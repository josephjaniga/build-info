"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGitInfo = getGitInfo;
const child_process_1 = require("child_process");
function getGitInfo() {
    try {
        // Get full commit hash
        const gitHash = (0, child_process_1.execSync)("git rev-parse HEAD", { encoding: "utf8" }).trim();
        const shortHash = gitHash.substring(0, 7);
        // Get repository name from git remote
        const remoteUrl = (0, child_process_1.execSync)("git config --get remote.origin.url", {
            encoding: "utf8",
        }).trim();
        const repository = extractRepositoryName(remoteUrl);
        // Get branch name with fallbacks for different CI environments
        const branch = getBranchName();
        return {
            repository,
            gitHash,
            shortHash,
            branch,
        };
    }
    catch (error) {
        throw new Error(`Failed to get Git information: ${error}`);
    }
}
function extractRepositoryName(remoteUrl) {
    // GitHub: git@github.com:user/repo.git or https://github.com/user/repo.git
    const githubMatch = remoteUrl.match(/github\.com[:/]([^/]+)\/([^/.]+)/);
    if (githubMatch) {
        return githubMatch[2];
    }
    // Generic git URL ending with .git
    const gitMatch = remoteUrl.match(/\/([^/]+)\.git$/);
    if (gitMatch) {
        return gitMatch[1];
    }
    // Generic URL without .git
    const urlMatch = remoteUrl.match(/\/([^/]+)\/?$/);
    if (urlMatch) {
        return urlMatch[1];
    }
    return "unknown";
}
function getBranchName() {
    // Check CI environment variables first
    if (process.env.CF_PAGES_BRANCH) {
        return process.env.CF_PAGES_BRANCH;
    }
    if (process.env.GITHUB_REF_NAME) {
        return process.env.GITHUB_REF_NAME;
    }
    if (process.env.VERCEL_GIT_COMMIT_REF) {
        return process.env.VERCEL_GIT_COMMIT_REF;
    }
    // Fall back to git command
    try {
        const branch = (0, child_process_1.execSync)("git branch --show-current", {
            encoding: "utf8",
        }).trim();
        return branch || undefined;
    }
    catch {
        // If git command fails, return undefined
        return undefined;
    }
}
//# sourceMappingURL=git.js.map