import Solver from "@/app/api/lib/solver";
import { InputFeedback } from "@/lib/enums/inputFeedback";

type FeedbackGroup = {
    feedback: InputFeedback[],
    words: string[][],
    score: number
}

export default class AbsurdSolver {

    static generateFeedbackGroups(_candidates: string[][], _attempt: string[]): FeedbackGroup[] {
        //We use a map for more efficient indexing and key-value pair pushing
        const map = new Map<string, string[][]>()

        for (const word of _candidates) {
            const feedbackArr = Solver.checkAnswer(word, _attempt)

            //We need to use strings as keys since arrays cannot be used to detect duplicate keys in maps
            const feedbackKey = feedbackArr.join('')

            //If the feedback pattern does not already exist, create a key/value pair for it
            if(!map.has(feedbackKey)) {
                map.set(feedbackKey, [])
            }

            //Attempt to insert the word into the array for the given feedback pattern (key)
            map.get(feedbackKey)?.push(word)
        }

        //Reorganize the map into an array for easier filtering through feedback pattern/score later
        const feedbackGroups: FeedbackGroup[] = Array.from(map.entries()).map(([key, words]) => {
            const feedback = key.split('').map(Number) as InputFeedback[]
            const score = feedback.reduce((sum, val) => sum + val, 0)

            return {
                feedback,
                words,
                score
            }
        })

        return feedbackGroups
    }

    static getHighestScoreGroups(_feedbackGroups: FeedbackGroup[]) {
        
        //find the maximum score within the feedback groups
        const maxScore = Math.max(..._feedbackGroups.map(group => group.score))
        
        return _feedbackGroups.filter(group => group.score === maxScore)
    }

    static getGroupsWithLeastHIT(_group: FeedbackGroup[]) {
        const minHits = Math.min(..._group.map(
            group => group.feedback.filter(
                letterFeedback => letterFeedback === InputFeedback.HIT
            ).length)
        )
        const hitFilteredGroups = _group.filter(
            group => group.feedback.filter(
                letterFeedback => letterFeedback === InputFeedback.HIT
            ).length === minHits
        )

        return hitFilteredGroups
    }

    static getGroupsWithLeastPRESENT(_group: FeedbackGroup[]) {
        const minPresent = Math.min(..._group.map(
            group => group.feedback.filter(
                letterFeedback => letterFeedback === InputFeedback.PRESENT
            ).length)
        )
        const hitFilteredGroups = _group.filter(
            group => group.feedback.filter(
                letterFeedback => letterFeedback === InputFeedback.PRESENT
            ).length === minPresent
        )

        return hitFilteredGroups
    }

    static checkCandidates(_candidates: string[][], _attempt: string[]): {feedback: InputFeedback[], remaining_candidates: string[][]} {

        //Organize words into groups with the same feedback
        const feedbackGroups = this.generateFeedbackGroups(_candidates, _attempt)
        console.log(feedbackGroups)

        //Filter groups with ONLY the highest scores -> most ambiguous
        const highestScoreGroups = this.getHighestScoreGroups(feedbackGroups)
        console.log(highestScoreGroups)

        //If there is only 1 group remaining (highest score) return the feedback and remaining candidates to prevent further processing
        if(highestScoreGroups.length == 1) {
            return {
                feedback: highestScoreGroups[0].feedback,
                remaining_candidates: highestScoreGroups[0].words
            }
        }

        //If more than one group remaining, get groups with least amount of HITs
        const hitFilteredGroups = this.getGroupsWithLeastHIT(highestScoreGroups)

        if(hitFilteredGroups.length == 1) {
            return {
                feedback: hitFilteredGroups[0].feedback,
                remaining_candidates: hitFilteredGroups[0].words
            }
        }

        //IF more than one group remaining, get groups with least amount of PRESENTs
        const presentFilteredGroups = this.getGroupsWithLeastPRESENT(hitFilteredGroups)

        //Either there is 1 group remaining, or multiple groups remaining, we can just assume to return the first group at this point since furhter filtering cannot be done
        return {
            feedback: presentFilteredGroups[0].feedback,
            remaining_candidates: presentFilteredGroups[0].words
        }
    }
}