import { ValidationEngine } from "../engine/ValidationEngine";
import { validateVinFormat } from "../rules/VinRules";

const issues = validateVinFormat("VF1ABC12345O7890");

const engine = new ValidationEngine();
const result = engine.buildResult(issues);

console.log(JSON.stringify(result, null, 2));