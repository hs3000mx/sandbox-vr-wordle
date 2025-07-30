'use client'

import { MAX_GUESSES, WORD_LIST } from "@/config"; //WARNING: The word list can be seen client side 
import Solver from "@/lib/solver";

import { useEffect, useState } from "react";

import styles from "./page.module.css";
import Row from "@/app/components/row";
import InputRow from "@/app/components/inputRow";
import { InputFeedback } from "@/lib/enums/inputFeedback";
import { GameState } from "@/lib/enums/gameState";

export default function Home() {
  
  const [gameState, setGameState] = useState<GameState>(GameState.NEUTRAL)
  const [answer, setAnswer] = useState<string[]>([]);
  const [guessCount, setGuessCount] = useState<number>(0); 

  //Initialize the answer from WORD_LIST
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
    setAnswer(WORD_LIST[randomIndex])
  }, [])


  //DEBUG ONLY
  useEffect(() => {
    console.log(answer)
  }, [answer])
  
  //Stores user submitted attempts
  const [submittedRows, setSubmittedRows] = useState<{attempt: string[], attemptResults: InputFeedback[]}[]>([]);

	const handleInputSubmit = (letters: string[]) => {
    //Populates user submitted attempts along with attempt feedback using Solver.checkAnswer
    const attemptResults = Solver.checkAnswer(answer, letters)
    setSubmittedRows((prev) => [...prev, 
      {
        attempt: letters,
        attemptResults: attemptResults
      }
    ]);

    //Increment the guess counter for UI display
    setGuessCount((prev) => {
      const newGuessCount = prev+1
    
      if(checkGameEndConditions(attemptResults)) {
        setGameState(GameState.WIN)
      }
      else if(newGuessCount >= MAX_GUESSES) {
        setGameState(GameState.LOSS)
      }

      return newGuessCount
    })
	};

  const checkGameEndConditions = (attemptResult: InputFeedback[]) => {
    return attemptResult.every(result => result == InputFeedback.HIT)
  }

  function renderGameState() {
    switch (gameState) {
      case GameState.WIN:
        return <h1>You win! 🎉</h1>;
      case GameState.LOSS:
        return <h1>You lose 😢</h1>;
      case GameState.NEUTRAL:
      default:
        return null;
    }
  }


	return (
		<div className={styles.page}>
			<main className={styles.main}>
        <div>
          <h1>
            {`Maximum Guesses: ${MAX_GUESSES}`}
          </h1>
          <h2>
            {`Current Guesses: ${guessCount}`}
          </h2>
        </div>
				{submittedRows.map((row, i) => (
					<Row key={i} letters={row.attempt} attemptResults={row.attemptResults} />
				))}
				<InputRow onSubmit={handleInputSubmit}/>
        {
          renderGameState()
        }
			</main>
		</div>
	);
  
}


