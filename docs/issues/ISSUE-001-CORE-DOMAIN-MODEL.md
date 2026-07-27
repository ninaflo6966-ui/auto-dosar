# ISSUE-001 — Core Domain Model v1.0

**Stare:** implementat — fundație inițială  
**Prioritate:** critică  
**Componentă:** `packages/adi-core/src/domain`

## Scop

Definirea unui limbaj comun, independent de interfață, OCR, baza de date și instituțiile externe, pentru toate modulele AutoDosar.

## Decizii

1. `DomainCase` este agregatul administrativ central.
2. `DomainCaseTwin` este proiecția coerentă și versionată folosită de motoarele platformei.
3. Persoana fizică și persoana juridică sunt entități distincte, reunite prin `DomainParty`.
4. Rolul unei părți într-un dosar este separat de identitatea sa.
5. Documentele încărcate, generate și obținute prin integrare folosesc același model de bază.
6. Orice validare păstrează `ruleId`, `ruleVersion` și sursele juridice.
7. Orice document generat păstrează versiunea șablonului și versiunea Digital Twin din care a fost produs.
8. Sumele sunt păstrate în unități monetare minore (`amountMinor`) pentru evitarea erorilor de precizie.
9. Datele de domeniu nu depind de React, Next.js, NestJS, Prisma sau furnizori OCR.

## Entități incluse

- DomainPerson
- DomainCompany
- DomainParty
- DomainVehicle
- DomainOperation
- DomainInstitution
- DomainDocument
- DomainPayment
- DomainValidationResult
- DomainGeneratedDocument
- DomainAuditEvent
- DomainCase
- DomainCaseTwin

## Compatibilitate

Proiectul conține modele legacy cu denumiri duplicate (`Person`, `Vehicle`). Pentru a nu rupe funcționalitățile existente, noul model este exportat temporar ca namespace:

```ts
import { Domain } from "@autodosar/adi-core";

const vehicle: Domain.DomainVehicle = { /* ... */ };
```

Migrarea modelelor legacy va fi realizată separat și controlat.

## Criterii de acceptare

- [x] Există un model canonic pentru părți, vehicul, operațiune și dosar.
- [x] Digital Twin este versionat.
- [x] Validările sunt explicabile și auditabile.
- [x] Documentele generate pot fi invalidate în funcție de versiunea Twin.
- [x] Modelul nu depinde de framework-uri.
- [x] Codul existent nu este rupt prin coliziuni de export.

## Următorul issue

`ISSUE-002 — Digital Twin Engine`: construire, actualizare, versionare și invalidarea derivatelor atunci când datele sursă se modifică.
