export interface UserJourneyEvent {
  id: string;
  title: string;
  description: string;

  userGoal: string;

  traditionalDuration?: string;
  autodosarTargetDuration: string;

  physicalTripsTarget: "ZERO" | "ONE" | "DEPENDS";

  steps: string[];

  relatedOperations: string[];
  requiredDocuments: string[];
  generatedDocuments: string[];
  validationRules: string[];
}