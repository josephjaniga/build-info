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
        // Get file size for technical details
        const stats = require("fs").statSync(outputPath);
        const fileSize = stats.size;
        const fileSizeKB = (fileSize / 1024).toFixed(2);
        // Calculate gzip size (approximate)
        const jsonString = JSON.stringify(buildInfo);
        const gzipSize = require("zlib").gzipSync(jsonString).length;
        const gzipSizeKB = (gzipSize / 1024).toFixed(2);
        // ANSI color codes
        const colors = {
            cyan: "\x1b[36m",
            green: "\x1b[32m",
            yellow: "\x1b[33m",
            blue: "\x1b[34m",
            gray: "\x1b[90m",
            orange: "\x1b[38;5;208m",
            white: "\x1b[37m",
            bold: "\x1b[1m",
            reset: "\x1b[0m",
        };
        console.log(""); // Blank line before output
        console.log(`${colors.cyan}📦 build-info ${colors.green}v1.0.0${colors.reset} creating build json output...`);
        console.log(""); // Blank line after header
        console.log(`${colors.green}✓ Build info generated${colors.reset}`);
        console.log(`  ${colors.gray}Repository:${colors.reset} ${buildInfo.repository}`);
        if (buildInfo.branch) {
            console.log(`  ${colors.gray}Branch:${colors.reset} ${buildInfo.branch}`);
        }
        console.log(`  ${colors.gray}Commit:${colors.reset} ${colors.yellow}${buildInfo.shortHash}${colors.reset}`);
        console.log(`  ${colors.gray}Build Time:${colors.reset} ${buildInfo.buildDate}`);
        console.log(""); // Blank line before file info
        // Split the path to colorize different parts
        const pathParts = outputPath.split("/");
        const folderName = pathParts.slice(0, -1).join("/");
        const fileName = pathParts[pathParts.length - 1];
        console.log(`${colors.orange}${folderName}${colors.white}/${colors.blue}${fileName}${colors.reset}                   ${colors.white}${colors.bold}${fileSizeKB} kB${colors.reset} │ gzip:  ${gzipSizeKB} kB`);
    }
    return buildInfo;
}
//# sourceMappingURL=generator.js.map