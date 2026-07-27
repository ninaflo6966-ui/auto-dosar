import { CaseFile } from "../../case-file/models/CaseFile";
import { ChecklistResult } from "../../checklist/models/ChecklistResult";

export interface CaseTwin {

  caseFile: CaseFile;

  checklist: ChecklistResult;

  insights: string[];

  warnings: string[];

  recommendations: string[];

  createdAt: Date;

}