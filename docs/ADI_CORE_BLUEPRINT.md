# ADI Core Blueprint
Version 1.0

---

# Executive Summary

ADI Core este un motor modular pentru procesarea inteligentă a dosarelor administrative.

AutoDosar reprezintă prima aplicație construită peste acest motor și are ca obiectiv digitalizarea completă a procesului de pregătire, verificare și generare a dosarelor de înmatriculare din România.

ADI Core este proiectat astfel încât să poată fi reutilizat pentru orice alt tip de dosar administrativ.

Principiul fundamental este separarea dintre:

- motorul generic (ADI Core);
- cunoștințele legislative și operaționale (Knowledge Packs);
- aplicația destinată utilizatorilor (AutoDosar).

---

# Vision

Să construim cel mai performant motor european pentru procesarea dosarelor administrative.

Utilizatorul nu trebuie să cunoască legislația, procedurile sau documentele necesare.

Platforma îl conduce pas cu pas până la finalizarea dosarului.

Obiectivul este reducerea timpului de pregătire a unui dosar de la zile sau ore la câteva minute.

---

# Mission

ADI Core trebuie să poată:

- colecta documente;
- extrage automat informații;
- valida consistența datelor;
- identifica neconcordanțe;
- explica erorile;
- genera documentele necesare;
- pregăti dosarul pentru depunere.

---

# Product Philosophy

ADI Core nu este o aplicație.

ADI Core este un motor.

AutoDosar este prima aplicație construită peste acest motor.

Motorul trebuie să rămână complet independent de:

- Next.js;
- React;
- baze de date;
- servicii OCR;
- servicii AI;
- furnizori cloud.

---

# Architecture Principles

## 1. Domain First

Modelul domeniului este mai important decât tehnologia.

## 2. UI Independent

Motorul nu cunoaște interfața.

## 3. Provider Independent

OCR, AI și serviciile externe sunt adaptoare.

## 4. Rule Driven

Toate verificările sunt implementate prin reguli reutilizabile.

## 5. Workflow Driven

Fiecare dosar urmează un flux controlat.

## 6. Privacy by Design

Protecția datelor este parte a arhitecturii.

## 7. Explainable Decisions

Fiecare decizie trebuie explicată utilizatorului.

---

# Platform Architecture

```
                    ADI Platform
                         │
        ┌────────────────┼─────────────────┐
        │                │                 │
    ADI Core      Knowledge Packs     AutoDosar
```

---

# ADI Core Modules

- Identity
- Documents
- Vehicle
- Case Management
- Validation
- Workflow
- Rule Engine
- Knowledge Engine
- Generator
- OCR
- AI
- Security
- Audit
- Integrations

---

# Bounded Contexts

## Identity

Responsabil pentru:

- persoane fizice;
- persoane juridice;
- reprezentanți;
- delegați;
- împuterniciți.

---

## Vehicle

Responsabil pentru:

- vehicul;
- VIN;
- CIV;
- certificat de înmatriculare;
- caracteristici tehnice.

---

## Documents

Responsabil pentru:

- încărcare;
- OCR;
- parsare;
- metadate;
- clasificare.

---

## Case Management

Responsabil pentru:

- CaseFile;
- progres;
- timeline;
- workflow.

---

## Validation

Responsabil pentru:

- reguli;
- profile;
- rapoarte;
- scoruri.

---

## Knowledge

Responsabil pentru:

- evenimente de viață;
- operațiuni;
- reguli legislative;
- explicații.

---

# Core Entities

- Person
- Company
- Vehicle
- CaseDocument
- CaseFile

---

# Aggregate Root

CaseFile este Aggregate Root.

Nicio entitate nu modifică direct:

- documentele;
- persoanele;
- vehiculele.

Toate modificările trec prin CaseFile.

---

# Workflow

Un dosar poate avea următoarele stări:

- Draft
- Collecting Documents
- OCR Processing
- Parsing
- Validation
- User Corrections
- Ready for Submission
- Submitted
- Completed
- Cancelled

---

# Validation Engine

Validation Engine verifică:

- existența documentelor;
- validitatea documentelor;
- consistența datelor;
- regulile operațiunii.

Motorul validează întregul dosar, nu documentele individuale.

---

# Business Rules

Fiecare regulă este:

- reutilizabilă;
- documentată;
- testabilă;
- explicabilă.

Exemple:

- RCA pe cumpărător;
- VIN identic;
- documente obligatorii;
- valabilitate acte.

---

# Validation Profiles

Fiecare operațiune activează un profil.

Exemple:

- Transcriere;
- Înmatriculare;
- Radiere;
- Duplicat;
- Modificare date.

---

# Knowledge Engine

Knowledge Engine transformă experiența utilizatorului în pași administrativi.

Exemplu:

Eveniment:

"Am cumpărat un vehicul."

↓

Platforma generează:

- documentele necesare;
- pașii;
- verificările;
- formularele.

Utilizatorul nu trebuie să cunoască procedura.

---

# Journey Engine

Platforma pornește de la evenimentul din viața utilizatorului.

Nu de la denumirea operațiunii.

Exemple:

- Am cumpărat un vehicul.
- Am importat un vehicul.
- Mi-am pierdut certificatul.
- Mi-am schimbat numele.
- M-am mutat.

Journey Engine stabilește traseul complet.

---

# OCR Pipeline

Imagine

↓

OCR

↓

Text

↓

Parser

↓

CaseDocument

↓

Validation

↓

CaseFile

---

# AI

Inteligența artificială asistă utilizatorul.

Nu ia decizii în locul motorului.

Toate deciziile oficiale sunt luate exclusiv pe baza regulilor de business.

---

# Security

Principii:

- minimizarea datelor;
- criptare;
- jurnalizare;
- audit;
- control acces;
- GDPR.

---

# Audit

Platforma păstrează istoricul tuturor modificărilor importante.

Exemple:

- document încărcat;
- document modificat;
- validare;
- generare document;
- depunere.

---

# Knowledge Packs

ADI Core nu conține legislația unei țări.

Legislația este organizată în Knowledge Packs.

Exemplu:

knowledge/

- ro/
  - dgpci/
  - rar/
  - itl/
  - insurance/

Aceste pachete conțin:

- reguli;
- operațiuni;
- documente;
- explicații;
- fluxuri.

---

# Coding Principles

- Clean Architecture
- Domain Driven Design
- SOLID
- Dependency Injection
- Test First
- Small Modules
- Explicit Types
- No Business Logic in UI

---

# Product Roadmap

Sprint 1

✔ Identity

Sprint 2

✔ Validation

Sprint 3

✔ Core Domain

Sprint 4

Knowledge Engine

Sprint 5

Workflow Engine

Sprint 6

Cross Validation

Sprint 7

Generator

Sprint 8

OCR

Sprint 9

AI Assistant

Sprint 10

Production Platform

---

# Long Term Vision

ADI Core trebuie să devină motorul reutilizabil pentru orice proces administrativ bazat pe documente.

AutoDosar reprezintă prima aplicație construită peste această platformă.

Pe termen lung, aceeași arhitectură poate susține și alte domenii administrative prin adăugarea unor Knowledge Packs specifice, fără modificarea nucleului platformei.