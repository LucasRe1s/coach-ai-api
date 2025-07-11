import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import healthController from "./health.controller";

export const healthRoute = Router();

healthRoute.get ("/", expressAsyncHandler(healthController.healthCheck));
healthRoute.get ("/health", expressAsyncHandler(healthController.healthCheck));

