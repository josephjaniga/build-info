# build-info Examples

This directory contains examples demonstrating how to use the `build-info` package as a Git dependency.

## Quick Start

### 1. Install the Package

```bash
npm install git+https://github.com/josephjaniga/build-info.git
```

### 2. Use the CLI Tool

```bash
# Generate build info with default settings
npx build-info

# Generate with custom output directory and filename
npx build-info --outdir ./public --filename version.json

# Generate quietly (no console output)
npx build-info --quiet

# Show help
npx build-info --help
```

### 3. Use in Node.js

```javascript
const { generateBuildInfo, getGitInfo } = require('build-info');

// Get Git information
const gitInfo = getGitInfo();
console.log('Repository:', gitInfo.repository);
console.log('Commit:', gitInfo.shortHash);

// Generate build info file
generateBuildInfo({
  outdir: './dist',
  filename: 'build-info.json',
  quiet: true
});
```

### 4. Use in React

```jsx
import { useBuildInfo } from 'build-info/react';

function App() {
  const { buildInfo, loading, error } = useBuildInfo({
    url: '/build-info.json',
    retry: 3,
    timeout: 5000
  });

  if (loading) return <div>Loading build info...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Build Information</h1>
      <p>Repository: {buildInfo?.repository}</p>
      <p>Commit: {buildInfo?.shortHash}</p>
      <p>Branch: {buildInfo?.branch}</p>
      <p>Build Time: {buildInfo?.buildDate}</p>
    </div>
  );
}
```

## Test Files

This directory includes several test files to verify the package functionality:

- `test-react.js` - Tests React hook import and compatibility
- `test-main.js` - Tests main module exports
- `test-complete.js` - Comprehensive workflow test

Run the tests:

```bash
# Test React hook
node test-react.js

# Test main module
node test-main.js

# Test complete workflow
node test-complete.js
```

## Package.json Configuration

Add to your `package.json`:

```json
{
  "dependencies": {
    "build-info": "git+https://github.com/josephjaniga/build-info.git"
  }
}
```

## Build Process Integration

### Vite Example

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { execSync } from 'child_process';

export default defineConfig({
  plugins: [
    {
      name: 'build-info',
      buildStart() {
        // Generate build info before build starts
        execSync('npx build-info -o ./public');
      }
    }
  ]
});
```

### Next.js Example

```javascript
// next.config.js
const { execSync } = require('child_process');

module.exports = {
  webpack: (config, { buildId, dev, isServer }) => {
    if (!dev) {
      // Generate build info during production build
      execSync('npx build-info -o ./public');
    }
    return config;
  }
};
```

## Generated Build Info Structure

The package generates a `build-info.json` file with the following structure:

```json
{
  "repository": "my-app",
  "gitHash": "d4466f640749b3f6dc755dd8305c12c546533b16",
  "shortHash": "d4466f6",
  "branch": "main",
  "buildTimestamp": 1234567890,
  "buildDate": "2023-01-01T00:00:00.000Z"
}
```

## Environment Variables

The package automatically detects CI/CD environment variables:

- `CF_PAGES_BRANCH` / `CF_PAGES_COMMIT_SHA` (Cloudflare Pages)
- `GITHUB_REF_NAME` / `GITHUB_SHA` (GitHub Actions)
- `VERCEL_GIT_COMMIT_REF` / `VERCEL_GIT_COMMIT_SHA` (Vercel)

## React Hook Options

```javascript
const { buildInfo, loading, error, refetch } = useBuildInfo({
  url: '/build-info.json',        // Custom URL path
  enabled: true,                  // Enable/disable fetching
  ssr: false,                     // Enable server-side fetching
  retry: 1,                       // Number of retry attempts
  timeout: 5000                   // Request timeout in ms
});
```

## Error Handling

The package includes comprehensive error handling:

- Network errors with retry logic
- Invalid JSON responses
- Missing required fields
- Timeout handling
- SSR/SSG compatibility

## Framework Compatibility

The React hook is compatible with:

- ✅ Next.js (SSR/SSG)
- ✅ Vite
- ✅ Create React App
- ✅ Gatsby
- ✅ Remix
- ✅ Astro
- ✅ Any React 16.8+ application
