#!/usr/bin/env node

import { Command } from "commander";
import { generateBuildInfo } from "./generator";

const program = new Command();

program
  .name("build-info")
  .description(
    "Generate build metadata for React + Vite projects to be included in their build output"
  )
  .version("1.0.0")
  .option(
    "-o, --outdir <directory>",
    "Output directory for build-info.json",
    "./dist"
  )
  .option("-f, --filename <filename>", "Output filename", "build-info.json")
  .option("-q, --quiet", "Suppress console output")
  .action(async (options) => {
    try {
      await generateBuildInfo({
        outdir: options.outdir,
        filename: options.filename,
        quiet: options.quiet,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error:", errorMessage);
      process.exit(1);
    }
  });

program.parse();
