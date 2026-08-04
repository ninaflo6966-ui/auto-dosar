import type { CaseFileState } from "../models/CaseFileState";

export interface ICaseFileRepository {
  save(caseFile: CaseFileState): Promise<void>;
  findById(id: string): Promise<CaseFileState | undefined>;
  findByReference(reference: string): Promise<CaseFileState | undefined>;
  list(): Promise<CaseFileState[]>;
  delete(id: string): Promise<boolean>;
}
