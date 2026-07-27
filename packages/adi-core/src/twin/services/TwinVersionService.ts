import type { DigitalCaseTwin, TwinSnapshot } from "../models/DigitalTwin";
import { checksum, deepClone, deepFreeze } from "../utils/objectTools";

export class TwinVersionService {
  snapshot(twin: DigitalCaseTwin): TwinSnapshot {
    const copy = deepClone(twin);
    return deepFreeze({
      twinId: twin.id,
      caseId: twin.caseId,
      version: twin.version,
      createdAt: twin.updatedAt,
      checksum: checksum(copy),
      twin: copy,
    });
  }

  verify(snapshot: TwinSnapshot): boolean {
    return checksum(snapshot.twin) === snapshot.checksum;
  }
}
