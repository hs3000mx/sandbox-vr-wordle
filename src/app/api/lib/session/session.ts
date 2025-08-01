import { cookies } from "next/headers";
import { getIronSession } from "iron-session";

import { sessionOptions, sessionData } from "@/app/api/lib/session/sessionOptions";
import { WORD_LIST } from "@/app/api/config";

export async function getSession() {
    const session = await getIronSession<sessionData>(await cookies(), sessionOptions)
    return session
}

export async function initializeSession() {
    const session = await getSession()
    session.candidates = WORD_LIST
    session.attempts = 0
    await session.save()
    return session
}

export async function setSession(candidates: string[][] | null, attempts: number | null) {
    const session = await getSession()
    if(candidates) session.candidates = candidates
    if(attempts) session.attempts = attempts
    await session.save()
    return session
}