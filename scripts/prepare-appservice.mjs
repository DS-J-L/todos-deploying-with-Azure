import { access, cp, mkdir, rm } from "fs/promises";
import path from "path";

const projectRoot = process.cwd();
const sourceStandaloneDir = path.join(projectRoot, ".next", "standalone");
const sourceStaticDir = path.join(projectRoot, ".next", "static");
const sourcePublicDir = path.join(projectRoot, "public");
const targetDir = path.join(projectRoot, "deployment", "package");
const targetStaticDir = path.join(targetDir, ".next", "static");
const targetPublicDir = path.join(targetDir, "public");

async function pathExists(targetPath) {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  await rm(targetDir, { recursive: true, force: true });
  await mkdir(path.dirname(targetDir), { recursive: true });

  if (!(await pathExists(sourceStandaloneDir))) {
    throw new Error("Missing .next/standalone. Run `npm run build` before packaging for Azure.");
  }

  await cp(sourceStandaloneDir, targetDir, { recursive: true });

  if (await pathExists(sourceStaticDir)) {
    await mkdir(path.dirname(targetStaticDir), { recursive: true });
    await cp(sourceStaticDir, targetStaticDir, { recursive: true });
  }

  if (await pathExists(sourcePublicDir)) {
    await cp(sourcePublicDir, targetPublicDir, { recursive: true });
  }

  console.log("Azure App Service package prepared at deployment/package");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

