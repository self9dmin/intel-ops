import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
const output = `// Generated at build time from package.json. Do not edit.\nexport const APP_VERSION = ${JSON.stringify(packageJson.version)};\n`;

await writeFile(resolve(root, "ui/app/buildVersion.ts"), output, "utf8");
