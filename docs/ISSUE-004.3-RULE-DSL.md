# ISSUE-004.3 — Rule DSL

## Status

Implemented.

## Purpose

The Rule DSL provides a typed, declarative API for defining AutoDosar business rules while preserving compatibility with the existing `RuleEngine` and legacy `RuleCondition[]` rules.

## Public API

```ts
import {
  rule,
  document,
  vehicle,
  applicant,
  proxy,
  operation,
  allOf,
  anyOf,
  not,
  RuleRegistry,
  rulePack,
} from "@adi-core/rules";
```

## Example

```ts
const rcaRequired = rule("DGPCI.REG.TRANSCRIERE.001")
  .name("RCA required")
  .description("RCA is required for transcription")
  .category("DOCUMENTS")
  .severity("CRITICAL")
  .priority(10)
  .tags("operation:TRANSCRIPTION", "RCA")
  .owner("DGPCI")
  .when(
    allOf(
      operation.isTranscription(),
      applicant.isNaturalPerson(),
      vehicle.isUsed(),
      document("RCA").missing(),
    ),
  )
  .message("RCA is missing")
  .reason("A valid policy is required")
  .because("Applicable RCA legal source")
  .recommend("Upload a valid RCA policy.", "CRITICAL")
  .nextAction("UPLOAD_RCA", "Upload RCA policy", { blocking: true })
  .build();
```

## Expression model

The DSL builds a serializable expression tree containing `CONDITION`, `PREDICATE`, `AND`, `OR`, and `NOT` nodes. `ExpressionEvaluator` evaluates the tree and produces the same trace format used by the existing explainable rule system.

## Predicate library

- `document(type).exists()`, `.missing()`, `.isValid()`
- `vehicle.isImported()`, `.isDomestic()`, `.isNew()`, `.isUsed()`
- `applicant.isNaturalPerson()`, `.isCompany()`, `.hasProxy()`
- `proxy.exists()`, `.missing()`
- `operation.isRegistration()`, `.isTranscription()`, `.isTemporaryAuthorization()`, `.isRadiation()`, `.is(type)`

## Registry and packs

`RuleRegistry` supports registration, duplicate protection, lookup by id/version, category, tag, and operation tag. `RulePack` groups a manifest and a unique collection of rules.

## Compatibility

Legacy rules continue to use `conditions`. DSL rules use the optional `expression` property. `RuleExecutor` selects the expression evaluator only when an expression exists.

## Verification

```bash
npm run test:rules
```
