# AutoDosar / ADI Core – Architecture v2.0

## 1. Decizie strategică

AutoDosar nu este doar o aplicație de generare dosare.

AutoDosar este primul produs construit peste ADI Core, un motor inteligent pentru procesarea, validarea și generarea dosarelor administrative.

## 2. Principiu central

ADI Core nu cunoaște interfața.

ADI Core nu depinde de Next.js, React, Google Vision sau de un anumit furnizor AI.

ADI Core lucrează cu obiecte de domeniu:
- CaseFile;
- CaseDocument;
- Person;
- Company;
- Vehicle;
- ValidationResult;
- BusinessRule;
- ValidationProfile.

## 3. Arhitectură generală

```text
AutoDosar Web App
        |
        v
ADI Core
        |
        +-- Identity Module
        +-- Vehicle Module
        +-- Documents Module
        +-- CaseFile Module
        +-- Validation Module
        +-- Workflow Module
        +-- Rules Module
        +-- Generator Module
        +-- Privacy Module