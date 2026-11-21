// Jenkins credential preflight. Read stdin; write normalized JSON only to stdout.
// The caller must redirect stdout to a private file, never to the build log.
import { readFileSync } from "node:fs";
import { createPrivateKey } from "node:crypto";

function invalid(reason) {
  throw new Error(reason);
}

try {
  const text = readFileSync(0, "utf8").replace(/^\uFEFF/, "");
  let key;
  try {
    key = JSON.parse(text);
  } catch {
    invalid("The file is not valid UTF-8 JSON (legacy .p12 keys are not supported).");
  }
  if (!key || Array.isArray(key) || typeof key !== "object" || key.type !== "service_account") {
    invalid('Expected a Google service-account JSON object with type "service_account".');
  }
  if (typeof key.client_email !== "string" || !/^[^\s@]+@[^\s@]+\.gserviceaccount\.com$/.test(key.client_email)) {
    invalid("The service-account client_email is missing or invalid.");
  }
  if (typeof key.private_key !== "string" || !key.private_key.startsWith("-----BEGIN PRIVATE KEY-----")) {
    invalid("The service-account private_key is missing or is not a PEM private key.");
  }
  try {
    if (createPrivateKey(key.private_key).asymmetricKeyType !== "rsa") {
      invalid("Not an RSA key.");
    }
  } catch {
    invalid("The service-account private_key is not a valid RSA private key.");
  }
  process.stdout.write(JSON.stringify(key) + "\n");
} catch (error) {
  // Only our fixed diagnostics are emitted, never parser input or crypto errors.
  const reason = error?.code ? "The credential file could not be read." : error.message;
  process.stderr.write(`Invalid Jenkins credential gcp-jenkins-deployer-sa: ${reason}\n`);
  process.stderr.write("Use Kind: Secret file containing the original Google service-account JSON key. Do not paste the key into the console.\n");
  process.exitCode = 1;
}
