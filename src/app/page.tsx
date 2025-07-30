'use client'

import { MAX_GUESSES, WORD_LIST } from "@/config"; //WARNING: The word list can be seen client side 
import Solver from "@/lib/solver";

import { useEffect, useState } from "react";

import styles from "./page.module.css";
import Row from "@/app/components/row";
import InputRow from "@/app/components/inputRow";
import { InputFeedback } from "@/lib/enums/inputFeedback";

export default function Home() {

  const guessCount = 0
  
  const [answer, setAnswer] = useState<string[]>([]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
    setAnswer(WORD_LIST[randomIndex])
  }, [])

  useEffect(() => {
    console.log(answer)
  }, [answer])
  
  const [submittedRows, setSubmittedRows] = useState<{attempt: string[], attemptResults: InputFeedback[]}[]>([]);

	const handleInputSubmit = (letters: string[]) => {
    const attemptResults = Solver.checkAnswer(answer, letters)
    setSubmittedRows((prev) => [...prev, 
      {
        attempt: letters,
        attemptResults: attemptResults
      }
    ]);
	};

	return (
		<div className={styles.page}>
			<main className={styles.main}>
				{submittedRows.map((row, i) => (
					<Row key={i} letters={row.attempt} attemptResults={row.attemptResults} />
				))}
				<InputRow onSubmit={handleInputSubmit} />
			</main>
		</div>
	);
  
}
