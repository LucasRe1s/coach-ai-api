import express, { Router } from "express";
import { healthRoute } from "./interface/health-check/health.routes";
import { registerUserRoute, userRoute } from "./interface/user/user.routes";
import { conversationRoute } from "./interface/conversation/conversation.route";
import { authRoute } from "./interface/auth/auth.routes";
import { authMiddleware } from "./middleware/auth.middleware";
import { 
    errorHandler, 
    notFoundHandler, 
    jsonErrorHandler 
} from "./middleware/error.middleware";
import { requestLogger, errorLogger } from "./middleware/logger.middleware";

export const routes = (app: express.Express) => {
  app.use(express.json({ limit: "5mb" }));
  app.use(requestLogger);
  
  app.use(jsonErrorHandler);
  
  app.use(healthRoute);
  app.use(authRoute);
  app.use(registerUserRoute);
  
  const authenticatedRoutes = Router();
  authenticatedRoutes.use(authMiddleware);
  authenticatedRoutes.use(userRoute);
  authenticatedRoutes.use(conversationRoute);
  app.use(authenticatedRoutes);
  
  app.use(notFoundHandler);
  app.use(errorLogger);
  app.use(errorHandler);
};
