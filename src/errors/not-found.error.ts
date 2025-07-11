import { ErrorBase } from "./base.error";

export class NotFoundError extends ErrorBase {
    constructor(message = "Recurso não encontrado") {
        super(404, message, "NOT_FOUND");
    }
} 