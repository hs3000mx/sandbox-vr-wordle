import * as z from "zod";
import { NextResponse } from "next/server";
import { getSession, initializeSession } from "@/app/api/lib/session/session";

export async function POST(req: Request) {

    const session = await initializeSession()
    console.log(session)
    
    return NextResponse.json({ status: 200, message: `Success Start Game`, data: null }, { status: 200 })
}