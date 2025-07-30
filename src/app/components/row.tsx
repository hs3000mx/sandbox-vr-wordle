import styles from "@/app/components/row.module.css"
import { InputFeedback } from "@/lib/enums/inputFeedback";

export default function Row({ letters, attemptResults }: { letters: string[], attemptResults: InputFeedback[] }) {

    const getFeedbackClassName = (feedback: InputFeedback) => {
        switch(feedback) {
            case InputFeedback.HIT:
                return styles.hit
            case InputFeedback.PRESENT:
                return styles.present
            case InputFeedback.MISS:
                return styles.miss
        }
    }

	return (
		<div className={styles.row}>
			{letters.map((char, i) => (
				<div key={i} className={`${styles.box} ${getFeedbackClassName(attemptResults[i])}`}>
					{char}
				</div>
			))}
		</div>
	);
}
