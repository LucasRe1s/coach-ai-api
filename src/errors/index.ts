// Classe base de erro
export { ErrorBase } from './base.error';

// Erros de validação
export { ValidationError } from './validation.error';

// Erros de autenticação e autorização
export { UnauthorizedError } from './unauthorized.error';
export { ForbiddenError } from './forbidden.error';

// Erros de recursos
export { NotFoundError } from './not-found.error';

// Erros de negócio
export { EmailAlreadyExistsError } from './email-already-exist.error';

// Erros de banco de dados
export { DatabaseError } from './database.error'; 