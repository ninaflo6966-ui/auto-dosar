import { RuleRegistry } from "../registry/RuleRegistry";

const registry = new RuleRegistry();

console.log("=== ALL RULES ===");
console.log(registry.getAllRules());

console.log("=== RCA_001 ===");
console.log(registry.getRuleById("RCA_001"));

console.log("=== INSURANCE RULES ===");
console.log(registry.getRulesByCategory("insurance"));