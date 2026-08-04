import type { CaseFileState } from "../models/CaseFileState";
import type { ICaseFileRepository } from "./ICaseFileRepository";

export class InMemoryCaseFileRepository implements ICaseFileRepository {
  private readonly records = new Map<string, CaseFileState>();

  async save(caseFile: CaseFileState): Promise<void> {
    this.records.set(caseFile.id, structuredClone(caseFile));
  }

  async findById(id: string): Promise<CaseFileState | undefined> {
    const found = this.records.get(id);
    return found ? structuredClone(found) : undefined;
  }

  async findByReference(reference: string): Promise<CaseFileState | undefined> {
    const found = [...this.records.values()].find((item) => item.reference === reference);
    return found ? structuredClone(found) : undefined;
  }

  async list(): Promise<CaseFileState[]> {
    return [...this.records.values()].map((item) => structuredClone(item));
  }

  async delete(id: string): Promise<boolean> {
    return this.records.delete(id);
  }
}
