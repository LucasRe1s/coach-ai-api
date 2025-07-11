import { ErrorBase } from "./base.error";

export class DatabaseError extends ErrorBase {
    public readonly originalError?: Error;

    constructor(message = "Erro no banco de dados", originalError?: Error) {
        super(500, message, "DATABASE_ERROR");
        this.originalError = originalError;
    }
} 