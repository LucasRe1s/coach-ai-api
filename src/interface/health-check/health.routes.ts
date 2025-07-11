import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import healthController from "./health.controller";
// healthController
// import { AuthController } from "../controllers/auth.controller.js";
// import { celebrate, Segments } from "celebrate";
// import { authLoginSchema, authRecoverySchema } from "../models/user.model.js";

export const healthRoute = Router();

healthRoute.get ("/health", expressAsyncHandler(healthController.healthCheck));

