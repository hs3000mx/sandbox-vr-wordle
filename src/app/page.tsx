'use client'

import { MAX_GUESSES, WORD_LIST } from "@/app/api/config"; //WARNING: The word list can be seen client side 
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

    setGuessCount((prev) => {
      //Increment the guess counter 
      const newGuessCount = prev+1
    
      //If the player wins
      if(checkGameEndConditions(attemptResults)) {
        setGameState(GameState.WIN)
      }
      //If the player loses
      else if(newGuessCount >= MAX_GUESSES) {
        setGameState(GameState.LOSS)
      }

      //Regardless of the game state, we must return the guess counter 
      return newGuessCount
    })
	};

  //Helper function to determine if the player has guesses correctly or not for a given attempt result
  const checkGameEndConditions = (attemptResult: InputFeedback[]) => {
    return attemptResult.every(result => result == InputFeedback.HIT)
  }


  //Helper function that returns a simple element for a given game state
  const renderGameState = () => {
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

				<InputRow onSubmit={handleInputSubmit} gameState = {gameState}/>

        {
          renderGameState()
        }
			</main>
		</div>
	);
  
}


