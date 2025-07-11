import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middleware/validation.middleware";
import { UserIdSchema } from "./user.schema";

const userController = new UserController();

export const userRoute = Router();
export const registerUserRoute = Router();

// Rotas públicas
registerUserRoute.post("/users", userController.create);

userRoute.get("/users", userController.list);
userRoute.put(
  "/users/:id",
  validateRequest(UserIdSchema),
  userController.update
);
userRoute.delete(
  "/users/:id",
  validateRequest(UserIdSchema),
  userController.delete
);
