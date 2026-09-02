import { mkdir, rm, cp, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";

await rm("dist", { recursive: true, force: true });
await mkdir("dist/stage", { recursive: true });

const entries = [
  "README.md",
  "LICENSE",
  "AUTHORS.md",
  "CHANGELOG.md",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "GOVERNANCE.md",
  "docs",
  "packages",
  "apps",
  "scripts",
  "package.json",
  "package-lock.json"
];

for (const entry of entries) {
  await cp(entry, `dist/stage/${entry}`, { recursive: true });
}

execFileSync("tar", ["-czf", "dist/yaaw-collab.tar.gz", "-C", "dist/stage", "."]);
const data = await readFile("dist/yaaw-collab.tar.gz");
const digest = createHash("sha256").update(data).digest("hex");
await writeFile("dist/SHA256SUMS", `${digest}  yaaw-collab.tar.gz\n`);
console.log(`release artifact: dist/yaaw-collab.tar.gz`);
console.log(`sha256: ${digest}`);
