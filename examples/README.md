# Build-Info Examples

This directory contains examples demonstrating how to use the `build-info` package with different frameworks and bundlers.

## Examples

### 📦 [Vite Example](./vite/)

A working example using Vite that demonstrates:

- ✅ Successful integration with Vite
- ✅ React hook usage
- ✅ Build process integration
- ✅ No bundling issues

**Key takeaway**: Vite handles Node.js modules differently and works without issues.

### ⚠️ [Next.js Example](./nextjs/)

An example that demonstrates the **bundling issue** with Next.js:

- ❌ Webpack bundling errors
- ❌ Node.js module resolution problems
- ✅ Same React hook code as Vite
- ✅ Identical functionality

**Key takeaway**: Next.js is stricter about Node.js modules and requires special handling.

## The Problem

The `build-info` package includes both client-safe and server-side modules:

```typescript
// Client-safe (works in browser)
import { useBuildInfo } from "build-info";

// Server-side (uses Node.js modules)
import { generateBuildInfo, getGitInfo } from "build-info";
```

When importing from the main entry point, bundlers like Next.js try to include all modules, including those that use Node.js built-ins (`fs`, `path`, `zlib`, `child_process`).

## Framework Differences

| Framework        | Node.js Module Handling | Status               |
| ---------------- | ----------------------- | -------------------- |
| Vite             | Permissive, polyfills   | ✅ Works             |
| Next.js          | Strict, requires config | ❌ Fails             |
| Create React App | Moderate                | ⚠️ May work          |
| Webpack          | Configurable            | ⚠️ Depends on config |

## Testing the Examples

### Vite Example

```bash
cd vite
npm install
npm run build  # Should succeed
```

### Next.js Example

```bash
cd nextjs
npm install
npm run build  # Should fail with webpack errors
```

## Solutions

These examples will be updated to demonstrate various solutions:

1. **Webpack Configuration** - Exclude Node.js modules
2. **Alternative Imports** - Use client-safe entry points
3. **Conditional Imports** - Import only what's needed
4. **Package Structure** - Separate client/server exports

## Purpose

These examples help us:

- Understand the bundling issue
- Test different solutions
- Ensure backward compatibility
- Provide clear documentation for users
