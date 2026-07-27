# AutoDosar AI – Validation Engine v1.0

## 1. Scop

Validation Engine verifică dacă documentele și datele dintr-un dosar sunt coerente, complete și compatibile între ele.

Scopul nu este doar să spună dacă lipsesc documente, ci să prevină depunerea unui dosar greșit.

## 2. Principiu central

Validăm înainte să generăm.

## 3. Tipuri de validări

### 3.1 Validări de completitudine

Verifică dacă toate documentele obligatorii sunt prezente.

Exemple:
- lipsește CI solicitant;
- lipsește CIV;
- lipsește dovada plății;
- lipsește certificatul fiscal;
- lipsește procura, dacă există împuternicit.

### 3.2 Validări de identitate

Verifică dacă datele persoanei sunt aceleași în toate documentele.

Exemple:
- CNP cumpărător identic în CI și contract;
- nume solicitant identic în cerere și CI;
- CUI firmă identic în CUI, factură și împuternicire.

### 3.3 Validări vehicul

Verifică dacă datele vehiculului coincid în toate documentele.

Validarea principală:
- seria de șasiu / VIN trebuie să fie identică în toate documentele în care apare.

Exemple:
- VIN din CIV = VIN din contract;
- VIN din CIV = VIN din certificat fiscal;
- VIN din CIV = VIN din talon;
- VIN din CIV = VIN din RCA.

Dacă există diferențe, dosarul primește eroare majoră.

### 3.4 Validări document greșit

Detectează documente care par să aparțină altui vehicul sau altei persoane.

Exemple:
- certificat fiscal pentru alt VIN;
- RCA pentru alt număr de înmatriculare;
- contract cu alt cumpărător;
- CI a altei persoane.

### 3.5 Validări cronologice

Verifică logica datelor calendaristice.

Exemple:
- data contractului nu poate fi după data solicitării;
- certificatul fiscal trebuie să fie emis după dobândirea vehiculului, dacă regula locală o impune;
- RCA trebuie să fie valabil la data depunerii;
- ITP trebuie să fie valabil, dacă operațiunea îl cere.

### 3.6 Validări procedurale

Verifică dacă documentele corespund operațiunii alese.

Exemple:
- pentru duplicat talon nu este necesar contract de vânzare-cumpărare;
- pentru vânzător persoană juridică nu se generează contract ITL-054, ci se folosește factura;
- pentru CIE este necesară adeverința de domiciliu;
- pentru număr preferențial sunt permise maximum trei combinații.

## 4. Niveluri de severitate

### Verde – OK

Documentul sau regula este validă.

### Galben – Atenționare

Există o posibilă problemă, dar utilizatorul poate continua după confirmare.

Exemple:
- document opțional lipsă;
- imagine greu lizibilă;
- câmp extras cu încredere scăzută.

### Roșu – Eroare majoră

Dosarul nu trebuie generat sau depus fără corectare.

Exemple:
- VIN diferit între documente;
- CNP diferit;
- document obligatoriu lipsă;
- document aparținând altui vehicul.

## 5. Scor de calitate dosar

AutoDosar va calcula un scor de calitate al dosarului.

Exemple:
- 95–100%: dosar excelent;
- 80–94%: dosar bun, cu atenționări;
- sub 80%: dosar incomplet sau riscant.

## 6. Obiectiv final

Utilizatorul trebuie să știe clar dacă dosarul poate fi depus.

Mesajul ideal:

AutoDosar a verificat automat documentele și regulile aplicabile. Dosarul este pregătit pentru depunere.