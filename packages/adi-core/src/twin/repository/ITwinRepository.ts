import type { DigitalCaseTwin, TwinSnapshot } from "../models/DigitalTwin";

export interface ITwinRepository {
  save(twin: DigitalCaseTwin): Promise<void>;
  getCurrent(caseId: string): Promise<DigitalCaseTwin | null>;
  getVersion(caseId: string, version: number): Promise<DigitalCaseTwin | null>;
  listVersions(caseId: string): Promise<TwinSnapshot[]>;
}
