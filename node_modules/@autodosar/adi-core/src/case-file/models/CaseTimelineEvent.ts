export interface CaseTimelineEvent {

    id: string;

    date: Date;

    type: string;

    description: string;

    createdBy: "SYSTEM" | "USER";

}