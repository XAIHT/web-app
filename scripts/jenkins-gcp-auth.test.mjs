import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import test from "node:test";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const validator = path.join(scriptDir, "validate-gcp-key.mjs");
const helper = path.join(scriptDir, "jenkins-gcp-auth.sh");
const scratch = process.env.TEST_TMP_ROOT;
if (!scratch) throw new Error("Set TEST_TMP_ROOT to an application-owned test directory.");
mkdirSync(scratch, { recursive: true });
const privateKey = generateKeyPairSync("rsa", { modulusLength: 2048 }).privateKey.export({ type: "pkcs8", format: "pem" });
const key = { type: "service_account", client_email: "test@fixture.iam.gserviceaccount.com", private_key: privateKey, project_id: "fixture" };
const encodedKey = JSON.stringify(key);

function validate(input) {
  return spawnSync(process.execPath, [validator], { input, encoding: "utf8" });
}

for (const [name, input] of [["original JSON", encodedKey], ["UTF-8 BOM JSON", "\uFEFF" + encodedKey]]) {
  test(`validator accepts ${name} and preserves fields`, () => {
    const result = validate(input);
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(JSON.parse(result.stdout), key);
    assert.equal(result.stderr, "");
    assert.ok(!result.stdout.startsWith("\uFEFF"));
  });
}

for (const [name, input, expected] of [
  ["empty file", "", "not valid UTF-8 JSON"],
  ["P12/binary", Buffer.from([0x30, 0x82, 0xff, 0x00]), "not valid UTF-8 JSON"],
  ["malformed JSON", '{"private_key":"PRIVATE-CONTENT",', "not valid UTF-8 JSON"],
  ["double encoded JSON", JSON.stringify(encodedKey), "service_account"],
  ["OAuth user", JSON.stringify({ ...key, type: "authorized_user" }), "service_account"],
  ["missing email", JSON.stringify({ ...key, client_email: "" }), "client_email"],
  ["missing private key", JSON.stringify({ ...key, private_key: null }), "private_key"],
  ["broken private key", JSON.stringify({ ...key, private_key: "-----BEGIN PRIVATE KEY-----\nPRIVATE-CONTENT\n-----END PRIVATE KEY-----" }), "valid RSA"],
]) {
  test(`validator rejects ${name} without disclosing input`, () => {
    const result = validate(input);
    assert.equal(result.status, 1);
    assert.equal(result.stdout, "");
    assert.ok(result.stderr.includes(expected), result.stderr);
    assert.ok(!result.stderr.includes("PRIVATE-CONTENT"));
    assert.ok(!result.stderr.includes(privateKey.slice(28, 70)));
  });
}

// Stub only external commands. The real POSIX helper and credential validator
// run together, including file permissions, stdin, exit propagation and cleanup.
const fakeTool = `
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
const [tool, ...args] = process.argv.slice(2);
const event = tool + ' ' + args.slice(0, 2).join(' ');
fs.appendFileSync(process.env.CALL_LOG, event + '\\n');
if (event === process.env.FAIL_AT) process.exit(23);
if (tool === 'docker' && args[0] === 'run') {
  for (const flag of ['--rm', '-i', '--read-only', '--cap-drop', '--security-opt']) assert.ok(args.includes(flag));
  assert.equal(args[args.indexOf('--network') + 1], 'none');
  assert.ok(!args.includes('-v'));
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', args[args.indexOf('-e') + 1]], { input: fs.readFileSync(0), encoding: 'utf8' });
  process.stdout.write(result.stdout);
  process.stderr.write(result.stderr);
  process.exit(result.status ?? 1);
}
if (tool === 'gcloud') {
  for (const name of ['CLOUDSDK_ACTIVE_CONFIG_NAME', 'CLOUDSDK_AUTH_CREDENTIAL_FILE_OVERRIDE', 'CLOUDSDK_AUTH_ACCESS_TOKEN', 'CLOUDSDK_AUTH_IMPERSONATE_SERVICE_ACCOUNT']) assert.equal(process.env[name], undefined);
  for (const name of ['CLOUDSDK_CONFIG', 'DOCKER_CONFIG']) {
    assert.ok(process.env[name].startsWith(process.env.DEPLOY_AUTH_TMP_ROOT + path.sep));
    assert.equal(fs.statSync(process.env[name]).mode & 0o777, 0o700);
  }
  if (args[1] === 'activate-service-account') {
    const filename = args.find(x => x.startsWith('--key-file=')).slice(11);
    assert.equal(fs.statSync(filename).mode & 0o777, 0o600);
    assert.equal(JSON.parse(fs.readFileSync(filename, 'utf8')).type, 'service_account');
    fs.writeFileSync(path.join(process.env.CLOUDSDK_CONFIG, 'credential-cache'), 'TEST-PRIVATE-CACHE');
  } else if (args[1] === 'print-access-token' && !process.env.EMPTY_TOKEN) {
    process.stdout.write('TEST-ACCESS-TOKEN');
  }
}
if (tool === 'docker' && args[0] === 'login') assert.equal(fs.readFileSync(0, 'utf8'), 'TEST-ACCESS-TOKEN');
`;

