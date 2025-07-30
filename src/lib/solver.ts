import { InputFeedback } from "@/lib/enums/inputFeedback"

export default class Solver {

    static checkAnswer(_answer: string[], _attempt: string[]): InputFeedback[] {


        // console.log("FROM SOLVER:", _answer, _attempt)

        const results: InputFeedback[] = new Array(_answer.length).fill(InputFeedback.MISS);

        _attempt.forEach((_letter, _index) => {
            if(_answer[_index] === _letter) {
                results[_index] = InputFeedback.HIT
            }
        })

        results.forEach((_result, _index) => {
            if(_result != InputFeedback.HIT) {
                if(_answer.includes(_attempt[_index])) {
                    results[_index] = InputFeedback.PRESENT
                }
            }
        })

        return results
    }
}