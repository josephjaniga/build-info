"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBuildInfo = generateBuildInfo;
const fs_1 = require("fs");
const path_1 = require("path");
const git_1 = require("./git");
function generateBuildInfo(options = {}) {
    const { outdir = "./dist", filename = "build-info.json", quiet = false, } = options;
    // Get Git information
    const gitInfo = (0, git_1.getGitInfo)();
    // Get build timestamp
    const buildTimestamp = Math.floor(Date.now() / 1000);
    const buildDate = new Date().toISOString();
    // Create build info object
    const buildInfo = {
        ...gitInfo,
        buildTimestamp,
        buildDate,
    };
    // Ensure output directory exists
    try {
        (0, fs_1.mkdirSync)(outdir, { recursive: true });
    }
    catch (error) {
        throw new Error(`Failed to create output directory '${outdir}': ${error}`);
    }
    // Write JSON file
    const outputPath = (0, path_1.join)(outdir, filename);
    try {
        (0, fs_1.writeFileSync)(outputPath, JSON.stringify(buildInfo, null, 2));
    }
    catch (error) {
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
//# sourceMappingURL=generator.js.map