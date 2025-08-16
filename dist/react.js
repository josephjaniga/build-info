"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBuildInfo = useBuildInfo;
const react_1 = require("react");
// Environment detection
function getEnvironment() {
    if (typeof globalThis !== "undefined" &&
        typeof globalThis.window !== "undefined") {
        if (typeof globalThis.document !== "undefined")
            return "browser";
        return "worker";
    }
    return "server";
}
// Universal fetch with timeout and retry
async function fetchWithRetry(url, options = {}) {
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
        }
        catch (error) {
            if (attempt === retry)
                throw error;
            // Wait before retry (exponential backoff)
            await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
    }
    throw new Error("Max retries exceeded");
}
function useBuildInfo(options = {}) {
    const { url = "/build-info.json", enabled = true, ssr = false, retry = 1, timeout = 5000, } = options;
    const environment = getEnvironment();
    const isServer = environment === "server";
    const shouldFetch = enabled && (!isServer || ssr);
    const [buildInfo, setBuildInfo] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(shouldFetch);
    const [error, setError] = (0, react_1.useState)(null);
    const fetchBuildInfo = (0, react_1.useCallback)(async () => {
        if (!shouldFetch)
            return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetchWithRetry(url, { timeout, retry });
            if (!response.ok) {
                throw new Error(`Failed to fetch build info: ${response.status} ${response.statusText}`);
            }
            const data = (await response.json());
            // Validate the response structure
            if (!data.repository || !data.gitHash || !data.buildTimestamp) {
                throw new Error("Invalid build info format");
            }
            setBuildInfo(data);
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to fetch build info";
            setError(errorMessage);
            // Only log warnings in browser environment
            if (environment === "browser") {
                console.warn("Could not fetch build info:", err);
            }
        }
        finally {
            setLoading(false);
        }
    }, [url, shouldFetch, timeout, retry, environment]);
    (0, react_1.useEffect)(() => {
        fetchBuildInfo();
    }, [fetchBuildInfo]);
    const refetch = (0, react_1.useCallback)(() => {
        fetchBuildInfo();
    }, [fetchBuildInfo]);
    return {
        buildInfo,
        loading,
        error,
        refetch,
    };
}
//# sourceMappingURL=react.js.map