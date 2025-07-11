import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middleware/validation.middleware";
import { z } from "zod";

const userController = new UserController();

// Schema para validação de ID
const idParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, "ID é obrigatório")
  })
});

export const userRoute = Router();
export const registerUserRoute = Router();

// Rotas públicas
registerUserRoute.post("/users", userController.create);

// Rotas autenticadas
userRoute.get("/users", userController.list);
userRoute.put("/users/:id", validateRequest(idParamSchema), userController.update);
userRoute.delete("/users/:id", validateRequest(idParamSchema), userController.delete);
