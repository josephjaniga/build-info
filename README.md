# Build-Info

Generate build metadata for React + Vite projects to be included in their build output.

## Features

- 🚀 **CLI Tool** - Run with `npx build-info`
- 📦 **Git Integration** - Automatically extracts repository, commit, and branch info
- 🌍 **CI/CD Support** - Works with Cloudflare Pages, GitHub Actions, Vercel
- ⚡ **Zero Config** - Sensible defaults for Vite projects
- 🎯 **TypeScript** - Full type safety and IntelliSense support

## Installation

```bash
npm install build-info
```

Or use directly with npx:

```bash
npx build-info
```

## CLI Usage

### Basic Usage

```bash
# Generate build-info.json in ./dist (default)
npx build-info

# Specify custom output directory
npx build-info --outdir ./build

# Specify custom filename
npx build-info --filename version.json

# Suppress console output
npx build-info --quiet
```

### Options

| Option       | Short | Default           | Description                          |
| ------------ | ----- | ----------------- | ------------------------------------ |
| `--outdir`   | `-o`  | `./dist`          | Output directory for build-info.json |
| `--filename` | `-f`  | `build-info.json` | Output filename                      |
| `--quiet`    | `-q`  | `false`           | Suppress console output              |

## Integration with Vite

Add to your `package.json` build script:

```json
{
  "scripts": {
    "build": "vite build && npx build-info",
    "build:quiet": "vite build && npx build-info --quiet"
  }
}
```

## Generated Output

The CLI generates a `build-info.json` file with the following structure:

```json
{
  "repository": "my-app",
  "gitHash": "d4466f640749b3f6dc755dd8305c12c546533b16",
  "shortHash": "d4466f6",
  "branch": "main",
  "buildTimestamp": 1755232523,
  "buildDate": "2025-08-15T04:35:23Z"
}
```

### Fields

- **repository** - Name of the Git repository
- **gitHash** - Full commit hash
- **shortHash** - First 7 characters of commit hash
- **branch** - Branch name (if available)
- **buildTimestamp** - Unix timestamp (seconds)
- **buildDate** - ISO 8601 UTC date

## Programmatic Usage

```typescript
import { generateBuildInfo } from "build-info";

const buildInfo = await generateBuildInfo({
  outdir: "./dist",
  filename: "build-info.json",
  quiet: false,
});

console.log(buildInfo.repository); // "my-app"
console.log(buildInfo.shortHash); // "d4466f6"
```

## CI/CD Environment Support

The tool automatically detects and uses environment variables from:

- **Cloudflare Pages**: `CF_PAGES_COMMIT_SHA`, `CF_PAGES_BRANCH`
- **GitHub Actions**: `GITHUB_REF_NAME`
- **Vercel**: `VERCEL_GIT_COMMIT_REF`

## Cloudflare Pages Integration

1. Add to your build command in Cloudflare Pages:

   ```bash
   npm run build && npx build-info
   ```

2. The `build-info.json` file will be available at your domain root:
   ```
   https://your-app.pages.dev/build-info.json
   ```

## React Integration (Coming Soon)

Future versions will include React hooks and components for displaying build information in your app.

## Requirements

- Node.js 16+
- Git repository
- macOS/Linux environment (Windows support planned)

## License

MIT
