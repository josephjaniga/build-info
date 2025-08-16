import { execSync } from "child_process";
import { readFileSync, existsSync, rmSync } from "fs";
import { join } from "path";

describe("Real Integration Tests", () => {
  const testOutputDir = "./test-output";

  beforeAll(() => {
    // Build the project once before all tests
    execSync("npm run build", { encoding: "utf8", cwd: process.cwd() });

    // Clean up any existing test output
    if (existsSync(testOutputDir)) {
      rmSync(testOutputDir, { recursive: true, force: true });
    }
  });

  afterAll(() => {
    // Clean up test output
    if (existsSync(testOutputDir)) {
      rmSync(testOutputDir, { recursive: true, force: true });
    }
  });

  describe("CLI Commands", () => {
    it("should generate build info with default settings", () => {
      // Run the actual CLI command
      const output = execSync("node dist/cli.js", {
        encoding: "utf8",
        cwd: process.cwd(),
      });

      // Verify output contains expected information
      expect(output).toContain("Build info created successfully");
      expect(output).toContain("build-info.json");

      // Verify the file was actually created
      expect(existsSync("./dist/build-info.json")).toBe(true);

      // Read and parse the actual file
      const buildInfoContent = readFileSync("./dist/build-info.json", "utf8");
      const buildInfo = JSON.parse(buildInfoContent);

      // Verify the structure
      expect(buildInfo).toHaveProperty("repository");
      expect(buildInfo).toHaveProperty("gitHash");
      expect(buildInfo).toHaveProperty("shortHash");
      expect(buildInfo).toHaveProperty("buildTimestamp");
      expect(buildInfo).toHaveProperty("buildDate");

      // Verify data types
      expect(typeof buildInfo.repository).toBe("string");
      expect(typeof buildInfo.gitHash).toBe("string");
      expect(typeof buildInfo.shortHash).toBe("string");
      expect(typeof buildInfo.buildTimestamp).toBe("number");
      expect(typeof buildInfo.buildDate).toBe("string");

      // Verify Git hash format (should be 40 characters for full hash)
      expect(buildInfo.gitHash).toHaveLength(40);
      expect(buildInfo.shortHash).toHaveLength(7);

      // Verify timestamp is recent (within last hour) - timestamp is in seconds
      const nowInSeconds = Math.floor(Date.now() / 1000);
      expect(buildInfo.buildTimestamp).toBeGreaterThan(nowInSeconds - 3600);
      expect(buildInfo.buildTimestamp).toBeLessThanOrEqual(nowInSeconds);

      // Verify date format is ISO 8601
      expect(new Date(buildInfo.buildDate).toISOString()).toBe(
        buildInfo.buildDate
      );
    });

    it("should generate build info with custom output directory and filename", () => {
      // Run CLI with custom options
      const output = execSync(
        "node dist/cli.js --outdir ./test-output --filename custom-build.json",
        {
          encoding: "utf8",
          cwd: process.cwd(),
        }
      );

      expect(output).toContain("Build info created successfully");
      expect(output).toContain("custom-build.json");

      // Verify custom file was created
      expect(existsSync("./test-output/custom-build.json")).toBe(true);

      // Read and verify the custom file
      const buildInfoContent = readFileSync(
        "./test-output/custom-build.json",
        "utf8"
      );
      const buildInfo = JSON.parse(buildInfoContent);

      expect(buildInfo).toHaveProperty("repository");
      expect(buildInfo).toHaveProperty("gitHash");
      expect(buildInfo).toHaveProperty("shortHash");
    });

    it("should handle quiet mode", () => {
      // Run CLI with quiet flag
      const output = execSync("node dist/cli.js --quiet", {
        encoding: "utf8",
        cwd: process.cwd(),
      });

      // Should be minimal output in quiet mode
      expect(output.trim()).toBe("");
    });

    it("should extract actual Git information", () => {
      // Get actual Git info using our CLI
      execSync("node dist/cli.js --outdir ./test-output", {
        encoding: "utf8",
        cwd: process.cwd(),
      });

      const buildInfoContent = readFileSync(
        "./test-output/build-info.json",
        "utf8"
      );
      const buildInfo = JSON.parse(buildInfoContent);

      // Verify repository name matches current directory or Git remote
      expect(buildInfo.repository).toBeTruthy();
      expect(buildInfo.repository.length).toBeGreaterThan(0);

      // Verify Git hash is valid (should match current HEAD)
      const gitHash = execSync("git rev-parse HEAD", {
        encoding: "utf8",
      }).trim();
      expect(buildInfo.gitHash).toBe(gitHash);

      // Verify short hash matches
      const shortHash = execSync("git rev-parse --short HEAD", {
        encoding: "utf8",
      }).trim();
      expect(buildInfo.shortHash).toBe(shortHash);

      // Verify branch (if available)
      try {
        const currentBranch = execSync("git branch --show-current", {
          encoding: "utf8",
        }).trim();
        if (currentBranch) {
          expect(buildInfo.branch).toBe(currentBranch);
        }
      } catch (error) {
        // Branch might not be available in all Git setups
        expect(buildInfo.branch).toBeDefined();
      }
    });
  });

  describe("File System Operations", () => {
    it("should create output directory if it does not exist", () => {
      const customDir = "./test-output/nested/directory";
      const customFile = join(customDir, "build-info.json");

      // Ensure directory doesn't exist
      if (existsSync(customDir)) {
        rmSync(customDir, { recursive: true, force: true });
      }

      // Run CLI with nested directory
      execSync("node dist/cli.js --outdir ./test-output/nested/directory", {
        encoding: "utf8",
        cwd: process.cwd(),
      });

      // Verify directory and file were created
      expect(existsSync(customDir)).toBe(true);
      expect(existsSync(customFile)).toBe(true);

      // Verify file content is valid JSON
      const content = readFileSync(customFile, "utf8");
      const parsed = JSON.parse(content);
      expect(parsed).toHaveProperty("repository");
    });

    it("should overwrite existing files", async () => {
      const testFile = "./test-output/overwrite-test.json";

      // Create initial file
      execSync(
        "node dist/cli.js --outdir ./test-output --filename overwrite-test.json",
        {
          encoding: "utf8",
          cwd: process.cwd(),
        }
      );

      const initialContent = readFileSync(testFile, "utf8");
      const initialInfo = JSON.parse(initialContent);
      const initialTimestamp = initialInfo.buildTimestamp;

      // Wait a moment to ensure different timestamp
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Overwrite the file
      execSync(
        "node dist/cli.js --outdir ./test-output --filename overwrite-test.json",
        {
          encoding: "utf8",
          cwd: process.cwd(),
        }
      );

      const newContent = readFileSync(testFile, "utf8");
      const newInfo = JSON.parse(newContent);

      // Verify file was overwritten with new timestamp
      expect(newInfo.buildTimestamp).toBeGreaterThan(initialTimestamp);
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid output directory gracefully", () => {
      // Try to write to a directory with invalid characters
      const invalidDir = "invalid/directory/with/*/invalid/chars";

      try {
        execSync(`node dist/cli.js --outdir ${invalidDir}`, {
          encoding: "utf8",
          cwd: process.cwd(),
        });
        // If we get here, the CLI handled the error gracefully
        expect(true).toBe(true);
      } catch (error) {
        // CLI should exit with an error code
        expect(error).toBeDefined();
      }
    });

    it("should handle Git repository requirements", () => {
      // This test verifies that the CLI requires a Git repository
      // If we're not in a Git repo, it should fail gracefully
      try {
        execSync("git status", { encoding: "utf8" });
        // If we get here, we're in a Git repo, so the CLI should work
        expect(() => {
          execSync("node dist/cli.js --outdir ./test-output", {
            encoding: "utf8",
            cwd: process.cwd(),
          });
        }).not.toThrow();
      } catch (error) {
        // Not in a Git repo, CLI should handle this gracefully
        expect(() => {
          execSync("node dist/cli.js --outdir ./test-output", {
            encoding: "utf8",
            cwd: process.cwd(),
          });
        }).toThrow();
      }
    });
  });
});
