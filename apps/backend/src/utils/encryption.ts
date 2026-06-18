import crypto from "crypto";
import { Buffer } from "buffer";
import { env } from "../config/env.js";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 12 bytes is standard for AES-GCM

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * @param plaintext The string to encrypt.
 * @returns Base64 encoded representation of the encrypted data, including IV and Auth Tag.
 */
export function encryptField(plaintext: string): string {
  const key = Buffer.from(env.ENCRYPTION_KEY, "hex");
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  // Combine: iv (hex) + authTag (hex) + encryptedText (hex)
  const combined = iv.toString("hex") + ":" + authTag.toString("hex") + ":" + encrypted;

  // Return as base64 string
  return Buffer.from(combined, "utf8").toString("base64");
}

/**
 * Decrypts a base64 encoded AES-256-GCM ciphertext.
 * @param ciphertext Base64 encoded representation containing IV, Auth Tag, and encrypted text.
 * @returns The decrypted plaintext string.
 */
export function decryptField(ciphertext: string): string {
  const key = Buffer.from(env.ENCRYPTION_KEY, "hex");

  // Decode base64 back to the string with colons
  const combined = Buffer.from(ciphertext, "base64").toString("utf8");
  const parts = combined.split(":");

  if (parts.length !== 3) {
    throw new Error("Invalid encrypted format. Expected iv:authTag:encrypted");
  }

  const [ivHex, authTagHex, encryptedHex] = parts;
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedHex, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
export type Cryptography = {
  encryptField: typeof encryptField;
  decryptField: typeof decryptField;
};
