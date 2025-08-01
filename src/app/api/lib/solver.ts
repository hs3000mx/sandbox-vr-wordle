import { InputFeedback } from "@/lib/enums/inputFeedback"

export default class Solver {

    static checkAnswer(_answer: string[], _attempt: string[]): InputFeedback[] {

        //DEBUG ONLY
        // console.log("FROM SOLVER:", _answer, _attempt)

        //We first assume that all letters MISS
        const results: InputFeedback[] = new Array(_answer.length).fill(InputFeedback.MISS);

        //Check if any letters are HIT
        _attempt.forEach((_letter, _index) => {
            if(_answer[_index] === _letter) {
                results[_index] = InputFeedback.HIT
            }
        })

        //For any letters that did NOT HIT, we check if they exist at a different position of the _answer
        //This does not check if the number of existances of the same letters are equal between the _answer and _attempt, it will unconditionally set any occurances that exist as PRESENT
        results.forEach((_result, _index) => {
            if(_result != InputFeedback.HIT) {
                if(_answer.includes(_attempt[_index])) {
                    results[_index] = InputFeedback.PRESENT
                }
                //We can skip setting MISS since results was initialized with MISS
            }
        })

        return results
    }
}