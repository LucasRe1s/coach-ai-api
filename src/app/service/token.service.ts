import jwt from "jsonwebtoken";

const FOUR_HOURS = 14400;

export class TokenService {
  private readonly secret: string;
  private readonly expiresIn: number;

  constructor() {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    this.secret = process.env.JWT_SECRET || "secret";
    this.expiresIn = FOUR_HOURS;
  }

  public generate(data: any, expiresIn?: number): string {
    const options = {
      expiresIn: expiresIn ?? this.expiresIn,
    };
    return jwt.sign(data, this.secret, options);
  }

  public verify(token: string): any {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }
}
