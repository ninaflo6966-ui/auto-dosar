import { CaseFile } from "../../case-file/models/CaseFile";
import { ChecklistBuilder } from "../../checklist/builders/ChecklistBuilder";
import { CaseTwin } from "../models/CaseTwin";

export class CaseTwinBuilder {

  private readonly checklistBuilder = new ChecklistBuilder();

  build(caseFile: CaseFile): CaseTwin {

    const checklist = this.checklistBuilder.build(caseFile);

    const recommendations =
      checklist.items
        .filter(item => !item.completed && item.recommendation)
        .map(item => item.recommendation!);

    const warnings =
      checklist.items
        .filter(item => item.blocking && !item.completed)
        .map(item => item.title);

    const insights = [

      `Dosarul este pregătit în proporție de ${checklist.progress}%.`,

      checklist.readyForSubmission
        ? "Dosarul poate fi depus."
        : "Dosarul NU poate fi depus încă."

    ];

    return {

      caseFile,

      checklist,

      insights,

      warnings,

      recommendations,

      createdAt: new Date()

    };

  }

}