'use client';

import { useRef } from "react";
import styles from "@/app/components/inputRow.module.css";

export default function InputRow({ onSubmit }: { onSubmit: (letters: string[]) => void }) {
	const inputs = useRef<Array<HTMLInputElement | null>>([]);

	const handleLetterTyped = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
		const value = e.target.value.toUpperCase().slice(0, 1);
		e.target.value = value;

		if (value && inputs.current[index + 1]) {
			inputs.current[index + 1]?.focus();
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
		if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
			inputs.current[index - 1]?.focus();
		}

		if (e.key === "Enter") {
			const letters = inputs.current.map((input) => input?.value.toUpperCase() || "");
			onSubmit(letters);
 
            inputs.current.forEach((input) => {
                if (input) input.value = "";
            });

            inputs.current[0]?.focus()
		}
	};

	return (
		<div className={styles.row}>
			{Array.from({ length: 5 }).map((_, i) => (
				<input
					key={i}
					ref={(el) => {
						inputs.current[i] = el;
					}}
					className={styles.box}
					maxLength={1}
					onChange={(e) => handleLetterTyped(e, i)}
					onKeyDown={(e) => handleKeyDown(e, i)}
					type="text"
					inputMode="text"
					autoComplete="off"
				/>
			))}
		</div>
	);
}
