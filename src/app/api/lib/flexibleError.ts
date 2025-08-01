import 'server-only'

export class FlexibleError extends Error {

    private status: number;

    constructor(message: string, status: number) {
        super(message)
        this.status = status
        this.name = this.constructor.name
    }
}