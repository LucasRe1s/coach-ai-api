import { Request, Response } from "express";
import { AuthSchema } from "./auth.schema";
import { AuthUseCase } from "../../app/usecase/auth.usecase";

export class AuthController {
  private usecase: AuthUseCase;
  private schema = AuthSchema;

  constructor() {
    this.usecase = new AuthUseCase();
    this.schema = AuthSchema;
  }

  public login = async (req: Request, res: Response): Promise<void> => {
    console.log(req.body);
    const payload = this.schema.parse(req.body);
    const data = await this.usecase.login(payload);
    res.status(200).json(data);
  };
}
