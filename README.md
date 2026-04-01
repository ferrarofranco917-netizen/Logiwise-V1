# Kedrix One — STEP 5C.1 HARDENING

Consolidamento reale del modulo Pratiche con hardening retrocompatibile e preparazione operativa per la ricerca base.

## Interventi applicati
- retrocompatibilità record legacy: i dati top-level vengono reidratati dentro dynamicData quando si riapre una pratica
- nessuna perdita campi in modifica per pratiche create nelle basi precedenti
- nuovi riferimenti operativi raccolti nel form: terminal, MBL, HBL, CMR, direzione movimento magazzino
- validazioni condizionali per scenario:
  - FCL → container + MBL
  - LCL/GROUPAGE mare → HBL
  - AIR-CONSOL → HAWB
  - Terra → CMR obbligatorio
  - Deposito doganale → dogana di riferimento
- quick filter elenco ampliato anche a HBL/MBL/MAWB/HAWB/CMR/terminal/vettore/deposito
- dataset demo riallineato con dynamicData e dynamicLabels, utile anche per search preview e modifica record

## File toccati
- js/practice-schemas.js
- js/app.js
- js/data.js
- js/templates.js
- js/i18n.js
- README.md

## Istruzione
Sostituisci integralmente il contenuto del repo con questo pacchetto oppure applica solo i file sopra indicati.
