import { CaseFile } from "../../case-file/models/CaseFile";
import { CaseTwinBuilder } from "../../twin/builders/CaseTwinBuilder";
import { CaseState } from "../models/CaseState";

export class CaseOrchestrator {
  private readonly twinBuilder = new CaseTwinBuilder();

  public getState(caseFile: CaseFile): CaseState {
    const twin = this.twinBuilder.build(caseFile);

    return {
      progress: twin.checklist.progress,
      currentStep: "Validation",
      nextStep:
        twin.recommendations[0] ?? "Dosarul este complet.",
      score: twin.checklist.score,
      readyForSubmission: twin.checklist.readyForSubmission,
      checklist: twin.checklist.items,
    };
  }
}