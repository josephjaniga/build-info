import { useState, useEffect, useCallback } from "react";
import { BuildInfo } from "./types";

interface UseBuildInfoOptions {
  url?: string;
  enabled?: boolean;
  ssr?: boolean;
  retry?: number;
  timeout?: number;
}

interface UseBuildInfoReturn {
  buildInfo: BuildInfo | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Environment detection
function getEnvironment(): "browser" | "server" | "worker" {
  if (
    typeof globalThis !== "undefined" &&
    typeof (globalThis as any).window !== "undefined"
  ) {
    if (typeof (globalThis as any).document !== "undefined") return "browser";
    return "worker";
  }
  return "server";
}

// Universal fetch with timeout and retry
async function fetchWithRetry(
  url: string,
  options: { timeout?: number; retry?: number } = {}
): Promise<Response> {
  const { timeout = 5000, retry = 1 } = options;

  for (let attempt = 0; attempt <= retry; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      if (attempt === retry) throw error;
      // Wait before retry (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }

  throw new Error("Max retries exceeded");
}

export function useBuildInfo(
  options: UseBuildInfoOptions = {}
): UseBuildInfoReturn {
  const {
    url = "/build-info.json",
    enabled = true,
    ssr = false,
    retry = 1,
    timeout = 5000,
  } = options;

  const environment = getEnvironment();
  const isServer = environment === "server";
  const shouldFetch = enabled && (!isServer || ssr);

  const [buildInfo, setBuildInfo] = useState<BuildInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(shouldFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchBuildInfo = useCallback(async () => {
    if (!shouldFetch) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetchWithRetry(url, { timeout, retry });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch build info: ${response.status} ${response.statusText}`
        );
      }

      const data = (await response.json()) as BuildInfo;

      // Validate the response structure
      if (!data.repository || !data.gitHash || !data.buildTimestamp) {
        throw new Error("Invalid build info format");
      }

      setBuildInfo(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch build info";
      setError(errorMessage);

      // Only log warnings in browser environment
      if (environment === "browser") {
        console.warn("Could not fetch build info:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [url, shouldFetch, timeout, retry, environment]);

  useEffect(() => {
    fetchBuildInfo();
  }, [fetchBuildInfo]);

  const refetch = useCallback(() => {
    fetchBuildInfo();
  }, [fetchBuildInfo]);

  return {
    buildInfo,
    loading,
    error,
    refetch,
  };
}
