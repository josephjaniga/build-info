"use client";

import { useBuildInfo } from "build-info"; // This import may cause bundling issues

export default function ProblematicPage() {
  const { buildInfo, loading, error, refetch } = useBuildInfo({
    url: "/build-info.json",
    retry: 2,
    timeout: 5000,
  });

  return (
    <div className="container">
      <header>
        <h1>⚠️ Problematic Import Example</h1>
        <p>
          This page uses the problematic import that may cause bundling issues
        </p>
      </header>

      <main>
        <div className="status error">
          <h2>⚠️ Warning</h2>
          <p>
            This page uses{" "}
            <code>import {"{ useBuildInfo }"} from "build-info"</code> which
            includes Node.js modules.
          </p>
          <p>
            <strong>Expected behavior:</strong> This may cause webpack bundling
            errors during build.
          </p>
        </div>

        {loading && (
          <div className="status loading">
            <h2>🔄 Loading build info...</h2>
          </div>
        )}

        {error && (
          <div className="status error">
            <h2>❌ Error loading build info</h2>
            <p>{error}</p>
            <button onClick={refetch}>Retry</button>
          </div>
        )}

        {buildInfo && (
          <div className="status success">
            <h2>✅ Build Info Loaded</h2>
            <div className="build-info">
              <div className="info-item">
                <strong>Repository:</strong> {buildInfo.repository}
              </div>
              <div className="info-item">
                <strong>Commit:</strong> {buildInfo.shortHash}
              </div>
              <div className="info-item">
                <strong>Branch:</strong> {buildInfo.branch || "N/A"}
              </div>
              <div className="info-item">
                <strong>Build Time:</strong>{" "}
                {new Date(buildInfo.buildTimestamp * 1000).toLocaleString()}
              </div>
              <div className="info-item">
                <strong>Build Date:</strong> {buildInfo.buildDate}
              </div>
            </div>
            <button onClick={refetch}>Refresh</button>
          </div>
        )}

        <div className="instructions">
          <h3>Problematic Import:</h3>
          <pre>{'import { useBuildInfo } from "build-info";'}</pre>

          <h3>Why this is problematic:</h3>
          <ul>
            <li>Includes all exports from the main entry point</li>
            <li>Bundles Node.js modules (fs, path, zlib, child_process)</li>
            <li>May cause webpack errors in Next.js</li>
            <li>Larger bundle size due to unnecessary modules</li>
          </ul>

          <h3>Better Alternative:</h3>
          <pre>{'import { useBuildInfo } from "build-info/react";'}</pre>

          <p>
            <a href="/" className="button">
              ← Back to Working Example
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
