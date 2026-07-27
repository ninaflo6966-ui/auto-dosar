import { DocumentType } from "../../documents/enums/DocumentType";
import { DocumentClassification } from "../models/DocumentClassification";

export class RuleBasedDocumentClassifier {
  classify(rawText: string): DocumentClassification {
    const text = rawText.toUpperCase();
    const signals: string[] = [];

    if (text.includes("CARTE DE IDENTITATE") || text.includes("CNP")) {
      signals.push("identity_keywords");
      return {
        type: DocumentType.IdentityCard,
        confidence: 0.95,
        matchedSignals: signals,
      };
    }

    if (text.includes("CARTEA DE IDENTITATE A VEHICULULUI") || text.includes("CIV")) {
      signals.push("civ_keywords");
      return {
        type: DocumentType.CIV,
        confidence: 0.95,
        matchedSignals: signals,
      };
    }

    if (text.includes("RCA") || text.includes("ASIGURARE OBLIGATORIE")) {
      signals.push("rca_keywords");
      return {
        type: DocumentType.RCA,
        confidence: 0.95,
        matchedSignals: signals,
      };
    }

    if (text.includes("CONTRACT DE ÎNSTRĂINARE") || text.includes("ITL-054")) {
      signals.push("contract_keywords");
      return {
        type: DocumentType.ContractITL054,
        confidence: 0.95,
        matchedSignals: signals,
      };
    }

    return {
      type: DocumentType.GeneratedApplication,
      confidence: 0.2,
      matchedSignals: ["unknown_document"],
    };
  }
}