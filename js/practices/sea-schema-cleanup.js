window.KedrixOneSeaSchemaCleanup = (() => {
  'use strict';

  function isSeaPracticeType(practiceType) {
    return String(practiceType || '').trim().toLowerCase().startsWith('sea_');
  }

  function cleanText(value) {
    return String(value || '').trim();
  }

  function mergeCustomsOffice(customsOffice, customsSection) {
    const office = cleanText(customsOffice);
    const section = cleanText(customsSection);

    if (!office) return section;
    if (!section) return office;

    const upperOffice = office.toUpperCase();
    const upperSection = section.toUpperCase();
    if (upperOffice.includes(upperSection)) return office;

    return `${office} / ${section}`;
  }

  function normalizeDynamicData(dynamicData = {}, practiceType = '') {
    const next = { ...(dynamicData || {}) };
    if (!isSeaPracticeType(practiceType)) return next;

    const policyNumber = cleanText(next.policyNumber || next.mbl || '');
    if (policyNumber) next.policyNumber = policyNumber;
    delete next.mbl;

    const customsOffice = mergeCustomsOffice(next.customsOffice || next.customsOperator || '', next.customsSection || '');
    if (customsOffice) next.customsOffice = customsOffice;
    delete next.customsSection;

    return next;
  }

  function normalizeDraft(draft = {}) {
    if (!draft || typeof draft !== 'object' || !isSeaPracticeType(draft.practiceType)) return draft;
    draft.dynamicData = normalizeDynamicData(draft.dynamicData || {}, draft.practiceType);
    return draft;
  }

  function normalizeRecord(record = {}) {
    if (!record || typeof record !== 'object' || !isSeaPracticeType(record.practiceType)) return record;

    const dynamicData = normalizeDynamicData(record.dynamicData || {}, record.practiceType);
    const policyNumber = cleanText(record.policyNumber || dynamicData.policyNumber || record.mbl || '');
    const customsOffice = mergeCustomsOffice(record.customsOffice || dynamicData.customsOffice || '', record.customsSection || '');

    return {
      ...record,
      dynamicData,
      policyNumber,
      mbl: policyNumber,
      customsOffice,
      customsSection: ''
    };
  }

  function getSeaPolicyNumber(source = {}) {
    if (!source || typeof source !== 'object') return '';
    return cleanText(source.policyNumber || source.mbl || '');
  }

  return {
    getSeaPolicyNumber,
    isSeaPracticeType,
    mergeCustomsOffice,
    normalizeDraft,
    normalizeDynamicData,
    normalizeRecord
  };
})();
