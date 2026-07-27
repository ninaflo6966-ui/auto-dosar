import type { TwinVersionSummary } from "../models/DigitalTwin";
import type { ITwinRepository } from "../repository/ITwinRepository";

export class TwinHistoryService {
  constructor(private readonly repository: ITwinRepository) {}

  async list(caseId: string): Promise<TwinVersionSummary[]> {
    const snapshots = await this.repository.listVersions(caseId);
    return snapshots.map(({ twin }) => ({
      twinId: twin.id,
      caseId: twin.caseId,
      version: twin.version,
      createdAt: twin.updatedAt,
      source: twin.metadata.lastChangeSource,
      reason: twin.metadata.lastChangeReason,
      actor: twin.metadata.lastActor,
    }));
  }
}
