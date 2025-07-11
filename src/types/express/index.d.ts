// src/types/express/index.d.ts
declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      email: string;
      name?: string;
    };
    token?: string;
  }
}
