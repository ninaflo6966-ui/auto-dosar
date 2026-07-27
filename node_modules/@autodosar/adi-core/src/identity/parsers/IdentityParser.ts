import { IdentityDocumentType } from "../../enums/IdentityDocumentType";
import { IdentityCard } from "../models/IdentityCard";

export class IdentityParser {
  parse(rawText: string): IdentityCard {
    const text = this.normalizeText(rawText);

    const documentType = this.detectDocumentType(text);
    const cnp = this.extractCnp(text);
    const { series, number } = this.extractSeriesAndNumber(text);
    const lastName = this.extractLastName(text);
    const firstName = this.extractFirstName(text);
    const address = this.extractAddress(text);
    const issuingAuthority = this.extractIssuingAuthority(text);
    const dates = this.extractDates(text);

    const confidence = this.calculateConfidence({
      cnp,
      series,
      number,
      lastName,
      firstName,
      address,
    });

    return {
      documentType,
      series,
      number,
      cnp,
      lastName,
      firstName,
      address,
      issuingAuthority,
      validFrom: dates[0],
      validUntil: dates[1],
      confidence,
      rawText,
    };
  }

  private normalizeText(rawText: string): string {
    return rawText
      .replace(/\r/g, "\n")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{2,}/g, "\n")
      .trim()
      .toUpperCase();
  }

  private detectDocumentType(text: string): IdentityDocumentType {
    if (
      text.includes("CARTE ELECTRONICA") ||
      text.includes("CARTE ELECTRONICĂ") ||
      text.includes("CIE")
    ) {
      return IdentityDocumentType.CIE;
    }

    return IdentityDocumentType.CI;
  }

  private extractCnp(text: string): string | undefined {
    const cnpMatch = text.match(/\b[1-9]\d{12}\b/);
    return cnpMatch?.[0];
  }

  private extractSeriesAndNumber(text: string): {
    series?: string;
    number?: string;
  } {
    const patterns = [
      /SERIA\s*([A-Z]{2})\s*(?:NR|NUMAR|NUMĂR|NO|N)\.?\s*([0-9]{6})/,
      /SERIE\s*([A-Z]{2})\s*(?:NR|NUMAR|NUMĂR|NO|N)\.?\s*([0-9]{6})/,
      /\b([A-Z]{2})\s*([0-9]{6})\b/,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);

      if (match) {
        return {
          series: match[1],
          number: match[2],
        };
      }
    }

    return {};
  }

  private extractLastName(text: string): string | undefined {
    return this.extractValueAfterLabels(text, [
      "NUME",
      "NOM",
      "LAST NAME",
      "SURNAME",
    ]);
  }

  private extractFirstName(text: string): string | undefined {
    return this.extractValueAfterLabels(text, [
      "PRENUME",
      "PRENOM",
      "FIRST NAME",
      "GIVEN NAME",
    ]);
  }

  private extractAddress(text: string): string | undefined {
    const addressPattern =
      /(?:DOMICILIU|ADRESA|ADDRESS)\s*[:\-]?\s*([\s\S]*?)(?:EMIS|ELIBERAT|ISSUED|VALABIL|VALID|CNP|$)/;

    const match = text.match(addressPattern);

    if (!match?.[1]) {
      return undefined;
    }

    return this.cleanValue(match[1]);
  }

  private extractIssuingAuthority(text: string): string | undefined {
    const authorityPattern =
      /(?:EMIS DE|ELIBERAT DE|ISSUED BY)\s*[:\-]?\s*([\s\S]*?)(?:LA DATA|DATA|VALID|VALABIL|$)/;

    const match = text.match(authorityPattern);

    if (!match?.[1]) {
      return undefined;
    }

    return this.cleanValue(match[1]);
  }

  private extractDates(text: string): string[] {
    const matches = text.match(/\b\d{2}[./-]\d{2}[./-]\d{4}\b/g);
    return matches ?? [];
  }

  private extractValueAfterLabels(
    text: string,
    labels: string[]
  ): string | undefined {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      for (const label of labels) {
        if (line.includes(label)) {
          const afterLabel = line
            .substring(line.indexOf(label) + label.length)
            .replace(/[:\-\/]/g, " ")
            .trim();

          const cleanedInlineValue = this.cleanName(afterLabel);

          if (cleanedInlineValue && cleanedInlineValue.length >= 2) {
            return cleanedInlineValue;
          }

          const nextLine = lines[i + 1];

          if (nextLine && !this.looksLikeLabel(nextLine)) {
            return this.cleanName(nextLine);
          }
        }
      }
    }

    return undefined;
  }

  private looksLikeLabel(value: string): boolean {
    const labels = [
      "NUME",
      "PRENUME",
      "CNP",
      "DOMICILIU",
      "ADRESA",
      "EMIS",
      "ELIBERAT",
      "VALABIL",
      "SERIA",
      "SERIE",
    ];

    return labels.some((label) => value.includes(label));
  }

  private cleanName(value: string): string | undefined {
    const cleaned = value
      .replace(/[^A-ZĂÂÎȘŞȚŢ \-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return cleaned || undefined;
  }

  private cleanValue(value: string): string | undefined {
    const cleaned = value.replace(/\s+/g, " ").trim();
    return cleaned || undefined;
  }

  private calculateConfidence(fields: {
    cnp?: string;
    series?: string;
    number?: string;
    lastName?: string;
    firstName?: string;
    address?: string;
  }): number {
    let score = 0;

    if (fields.cnp) score += 0.25;
    if (fields.series && fields.number) score += 0.2;
    if (fields.lastName) score += 0.15;
    if (fields.firstName) score += 0.15;
    if (fields.address) score += 0.25;

    return Math.round(score * 100) / 100;
  }
}