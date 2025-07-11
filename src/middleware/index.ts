// Middlewares de erro
export { 
    errorHandler, 
    notFoundHandler, 
    jsonErrorHandler 
} from './error.middleware';

// Middlewares de autenticação
export { authMiddleware } from './auth.middleware';

// Middlewares de validação
export { validateRequest } from './validation.middleware';

// Middlewares de logging
export { requestLogger, errorLogger } from './logger.middleware';

// Middlewares de tratamento assíncrono
export { asyncHandler } from './async-handler.middleware'; 