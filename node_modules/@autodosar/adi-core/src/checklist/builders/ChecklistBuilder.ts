import { CaseFile } from "../../case-file/models/CaseFile";
import { DocumentType } from "../../documents/enums/DocumentType";
import { ChecklistItem } from "../models/ChecklistItem";
import { CaseHealth, ChecklistResult } from "../models/ChecklistResult";

export class ChecklistBuilder {
  build(caseFile: CaseFile): ChecklistResult {
    const items: ChecklistItem[] = [
      {
        id: "BUYER_IDENTIFIED",
        title: "Cumpărător identificat",
        description: "Datele cumpărătorului sunt prezente în dosar.",
        completed: caseFile.persons.length > 0 || caseFile.companies.length > 0,
        mandatory: true,
        blocking: true,
        category: "identity",
        recommendation: "Adaugă CI/CIE cumpărător sau datele firmei cumpărătoare.",
      },
      {
        id: "VEHICLE_IDENTIFIED",
        title: "Vehicul identificat",
        description: "Vehiculul are date minime de identificare.",
        completed: caseFile.vehicles.some((vehicle) => Boolean(vehicle.vin)),
        mandatory: true,
        blocking: true,
        category: "vehicle",
        recommendation: "Adaugă CIV sau completează VIN-ul vehiculului.",
      },
      {
        id: "RCA_PRESENT",
        title: "RCA încărcată",
        description: "Dosarul conține polița RCA.",
        completed: this.hasDocument(caseFile, DocumentType.RCA),
        mandatory: true,
        blocking: true,
        category: "documents",
        recommendation: "Încarcă polița RCA emisă pe numele cumpărătorului.",
      },
      {
        id: "VIN_VALIDATION",
        title: "VIN verificat",
        description: "VIN-ul este verificat în documentele dosarului.",
        completed: !this.hasBlockingIssue(caseFile, "VIN"),
        mandatory: true,
        blocking: true,
        category: "validation",
        recommendation: "Verifică documentele în care apare seria de șasiu.",
      },
      {
        id: "RCA_VALIDATION",
        title: "RCA verificată pe cumpărător",
        description: "RCA este validată ca fiind emisă pe cumpărător.",
        completed: !this.hasBlockingIssue(caseFile, "RCA"),
        mandatory: true,
        blocking: true,
        category: "validation",
        recommendation: "Asigură-te că RCA este emisă pe numele cumpărătorului.",
      },
    ];

    const progress = this.calculateProgress(items);
    const score = this.calculateScore(items);
    const health = this.calculateHealth(score);
    const nextAction = this.findNextAction(items);

    return {
      items,
      progress,
      score,
      health,
      readyForSubmission: items.every((item) => !item.blocking || item.completed),
      nextAction,
    };
  }

  private hasDocument(caseFile: CaseFile, type: DocumentType): boolean {
    return caseFile.documents.some((document) => document.type === type);
  }

  private hasBlockingIssue(caseFile: CaseFile, keyword: string): boolean {
    return Boolean(
      caseFile.validation?.issues.some(
        (issue) =>
          issue.severity === "error" &&
          issue.code.toUpperCase().includes(keyword.toUpperCase())
      )
    );
  }

  private calculateProgress(items: ChecklistItem[]): number {
    const completed = items.filter((item) => item.completed).length;
    return Math.round((completed / items.length) * 100);
  }

  private calculateScore(items: ChecklistItem[]): number {
    let score = 100;

    for (const item of items) {
      if (!item.completed && item.mandatory) {
        score -= item.blocking ? 25 : 10;
      }
    }

    return Math.max(0, score);
  }

  private calculateHealth(score: number): CaseHealth {
    if (score >= 95) return "EXCELLENT";
    if (score >= 80) return "GOOD";
    if (score >= 60) return "NEEDS_ATTENTION";
    return "CRITICAL";
  }

  private findNextAction(items: ChecklistItem[]): string | undefined {
    const firstIncomplete = items.find((item) => !item.completed);
    return firstIncomplete?.recommendation;
  }
}