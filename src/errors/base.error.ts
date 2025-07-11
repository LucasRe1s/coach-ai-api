import { Response } from "express";

export class ErrorBase extends Error {
    public readonly status: number;
    public readonly code: string;
    public readonly timestamp: string;

    constructor(status: number, message: string, code?: string) {
        super(message);
        this.status = status;
        this.code = code || this.constructor.name;
        this.timestamp = new Date().toISOString();
        
        // Garante que o stack trace seja preservado
        Error.captureStackTrace(this, this.constructor);
    }

    send(res: Response) {
        res.status(this.status).json({
            error: {
                code: this.code,
                message: this.message,
                status: this.status,
                timestamp: this.timestamp
            }
        });
    }

    toJSON() {
        return {
            code: this.code,
            message: this.message,
            status: this.status,
            timestamp: this.timestamp
        };
    }
}