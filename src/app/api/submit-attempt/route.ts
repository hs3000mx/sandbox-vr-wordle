import * as z from "zod";
import { NextResponse } from "next/server";
import { getSession, setSession } from "@/app/api/lib/session/session";
import { MAX_GUESSES } from "@/app/api/config";
import { FlexibleError } from "@/app/api/lib/flexibleError";
import AbsurdSolver from "@/app/api/lib/absurd_solver";

export async function POST(req: Request) {

    //Validation ZOD objects to validate input and session data
    const AttemptBody = z.object({
        "attempt": z.array(z.string().length(1)).length(5)
    })

    const SessionValidation = z.object({
        "candidates": z.array(z.array(z.string().length(1)).length(5)),
        "attempts": z.number()
    })

    try {

        //validating and parsing request body
        console.log("---------------------------")
        console.log("Running Submit Attempt...")
        const _body = await req.json()
        console.log("Validating request body...")
        const parsedBody = AttemptBody.parse(_body)
        console.log(parsedBody)

        //fetching user session, validating and parsing
        const session = await getSession()
        console.log("Validating Session Data...")
        const parsedSessionData = SessionValidation.parse(session)
        console.log(parsedSessionData)

        //ensure max guesses are not reached for current game
        console.log("Validating Max Guesses/Attempts...")
        if(parsedSessionData.attempts >= MAX_GUESSES) {
            throw new FlexibleError("Max guesses already reached!", 403)
        }

        //get feedback on attempt using the solver
        console.log("Validating User Attempt...")
        const attemptFeedback = AbsurdSolver.checkCandidates(parsedSessionData.candidates, parsedBody.attempt)
        console.log(attemptFeedback.feedback)
        console.log(attemptFeedback.remaining_candidates)

        //increment their attempt count, update the new candidate list and fetch latest session state
        console.log("Incrementing Player Attempt and setting NEW Candidates...")
        await setSession(attemptFeedback.remaining_candidates, parsedSessionData.attempts + 1)
        const finalizedSessionData = await getSession()
        console.log(finalizedSessionData.attempts)

        const returnData = {
            max_guesses_reached: finalizedSessionData.attempts >= MAX_GUESSES ? true : false,
            attempt_number: finalizedSessionData.attempts,
            attempt_feedback: attemptFeedback.feedback
        }
        
        return NextResponse.json({ status: 200, message: `Success Submit Attempt`, data: returnData }, { status: 200 })
    }
    catch(err: any) {
        return NextResponse.json({ status: err.status ?? 500, message: err.message, data: null }, { status: err.status ?? 500 })
    }
}