import type { DigitalCaseTwin, TwinChangeContext } from "./DigitalTwin";

export type TwinPath = string;

export type TwinPatchOperation =
  | { op: "set"; path: TwinPath; value: unknown }
  | { op: "remove"; path: TwinPath }
  | { op: "append"; path: TwinPath; value: unknown }
  | { op: "replace"; path: TwinPath; value: unknown };

export interface TwinUpdateCommand {
  expectedVersion: number;
  changes: TwinPatchOperation[];
  context: TwinChangeContext;
}

export interface TwinUpdateResult {
  previous: DigitalCaseTwin;
  current: DigitalCaseTwin;
  changedPaths: string[];
}
