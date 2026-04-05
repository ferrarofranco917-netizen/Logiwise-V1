# STEP U — Pratica / Anagrafiche / Allegati stabilization hardening

## Obiettivo
Blindare i flussi già introdotti senza aggiungere nuove feature:
- persistenza reale del draft pratica prima di entrare in quick add
- ritorno corretto da Anagrafiche alla stessa maschera/tab della pratica
- pulizia dei flag temporanei che potevano interferire con Allegati
- riduzione del rischio di regressioni su multi-maschera e dirty state

## Modifiche principali
- flush del draft pratica attivo prima del click su `+`
- flush del draft pratica anche nel cambio tab interno
- cleanup di `pendingPracticeFieldFocus` quando si lascia il modulo Pratiche
- cleanup del `quickAddContext` se si abbandona il flusso master-data in modo non coerente
- marcatura dirty della pratica quando il quick add riporta un nuovo collegamento in pratica

## File toccati
- `js/app.js`
- `js/master-data/quick-add.js`

## Focus QA
1. Compilare alcuni campi in Pratica senza salvare.
2. Premere `+` su Importatore / Destinatario / Mittente / Vettore.
3. Salvare la scheda anagrafica.
4. Verificare ritorno alla stessa maschera e tab.
5. Verificare che i dati già digitati nella pratica siano ancora presenti.
6. Aprire Allegati dopo il rientro e verificare che la tab resti stabile.
7. Verificare che la pratica risulti ancora modificata fino al salvataggio finale.
