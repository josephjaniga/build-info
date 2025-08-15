import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { BuildInfo, BuildInfoOptions } from "./types";
import { getGitInfo } from "./git";

export function generateBuildInfo(options: BuildInfoOptions = {}): BuildInfo {
  const {
    outdir = "./dist",
    filename = "build-info.json",
    quiet = false,
  } = options;

  // Get Git information
  const gitInfo = getGitInfo();

  // Get build timestamp
  const buildTimestamp = Math.floor(Date.now() / 1000);
  const buildDate = new Date().toISOString();

  // Create build info object
  const buildInfo: BuildInfo = {
    ...gitInfo,
    buildTimestamp,
    buildDate,
  };

  // Ensure output directory exists
  try {
    mkdirSync(outdir, { recursive: true });
  } catch (error) {
    throw new Error(`Failed to create output directory '${outdir}': ${error}`);
  }

  // Write JSON file
  const outputPath = join(outdir, filename);
  try {
    writeFileSync(outputPath, JSON.stringify(buildInfo, null, 2));
  } catch (error) {
    throw new Error(`Failed to write build info to '${outputPath}': ${error}`);
  }

  // Log success (unless quiet mode)
  if (!quiet) {
    console.log("Build info created successfully:");
    console.log(` Repository: ${buildInfo.repository}`);
    if (buildInfo.branch) {
      console.log(` Branch: ${buildInfo.branch}`);
    }
    console.log(` Commit: ${buildInfo.shortHash}`);
    console.log(` Build Time: ${buildInfo.buildDate}`);
    console.log(` Output: ${outputPath}`);
  }

  return buildInfo;
}
