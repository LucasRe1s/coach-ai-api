import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors/unauthorized.error";

type JwtToken = {
  company_code: string;
  user_id: string;
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // ✅ Se for POST /users, libera sem token
    if (req.method === "POST" && req.path === "/users") {
      return next();
    }
    
    const authHeader = retrieveAuthenticationHeader(req);
    const token = await retrieveTokenFromHeader(authHeader);
    const decodedToken = retrieveDecodedToken(token);
    const serializedToken = retrieveTokenSerialized(decodedToken);

    req.headers["id"] = serializedToken.user_id;
    next();
  } catch (error) {
    next(new UnauthorizedError(error instanceof Error ? error.message : "Token inválido"));
  }
};

const retrieveTokenSerialized = (decodedToken: string | jwt.JwtPayload) => {
  const castedToken = decodedToken as JwtToken;
  return castedToken;
};

const retrieveTokenFromHeader = async (authHeader: string) => {
  const token = authHeader.split(" ")[1];
  return token;
};

const retrieveDecodedToken = (token: string) => {
  try {
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET || "a_secret_key"
    );

    if (!decodedToken) {
      throw new UnauthorizedError("Token inválido ou expirado");
    }

    return decodedToken;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError("Token inválido");
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError("Token expirado");
    }
    throw new UnauthorizedError("Token inválido ou expirado");
  }
};

const retrieveAuthenticationHeader = (req: Request) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new UnauthorizedError("Token não fornecido");
  }

  return authHeader;
};
