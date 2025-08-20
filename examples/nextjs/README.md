# Build-Info Next.js Example

This example demonstrates how to use the `build-info` package with Next.js.

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

## Expected Behavior

This example demonstrates the **proper usage** of `build-info` with Next.js using the client-safe import.

### The Solution

This example uses the recommended import path that avoids bundling issues:

```typescript
import { useBuildInfo } from "build-info/react";
```

This import only includes client-safe modules:

- `useBuildInfo` (client-safe)
- Type definitions

### Why This Works

1. The `build-info/react` import only includes client-safe code
2. No Node.js modules are bundled for the client side
3. Next.js webpack can successfully build the application
4. The React hook works as expected in the browser

## How It Works

This example demonstrates the proper way to use `build-info` with Next.js:

1. **Client-safe import** - Uses `build-info/react` to avoid Node.js modules
2. **Clean bundling** - No webpack errors or bundling issues
3. **Optimal performance** - Only imports what's needed for the client

## Testing

To test the working solution:

1. Run `npm install`
2. Run `npm run build` - should succeed without webpack errors
3. Run `npm run dev` - should work in development mode
4. This demonstrates the proper way to use build-info with Next.js

## Next Steps

This example will be updated as we implement solutions to make the package work properly with Next.js while maintaining backward compatibility.
