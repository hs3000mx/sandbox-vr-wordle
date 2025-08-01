import { NextResponse } from "next/server";
import { getSession, initializeSession, setSession } from "@/app/api/lib/session/session";
import { MAX_GUESSES, WORD_LIST } from "@/app/api/config";

export async function POST(req: Request) {

    try {
        console.log("---------------------------")
        console.log("Running Start Game...")

        //initialize the users session to make sure a session object exists
        await initializeSession()

        //confirm contents of new session
        const newSession = await getSession()
        
        console.log(newSession)

        const returnData = {
            max_guesses: MAX_GUESSES
        }

        return NextResponse.json({ status: 200, message: `Success Start Game`, data: returnData }, { status: 200 })
    }
    catch(err: any) {
        return NextResponse.json({ status: err.status ?? 500, message: err.message, data: null }, { status: err.status ?? 500 })
    }
}