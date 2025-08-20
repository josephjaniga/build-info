# Build-Info Vite Example

This example demonstrates how to use the `build-info` package with Vite.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

3. Build the application:
   ```bash
   npm run build
   ```

## How it Works

This example shows the **working case** where `build-info` works properly with Vite:

1. **Vite Plugin**: The `vite.config.js` includes a plugin that generates build info before the build starts
2. **React Hook**: The app uses `useBuildInfo` to fetch and display build information
3. **Build Process**: The build script runs `npx build-info` to generate the JSON file

### Import Used

```typescript
import { useBuildInfo } from "build-info/react";
```

This import works fine with Vite because:

- Vite handles Node.js modules differently than Next.js
- The server-side modules aren't being imported in client-side code
- Vite's bundling strategy is more permissive

## Key Features

- ✅ **Working with Vite** - No bundling issues
- ✅ **Build Info Generation** - Automatic generation during build
- ✅ **React Hook Integration** - Clean hook-based API
- ✅ **Error Handling** - Graceful fallbacks and retries

## File Structure

```
vite/
├── src/
│   └── App.jsx          # Main app component using useBuildInfo
├── public/              # Static assets
├── vite.config.js       # Vite config with build-info plugin
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## Build Process

1. `npm run build` runs `vite build && npx build-info -o ./dist`
2. Vite builds the application
3. `build-info` generates `build-info.json` in the `dist` folder
4. The React hook fetches this file at runtime

## Comparison with Next.js

This example works without issues, while the Next.js example demonstrates the bundling problem. This helps us understand:

- How different bundlers handle Node.js modules
- Why we need different solutions for different frameworks
- The importance of proper package structure
