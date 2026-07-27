# AutoDosar — Core Domain Model v1.0

## 1. Rolul modelului

Modelul de domeniu este vocabularul oficial al platformei. El descrie realitatea administrativă și nu structura unor formulare sau ecrane.

Fluxul fundamental este:

```text
surse de date → entități de domeniu → CaseTwin → reguli/validări → documente și pași
```

## 2. Agregatul central

`DomainCase` reprezintă dosarul administrativ. El leagă operațiunea, vehiculul, părțile și starea procedurală.

Datele detaliate sunt reunite în `DomainCaseTwin`, o proiecție versionată care devine sursa unică pentru validare, decizie și generarea documentelor.

## 3. Identitate și rol

Identitatea unei persoane nu este același lucru cu rolul său într-un dosar.

O persoană poate fi cumpărător într-un dosar, proprietar în altul și împuternicit într-un al treilea. Din acest motiv:

- `DomainPerson` și `DomainCompany` descriu identitatea;
- `CaseParty` descrie rolul în dosarul concret;
- `representedPartyId` arată în numele cui acționează un reprezentant, delegat sau împuternicit.

## 4. Vehicul

`DomainVehicle` reunește atributele stabile ale vehiculului și contextul administrativ relevant: proveniență, stare, VIN, CIV și date tehnice.

## 5. Documente

`DomainDocument` acoperă toate sursele:

- încărcare de către utilizator;
- generare AutoDosar;
- integrare instituțională;
- introducere manuală autorizată.

Documentele sunt versionate și pot înlocui documente anterioare fără pierderea istoricului.

## 6. Validare explicabilă

Fiecare rezultat de validare păstrează:

- identificatorul regulii;
- versiunea regulii;
- severitatea;
- mesajul explicativ;
- sursele juridice;
- momentul evaluării.

## 7. Documente generate

Orice document generat păstrează:

- șablonul și versiunea lui;
- versiunea `CaseTwin` folosită;
- starea `DRAFT`, `FINAL` sau `INVALIDATED`.

Astfel, o modificare ulterioară a datelor poate invalida automat documentele care nu mai corespund realității dosarului.

## 8. Limita versiunii 1.0

Modelul definește fundația comună. Nu include încă:

- algoritmul de construire și reconciliere a Twin-ului;
- persistența în PostgreSQL;
- schemele DTO ale API-ului;
- nomenclatoarele complete de documente;
- regulile legislative declarative.

Acestea vor fi dezvoltate în module separate, fără a introduce dependențe în modelul de domeniu.
