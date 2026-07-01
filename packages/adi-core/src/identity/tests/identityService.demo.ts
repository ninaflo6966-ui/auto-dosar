import { IdentityService } from "../services/IdentityService";

const rawText = `
ROMANIA
CARTE DE IDENTITATE

SERIA CJ NR 123456

CNP 1900512123451

NUME: POPESCU
PRENUME: ION

DOMICILIU: MUN. CLUJ-NAPOCA, STR. EXEMPLU NR. 10, AP. 3

EMIS DE SPCLEP CLUJ-NAPOCA

VALABIL 01.01.2020 01.01.2030
`;

const identityService = new IdentityService();

const result = identityService.analyzeRawText(rawText);

console.log("=== IDENTITY ANALYSIS RESULT ===");
console.log(JSON.stringify(result, null, 2));

if (!result.validation.isValid) {
  throw new Error("Test eșuat: datele nu sunt valide.");
}

console.log("Test reușit: Identity Module funcționează.");