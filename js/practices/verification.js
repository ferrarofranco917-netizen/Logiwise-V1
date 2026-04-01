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

  function updateBanner(draft = {}, options = {}) {
    const banner = options.banner || document.getElementById(options.bannerId || 'practiceVerificationBanner');
    if (!banner) return [];
    const titleNode = options.titleNode || document.getElementById(options.titleId || 'practiceVerificationBannerTitle');
    const labels = collectLabels(draft);

    if (!labels.length) {
      banner.hidden = true;
      banner.classList.add('is-hidden');
      if (titleNode) titleNode.textContent = '';
      return labels;
    }

    banner.hidden = false;
    banner.classList.remove('is-hidden');
    if (titleNode) titleNode.textContent = labels.join(' · ');
    return labels;
  }

  return {
    collectKeys,
    collectLabels,
    updateBanner
  };
})();
