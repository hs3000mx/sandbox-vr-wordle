export const sessionOptions = {
	cookieName: 'task2_session',
	password: process.env.SESSION_SECRET as string
}

export type sessionData = {
    answer: string,
    attempts: number
}