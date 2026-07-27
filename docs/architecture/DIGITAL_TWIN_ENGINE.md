# AutoDosar Digital Twin Engine v1.0

## Scop

Digital Twin Engine menține reprezentarea canonică, coerentă, imuabilă și versionată a unui dosar AutoDosar. Toate motoarele platformei citesc aceeași stare, iar orice modificare este aplicată controlat și produce o versiune nouă.

## Principii

1. Un singur Twin curent pentru fiecare dosar.
2. Fiecare schimbare produce o versiune consecutivă.
3. Versiunile istorice nu se suprascriu.
4. Actualizările folosesc control optimist prin `expectedVersion`.
5. Câmpurile structurale (`id`, `caseId`, `version`, metadatele și auditul) nu pot fi modificate direct.
6. Fiecare schimbare are actor, sursă, motiv, moment și opțional `correlationId`.
7. Twin-ul și snapshot-urile sunt înghețate pentru a preveni mutații accidentale.

## Componente

- `TwinBuilder` — creează versiunea 1.
- `TwinUpdater` — aplică operații incrementale `set`, `replace`, `append`, `remove`.
- `TwinVersionService` — creează snapshot-uri și verifică integritatea acestora.
- `TwinDiffService` — compară două versiuni, inclusiv obiecte și colecții.
- `TwinHistoryService` — expune istoricul într-o formă compactă.
- `ITwinRepository` — contract independent de tehnologia de persistență.
- `InMemoryTwinRepository` — implementare pentru teste și prototipare.
- `DigitalTwinEngine` — fațada aplicației pentru creare și procesare de evenimente.

## Flux

```text
Eveniment de domeniu
        ↓
DigitalTwinEngine
        ↓
Control versiune
        ↓
TwinUpdater
        ↓
Twin v(n+1) + AuditEvent
        ↓
ITwinRepository
```

## Concurență

Orice comandă conține `expectedVersion`. Dacă versiunea curentă diferă, actualizarea este respinsă. Astfel sunt prevenite suprascrierile silențioase când două surse actualizează simultan același dosar.

## Persistență

Implementarea de producție va utiliza o bază de date tranzacțională. Contractul repository impune:

- salvare numai în ordine consecutivă;
- citirea versiunii curente;
- citirea unei versiuni precise;
- listarea tuturor snapshot-urilor.

## Integrare viitoare

OCR, Rule Engine, Workflow Engine, Document Generation și integrările instituționale vor publica `TwinMutationEvent`. Niciun modul nu va modifica obiectul Twin direct.
