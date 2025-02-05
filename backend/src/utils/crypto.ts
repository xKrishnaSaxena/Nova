import crypto from "crypto";
import config from "./config";
const IV_LENGTH = 16;
const ENCRYPTION_KEY = crypto.scryptSync(config.ENCRYPTION_KEY, "salt", 32);

export function encrypt(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(text: string) {
  const [ivPart, encryptedPart] = text.split(":");
  const iv = Buffer.from(ivPart!, "hex");
  const encrypted = Buffer.from(encryptedPart!, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
