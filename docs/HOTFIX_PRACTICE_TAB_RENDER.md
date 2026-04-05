# HOTFIX — RENDER TAB PRATICA / IDENTITÀ PRATICA

## Problema corretto
La tab **Pratica** poteva risultare vuota o non aprire correttamente i campi collegati (Importatore, Destinatario, Mittente, ecc.), mentre la tab **Dettaglio** continuava a mostrare i campi specialistici come **Descrizione merce**.

## Causa
Il renderer dei campi dinamici e dei badge relazionali non riceveva sempre lo `state` completo. In alcuni casi il lookup dei record anagrafici strutturati andava in errore durante il rendering della tab **Pratica**, interrompendo la costruzione del pannello.

## Fix applicato
- passaggio dello `state` completo al renderer dinamico
- passaggio dello `state` alle meta relazionali dei campi
- passaggio dello `state` alla overview pratica
- hardening difensivo sul lookup dei record anagrafici strutturati

## File toccati
- `js/app.js`
- `js/practices/form-renderer.js`
- `js/practices/practice-overview.js`
- `js/master-data/entity-records.js`
