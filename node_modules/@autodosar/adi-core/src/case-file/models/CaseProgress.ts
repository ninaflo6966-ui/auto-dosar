export interface CaseProgress {

    completedSteps: number;

    totalSteps: number;

    percent: number;

    missingDocuments: string[];

    blockingErrors: string[];

}