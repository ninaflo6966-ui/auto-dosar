# ISSUE-002 — Digital Twin Engine

## Stare

Implementat — v1.0.

## Livrabile

- model `DigitalCaseTwin` extins peste Core Domain;
- metadate de proveniență pentru fiecare actualizare;
- builder pentru versiunea inițială;
- updater incremental cu protecția câmpurilor structurale;
- versionare imuabilă și checksum;
- diff recursiv între versiuni;
- istoric compact;
- repository abstract și implementare in-memory;
- evenimente standardizate;
- fațadă `DigitalTwinEngine`;
- teste pentru creare, actualizare, istoric, diff și conflict de versiune.

## Criterii de acceptare

- [x] Un Twin nou pornește la versiunea 1.
- [x] Fiecare actualizare produce exact versiunea următoare.
- [x] O comandă bazată pe o versiune veche este respinsă.
- [x] Istoricul păstrează toate versiunile.
- [x] Diferențele dintre versiuni sunt explicabile la nivel de cale.
- [x] Fiecare modificare produce un eveniment de audit.
- [x] Snapshot-urile pot fi verificate prin checksum.
- [x] Modelele legacy rămân exportate temporar pentru compatibilitate.

## Limitări v1.0

- repository-ul inclus este doar in-memory;
- nu există încă strategie automată de rezolvare a conflictelor dintre surse;
- invalidarea dependentă a documentelor generate va fi implementată odată cu Rule/Dependency Engine;
- proveniența la nivel de câmp va fi conectată la OCR în Document Intelligence.
