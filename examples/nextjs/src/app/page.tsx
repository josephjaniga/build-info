"use client";

import { useBuildInfo } from "build-info/react";

export default function Home() {
  const { buildInfo, loading, error, refetch } = useBuildInfo({
    url: "/build-info.json",
    retry: 2,
    timeout: 5000,
  });

  return (
    <div className="container">
      <header>
        <h1>build-info Example</h1>
        <p>This demonstrates the build-info React hook fetching from HTTP</p>
      </header>

      <main>
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
          <h3>How it works:</h3>
          <ol>
            <li>A placeholder build-info.json exists in the public folder</li>
            <li>
              During build, the placeholder is overwritten with real build info
            </li>
            <li>
              The React hook fetches /build-info.json from the public folder
            </li>
            <li>Build information is displayed above</li>
          </ol>

          <h3>Import used:</h3>
          <pre>{'import { useBuildInfo } from "build-info/react";'}</pre>

          <p>
            <strong>Note:</strong> This import uses the client-safe entry point
            and should work without bundling issues in Next.js.
          </p>
        </div>
      </main>
    </div>
  );
}
