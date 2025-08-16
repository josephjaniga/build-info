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
export declare function useBuildInfo(options?: UseBuildInfoOptions): UseBuildInfoReturn;
export {};
//# sourceMappingURL=react.d.ts.map