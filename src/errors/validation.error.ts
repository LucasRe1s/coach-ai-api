import { ErrorBase } from "./base.error";

export class ValidationError extends ErrorBase {
    public readonly details: any[];

    constructor(message: string, details: any[] = []) {
        super(400, message, "VALIDATION_ERROR");
        this.details = details;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            details: this.details
        };
    }
} 