// Tlamatini-RC — Angela López Mendoza · XAIHT
import { createHash, randomBytes } from "node:crypto";

// A computer key: "xrc_" + 43 base64url characters (32 random bytes). Shown
// once on the page, pasted into Tlachihuani, and stored here only as SHA-256.
export function newComputerKey(): { key: string; hash: string; hint: string } {
  const key = `xrc_${randomBytes(32).toString("base64url")}`;
  return { key, hash: hashComputerKey(key), hint: key.slice(-4) };
}

export function hashComputerKey(key: string): string {
  return createHash("sha256").update(key, "utf8").digest("hex");
}

export function keyFromAuthorization(header: string | undefined | null): string | null {
  const match = /^Bearer\s+(xrc_[A-Za-z0-9_-]{20,200})\s*$/.exec(header ?? "");
  return match ? match[1] : null;
}
