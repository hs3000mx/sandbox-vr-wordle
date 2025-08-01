export const sessionOptions = {
	cookieName: 'task4_session',
	password: process.env.SESSION_SECRET as string
}

export type sessionData = {
    candidates: string[][],
    attempts: number
}