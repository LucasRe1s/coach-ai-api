import { Request, Response, NextFunction } from "express";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Iniciando`
  );

  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const statusColor =
      status >= 500
        ? "\x1b[31m"
        : status >= 400
        ? "\x1b[33m"
        : status >= 300
        ? "\x1b[36m"
        : "\x1b[32m";
    const resetColor = "\x1b[0m";

    console.log(
      `[${new Date().toISOString()}] ${req.method} ${
        req.originalUrl
      } - ${statusColor}${status}${resetColor} - ${duration}ms`
    );
  });

  next();
};

export const errorLogger = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const userAgent = req.get("User-Agent") || "Unknown";
  const ip = req.ip || req.connection.remoteAddress || "Unknown";

  console.error(`[${timestamp}] ERROR - ${method} ${url}`);
  console.error(`IP: ${ip}`);
  console.error(`User-Agent: ${userAgent}`);
  console.error(`Error: ${error.message}`);
  console.error(`Stack: ${error.stack}`);

  next(error);
};
