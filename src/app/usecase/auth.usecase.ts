import { AuthProps } from "../../interface/auth/auth.schema";
import { AuthService } from "../service/auth.service";

export class AuthUseCase {
  private service: AuthService;
  constructor() {
    this.service = new AuthService();
  }

  public login = async (data: AuthProps) => await this.service.login(data);
}
