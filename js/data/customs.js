window.KedrixOneCustomsData = (() => {
  'use strict';

  function makeCustomsEntry(code, label, officeName, aliases = []) {
    const cleanCode = String(code || '').trim().toUpperCase();
    const cleanLabel = String(label || '').trim();
    const displayValue = `${cleanLabel} · ${cleanCode}`;
    const aliasValues = Array.from(new Set([
      cleanCode,
      cleanCode.replace(/^IT/, ''),
      cleanLabel,
      officeName,
      displayValue,
      ...aliases
    ].map((item) => String(item || '').trim()).filter(Boolean)));
    return {
      value: `${cleanCode} - ${cleanLabel}` ,
      label: cleanLabel,
      code: cleanCode,
      officeName,
      displayValue,
      aliases: aliasValues
    };
  }

  const defaultCustomsOffices = [
    makeCustomsEntry('IT018000', 'Bari', 'Ufficio delle dogane di Bari', ['018000', 'Bari']),
    makeCustomsEntry('IT261000', 'Genova 1', 'Ufficio delle dogane di Genova 1', ['261000', 'Genova 1', 'Genova Porto', 'Genova']),
    makeCustomsEntry('261101', 'Passo Nuovo (Genova 1)', 'Ufficio delle dogane di Genova 1 - SOT Passo Nuovo', ['Passo Nuovo', 'SOT Passo Nuovo']),
    makeCustomsEntry('IT262000', 'Genova 2', 'Ufficio delle dogane di Genova 2', ['262000', 'Genova 2']),
    makeCustomsEntry('262101', 'Aeroporto di Genova (Genova 2)', 'Ufficio delle dogane di Genova 2 - Distaccamento aeroporto', ['Aeroporto di Genova', 'GOA', 'Genova aeroporto']),
    makeCustomsEntry('262102', 'Voltri (Genova 2)', 'Ufficio delle dogane di Genova 2 - Distaccamento Voltri', ['Voltri', 'Genova Voltri']),
    makeCustomsEntry('IT068000', 'La Spezia', 'Ufficio delle dogane di La Spezia', ['068000', 'La Spezia']),
    makeCustomsEntry('068100', 'La Spezia operativa', 'Ufficio delle dogane di La Spezia', ['La Spezia operativa', 'UD La Spezia', 'La Spezia porto']),
    makeCustomsEntry('IT090000', 'Livorno', 'Ufficio delle dogane di Livorno', ['090000', 'Livorno']),
    makeCustomsEntry('090100', 'Livorno porto', 'Ufficio delle dogane di Livorno - Sezione porto', ['Livorno porto', 'Porto di Livorno']),
    makeCustomsEntry('IT206000', 'Ravenna', 'Ufficio delle dogane di Ravenna', ['206000', 'Ravenna']),
    makeCustomsEntry('206100', 'Ravenna operativa', 'Ufficio delle dogane di Ravenna', ['Ravenna operativa', 'Porto di Ravenna']),
    makeCustomsEntry('IT213000', 'Savona', 'Ufficio delle dogane di Savona', ['213000', 'Savona']),
    makeCustomsEntry('213101', 'Vado Ligure (Savona)', 'Ufficio delle dogane di Savona - Distaccamento locale Vado Ligure', ['Vado Ligure', 'Savona Vado Ligure', 'Vado']),
    makeCustomsEntry('IT242000', 'Trieste', 'Ufficio delle dogane di Trieste', ['242000', 'Trieste']),
    makeCustomsEntry('242100', 'Trieste porto', 'Ufficio delle dogane di Trieste - Sezione porto', ['Trieste porto', 'Porto di Trieste']),
    makeCustomsEntry('IT260000', 'Venezia', 'Ufficio delle dogane di Venezia', ['260000', 'Venezia']),
    makeCustomsEntry('260100', 'Venezia porto', 'Ufficio delle dogane di Venezia - Sezione porto', ['Venezia porto', 'Porto di Venezia']),
    makeCustomsEntry('IT277000', 'Milano 1', 'Ufficio delle dogane di Milano 1', ['277000', 'Milano 1']),
    makeCustomsEntry('277100', 'Milano 1 operativa', 'Ufficio delle dogane di Milano 1', ['Milano 1 operativa']),
    makeCustomsEntry('IT278000', 'Milano 2', 'Ufficio delle dogane di Milano 2', ['278000', 'Milano 2']),
    makeCustomsEntry('IT279000', 'Malpensa', 'Ufficio delle dogane di Malpensa', ['279000', 'Malpensa', 'Milano Malpensa']),
    makeCustomsEntry('279100', 'Malpensa Cargo', 'Ufficio delle dogane di Malpensa', ['Malpensa Cargo', 'Cargo City']),
    makeCustomsEntry('IT313000', 'Alessandria', 'Ufficio delle dogane di Alessandria', ['313000', 'Alessandria']),
    makeCustomsEntry('IT314000', 'Torino', 'Ufficio delle dogane di Torino', ['314000', 'Torino']),
    makeCustomsEntry('314101', 'Caselle Torinese (Torino)', 'Ufficio delle dogane di Torino - Sezione territoriale Caselle Torinese', ['Caselle Torinese', 'Torino aeroporto', 'TRN']),
    makeCustomsEntry('314102', 'Orbassano (Torino)', 'Ufficio delle dogane di Torino - Sezione territoriale Orbassano', ['Orbassano', 'Torino Orbassano', 'SITO Orbassano']),
  ].filter(Boolean);

  return {
    defaultCustomsOffices
  };
})();
