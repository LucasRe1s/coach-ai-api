import { Request, Response } from "express";
import { UserUseCase } from "../../app/usecase/user.usecase";
import { CreateUserSchema, UpdateUserSchema } from "./user.schema";
import { asyncHandler } from "../../middleware/async-handler.middleware";
import { ValidationError, NotFoundError } from "../../errors";

export class UserController {
  private usecase: UserUseCase;
  private schema = CreateUserSchema;

  constructor() {
    this.usecase = new UserUseCase();
    this.schema = CreateUserSchema;
  }

  public create = asyncHandler(async (req: Request, res: Response) => {
    try {
      const unparsedBody = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      };
      const body = this.schema.parse(unparsedBody);
      const data = await this.usecase.create(body);
      res.status(201).json(data);
    } catch (error) {
      if (error instanceof Error) {
        throw new ValidationError(error.message);
      }
      throw error;
    }
  });

  public list = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.usecase.retriever();
    res.status(200).json(data);
  });

  public update = asyncHandler(async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ValidationError("ID do usuário é obrigatório");
      }

      const unparsedBody = {
        name: req.body.name,
        email: req.body?.email,
        password: req.body?.password,
      };
      const body = UpdateUserSchema.parse(unparsedBody);
      await this.usecase.update(id, body);
      
      res.status(200).json({ message: "Usuário atualizado com sucesso" });
    } catch (error) {
      if (error instanceof Error) {
        throw new ValidationError(error.message);
      }
      throw error;
    }
  });

  public delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      throw new ValidationError("ID do usuário é obrigatório");
    }

    await this.usecase.delete(id);
    res.status(204).send();
  });
}
