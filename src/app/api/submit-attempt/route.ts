import * as z from "zod";
import { NextResponse } from "next/server";
import { getSession, setSession } from "@/app/api/lib/session/session";
import Solver from "@/app/api/lib/solver";
import { MAX_GUESSES } from "@/app/api/config";
import { FlexibleError } from "@/app/api/lib/flexibleError";

export async function POST(req: Request) {

    const AttemptBody = z.object({
        "attempt": z.array(z.string().length(1)).length(5)
    })

    const SessionValidation = z.object({
        "answer": z.array(z.string().length(1)).length(5),
        "attempts": z.number()
    })

    try {
        console.log("---------------------------")
        console.log("Running Submit Attempt...")
        const _body = await req.json()
        console.log("Validating request body...")
        const parsedBody = AttemptBody.parse(_body)
        console.log(parsedBody)


        const session = await getSession()
        console.log("Validating Session Data...")
        const parsedSessionData = SessionValidation.parse(session)
        console.log(parsedSessionData)

        console.log("Validating Max Guesses/Attempts...")
        if(parsedSessionData.attempts >= MAX_GUESSES) {
            throw new FlexibleError("Max guesses already reached!", 403)
        }

        console.log("Validating User Attempt...")
        const attemptFeedback = Solver.checkAnswer(parsedSessionData.answer, parsedBody.attempt)
        console.log(attemptFeedback)

        console.log("Incrementing Player Attempt...")
        await setSession(null, parsedSessionData.attempts + 1)
        const finalizedSessionData = await getSession()
        console.log(finalizedSessionData.attempts)

        const returnData = {
            max_guesses_reached: finalizedSessionData.attempts >= MAX_GUESSES ? true : false,
            attempt_number: finalizedSessionData.attempts,
            attempt_feedback: attemptFeedback
        }
        
        return NextResponse.json({ status: 200, message: `Success Submit Attempt`, data: returnData }, { status: 200 })
    }
    catch(err: any) {
        return NextResponse.json({ status: err.status ?? 500, message: err.message, data: null }, { status: err.status ?? 500 })
    }
}