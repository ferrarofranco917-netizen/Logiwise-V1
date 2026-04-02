window.KedrixOnePracticeContainerIntegrity = (() => {
  'use strict';

  const LETTER_VALUES = Object.freeze({
    A: 10, B: 12, C: 13, D: 14, E: 15, F: 16, G: 17, H: 18, I: 19, J: 20,
    K: 21, L: 23, M: 24, N: 25, O: 26, P: 27, Q: 28, R: 29, S: 30, T: 31,
    U: 32, V: 34, W: 35, X: 36, Y: 37, Z: 38
  });

  let preSaveHookRegistered = false;

  function normalizeContainerCode(rawValue) {
    return String(rawValue || '')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .trim();
  }

  function isSeaPractice(practiceType) {
    return String(practiceType || '').trim().toLowerCase().startsWith('sea_');
  }

  function hasIso6346Structure(code) {
    return /^[A-Z]{4}\d{7}$/.test(String(code || ''));
  }

  function computeCheckDigit(codeWithoutDigit) {
    const clean = String(codeWithoutDigit || '').trim().toUpperCase();
    if (!/^[A-Z]{4}\d{6}$/.test(clean)) return null;

    let sum = 0;
    for (let index = 0; index < clean.length; index += 1) {
      const char = clean.charAt(index);
      const value = /\d/.test(char) ? Number(char) : LETTER_VALUES[char];
      if (typeof value !== 'number' || Number.isNaN(value)) return null;
      sum += value * (2 ** index);
    }

    const remainder = sum % 11;
    return remainder === 10 ? 0 : remainder;
  }

  function analyzeContainerCode(rawValue, practiceType) {
    const normalized = normalizeContainerCode(rawValue);
    const present = Boolean(normalized);
    const structured = hasIso6346Structure(normalized);
    const isSea = isSeaPractice(practiceType);
    const baseCode = structured ? normalized.slice(0, 10) : '';
    const providedDigit = structured ? Number(normalized.slice(10, 11)) : null;
    const calculatedDigit = structured ? computeCheckDigit(baseCode) : null;
    const checkDigitValid = !present ? true : (structured && calculatedDigit !== null && calculatedDigit === providedDigit);

    return {
      rawValue: String(rawValue || ''),
      normalized,
      present,
      isSea,
      structured,
      baseCode,
      providedDigit,
      calculatedDigit,
      checkDigitValid
    };
  }

  function resolvePracticeContainerCode(practice) {
    if (!practice || typeof practice !== 'object') return '';
    return normalizeContainerCode(practice.containerCode || practice.dynamicData?.containerCode || '');
  }

  function buildDuplicateEntry(practice) {
    return {
      id: practice.id || '',
      reference: practice.reference || practice.id || '',
      clientName: practice.clientName || practice.client || '',
      status: practice.status || '',
      practiceType: practice.practiceType || ''
    };
  }

  function findDuplicatePractices(state, draft) {
    const practices = Array.isArray(state?.practices) ? state.practices : [];
    const currentId = String(draft?.editingPracticeId || '').trim();
    const analysis = analyzeContainerCode(draft?.dynamicData?.containerCode || '', draft?.practiceType || '');
    if (!analysis.present) return [];

    return practices
      .filter((practice) => String(practice?.id || '').trim() !== currentId)
      .filter((practice) => resolvePracticeContainerCode(practice) === analysis.normalized)
      .map((practice) => buildDuplicateEntry(practice));
  }

  function getFieldLabel(i18n) {
    return typeof i18n?.t === 'function'
      ? i18n.t('ui.containerCode', 'Container / telaio')
      : 'Container / telaio';
  }

  function buildValidationErrors(context = {}) {
    const { draft, i18n } = context;
    const analysis = analyzeContainerCode(draft?.dynamicData?.containerCode || '', draft?.practiceType || '');
    if (!analysis.present || !analysis.isSea) return [];

    const label = getFieldLabel(i18n);
    if (!analysis.structured) {
      return [{
        field: 'containerCode',
        tab: 'detail',
        label,
        message: typeof i18n?.t === 'function'
          ? i18n.t('ui.validationContainerFormat', 'Formato container non valido. Usa ISO 6346 (es. MSCU1234567).')
          : 'Formato container non valido. Usa ISO 6346 (es. MSCU1234567).'
      }];
    }

    if (!analysis.checkDigitValid) {
      return [{
        field: 'containerCode',
        tab: 'detail',
        label,
        message: typeof i18n?.t === 'function'
          ? i18n.t('ui.validationContainerCheckDigit', 'Check digit container non valido. Verifica il codice ISO 6346.')
          : 'Check digit container non valido. Verifica il codice ISO 6346.'
      }];
    }

    return [];
  }

  function formatDuplicateWarning(duplicates = [], i18n) {
    if (!duplicates.length) return '';
    const references = duplicates
      .map((duplicate) => String(duplicate.reference || duplicate.id || '').trim())
      .filter(Boolean);
    const compact = references.slice(0, 3).join(' · ');
    const suffix = references.length > 3 ? '…' : '';
    if (duplicates.length === 1) {
      const prefix = typeof i18n?.t === 'function'
        ? i18n.t('ui.containerDuplicateSingle', 'Attenzione: container già presente nella pratica')
        : 'Attenzione: container già presente nella pratica';
      return `${prefix} ${compact}.`;
    }
    const prefix = typeof i18n?.t === 'function'
      ? i18n.t('ui.containerDuplicateMultiple', 'Attenzione: container già presente in altre pratiche')
      : 'Attenzione: container già presente in altre pratiche';
    return `${prefix}: ${compact}${suffix}.`;
  }

  function buildFieldState(context = {}) {
    const { state, draft, i18n } = context;
    const analysis = analyzeContainerCode(draft?.dynamicData?.containerCode || '', draft?.practiceType || '');
    const warnings = [];

    if (!analysis.present) {
      return { analysis, warnings };
    }

    if (analysis.normalized && analysis.normalized !== String(draft?.dynamicData?.containerCode || '').trim()) {
      warnings.push({
        type: 'info',
        message: typeof i18n?.t === 'function'
          ? i18n.t('ui.containerNormalizedHint', 'Il codice container viene normalizzato in maiuscolo senza spazi.')
          : 'Il codice container viene normalizzato in maiuscolo senza spazi.'
      });
    }

    if (analysis.isSea && !analysis.structured) {
      warnings.push({
        type: 'warning',
        message: typeof i18n?.t === 'function'
          ? i18n.t('ui.validationContainerFormat', 'Formato container non valido. Usa ISO 6346 (es. MSCU1234567).')
          : 'Formato container non valido. Usa ISO 6346 (es. MSCU1234567).'
      });
    } else if (analysis.isSea && !analysis.checkDigitValid) {
      warnings.push({
        type: 'warning',
        message: typeof i18n?.t === 'function'
          ? i18n.t('ui.validationContainerCheckDigit', 'Check digit container non valido. Verifica il codice ISO 6346.')
          : 'Check digit container non valido. Verifica il codice ISO 6346.'
      });
    }

    const duplicates = findDuplicatePractices(state, draft);
    if (duplicates.length) {
      warnings.push({
        type: 'warning',
        message: formatDuplicateWarning(duplicates, i18n)
      });
    }

    return {
      analysis,
      duplicates,
      warnings
    };
  }

  function clearFieldState(root) {
    const wrap = root?.querySelector?.('[data-field-wrap="containerCode"]');
    if (!wrap) return;
    wrap.classList.remove('is-warning');
    wrap.querySelectorAll('.field-note[data-field-note="container-integrity"]').forEach((node) => node.remove());
  }

  function applyFieldState(context = {}) {
    const { root, state, draft, i18n } = context;
    clearFieldState(root);
    const wrap = root?.querySelector?.('[data-field-wrap="containerCode"]');
    if (!wrap) return { analysis: analyzeContainerCode('', ''), duplicates: [], warnings: [] };

    const fieldState = buildFieldState({ state, draft, i18n });
    const warningMessages = fieldState.warnings.filter((item) => item?.message);
    if (warningMessages.length) {
      wrap.classList.add('is-warning');
      warningMessages.forEach((item) => {
        const node = document.createElement('div');
        node.className = `field-note ${item.type === 'warning' ? 'field-warning' : 'field-info'}`;
        node.dataset.fieldNote = 'container-integrity';
        node.textContent = item.message;
        wrap.appendChild(node);
      });
    }

    return fieldState;
  }

  function normalizeFieldValue(fieldName, rawValue) {
    if (fieldName !== 'containerCode') return rawValue;
    return normalizeContainerCode(rawValue);
  }

  function registerPreSaveHook(savePipeline, i18n) {
    if (preSaveHookRegistered) return true;
    if (!savePipeline || typeof savePipeline.registerPreSaveHook !== 'function') return false;
    savePipeline.registerPreSaveHook((context = {}) => {
      const errors = buildValidationErrors({
        state: context.state,
        draft: context.draft,
        i18n
      });
      return errors.length ? { valid: false, errors } : { valid: true };
    });
    preSaveHookRegistered = true;
    return true;
  }

  return {
    analyzeContainerCode,
    applyFieldState,
    buildFieldState,
    buildValidationErrors,
    computeCheckDigit,
    findDuplicatePractices,
    normalizeContainerCode,
    normalizeFieldValue,
    registerPreSaveHook
  };
})();
