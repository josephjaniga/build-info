const fs = require("fs");
const path = require("path");

// Safety check: Ensure we're in the examples directory
const currentDir = path.basename(process.cwd());
if (currentDir !== "examples") {
  console.error("❌ SAFETY CHECK FAILED!");
  console.error(
    "This reset script can only be run from the 'examples' directory."
  );
  console.error(`Current directory: ${currentDir}`);
  console.error("Please navigate to the examples directory first:");
  console.error("  cd examples");
  console.error("  npm run reset");
  process.exit(1);
}

// Additional safety check: Verify we have the expected structure
const expectedFiles = ["package.json", "vite.config.js", "index.html"];
const missingFiles = expectedFiles.filter((file) => !fs.existsSync(file));

if (missingFiles.length > 0) {
  console.error("❌ SAFETY CHECK FAILED!");
  console.error("This doesn't appear to be the correct examples directory.");
  console.error("Missing expected files:", missingFiles.join(", "));
  console.error("Please ensure you're in the right directory.");
  process.exit(1);
}

console.log("✅ Safety checks passed - running in examples directory");
console.log("🧹 Resetting examples directory to factory settings...\n");

// Directories and files to remove
const toRemove = [
  "dist",
  "public/build-info.json",
  "test-output",
  "build-info.json",
  "node_modules",
  "package-lock.json",
];

// Remove directories and files
toRemove.forEach((item) => {
  const fullPath = path.join(__dirname, item);
  try {
    if (fs.existsSync(fullPath)) {
      if (fs.lstatSync(fullPath).isDirectory()) {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`✅ Removed directory: ${item}`);
      } else {
        fs.unlinkSync(fullPath);
        console.log(`✅ Removed file: ${item}`);
      }
    } else {
      console.log(`⏭️  Skipped (not found): ${item}`);
    }
  } catch (error) {
    console.log(`⚠️  Could not remove ${item}: ${error.message}`);
  }
});

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log("✅ Created public directory");
}

console.log("\n🎉 Reset complete!");
console.log("\nNext steps:");
console.log("1. Run: npm install");
console.log("2. Run: npm run dev");
console.log("3. Open http://localhost:3000 to see the example");
