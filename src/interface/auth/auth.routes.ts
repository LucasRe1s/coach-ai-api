import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { AuthController } from "./auth.controller";

const authController = new AuthController();
export const authRoute = Router();

authRoute.post("/auth", expressAsyncHandler(authController.login));
