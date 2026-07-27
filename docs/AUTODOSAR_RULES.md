# AutoDosar AI – Rules Engine v1.0

## Scop

Rules Engine reprezintă baza de cunoștințe a platformei.

El conține toate regulile necesare pentru fiecare operațiune administrativă și permite platformei să decidă automat:

- ce documente sunt necesare;
- ce documente sunt opționale;
- ce excepții există;
- ce taxe trebuie plătite;
- ce formulare trebuie generate;
- ce validări trebuie efectuate;
- care este următorul pas.

Rules Engine trebuie să poată fi actualizat fără modificarea codului aplicației.

---

# Structura regulilor

Fiecare operațiune este definită prin:

## 1. Operațiune

Exemplu:

- Duplicat certificat de înmatriculare

---

## 2. Scop

Exemplu:

Emiterea unui nou certificat de înmatriculare.

---

## 3. Documente obligatorii

Exemplu:

- CI solicitant
- Cerere
- Dovada plății
- Certificat deteriorat (dacă există)

---

## 4. Documente opționale

Exemplu:

- Procură
- Împuternicire

---

## 5. Excepții

Exemple:

- CIE → necesită adeverință de domiciliu.
- Persoană juridică → se solicită CUI.
- Împuternicit → se solicită procură.

---

## 6. Validări

Exemple:

- VIN identic.
- Nume identic.
- CNP identic.
- Documente complete.

---

## 7. Taxe

Exemplu:

- certificat înmatriculare;
- număr preferențial;
- autorizație provizorie.

---

## 8. Documente generate

Exemplu:

- Cerere DRPCIV.
- Checklist dosar.
- Contract ITL-054.
- Declarație.

---

## 9. Integrare viitoare

Exemplu:

- verificare RCA;
- verificare fiscal;
- verificare ONRC;
- plată online;
- depunere online.

---

# Principii

Rules Engine trebuie să conțină exclusiv reguli.

Nu trebuie să conțină cod.

El trebuie să poată fi actualizat ori de câte ori legislația se modifică.

---

# Obiectiv

În viitor, AutoDosar trebuie să poată determina automat toate documentele și regulile aplicabile fără intervenția utilizatorului.