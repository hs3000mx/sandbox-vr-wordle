import { cookies } from "next/headers";
import { getIronSession } from "iron-session";

import { sessionOptions, sessionData } from "@/app/api/lib/session/sessionOptions";

export async function getSession() {
    const session = await getIronSession<sessionData>(await cookies(), sessionOptions)
    return session
}

export async function initializeSession() {
    const session = await getSession()
    session.answer = []
    session.attempts = 0
    await session.save()
    return session
}

export async function setSession(answer: string[] | null, attempts: number | null) {
    const session = await getSession()
    if(answer) session.answer = answer
    if(attempts) session.attempts = attempts
    await session.save()
    return session
}