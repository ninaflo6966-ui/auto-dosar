export type TwinDiffKind = "ADDED" | "REMOVED" | "CHANGED";

export interface TwinDiffEntry {
  path: string;
  kind: TwinDiffKind;
  before?: unknown;
  after?: unknown;
}

export interface TwinDiffResult {
  fromVersion: number;
  toVersion: number;
  entries: TwinDiffEntry[];
  hasChanges: boolean;
}
