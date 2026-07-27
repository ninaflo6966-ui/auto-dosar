import type { DigitalCaseTwin, TwinSnapshot } from "../models/DigitalTwin";
import { TwinVersionService } from "../services/TwinVersionService";
import { deepClone, deepFreeze } from "../utils/objectTools";
import type { ITwinRepository } from "./ITwinRepository";

export class InMemoryTwinRepository implements ITwinRepository {
  private readonly storage = new Map<string, Map<number, TwinSnapshot>>();
  constructor(private readonly versions = new TwinVersionService()) {}

  async save(twin: DigitalCaseTwin): Promise<void> {
    const caseVersions = this.storage.get(twin.caseId) ?? new Map<number, TwinSnapshot>();
    const latest = Math.max(0, ...caseVersions.keys());
    if (caseVersions.has(twin.version)) throw new Error(`Versiunea ${twin.version} există deja pentru dosarul ${twin.caseId}.`);
    if (twin.version !== latest + 1) throw new Error(`Versiune neconsecutivă: ${twin.version}; următoarea permisă este ${latest + 1}.`);
    caseVersions.set(twin.version, this.versions.snapshot(twin));
    this.storage.set(twin.caseId, caseVersions);
  }

  async getCurrent(caseId: string): Promise<DigitalCaseTwin | null> {
    const versions = this.storage.get(caseId);
    if (!versions?.size) return null;
    const latest = Math.max(...versions.keys());
    return cloneTwin(versions.get(latest)!.twin);
  }

  async getVersion(caseId: string, version: number): Promise<DigitalCaseTwin | null> {
    const snapshot = this.storage.get(caseId)?.get(version);
    return snapshot ? cloneTwin(snapshot.twin) : null;
  }

  async listVersions(caseId: string): Promise<TwinSnapshot[]> {
    return [...(this.storage.get(caseId)?.values() ?? [])]
      .sort((a, b) => a.version - b.version)
      .map(item => deepFreeze(deepClone(item)));
  }
}

function cloneTwin(twin: DigitalCaseTwin): DigitalCaseTwin {
  return deepFreeze(deepClone(twin));
}