function runHelper(mode, { failAt = "", input = "\uFEFF" + encodedKey, emptyToken = "" } = {}) {
  const root = mkdtempSync(path.join(scratch, "auth-test-"));
  try {
    const bin = path.join(root, "bin");
    const tmp = path.join(root, "private temp");
    mkdirSync(bin);
    mkdirSync(tmp);
    writeFileSync(path.join(root, "key.json"), input);
    writeFileSync(path.join(root, "fake-tool.mjs"), fakeTool);
    for (const tool of ["gcloud", "docker"]) {
      writeFileSync(path.join(bin, tool), `#!/bin/sh\nexec '${process.execPath}' '${path.join(root, "fake-tool.mjs")}' ${tool} "$@"\n`, { mode: 0o700 });
    }
    const callLog = path.join(root, "calls.txt");
    writeFileSync(callLog, "");
    const result = spawnSync("sh", [helper, mode], {
      encoding: "utf8",
      env: { ...process.env, PATH: bin + ":" + process.env.PATH, CALL_LOG: callLog,
        GCLOUD_KEY: path.join(root, "key.json"), GCP_PROJECT: "fixture", DEPLOY_AUTH_TMP_ROOT: tmp,
        IMAGE_REPO: "registry.example/project/app", SHORT_SHA: "testsha", FAIL_AT: failAt, EMPTY_TOKEN: emptyToken,
        CLOUDSDK_ACTIVE_CONFIG_NAME: "old", CLOUDSDK_AUTH_CREDENTIAL_FILE_OVERRIDE: "old",
        CLOUDSDK_AUTH_ACCESS_TOKEN: "old", CLOUDSDK_AUTH_IMPERSONATE_SERVICE_ACCOUNT: "old" },
    });
    assert.deepEqual(readdirSync(tmp), [], "private credential/cache/token directories must be removed");
    assert.equal(readFileSync(path.join(root, "key.json"), "utf8"), input, "Jenkins credential must not be rewritten");
    for (const secret of [privateKey.slice(28, 70), "TEST-ACCESS-TOKEN", "TEST-PRIVATE-CACHE"]) {
      assert.ok(!(result.stdout + result.stderr).includes(secret), "secret leaked to output");
    }
    return { ...result, calls: readFileSync(callLog, "utf8").trim().split("\n") };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test("preflight authenticates without pushing and cleans private state", () => {
  const result = runHelper("check");
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(result.calls, ["docker run --rm", "gcloud auth activate-service-account", "gcloud auth print-access-token"]);
});

test("push logs in through stdin, pushes both tags and cleans private state", () => {
  const result = runHelper("push");
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(result.calls.slice(-3), ["docker login -u", "docker push registry.example/project/app:testsha", "docker push registry.example/project/app:latest"]);
});

const order = ["docker run --rm", "gcloud auth activate-service-account", "gcloud auth print-access-token", "docker login -u", "docker push registry.example/project/app:testsha", "docker push registry.example/project/app:latest"];
for (const failure of order) {
  test(`failure at ${failure} stops subsequent operations and cleans up`, () => {
    const result = runHelper("push", { failAt: failure });
    assert.notEqual(result.status, 0);
    assert.deepEqual(result.calls, order.slice(0, order.indexOf(failure) + 1));
  });
}

test("malformed credential never reaches Google or image push", () => {
  const result = runHelper("push", { input: "not a JSON key" });
  assert.notEqual(result.status, 0);
  assert.deepEqual(result.calls, [order[0]]);
  assert.match(result.stderr, /Invalid Jenkins credential gcp-jenkins-deployer-sa/);
});

test("empty access token cannot reach Docker login", () => {
  const result = runHelper("push", { emptyToken: "1" });
  assert.notEqual(result.status, 0);
  assert.deepEqual(result.calls, order.slice(0, 3));
});

// Execute the exact smoke shell from Jenkinsfile, with deterministic HTTP
// responses, so a live homepage cannot hide the original RC 404 regression.
const pipeline = readFileSync(path.join(scriptDir, "../Jenkinsfile"), "utf8");
const smoke = pipeline.split("stage('Smoke test')")[1].split("sh '''")[1].split("'''")[0];
for (const [label, site, rc, challenge, success] of [
  ["current endpoint", "200", "401", "yes", true],
  ["old image with RC 404", "200", "404", "", false],
  ["unrelated 401", "200", "401", "", false],
  ["broken homepage", "503", "401", "yes", false],
  ["network failure", "200", "network-error", "", false],
]) {
  test(`deployment smoke check: ${label}`, () => {
    const root = mkdtempSync(path.join(scratch, "smoke-test-"));
    try {
      writeFileSync(path.join(root, "curl"), `#!/bin/sh\ncase "$*" in\n *'/api/rc/poll?wait=0'*)\n  [ "$RC" != network-error ] || exit 28\n  printf 'HTTP/2 %s\\r\\n' "$RC"\n  if [ "$CHALLENGE" = yes ]; then printf 'www-authenticate: Bearer realm="xaiht.org Tlamatini-RC"\\r\\n'; fi\n  ;;\n *) printf '%s' "$SITE" ;;\nesac\n`, { mode: 0o700 });
      writeFileSync(path.join(root, "sleep"), "#!/bin/sh\nexit 0\n", { mode: 0o700 });
      const result = spawnSync("sh", ["-c", smoke], { encoding: "utf8", env: { ...process.env, PATH: root + ":" + process.env.PATH, SITE: site, RC: rc, CHALLENGE: challenge } });
      assert.equal(result.status === 0, success, result.stdout + result.stderr);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
}
