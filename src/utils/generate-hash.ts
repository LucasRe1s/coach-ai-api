import { createHmac } from "crypto";

export class HashGenerator {
  public generate(unhashedData: string): string {
    if (!unhashedData) return "";

    const hmac = createHmac(
      "sha256",
      process.env.HMAC_SECRET || "a_secret_key"
    );
    const salt = hmac.update(unhashedData);

    return salt.digest("hex");
  }
}
