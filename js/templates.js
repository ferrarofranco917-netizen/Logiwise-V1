window.KedrixOneTemplates = (() => {
  'use strict';

  const U = window.KedrixOneUtils;
  const W = window.KedrixOneWiseMind;
  const L = window.KedrixOneLicensing;

  function sidebar(modules, activeRoute, expandedModules) {
    const expanded = new Set(expandedModules || []);
    const activeRoot = activeRoute.split('/')[0];

    return modules.map((module) => {
      const isRootActive = activeRoot === module.key;
      const isExpanded = expanded.has(module.key);
      const hasSubmodules = module.submodules.length > 0;

      return `
        <section class="nav-section">
          <div class="nav-module-row">
            <button class="nav-tab nav-module ${isRootActive ? 'active' : ''}" data-route="${U.escapeHtml(module.route)}" type="button">
              <span>${U.escapeHtml(module.label)}</span>
              ${hasSubmodules ? `<span class="nav-count">${module.submodules.length}</span>` : ''}
            </button>
            ${hasSubmodules ? `<button class="nav-toggle" type="button" data-module-toggle="${U.escapeHtml(module.key)}" aria-expanded="${isExpanded ? 'true' : 'false'}">${isExpanded ? '−' : '+'}</button>` : ''}
          </div>
          ${hasSubmodules ? `
            <div class="subnav-grid ${isExpanded ? 'open' : ''}">
              ${module.submodules.map((submodule) => `
                <button class="subnav-link ${activeRoute === submodule.route ? 'active' : ''}" data-route="${U.escapeHtml(submodule.route)}" type="button">
                  ${U.escapeHtml(submodule.label)}
                </button>
              `).join('')}
            </div>` : ''}
        </section>`;
    }).join('');
  }

  function dashboard(state, modulesSummary, licensingSummary) {
    const alerts = W.alerts(state.practices);
    const activeUser = L.getActiveUser(state);

    return `
      <section class="hero">
        <div class="hero-meta">STEP 4C · Submodule permissions engine</div>
        <h2>Kedrix One</h2>
        <p>Ora il licensing lavora anche a livello di sottomodulo: puoi dare a un utente il modulo pratiche ma nascondere singole funzioni operative o documentali.</p>
      </section>

      <section class="kpi-grid">
        <article class="kpi-card">
          <div class="kpi-label">Moduli totali</div>
          <div class="kpi-value">${modulesSummary.totalModules}</div>
          <div class="kpi-hint">Architettura enterprise attiva</div>
        </article>
        <article class="kpi-card">
          <div class="kpi-label">Sottomoduli</div>
          <div class="kpi-value">${modulesSummary.totalSubmodules}</div>
          <div class="kpi-hint">Permessi granulari predisposti</div>
        </article>
        <article class="kpi-card">
          <div class="kpi-label">Moduli visibili</div>
          <div class="kpi-value">${licensingSummary.visibleModules}</div>
          <div class="kpi-hint">${U.escapeHtml(activeUser ? activeUser.name : 'Utente non trovato')}</div>
        </article>
        <article class="kpi-card">
          <div class="kpi-label">Sottomoduli visibili</div>
          <div class="kpi-value">${licensingSummary.visibleSubmodules}</div>
          <div class="kpi-hint">${licensingSummary.hiddenSubmodules} disattivati nel profilo corrente</div>
        </article>
      </section>

      <section class="three-col compact-grid">
        <article class="panel">
          <div class="summary-kicker">Licensing</div>
          <div class="summary-value">granulare</div>
          <p class="summary-text">Azienda e utente possono attivare o disattivare anche singole sottofunzioni.</p>
        </article>
        <article class="panel">
          <div class="summary-kicker">Modello business</div>
          <div class="summary-value">ready</div>
          <p class="summary-text">Base adatta a modulo premium + sottomodulo premium + profilo utente differenziato.</p>
        </article>
        <article class="panel">
          <div class="summary-kicker">Prossimo focus</div>
          <div class="summary-value">4D / 5</div>
          <p class="summary-text">Naming flessibile, IT/EN, poi raffinazione funzionale dei moduli.</p>
        </article>
      </section>

      <section class="two-col">
        <article class="panel">
          <div class="panel-head">
            <div>
              <h3 class="panel-title">WiseMind</h3>
              <p class="panel-subtitle">Segnali operativi iniziali senza popup di sistema.</p>
            </div>
          </div>
          <div class="alert-list">
            ${alerts.length ? alerts.map((alert) => `
              <div class="alert-item ${alert.severity}">
                <div class="panel-title" style="font-size:15px">${U.escapeHtml(alert.title)}</div>
                <div class="alert-text">${U.escapeHtml(alert.text)}</div>
                <div class="log-meta">${U.escapeHtml(alert.hint)}</div>
              </div>`).join('') : `
              <div class="alert-item success">
                <div class="panel-title" style="font-size:15px">Nessuna criticità</div>
                <div class="alert-text">Nessun alert attivo.</div>
              </div>`}
          </div>
        </article>

        <article class="panel">
          <div class="panel-head">
            <div>
              <h3 class="panel-title">Utente attivo</h3>
              <p class="panel-subtitle">Contesto applicativo corrente.</p>
            </div>
          </div>
          <div class="stack-list">
            <div class="stack-item"><strong>Nome</strong><span>${U.escapeHtml(activeUser ? activeUser.name : '—')}</span></div>
            <div class="stack-item"><strong>Ruolo</strong><span>${U.escapeHtml(activeUser ? activeUser.role : '—')}</span></div>
            <div class="stack-item"><strong>Azione rapida</strong><span>Vai in Impostazioni per configurare moduli e sottomoduli.</span></div>
          </div>
        </article>
      </section>
    `;
  }

  function practices(state, selected, filtered) {
    return `
      <section class="panel">
        <div class="panel-head">
          <div>
            <h3 class="panel-title">Filtro pratiche</h3>
            <p class="panel-subtitle">Ricerca e filtro senza regressioni grafiche.</p>
          </div>
        </div>
        <div class="toolbar-grid">
          <div class="field">
            <label for="filterText">Ricerca</label>
            <input id="filterText" value="${U.escapeHtml(state.filterText)}" placeholder="Cliente, riferimento, porto..." />
          </div>
          <div class="field">
            <label for="statusFilter">Filtro stato</label>
            <select id="statusFilter">
              ${['Tutti', 'In attesa documenti', 'Operativa', 'Sdoganamento'].map((option) => `<option ${state.statusFilter === option ? 'selected' : ''}>${option}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label>&nbsp;</label>
            <div class="action-row">
              <button class="btn secondary" type="button" data-action="reset-demo">Reset demo</button>
              <button class="btn secondary" type="button" data-route-action="practices/elenco-pratiche">Elenco pratiche</button>
            </div>
          </div>
        </div>
      </section>

      <section class="practice-layout">
        <article class="panel">
          <div class="panel-head">
            <div>
              <h3 class="panel-title">Nuova pratica</h3>
              <p class="panel-subtitle">Salvataggio locale e rendering immediato.</p>
            </div>
          </div>
          <form id="practiceForm">
            <div class="form-grid two">
              <div class="field"><label for="reference">Riferimento</label><input id="reference" name="reference" required placeholder="Es. KX-IMP-0004" /></div>
              <div class="field"><label for="client">Cliente</label><input id="client" name="client" required placeholder="Es. Cliente S.r.l." /></div>
              <div class="field"><label for="type">Tipo</label><select id="type" name="type"><option>Import</option><option>Export</option></select></div>
              <div class="field"><label for="port">Porto</label><input id="port" name="port" required placeholder="Es. Genova" /></div>
              <div class="field"><label for="eta">ETA</label><input id="eta" name="eta" type="date" required /></div>
              <div class="field"><label for="priority">Priorità</label><select id="priority" name="priority"><option>Alta</option><option>Media</option><option>Bassa</option></select></div>
              <div class="field"><label for="status">Stato</label><select id="status" name="status"><option>In attesa documenti</option><option>Operativa</option><option>Sdoganamento</option></select></div>
              <div class="field full"><label for="notes">Note operative</label><textarea id="notes" name="notes" placeholder="Indicazioni operative, vincoli, priorità..."></textarea></div>
            </div>
            <div class="action-row" style="margin-top:14px"><button class="btn" type="submit">Salva pratica</button></div>
          </form>
        </article>

        <article class="panel">
          <div class="panel-head">
            <div>
              <h3 class="panel-title">Dettaglio pratica</h3>
              <p class="panel-subtitle">Seleziona una pratica dalla tabella.</p>
            </div>
          </div>
          ${selected ? `
            <div class="detail-grid">
              <div class="detail-row"><div class="detail-label">ID</div><div>${U.escapeHtml(selected.id)}</div></div>
              <div class="detail-row"><div class="detail-label">Rif.</div><div>${U.escapeHtml(selected.reference)}</div></div>
              <div class="detail-row"><div class="detail-label">Cliente</div><div>${U.escapeHtml(selected.client)}</div></div>
              <div class="detail-row"><div class="detail-label">Porto</div><div>${U.escapeHtml(selected.port)}</div></div>
              <div class="detail-row"><div class="detail-label">ETA</div><div>${U.formatDate(selected.eta)}</div></div>
              <div class="detail-row"><div class="detail-label">Stato</div><div><span class="badge ${selected.status === 'In attesa documenti' ? 'warning' : 'info'}">${U.escapeHtml(selected.status)}</span></div></div>
              <div class="detail-row"><div class="detail-label">Note</div><div>${U.escapeHtml(selected.notes || '—')}</div></div>
            </div>` : `<div class="empty-text">Nessuna pratica selezionata.</div>`}
        </article>
      </section>

      <section class="table-panel">
        <div class="panel-head">
          <div><h3 class="panel-title">Elenco pratiche</h3><p class="panel-subtitle">Clicca una riga per selezionare il dettaglio.</p></div>
        </div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>ID</th><th>Riferimento</th><th>Cliente</th><th>Tipo</th><th>Porto</th><th>ETA</th><th>Priorità</th><th>Stato</th></tr></thead>
            <tbody>
              ${filtered.map((practice) => `
                <tr data-practice-id="${U.escapeHtml(practice.id)}">
                  <td>${U.escapeHtml(practice.id)}</td>
                  <td>${U.escapeHtml(practice.reference)}</td>
                  <td>${U.escapeHtml(practice.client)}</td>
                  <td>${U.escapeHtml(practice.type)}</td>
                  <td>${U.escapeHtml(practice.port)}</td>
                  <td>${U.formatDate(practice.eta)}</td>
                  <td>${U.escapeHtml(practice.priority)}</td>
                  <td><span class="badge ${practice.status === 'In attesa documenti' ? 'warning' : 'info'}">${U.escapeHtml(practice.status)}</span></td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </section>
    `;
  }

  function contacts(state, module) {
    return `
      <section class="hero">
        <div class="hero-meta">Mega modulo enterprise</div>
        <h2>Anagrafiche</h2>
        <p>${U.escapeHtml(module.description)}</p>
      </section>

      <section class="kpi-grid compact-kpi-grid">
        <article class="kpi-card"><div class="kpi-label">Famiglie previste</div><div class="kpi-value">${module.submodules.length}</div><div class="kpi-hint">Master data condivisi</div></article>
        <article class="kpi-card"><div class="kpi-label">Base contatti</div><div class="kpi-value">${state.contacts.length}</div><div class="kpi-hint">Stato attuale preservato</div></article>
        <article class="kpi-card"><div class="kpi-label">STEP successivo</div><div class="kpi-value">master data</div><div class="kpi-hint">Anagrafiche reali</div></article>
      </section>

      <section class="table-panel">
        <div class="panel-head"><div><h3 class="panel-title">Base attuale</h3><p class="panel-subtitle">Dataset iniziale esistente non alterato.</p></div></div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>ID</th><th>Nome</th><th>Tipo</th><th>Città</th></tr></thead>
            <tbody>${state.contacts.map((contact) => `
              <tr><td>${U.escapeHtml(contact.id)}</td><td>${U.escapeHtml(contact.name)}</td><td>${U.escapeHtml(contact.type)}</td><td>${U.escapeHtml(contact.city)}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      </section>

      <section class="panel">
        <div class="panel-head"><div><h3 class="panel-title">Famiglie previste</h3><p class="panel-subtitle">Architettura già predisposta per i prossimi step.</p></div></div>
        <div class="tag-grid">${module.submodules.map((submodule) => `<span class="tag-pill">${U.escapeHtml(submodule.label)}</span>`).join('')}</div>
      </section>
    `;
  }

  function settings(state, modules, activeUser) {
    const company = state.companyConfig || {};
    const companyEntitlements = L.getCompanyEntitlements(state);
    const userEntitlements = L.getUserEntitlements(state);
    const settingsModule = modules.find((module) => module.key === state.settingsModuleKey) || modules[0];
    const visibleModules = L.visibleModules(modules, state);
    const visibleSubmodules = visibleModules.reduce((acc, module) => acc + module.submodules.length, 0);
    const totalSubmodules = modules.reduce((acc, module) => acc + module.submodules.length, 0);

    return `
      <section class="hero">
        <div class="hero-meta">Licensing control panel</div>
        <h2>Impostazioni / Moduli</h2>
        <p>Ora Kedrix One gestisce anche l’attivazione e la disattivazione dei sottomoduli. Puoi concedere “Pratiche” a un utente ma nascondere singole sottofunzioni operative.</p>
      </section>

      <section class="kpi-grid compact-kpi-grid">
        <article class="kpi-card"><div class="kpi-label">Azienda</div><div class="kpi-value">${U.escapeHtml(company.name || '—')}</div><div class="kpi-hint">Cliente demo corrente</div></article>
        <article class="kpi-card"><div class="kpi-label">Piano</div><div class="kpi-value">${U.escapeHtml(String(company.plan || 'base').toUpperCase())}</div><div class="kpi-hint">${companyEntitlements.size} moduli azienda</div></article>
        <article class="kpi-card"><div class="kpi-label">Utente attivo</div><div class="kpi-value">${U.escapeHtml(activeUser ? activeUser.name : '—')}</div><div class="kpi-hint">${userEntitlements.size} moduli utente</div></article>
        <article class="kpi-card"><div class="kpi-label">Sottomoduli visibili</div><div class="kpi-value">${visibleSubmodules}</div><div class="kpi-hint">${totalSubmodules - visibleSubmodules} nascosti</div></article>
      </section>

      <section class="panel">
        <div class="panel-head">
          <div>
            <h3 class="panel-title">Configurazione rapida</h3>
            <p class="panel-subtitle">Cambia piano, utente attivo e modulo focus per configurare anche le sottofunzioni.</p>
          </div>
        </div>
        <div class="toolbar-grid">
          <div class="field">
            <label for="companyPlan">Piano azienda</label>
            <select id="companyPlan">
              ${['base', 'pro', 'enterprise'].map((plan) => `<option value="${plan}" ${company.plan === plan ? 'selected' : ''}>${plan.toUpperCase()}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label for="activeUserId">Utente attivo</label>
            <select id="activeUserId">
              ${(state.users || []).map((user) => `<option value="${user.id}" ${state.activeUserId === user.id ? 'selected' : ''}>${U.escapeHtml(user.name)} · ${U.escapeHtml(user.role)}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label for="settingsModuleKey">Modulo da configurare</label>
            <select id="settingsModuleKey">
              ${modules.map((module) => `<option value="${module.key}" ${state.settingsModuleKey === module.key ? 'selected' : ''}>${U.escapeHtml(module.label)}</option>`).join('')}
            </select>
          </div>
        </div>
      </section>

      <section class="table-panel">
        <div class="panel-head">
          <div>
            <h3 class="panel-title">Matrice moduli</h3>
            <p class="panel-subtitle">Azienda acquista, utente restringe o amplia la visibilità finale.</p>
          </div>
        </div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Modulo</th><th>Tier</th><th>Azienda</th><th>Utente</th><th>Esito</th></tr></thead>
            <tbody>
              ${modules.map((module) => {
                const status = L.moduleStatus(module, state);
                const companyButton = status.isBaseIncluded
                  ? `<span class="tag-pill muted">Incluso nel piano</span>`
                  : `<button class="btn secondary small-btn" type="button" data-toggle-company-module="${U.escapeHtml(module.key)}">${status.isCompanyPurchased ? 'Rimuovi acquisto' : 'Acquista modulo'}</button>`;

                let userButton = '';
                if (!status.isCompanyVisible && !status.isBaseIncluded) {
                  userButton = `<span class="tag-pill muted">Non acquistato</span>`;
                } else if (status.isBaseIncluded) {
                  userButton = `<button class="btn secondary small-btn" type="button" data-toggle-user-module="${U.escapeHtml(module.key)}">${status.isExplicitUserBlocked ? 'Riabilita utente' : 'Blocca per utente'}</button>`;
                } else {
                  userButton = `<button class="btn secondary small-btn" type="button" data-toggle-user-module="${U.escapeHtml(module.key)}">${status.isExplicitUserExtra ? 'Rimuovi extra utente' : 'Abilita per utente'}</button>`;
                }

                return `<tr>
                  <td><div class="table-title-cell">${U.escapeHtml(module.label)}</div><div class="table-meta-cell">${module.submodules.length} sottomoduli</div></td>
                  <td><span class="badge ${module.tierHint === 'base' ? 'success' : 'info'}">${U.escapeHtml(module.tierHint)}</span></td>
                  <td>${companyButton}</td>
                  <td>${userButton}</td>
                  <td><span class="badge ${status.isUserEnabled ? 'success' : 'warning'}">${status.isUserEnabled ? 'Visibile' : 'Nascosto'}</span></td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </section>

      <section class="table-panel">
        <div class="panel-head">
          <div>
            <h3 class="panel-title">Matrice sottomoduli · ${U.escapeHtml(settingsModule.label)}</h3>
            <p class="panel-subtitle">Granularità richiesta: modulo attivo ma singole funzioni visibili o nascoste per azienda e per utente.</p>
          </div>
        </div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Sottomodulo</th><th>Azienda</th><th>Utente</th><th>Esito</th></tr></thead>
            <tbody>
              ${settingsModule.submodules.map((submodule) => {
                const status = L.submoduleStatus(settingsModule, submodule, state);
                const companyButton = status.isCompanyIncluded
                  ? `<button class="btn secondary small-btn" type="button" data-toggle-company-submodule="${U.escapeHtml(submodule.route)}">` +
                    `${status.isCompanyVisible ? 'Disattiva per azienda' : 'Riattiva per azienda'}</button>`
                  : `<button class="btn secondary small-btn" type="button" data-toggle-company-submodule="${U.escapeHtml(submodule.route)}">` +
                    `${status.isCompanyPurchased ? 'Rimuovi acquisto' : 'Acquista sottomodulo'}</button>`;

                let userButton = '';
                if (!status.isModuleEnabled) {
                  userButton = `<span class="tag-pill muted">Modulo padre OFF</span>`;
                } else if (status.isCompanyVisible) {
                  userButton = `<button class="btn secondary small-btn" type="button" data-toggle-user-submodule="${U.escapeHtml(submodule.route)}">${status.isExplicitUserBlocked ? 'Riabilita utente' : 'Blocca per utente'}</button>`;
                } else {
                  userButton = `<button class="btn secondary small-btn" type="button" data-toggle-user-submodule="${U.escapeHtml(submodule.route)}">${status.isExplicitUserExtra ? 'Rimuovi extra utente' : 'Abilita per utente'}</button>`;
                }

                return `<tr>
                  <td><div class="table-title-cell">${U.escapeHtml(submodule.label)}</div><div class="table-meta-cell">${U.escapeHtml(submodule.route)}</div></td>
                  <td>${companyButton}</td>
                  <td>${userButton}</td>
                  <td><span class="badge ${status.isUserEnabled ? 'success' : 'warning'}">${status.isUserEnabled ? 'Visibile' : 'Nascosto'}</span></td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </section>
    `;
  }

  function moduleOverview(module, state) {
    const status = L.moduleStatus(module, state);
    return `
      <section class="hero">
        <div class="hero-meta">Modulo</div>
        <h2>${U.escapeHtml(module.label)}</h2>
        <p>${U.escapeHtml(module.description)}</p>
      </section>

      <section class="three-col compact-grid">
        <article class="panel"><div class="summary-kicker">Stato</div><div class="summary-value">STEP 4C ready</div><p class="summary-text">Routing, sidebar dinamica e controllo accessi predisposti.</p></article>
        <article class="panel"><div class="summary-kicker">Tier</div><div class="summary-value">${U.escapeHtml(module.tierHint)}</div><p class="summary-text">Usato dal licensing engine per piano azienda e attivazioni utente.</p></article>
        <article class="panel"><div class="summary-kicker">Visibilità</div><div class="summary-value">${status.isUserEnabled ? 'on' : 'off'}</div><p class="summary-text">Lo stato dipende da piano, acquisti azienda e profilo utente.</p></article>
      </section>

      ${module.submodules.length ? `
        <section class="panel">
          <div class="panel-head"><div><h3 class="panel-title">Sottomoduli previsti</h3><p class="panel-subtitle">Clicca un sottomodulo dalla sidebar per verificare routing e placeholder.</p></div></div>
          <div class="module-card-grid">
            ${module.submodules.map((submodule) => `
              <article class="module-card">
                <div><div class="module-card-title">${U.escapeHtml(submodule.label)}</div><div class="module-card-meta">${U.escapeHtml(module.label)}</div></div>
                <div class="action-row"><button class="btn secondary" type="button" data-route-action="${U.escapeHtml(submodule.route)}">Apri</button></div>
              </article>`).join('')}
          </div>
        </section>` : `
        <section class="panel">
          <div class="panel-head"><div><h3 class="panel-title">Modulo predisposto</h3><p class="panel-subtitle">Nessun sottomodulo esplicito definito nello STEP 4C.</p></div></div>
        </section>`}
    `;
  }

  function submodulePlaceholder(module, meta) {
    const siblings = module.submodules.filter((item) => item.route !== meta.route).slice(0, 8);

    return `
      <section class="hero">
        <div class="hero-meta">Sottomodulo</div>
        <h2>${U.escapeHtml(meta.submoduleLabel)}</h2>
        <p>${U.escapeHtml(meta.fullTitle)} · placeholder coerente STEP 4C pronto per implementazione reale nei prossimi step.</p>
      </section>

      <section class="three-col compact-grid">
        <article class="panel"><div class="summary-kicker">Modulo padre</div><div class="summary-value">${U.escapeHtml(module.label)}</div><p class="summary-text">Allineato con sidebar, routing e gerarchia enterprise.</p></article>
        <article class="panel"><div class="summary-kicker">Licensing readiness</div><div class="summary-value">granulare</div><p class="summary-text">Compatibile con attivazione futura per azienda e per utente.</p></article>
        <article class="panel"><div class="summary-kicker">Stato</div><div class="summary-value">placeholder</div><p class="summary-text">UI volutamente leggera per non introdurre regressioni premature.</p></article>
      </section>

      <section class="panel">
        <div class="panel-head"><div><h3 class="panel-title">Obiettivo di questo sottomodulo</h3><p class="panel-subtitle">Punto di aggancio già attivo per componenti, dati e permessi dei prossimi step.</p></div></div>
        <div class="placeholder-box">
          <div class="placeholder-line"><strong>Route attiva:</strong> ${U.escapeHtml(meta.route)}</div>
          <div class="placeholder-line"><strong>Categoria:</strong> ${U.escapeHtml(module.category)}</div>
          <div class="placeholder-line"><strong>Tier hint:</strong> ${U.escapeHtml(module.tierHint)}</div>
          <div class="placeholder-line"><strong>Prossima implementazione:</strong> UI reale + data model + azioni modulo-specifiche.</div>
        </div>
      </section>

      ${siblings.length ? `
        <section class="panel">
          <div class="panel-head"><div><h3 class="panel-title">Altri sottomoduli correlati</h3><p class="panel-subtitle">Navigazione enterprise coerente all'interno dello stesso modulo.</p></div></div>
          <div class="tag-grid">
            ${siblings.map((item) => `<button class="tag-pill action-chip" type="button" data-route-action="${U.escapeHtml(item.route)}">${U.escapeHtml(item.label)}</button>`).join('')}
          </div>
        </section>` : ''}
    `;
  }

  return {
    sidebar,
    dashboard,
    practices,
    contacts,
    settings,
    moduleOverview,
    submodulePlaceholder
  };
})();