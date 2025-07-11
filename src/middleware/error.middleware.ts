import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ErrorBase } from '../errors/base.error';
import { ValidationError } from '../errors/validation.error';
import { UnauthorizedError } from '../errors/unauthorized.error';
import { NotFoundError } from '../errors/not-found.error';
import { ForbiddenError } from '../errors/forbidden.error';
import { DatabaseError } from '../errors/database.error';
import { EmailAlreadyExistsError } from '../errors/email-already-exist.error';

interface ErrorResponse {
    error: {
        code: string;
        message: string;
        status: number;
        timestamp: string;
        details?: any[];
        path?: string;
        method?: string;
    };
}

const buildErrorResponse = (
    error: Error | ErrorBase,
    req: Request,
    includeDetails: boolean = false
): ErrorResponse => {
    const baseResponse = {
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Erro interno do servidor',
            status: 500,
            timestamp: new Date().toISOString(),
            path: req.originalUrl,
            method: req.method,
        }
    };

    if (error instanceof ErrorBase) {
        baseResponse.error = {
            ...error.toJSON(),
            path: req.originalUrl,
            method: req.method,
        };
    } else if (error instanceof ZodError) {
        const validationError = new ValidationError(
            'Dados de entrada inválidos',
            error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message,
                code: err.code
            }))
        );
        baseResponse.error = {
            ...validationError.toJSON(),
            path: req.originalUrl,
            method: req.method,
        };
    } else if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        const authError = new UnauthorizedError('Token inválido ou expirado');
        baseResponse.error = {
            ...authError.toJSON(),
            path: req.originalUrl,
            method: req.method,
        };
    } else if (error.name === 'CastError') {
        const notFoundError = new NotFoundError('Recurso não encontrado');
        baseResponse.error = {
            ...notFoundError.toJSON(),
            path: req.originalUrl,
            method: req.method,
        };
    } else if (error.name === 'ValidationError') {
        const validationError = new ValidationError('Erro de validação');
        baseResponse.error = {
            ...validationError.toJSON(),
            path: req.originalUrl,
            method: req.method,
        };
    } else if (error.message) {
        baseResponse.error.message = error.message;
    }

    return baseResponse;
};

const getStatusCode = (error: Error | ErrorBase): number => {
    if (error instanceof ErrorBase) {
        return error.status;
    }
    
    if (error instanceof ZodError) {
        return 400;
    }
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return 401;
    }
    
    if (error.name === 'CastError') {
        return 404;
    }
    
    if (error.name === 'ValidationError') {
        return 400;
    }
    
    return 500;
};

export const errorHandler = (
    error: Error | ErrorBase,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const statusCode = getStatusCode(error);
    const errorResponse = buildErrorResponse(error, req, isDevelopment);
    
    // Log do erro
    console.error(`[${new Date().toISOString()}] Error Handler:`);
    console.error(`Status: ${statusCode}`);
    console.error(`Message: ${error.message}`);
    console.error(`Stack: ${error.stack}`);
    
    // Em desenvolvimento, incluir stack trace
    if (isDevelopment && error.stack) {
        (errorResponse.error as any).stack = error.stack;
    }
    
    res.status(statusCode).json(errorResponse);
};

// Middleware para capturar erros não tratados
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
    const error = new NotFoundError(`Rota ${req.method} ${req.originalUrl} não encontrada`);
    next(error);
};

// Middleware para capturar erros de sintaxe JSON
export const jsonErrorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (error instanceof SyntaxError && 'body' in error) {
        const validationError = new ValidationError('JSON inválido');
        return next(validationError);
    }
    next(error);
};
