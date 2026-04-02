window.KedrixOnePracticeVerification = (() => {
  'use strict';

  const I18N = window.KedrixOneI18N;

  function collectKeys(draft = {}) {
    const values = [];
    ['inspectionFlags', 'warehouseFlag', 'verificationFlags'].forEach((key) => {
      const entry = draft?.dynamicData?.[key];
      if (Array.isArray(entry)) {
        values.push(...entry);
        return;
      }
      const text = String(entry || '').trim();
      if (!text) return;
      values.push(...text.split(',').map((item) => item.trim()).filter(Boolean));
    });

    if (String(draft?.status || '').trim().toLowerCase() === 'sdoganamento') {
      values.unshift('ui.verifyCustoms');
    }

    return Array.from(new Set(values.map((value) => String(value || '').trim()).filter(Boolean)));
  }

  function collectLabels(draft = {}) {
    return collectKeys(draft).map((key) => I18N.t(key, key)).filter(Boolean);
  }

  function formatTypesHint(labels = []) {
    if (!Array.isArray(labels) || !labels.length) {
      return I18N.t('ui.verificationBannerHint', 'Verifiche doganali attive sulla unità.');
    }
    const prefix = I18N.t('ui.customsVerificationTypePrefix', 'Tipo:');
    return `${prefix} ${labels.join(' · ')}`;
  }

  function updateBanner(draft = {}, options = {}) {
    const banner = options.banner || document.getElementById(options.bannerId || 'practiceVerificationBanner');
    if (!banner) return [];
    const titleNode = options.titleNode || document.getElementById(options.titleId || 'practiceVerificationBannerTitle');
    const hintNode = options.hintNode || document.getElementById(options.hintId || 'practiceVerificationBannerHint');
    const labels = collectLabels(draft);

    if (!labels.length) {
      banner.hidden = true;
      banner.classList.add('is-hidden');
      if (titleNode) titleNode.textContent = '';
      if (hintNode) hintNode.textContent = formatTypesHint(labels);
      return labels;
    }

    banner.hidden = false;
    banner.classList.remove('is-hidden');
    if (titleNode) titleNode.textContent = I18N.t('ui.customsVerificationAlertTitle', 'Attenzione unità sottoposta a verifica');
    if (hintNode) hintNode.textContent = formatTypesHint(labels);
    return labels;
  }

  return {
    collectKeys,
    collectLabels,
    formatTypesHint,
    updateBanner
  };
})();
