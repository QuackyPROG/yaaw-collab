import { readFile, readdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import { execFileSync } from "node:child_process";

const root = new URL("../", import.meta.url).pathname;
const required = [
  "README.md",
  "LICENSE",
  "AUTHORS.md",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "GOVERNANCE.md",
  ".github/CODEOWNERS",
  ".github/workflows/ci.yml"
];

for (const file of required) {
  await stat(join(root, file));
}

const textExtensions = new Set([".md", ".yml", ".yaml", ".json", ".js", ".mjs", ".txt"]);
const workflowUsePattern = /^\s*uses:\s*([^\s]+)\s*$/gm;
const shaPattern = /@[0-9a-f]{40}(?:\s*#.*)?$/i;

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules" || entry.name === "dist") continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full));
    else out.push(full);
  }
  return out;
}

for (const file of await walk(root)) {
  if (!textExtensions.has(file.slice(file.lastIndexOf(".")))) continue;
  const content = await readFile(file, "utf8");

  if (file.endsWith(".js") || file.endsWith(".mjs")) {
    execFileSync(process.execPath, ["--check", file], { stdio: "pipe" });
  }

  if (file.includes("/.github/workflows/")) {
    for (const match of content.matchAll(workflowUsePattern)) {
      const reference = match[1];
      if (reference.startsWith("./")) continue;
      if (!shaPattern.test(reference)) {
        throw new Error(`workflow dependency is not pinned to a full commit SHA: ${relative(root, file)}: ${reference}`);
      }
    }
  }
}

console.log("repository policy checks passed");
