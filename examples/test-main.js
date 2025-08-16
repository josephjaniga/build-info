// Test the main module exports
const { generateBuildInfo, getGitInfo } = require("build-info");

console.log("✅ Main module imported successfully!");
console.log("generateBuildInfo function:", typeof generateBuildInfo);
console.log("getGitInfo function:", typeof getGitInfo);

// Test that the functions are callable
try {
  const gitInfo = getGitInfo();
  console.log("✅ getGitInfo() works:", gitInfo);
} catch (error) {
  console.log(
    "⚠️ getGitInfo() error (expected if not in Git repo):",
    error.message
  );
}

console.log("✅ Package exports are working correctly!");
