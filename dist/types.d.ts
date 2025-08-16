export interface BuildInfo {
    repository: string;
    gitHash: string;
    shortHash: string;
    branch?: string;
    buildTimestamp: number;
    buildDate: string;
}
export interface BuildInfoOptions {
    outdir?: string;
    filename?: string;
    quiet?: boolean;
}
export interface GitInfo {
    repository: string;
    gitHash: string;
    shortHash: string;
    branch?: string;
}
//# sourceMappingURL=types.d.ts.map