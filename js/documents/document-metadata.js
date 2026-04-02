window.KedrixOneDocumentMetadata = (() => {
  'use strict';

  function normalizeText(value) {
    return String(value || '').trim();
  }

  function normalizeTags(value) {
    if (Array.isArray(value)) {
      return Array.from(new Set(value
        .map((item) => normalizeText(item))
        .filter(Boolean)));
    }
    return Array.from(new Set(normalizeText(value)
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)));
  }

  function serializeTags(tags) {
    return normalizeTags(tags).join(', ');
  }

  function ensure(item = {}) {
    return {
      ...item,
      documentDate: normalizeText(item.documentDate),
      externalReference: normalizeText(item.externalReference),
      customsMrn: normalizeText(item.customsMrn),
      tags: normalizeTags(item.tags),
      notes: normalizeText(item.notes)
    };
  }

  function applyPatch(item = {}, patch = {}) {
    const current = ensure(item);
    const next = {
      ...current,
      ...patch
    };
    return ensure(next);
  }

  function hasMeaningfulMetadata(item = {}) {
    const normalized = ensure(item);
    return Boolean(
      normalized.documentDate
      || normalized.externalReference
      || normalized.customsMrn
      || normalized.tags.length
      || normalized.notes
    );
  }

  function buildSummary(item = {}, i18n) {
    const t = (key, fallback) => (i18n && typeof i18n.t === 'function' ? i18n.t(key, fallback) : fallback);
    const normalized = ensure(item);
    const summary = [];
    if (normalized.documentDate) summary.push({ label: t('ui.documentDate', 'Data documento'), value: normalized.documentDate });
    if (normalized.externalReference) summary.push({ label: t('ui.documentReference', 'Rif. documento'), value: normalized.externalReference });
    if (normalized.customsMrn) summary.push({ label: t('ui.customsMrn', 'MRN / Rif. doganale'), value: normalized.customsMrn });
    if (normalized.tags.length) summary.push({ label: t('ui.tags', 'Tags'), value: serializeTags(normalized.tags) });
    return summary;
  }

  return {
    applyPatch,
    buildSummary,
    ensure,
    hasMeaningfulMetadata,
    normalizeTags,
    serializeTags
  };
})();
