# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-01-XX

### Added

- **Multiple Entry Points**: New import paths for better framework compatibility
  - `build-info/react` - Client-safe React hook only
  - `build-info/client` - Alias for React hook (client-safe)
  - `build-info/server` - Server-side functionality only
  - `build-info/generator` - Generator module only
  - `build-info/git` - Git utilities only
- **Framework-Specific Examples**: Added comprehensive examples for Vite and Next.js
- **Enhanced Documentation**: Updated README with import options and framework-specific guidance
- **Test Scripts**: Added manual test scripts for different import paths

### Changed

- **Backward Compatibility**: Main entry point (`build-info`) still works but may cause bundling issues in Next.js
- **Package Structure**: Reorganized exports to separate client and server functionality
- **Documentation**: Comprehensive guide for different use cases and frameworks

### Fixed

- **Next.js Compatibility**: Resolved bundling issues by providing client-safe import paths
- **Bundle Size**: Reduced bundle size for client-side usage by excluding Node.js modules

### Migration Guide

- **Vite Projects**: No changes needed, continue using `import { useBuildInfo } from "build-info"`
- **Next.js Projects**: Update to `import { useBuildInfo } from "build-info/react"`
- **Build Scripts**: Update to `import { generateBuildInfo } from "build-info/server"`

## [1.0.0] - 2025-01-XX

### Added

- Initial release
- CLI tool for generating build metadata
- React hook for fetching build info
- Git integration for repository information
- TypeScript support
- CI/CD environment detection
