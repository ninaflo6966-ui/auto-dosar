# AutoDosar AI – Domain Model v1.0

## 1. Principiu

AutoDosar modelează realitatea administrativă, nu doar formulare.

Platforma nu pornește de la câmpuri, ci de la întrebarea:

„Ce vrea utilizatorul să facă?”

## 2. Entități principale

### User

Persoana care folosește platforma.

### Folder / Dosar

Unitatea centrală a platformei.

Un dosar conține:
- operațiunea aleasă;
- solicitantul;
- vehiculul;
- documentele;
- validările;
- taxele;
- documentele generate;
- statusul final.

### Operation / Operațiune

Operațiunea administrativă gestionată de platformă.

## 3. Operațiuni DRPCIV

Operațiunile DRPCIV principale sunt:

- Înmatriculare definitivă;
- Transcriere;
- Autorizație provizorie;
- Radiere;
- Duplicat certificat de înmatriculare;
- Modificare date.

## 4. Proceduri conexe

Acestea nu sunt operațiuni DRPCIV, dar pot fi necesare în circuitul auto:

- Contract ITL-054;
- Impunere auto la primărie;
- Certificat fiscal;
- RCA;
- RAR.

## 5. Opțiuni în cadrul operațiunilor

Unele elemente nu sunt operațiuni separate, ci opțiuni în cadrul unei operațiuni.

Exemple:

- Număr preferențial – opțiune în cadrul înmatriculării definitive sau transcrierii;
- Păstrare număr – opțiune în cadrul radierii sau transcrierii;
- Împuternicit – pentru persoană fizică;
- Delegat – pentru persoană juridică;
- CIE – necesită adeverință de domiciliu.

## 6. Persoană fizică

Pentru persoană fizică, platforma folosește termenul:

Împuternicit

Nu „mandatar”.

## 7. Persoană juridică

Pentru persoană juridică, platforma folosește termenii:

- Reprezentant legal;
- Delegat.

Nu „mandatar”.

## 8. Vehicul

Vehiculul este identificat în principal prin:

- VIN / serie șasiu;
- marcă;
- model;
- CIV;
- certificat de înmatriculare;
- număr de înmatriculare, dacă există.

## 9. Document

Documentul este orice act încărcat, generat sau obținut prin integrare.

Exemple:

- CI;
- CIE;
- CIV;
- certificat de înmatriculare;
- contract;
- factură;
- certificat fiscal;
- RCA;
- CUI;
- delegație;
- împuternicire;
- dovadă plată.

## 10. Regula de aur

AutoDosar nu trebuie să afișeze utilizatorului opțiuni inutile.

Fluxul trebuie să fie dinamic.

Exemplu:

Dacă utilizatorul alege persoană fizică, aplicația poate întreba despre împuternicit.

Dacă utilizatorul alege persoană juridică, aplicația poate întreba despre reprezentant legal sau delegat.

## 11. Obiectiv

Domain Model-ul trebuie să permită construirea tuturor fluxurilor viitoare fără rescrierea aplicației.