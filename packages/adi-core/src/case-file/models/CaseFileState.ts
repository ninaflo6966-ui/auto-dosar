import type { OperationAnswers } from "../../operations/models/QuestionDefinition";
import type { SmartChecklistResult } from "../../checklist/models/SmartChecklistResult";
import type { CaseFile } from "./CaseFile";
import type { CaseFileMetadata } from "./CaseFileMetadata";

/**
 * Starea agregată a dosarului folosită de produsul AutoDosar.
 * Extinde modelul legacy fără a-l rupe și devine contractul central pentru
 * wizard, checklist, upload, validare și generare de documente.
 */
export interface CaseFileState extends CaseFile {
  version: number;
  operationSlug?: string;
  answers: OperationAnswers;
  smartChecklist?: SmartChecklistResult;
  score: number;
  metadata?: CaseFileMetadata;
}
