import { IdentityCard } from "../models/IdentityCard";
import { IdentityParser } from "../parsers/IdentityParser";
import {
  IdentityValidationResult,
  IdentityValidator,
} from "../validators/IdentityValidator";

export interface IdentityAnalysisResult {
  identityCard: IdentityCard;
  validation: IdentityValidationResult;
}

export class IdentityService {
  private parser: IdentityParser;
  private validator: IdentityValidator;

  constructor() {
    this.parser = new IdentityParser();
    this.validator = new IdentityValidator();
  }

  analyzeRawText(rawText: string): IdentityAnalysisResult {
    const identityCard = this.parser.parse(rawText);
    const validation = this.validator.validate(identityCard);

    return {
      identityCard,
      validation,
    };
  }
}