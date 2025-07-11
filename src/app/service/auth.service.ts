import { AuthProps } from "../../interface/auth/auth.schema";
import { HashGenerator } from "../../utils/generate-hash";
import { TokenService } from "./token.service";
import { UserService } from "./user.service";

export class AuthService {
  private userService: UserService;
  private tokenService: TokenService;
  private hashGenerator: HashGenerator;

  constructor() {
    this.tokenService = new TokenService();
    this.userService = new UserService();
    this.hashGenerator = new HashGenerator();
  }

  public login = async (payload: AuthProps): Promise<any> => {
    const { email, password } = payload;
    const hashedPassword = this.hashGenerator.generate(password);


    const user = await this.userService.retrieveByEmail(email);
    if (!user) {
      throw new Error("User not found or password is incorrect.");
    }
    console.log(user);
    console.log(hashedPassword);
    

    if (hashedPassword !== user.password) {
      throw new Error("User not found or password is incorrect.");
    }

    if (!user) {
      throw new Error("User not found or password is incorrect.");
    }

    const token = this.tokenService.generate({
      user_id: user.id,
      email: user.email,
      name: user.name,
    });

    return { token };
  };
}
