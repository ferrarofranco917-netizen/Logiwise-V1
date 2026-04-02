window.KedrixOneWiseMind = (() => {
  'use strict';

  const PracticeVerification = window.KedrixOnePracticeVerification;
  const I18N = window.KedrixOneI18N;

  function getVerificationLabels(practice = {}) {
    return PracticeVerification && typeof PracticeVerification.collectLabels === 'function'
      ? PracticeVerification.collectLabels(practice)
      : [];
  }

  function alerts(practices) {
    const result = [];

    practices.forEach((practice) => {
      const verificationLabels = getVerificationLabels(practice);
      const reference = practice.reference || practice.generatedReference || '—';
      const client = practice.client || practice.clientName || '—';

      if (verificationLabels.length) {
        result.push({
          severity: 'warning',
          title: I18N?.t ? I18N.t('ui.customsVerificationAlertTitle', 'Attenzione unità sottoposta a verifica') : 'Attenzione unità sottoposta a verifica',
          text: `${reference} · ${client}`,
          hint: PracticeVerification && typeof PracticeVerification.formatTypesHint === 'function'
            ? PracticeVerification.formatTypesHint(verificationLabels)
            : `${I18N?.t ? I18N.t('ui.customsVerificationTypePrefix', 'Tipo:') : 'Tipo:'} ${verificationLabels.join(' · ')}`
        });
      }

      if (practice.status === 'In attesa documenti') {
        result.push({
          severity: 'warning',
          title: 'Documenti da completare',
          text: `${reference} · ${client}`,
          hint: 'Completare documentazione prima del prossimo avanzamento.'
        });
      }

      if (practice.status === 'Sdoganamento') {
        result.push({
          severity: 'info',
          title: 'Attenzione operativa',
          text: `${reference} in sdoganamento`,
          hint: 'Verificare allineamento con pratica doganale e tempi di rilascio.'
        });
      }

      if (practice.priority === 'Alta' && practice.status !== 'Chiusa') {
        result.push({
          severity: 'info',
          title: 'Priorità alta attiva',
          text: `${reference} · ${practice.port || ''}`,
          hint: 'Mantenere monitoraggio operativo ravvicinato.'
        });
      }
    });

    return result;
  }

  function summary(alerts) {
    return {
      total: alerts.length,
      warning: alerts.filter((alert) => alert.severity === 'warning').length,
      info: alerts.filter((alert) => alert.severity === 'info').length
    };
  }

  return { alerts, summary };
})();
