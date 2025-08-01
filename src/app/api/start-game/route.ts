import { NextResponse } from "next/server";
import { getSession, initializeSession, setSession } from "@/app/api/lib/session/session";
import { WORD_LIST } from "@/app/api/config";

export async function POST(req: Request) {

    try {
        console.log("---------------------------")
        console.log("Running Start Game...")
        const session = await initializeSession()
        const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
        await setSession(WORD_LIST[randomIndex], null)

        const newSession = await getSession()
        
        console.log(newSession)

        return NextResponse.json({ status: 200, message: `Success Start Game`, data: null }, { status: 200 })
    }
    catch(err: any) {
        return NextResponse.json({ status: err.status ?? 500, message: err.message, data: null }, { status: err.status ?? 500 })
    }
}