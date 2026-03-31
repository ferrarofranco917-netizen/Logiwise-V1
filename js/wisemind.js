window.KedrixOneWiseMind = (() => {
  'use strict';

  function alerts(practices) {
    const result = [];

    practices.forEach((practice) => {
      if (practice.status === 'In attesa documenti') {
        result.push({
          severity: 'warning',
          title: 'Documenti da completare',
          text: `${practice.reference} · ${practice.client}`,
          hint: 'Completare documentazione prima del prossimo avanzamento.'
        });
      }

      if (practice.status === 'Sdoganamento') {
        result.push({
          severity: 'info',
          title: 'Attenzione operativa',
          text: `${practice.reference} in sdoganamento`,
          hint: 'Verificare allineamento con pratica doganale e tempi di rilascio.'
        });
      }

      if (practice.priority === 'Alta' && practice.status !== 'Chiusa') {
        result.push({
          severity: 'info',
          title: 'Priorità alta attiva',
          text: `${practice.reference} · ${practice.port}`,
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
