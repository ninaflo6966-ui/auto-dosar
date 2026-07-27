import type { IEventBus } from "../contracts/IEventBus";
import type { DomainEvent } from "../contracts/DomainEvent";
import { AutoDosarEvents, type TwinUpdatedPayload } from "../domain-events/AutoDosarEvents";
import { EventTypes } from "../domain-events/EventTypes";

export class TwinRuleEvaluationBridge {
  constructor(private readonly eventBus: IEventBus) {}

  register(): () => void {
    const subscription = this.eventBus.subscribe<DomainEvent<TwinUpdatedPayload>>(
      EventTypes.TWIN_UPDATED,
      async (event) => {
        await this.eventBus.publish(AutoDosarEvents.ruleEvaluationRequested({
          aggregateId: event.aggregateId,
          actorId: event.actorId,
          correlationId: event.correlationId,
          causationId: event.eventId,
          payload: {
            twinId: event.payload.twinId,
            twinVersion: event.payload.currentVersion,
            changedPaths: event.payload.changedPaths,
          },
        }));
      },
      { handlerId: "TwinRuleEvaluationBridge", priority: 100 },
    );
    return () => subscription.unsubscribe();
  }
}
