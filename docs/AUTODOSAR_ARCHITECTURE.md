# AutoDosar AI – Architecture v1.0

## 1. Scopul arhitecturii

AutoDosar este construit ca o platformă modulară, nu ca o simplă aplicație de completare formulare.

Scopul arhitecturii este ca fiecare funcționalitate importantă să poată fi reutilizată în mai multe operațiuni: contract ITL-054, impunere primărie, duplicat talon, transcriere, înmatriculare, radiere și alte fluxuri viitoare.

## 2. Principiul central

Scriem cod o singură dată și îl folosim de o sută de ori.

## 3. AutoDosar Core

Platforma este organizată în jurul următoarelor motoare:

### 3.1 Document Intelligence Engine

Responsabil de citirea și interpretarea documentelor încărcate de utilizator.

Exemple:
- CI / CIE;
- CIV;
- certificat de înmatriculare;
- certificat fiscal;
- contract;
- factură;
- CUI;
- procură.

### 3.2 Validation Engine

Responsabil de verificarea coerenței dosarului.

Exemple:
- VIN identic în toate documentele;
- CNP identic în documentele aceleiași persoane;
- CUI identic în documentele firmei;
- documente lipsă;
- documente incompatibile;
- documente pentru alt vehicul.

### 3.3 Rules Engine

Responsabil de regulile legale și procedurale.

Exemple:
- documente obligatorii pentru fiecare operațiune;
- excepții;
- acte suplimentare;
- taxe;
- formulare generate automat.

### 3.4 Workflow Engine

Responsabil de ghidarea utilizatorului pas cu pas.

Exemple:
- ce întrebare urmează;
- ce document trebuie încărcat;
- ce lipsește;
- ce se poate genera;
- când dosarul este complet.

### 3.5 Integration Engine

Responsabil de conectarea cu servicii externe, atunci când acestea permit acces digital.

Exemple:
- DRPCIV;
- ONRC;
- RAR;
- primării;
- Ghișeul.ro;
- asiguratori RCA;
- servicii de plată.

### 3.6 Document Generator

Responsabil de generarea documentelor finale.

Exemple:
- DOCX;
- PDF;
- checklist dosar;
- cereri;
- declarații;
- contract ITL-054.

### 3.7 Payment Engine

Responsabil de plăți și dovezi de plată.

Exemple:
- link plată Ghișeul.ro;
- dovadă plată încărcată;
- plată prin procesator privat;
- status plată.

### 3.8 Notification Engine

Responsabil de comunicarea cu utilizatorul.

Exemple:
- email;
- SMS;
- WhatsApp;
- notificări privind documente lipsă;
- trimitere documente finale.

### 3.9 User Profile Engine

Responsabil de datele reutilizabile ale utilizatorului, cu acordul acestuia.

Exemple:
- CI analizată o singură dată;
- date personale reutilizate;
- vehicule salvate;
- dosare anterioare.

### 3.10 Analytics Engine

Responsabil de măsurarea performanței platformei.

Exemple:
- dosare generate;
- dosare validate;
- erori frecvente;
- documente lipsă;
- timp economisit;
- deplasări la ghișeu eliminate.

## 4. Flux general

Utilizatorul alege operațiunea.

AutoDosar stabilește fluxul.

Utilizatorul adaugă documentele sau completează manual datele.

Document Intelligence Engine analizează documentele.

Validation Engine verifică datele.

Rules Engine stabilește cerințele.

Document Generator creează documentele finale.

Payment Engine gestionează taxele.

Notification Engine trimite rezultatul către client.

## 5. Direcție de dezvoltare

AutoDosar trebuie construit astfel încât să funcționeze imediat ca produs comercial, dar să poată evolua ulterior către integrare electronică directă cu instituțiile publice, dacă legislația și infrastructura permit acest lucru.