import { useState, useEffect } from "react";
import { BuildInfo } from "./types";

interface UseBuildInfoOptions {
  url?: string;
  enabled?: boolean;
}

interface UseBuildInfoReturn {
  buildInfo: BuildInfo | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useBuildInfo(
  options: UseBuildInfoOptions = {}
): UseBuildInfoReturn {
  const { url = "/build-info.json", enabled = true } = options;

  const [buildInfo, setBuildInfo] = useState<BuildInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);

  const fetchBuildInfo = async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch build info: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      setBuildInfo(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch build info";
      setError(errorMessage);
      console.warn("Could not fetch build info:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuildInfo();
  }, [url, enabled]);

  const refetch = () => {
    fetchBuildInfo();
  };

  return {
    buildInfo,
    loading,
    error,
    refetch,
  };
}
