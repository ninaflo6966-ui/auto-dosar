import type { DigitalCaseTwin } from "../models/DigitalTwin";
import type { TwinDiffEntry, TwinDiffResult } from "../models/TwinDiff";

export class TwinDiffService {
  compare(before: DigitalCaseTwin, after: DigitalCaseTwin): TwinDiffResult {
    if (before.caseId !== after.caseId) throw new Error("Nu pot fi comparate Twin-uri aparținând unor dosare diferite.");
    const entries: TwinDiffEntry[] = [];
    walk(before, after, "", entries);
    return { fromVersion: before.version, toVersion: after.version, entries, hasChanges: entries.length > 0 };
  }
}

function walk(before: unknown, after: unknown, path: string, output: TwinDiffEntry[]): void {
  if (Object.is(before, after)) return;
  if (before === undefined) { output.push({ path, kind: "ADDED", after }); return; }
  if (after === undefined) { output.push({ path, kind: "REMOVED", before }); return; }
  if (isObject(before) && isObject(after) && !Array.isArray(before) && !Array.isArray(after)) {
    const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
    for (const key of [...keys].sort()) walk(before[key], after[key], path ? `${path}.${key}` : key, output);
    return;
  }
  if (Array.isArray(before) && Array.isArray(after)) {
    const max = Math.max(before.length, after.length);
    for (let index = 0; index < max; index += 1) walk(before[index], after[index], `${path}[${index}]`, output);
    return;
  }
  output.push({ path, kind: "CHANGED", before, after });
}

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}
