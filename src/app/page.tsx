'use client'

import { useEffect, useState } from "react";

import styles from "./page.module.css";
import Row from "@/app/components/row";
import InputRow from "@/app/components/inputRow";
import { InputFeedback } from "@/lib/enums/inputFeedback";
import { GameState } from "@/lib/enums/gameState";

export default function Home() {

  const [loading, setLoading] = useState<boolean>(true)
  const [maxGuesses, setMaxGuesses] = useState<number>(0)
  const [gameState, setGameState] = useState<GameState>(GameState.NEUTRAL)
  const [guessCount, setGuessCount] = useState<number>(0); 

  //call /api/start-game to initialize game and user session
  const startGame = async() => {
    try {
      const res = await fetch('/api/start-game', {
        method: "POST"
      })
      const data = await res.json()
      console.log("Game started: ", data)
      setMaxGuesses(data.data.max_guesses)
      setLoading(false)
    }
    catch(error) {
      console.log("Failed to start game: ", error)
    }
  }

  //call /api/submit-attempt to check answers
  const submitAttempt = async(attempt: string[]) => {
    try {
      const res = await fetch('/api/submit-attempt', {
        method: "POST",
        body: JSON.stringify({
          attempt: attempt
        })
      })
      const data = await res.json()
      if(data.status != 200) throw new Error 
      console.log("Submitted attempt: ", data)
      return data
    }
    catch(error) {
      console.log("Failed to submit attempt: ", error)
    }
  }

  //Start game -> runs once per load
  useEffect(() => {
    startGame()
  }, [])
  
  //Stores user submitted attempts
  const [submittedRows, setSubmittedRows] = useState<{attempt: string[], attemptResults: InputFeedback[]}[]>([]);


  //Refactor checkAnswer with backend API call
	const handleInputSubmit = async(letters: string[]) => {
    const attemptData = await submitAttempt(letters)
    
    //skip further game state checking if 200 status is not returned
    if(attemptData?.status != 200) return
    
    //extract attempt_feedback from response body
    const attemptResults = attemptData?.data?.attempt_feedback

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
      else if(newGuessCount >= maxGuesses) {
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


  //prevent user input during initialization API call
  if(loading) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <h2>Loading game...</h2>
        </main>
      </div>
    )
  }

  //refactored maxGuesses to inherit value from startGame() call
	return (
		<div className={styles.page}>
			<main className={styles.main}>

        <div>
          <h1>
            {`Maximum Guesses: ${maxGuesses}`}
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


