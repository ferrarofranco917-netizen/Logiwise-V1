# STEP V — Apertura e modifica anagrafiche collegate dalla Pratica

## Obiettivo
Consentire l'apertura diretta della scheda anagrafica già collegata da un campo relazionale della tab Pratica, senza dover cercare manualmente il record nel modulo Anagrafiche.

## Implementazione
- Aggiunto pulsante inline `↗` sui campi relazionali che hanno una scheda già collegata.
- Il click apre il modulo Anagrafiche sulla famiglia corretta e sulla scheda già collegata.
- Il ritorno alla pratica mantiene contesto, sessione attiva e focus sul campo di origine.
- Normalizzato il campo cliente per usare `clientName` anche nel flusso inline, evitando differenze tra campo derivato e relazione reale.

## File toccati
- `js/master-data/quick-add.js`
- `js/practices/form-renderer.js`
- `js/app.js`
- `js/i18n.js`
- `style.css`

## Test consigliati
1. Aprire una pratica con Cliente collegato.
2. Premere `↗` sul campo Cliente o su un soggetto collegato già valorizzato.
3. Verificare apertura della scheda corretta in Anagrafiche.
4. Modificare la scheda e salvare.
5. Verificare ritorno alla stessa pratica e persistenza del collegamento.
