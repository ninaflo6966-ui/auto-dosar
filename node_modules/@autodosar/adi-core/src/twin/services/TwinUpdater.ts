import type { DomainAuditEvent } from "../../domain/CoreDomain";
import type { DigitalCaseTwin } from "../models/DigitalTwin";
import type { TwinPatchOperation, TwinUpdateCommand, TwinUpdateResult } from "../models/TwinPatch";
import { deepClone, deepFreeze, getPath, removePath, setPath } from "../utils/objectTools";

const PROTECTED_PATHS = new Set(["id", "caseId", "version", "createdAt", "updatedAt", "metadata", "auditTrail"]);

export class TwinUpdater {
  constructor(private readonly now: () => Date = () => new Date(), private readonly idFactory: () => string = defaultId) {}

  apply(twin: DigitalCaseTwin, command: TwinUpdateCommand): TwinUpdateResult {
    if (command.expectedVersion !== twin.version) {
      throw new Error(`Conflict de versiune: așteptată ${command.expectedVersion}, disponibilă ${twin.version}.`);
    }
    if (!command.changes.length) throw new Error("Actualizarea Twin trebuie să conțină cel puțin o modificare.");
    if (!command.context.reason.trim()) throw new Error("Motivul actualizării Twin este obligatoriu.");

    const next = deepClone(twin) as unknown as Record<string, unknown>;
    const changedPaths: string[] = [];
    for (const change of command.changes) {
      const path = normalize(change.path);
      guardPath(path);
      this.applyOperation(next, { ...change, path });
      changedPaths.push(path);
    }

    const timestamp = command.context.occurredAt ?? this.now().toISOString();
    const version = twin.version + 1;
    next.version = version;
    next.updatedAt = timestamp;
    next.metadata = {
      schemaVersion: "1.0",
      lastChangeSource: command.context.source,
      lastChangeReason: command.context.reason,
      lastActor: command.context.actor,
      correlationId: command.context.correlationId,
      updatedAt: timestamp,
    };

    const auditEvent: DomainAuditEvent = {
      id: this.idFactory(),
      caseId: twin.caseId,
      eventType: "TWIN_UPDATED",
      actorType: command.context.actor.type,
      actorId: command.context.actor.id,
      occurredAt: timestamp,
      payload: {
        fromVersion: twin.version,
        toVersion: version,
        source: command.context.source,
        reason: command.context.reason,
        changedPaths,
      },
    };
    next.auditTrail = [...twin.auditTrail, auditEvent];

    const current = deepFreeze(next as unknown as DigitalCaseTwin);
    return { previous: twin, current, changedPaths: [...new Set(changedPaths)] };
  }

  private applyOperation(root: Record<string, unknown>, change: TwinPatchOperation): void {
    if (change.op === "remove") {
      removePath(root, change.path);
      return;
    }
    if (change.op === "append") {
      const current = getPath(root, change.path);
      if (!Array.isArray(current)) throw new Error(`Calea „${change.path}” nu indică o colecție.`);
      setPath(root, change.path, [...current, deepClone(change.value)]);
      return;
    }
    if (change.op === "replace" && getPath(root, change.path) === undefined) {
      throw new Error(`Calea „${change.path}” nu există și nu poate fi înlocuită.`);
    }
    setPath(root, change.path, deepClone(change.value));
  }
}

function normalize(path: string): string {
  return path.replace(/^\//, "").replace(/\//g, ".");
}

function guardPath(path: string): void {
  const root = path.split(".")[0];
  if (!root || PROTECTED_PATHS.has(root)) throw new Error(`Calea protejată „${path}” nu poate fi modificată direct.`);
}

function defaultId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `event-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
