import { RcaNotOnBuyerRule } from "../rules/RcaBusinessRules";
import { ValidationEngine } from "../engine/ValidationEngine";

const issues = RcaNotOnBuyerRule.execute({
  buyerName: "ION POPESCU",
  vehicleVin: "VF1ABC12345678901",
  vehicleRegistrationNumber: "CJ12ABC",
  checkDate: "2026-06-30",
  rca: {
    ownerName: "MARIA POPESCU",
    vin: "VF1ABC12345678901",
    registrationNumber: "CJ12ABC",
    validFrom: "2026-01-01",
    validUntil: "2026-12-31",
  },
});

const engine = new ValidationEngine();
const result = engine.buildResult(issues);

console.log("=== BUSINESS RULE ===");
console.log(RcaNotOnBuyerRule);

console.log("=== VALIDATION RESULT ===");
console.log(JSON.stringify(result, null, 2));