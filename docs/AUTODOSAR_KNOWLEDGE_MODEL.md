# AutoDosar – Knowledge Model v1.0

## 1. Scop

Acest document definește modelul conceptual al dosarului AutoDosar.

Scopul este ca platforma să poată valida coerența întregului dosar, nu doar existența unor documente.

## 2. Principiu central

AutoDosar validează relațiile dintre documente.

Nu este suficient ca documentele să existe. Datele din ele trebuie să coincidă.

## 3. Entități principale

### Persoană fizică

Câmpuri relevante:
- nume;
- prenume;
- CNP;
- adresă;
- serie CI/CIE;
- număr CI/CIE.

### Persoană juridică

Câmpuri relevante:
- denumire;
- CUI;
- număr registrul comerțului;
- sediu;
- reprezentant legal;
- delegat.

### Vehicul

Câmpuri relevante:
- VIN / serie șasiu;
- marcă;
- model;
- categorie;
- număr de înmatriculare;
- serie CIV;
- serie certificat de înmatriculare;
- combustibil;
- capacitate cilindrică;
- masă maximă;
- normă poluare.

## 4. Documente principale

### CI / CIE

Leagă:
- persoană fizică;
- solicitant;
- cumpărător;
- vânzător;
- împuternicit.

Câmpuri extrase:
- nume;
- prenume;
- CNP;
- adresă;
- serie;
- număr;
- valabilitate.

### CIV

Leagă:
- vehicul.

Câmpuri extrase:
- VIN;
- marcă;
- model;
- categorie;
- serie CIV;
- an fabricație;
- capacitate cilindrică;
- combustibil;
- masă maximă;
- normă poluare.

### Certificat de înmatriculare

Leagă:
- vehicul;
- proprietar actual;
- număr de înmatriculare.

Câmpuri extrase:
- VIN;
- număr de înmatriculare;
- serie certificat;
- proprietar.

### Contract ITL-054

Leagă:
- vânzător;
- cumpărător;
- vehicul.

Câmpuri extrase:
- nume vânzător;
- CNP vânzător;
- nume cumpărător;
- CNP/CUI cumpărător;
- VIN;
- marcă;
- model;
- preț;
- dată contract.

### Factură

Leagă:
- vânzător persoană juridică;
- cumpărător;
- vehicul.

Câmpuri extrase:
- emitent;
- CUI emitent;
- beneficiar;
- CNP/CUI beneficiar;
- VIN;
- preț;
- dată factură.

### RCA

Leagă:
- cumpărător / nou proprietar;
- vehicul.

Câmpuri extrase:
- titular poliță;
- VIN;
- număr de înmatriculare;
- valabil de la;
- valabil până la.

### Certificat fiscal

Leagă:
- vânzător;
- vehicul.

Câmpuri extrase:
- titular;
- CNP/CUI;
- VIN;
- număr de înmatriculare;
- dată emitere.

### Dovadă plată

Leagă:
- solicitant;
- taxă;
- operațiune.

Câmpuri extrase:
- plătitor;
- sumă;
- tip taxă;
- dată plată.

### Împuternicire / Procură

Se aplică pentru persoană fizică.

Leagă:
- solicitant;
- împuternicit.

### Delegație

Se aplică pentru persoană juridică.

Leagă:
- persoană juridică;
- delegat.

## 5. Relații critice

### CV_001 – VIN identic

VIN-ul trebuie să coincidă în toate documentele în care apare:
- CIV;
- certificat de înmatriculare;
- contract;
- factură;
- RCA;
- certificat fiscal;
- cerere generată.

Dacă VIN-ul diferă, eroarea este critică.

### CV_002 – Cumpărător identic

Cumpărătorul / dobânditorul trebuie să coincidă în:
- CI/CIE;
- contract sau factură;
- RCA;
- cererea generată;
- documentele fiscale locale.

### CV_003 – Vânzător identic

Vânzătorul / înstrăinătorul trebuie să coincidă în:
- contract;
- certificat fiscal;
- certificat de înmatriculare, dacă este cazul.

### CV_004 – RCA corectă

RCA trebuie:
- să fie valabilă la data depunerii;
- să fie emisă pe numele cumpărătorului / noului proprietar;
- să corespundă vehiculului prin VIN sau număr de înmatriculare.

### CV_005 – Documente din același dosar

Documentele nu trebuie să aparțină unor vehicule diferite sau unor persoane diferite.

## 6. Operațiuni DRPCIV principale

### Înmatriculare definitivă

Operațiune DRPCIV.

Poate include opțiuni:
- număr preferențial;
- păstrare număr, dacă este aplicabil;
- persoană fizică;
- persoană juridică;
- împuternicit;
- delegat.

### Transcriere

Operațiune DRPCIV.

Poate include opțiuni:
- număr preferențial;
- păstrare număr;
- cumpărător persoană fizică;
- cumpărător persoană juridică;
- împuternicit;
- delegat.

### Autorizație provizorie

Operațiune DRPCIV.

### Radiere

Operațiune DRPCIV.

Poate include:
- păstrare număr, dacă este cazul.

### Duplicat certificat de înmatriculare

Operațiune DRPCIV.

### Modificare date

Operațiune DRPCIV.

Se emite un nou certificat de înmatriculare.

## 7. Proceduri conexe

Acestea nu sunt operațiuni DRPCIV, dar pot fi necesare în flux:

- contract ITL-054;
- impunere auto la primărie;
- certificat fiscal;
- RCA;
- RAR;
- plată taxe.

## 8. Regula de aur

Un dosar nu este valid doar pentru că are toate documentele.

Un dosar este valid când:
- documentele există;
- documentele sunt lizibile;
- datele coincid;
- documentele aparțin aceleiași persoane și aceluiași vehicul;
- regulile operațiunii sunt îndeplinite.

## 9. Obiectiv final

AutoDosar trebuie să poată spune:

„Am verificat documentele, relațiile dintre ele și regulile aplicabile. Dosarul este pregătit pentru depunere.”