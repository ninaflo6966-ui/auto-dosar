import { RuleBasedDocumentClassifier } from "../classifier/RuleBasedDocumentClassifier";
import { DocumentClassification } from "../models/DocumentClassification";

export class DocumentIntelligenceService {

  private readonly classifier =
    new RuleBasedDocumentClassifier();

  public analyze(rawText: string): DocumentClassification {

    return this.classifier.classify(rawText);

  }

}