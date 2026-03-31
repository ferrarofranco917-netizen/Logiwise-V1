window.KedrixOneTemplates = (() => {
  'use strict';

  const U = window.KedrixOneUtils;
  const W = window.KedrixOneWiseMind;

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
            ${hasSubmodules ? `
              <button
                class="nav-toggle"
                type="button"
                data-module-toggle="${U.escapeHtml(module.key)}"
                aria-expanded="${isExpanded ? 'true' : 'false'}"
                aria-label="Espandi ${U.escapeHtml(module.label)}"
              >${isExpanded ? '−' : '+'}</button>
            ` : ''}
          </div>

          ${hasSubmodules ? `
            <div class="subnav-grid ${isExpanded ? 'open' : ''}">
              ${module.submodules.map((submodule) => `
                <button class="subnav-link ${activeRoute === submodule.route ? 'active' : ''}" data-route="${U.escapeHtml(submodule.route)}" type="button">
                  ${U.escapeHtml(submodule.label)}
                </button>
              `).join('')}
            </div>
          ` : ''}
        </section>
      `;
    }).join('');
  }

  function dashboard(state, modulesSummary) {
    const alerts = W.alerts(state.practices);
    const summary = W.summary(alerts);

    return `
      <section class="hero">
        <div class="hero-meta">STEP 4A · Architettura enterprise moduli e routing</div>
        <h2>Kedrix One</h2>
        <p>Base grafica preservata, repo pulita, routing completo predisposto per moduli, sottomoduli, licensing e sidebar dinamica senza regressioni del workspace esistente.</p>
      </section>

      <section class="kpi-grid">
        <article class="kpi-card">
          <div class="kpi-label">Moduli</div>
          <div class="kpi-value">${modulesSummary.totalModules}</div>
          <div class="kpi-hint">Architettura enterprise attiva</div>
        </article>
        <article class="kpi-card">
          <div class="kpi-label">Sottomoduli</div>
          <div class="kpi-value">${modulesSummary.totalSubmodules}</div>
          <div class="kpi-hint">Routing e placeholder coerenti</div>
        </article>
        <article class="kpi-card">
          <div class="kpi-label">Alert</div>
          <div class="kpi-value">${summary.total}</div>
          <div class="kpi-hint">WiseMind operativo</div>
        </article>
        <article class="kpi-card">
          <div class="kpi-label">Anagrafiche base</div>
          <div class="kpi-value">${state.contacts.length}</div>
          <div class="kpi-hint">Dataset iniziale preservato</div>
        </article>
      </section>

      <section class="three-col">
        <article class="panel">
          <div class="panel-head">
            <div>
              <h3 class="panel-title">Roadmap attiva</h3>
              <p class="panel-subtitle">STEP 4A completato a livello di struttura e predisposizione commerciale/tecnica.</p>
            </div>
          </div>

          <div class="stack-list">
            <div class="stack-item"><strong>Sidebar dinamica</strong><span>Modulo e sottomodulo con espansione persistente</span></div>
            <div class="stack-item"><strong>Routing completo</strong><span>Hash routing coerente con moduli e deep link</span></div>
            <div class="stack-item"><strong>STEP 4B ready</strong><span>Metadati base per registry e licensing engine</span></div>
          </div>
        </article>

        <article class="panel">
          <div class="panel-head">
            <div>
              <h3 class="panel-title">WiseMind</h3>
              <p class="panel-subtitle">Segnali operativi iniziali senza popup di sistema.</p>
            </div>
          </div>

          <div class="alert-list">
            ${
              alerts.length
                ? alerts.map((alert) => `
                    <div class="alert-item ${alert.severity}">
                      <div class="panel-title" style="font-size:15px">${U.escapeHtml(alert.title)}</div>
                      <div class="alert-text">${U.escapeHtml(alert.text)}</div>
                      <div class="log-meta">${U.escapeHtml(alert.hint)}</div>
                    </div>
                  `).join('')
                : `
                  <div class="alert-item success">
                    <div class="panel-title" style="font-size:15px">Nessuna criticità</div>
                    <div class="alert-text">Nessun alert attivo.</div>
                  </div>
                `
            }
          </div>
        </article>

        <article class="panel">
          <div class="panel-head">
            <div>
              <h3 class="panel-title">Log operatore</h3>
              <p class="panel-subtitle">Ultimi eventi collegati alle pratiche.</p>
            </div>
          </div>

          <div class="log-list">
            ${state.operatorLogs.slice(0, 4).map((log) => `
              <div class="log-item">
                <div class="log-meta">${U.escapeHtml(log.when)} · ${U.escapeHtml(log.practiceId)}</div>
                <div class="log-text">${U.escapeHtml(log.text)}</div>
              </div>
            `).join('')}
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
              ${['Tutti', 'In attesa documenti', 'Operativa', 'Sdoganamento'].map((option) => `
                <option ${state.statusFilter === option ? 'selected' : ''}>${option}</option>
              `).join('')}
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
              <div class="field">
                <label for="reference">Riferimento</label>
                <input id="reference" name="reference" required placeholder="Es. KX-IMP-0004" />
              </div>

              <div class="field">
                <label for="client">Cliente</label>
                <input id="client" name="client" required placeholder="Es. Cliente S.r.l." />
              </div>

              <div class="field">
                <label for="type">Tipo</label>
                <select id="type" name="type">
                  <option>Import</option>
                  <option>Export</option>
                </select>
              </div>

              <div class="field">
                <label for="port">Porto</label>
                <input id="port" name="port" required placeholder="Es. Genova" />
              </div>

              <div class="field">
                <label for="eta">ETA</label>
                <input id="eta" name="eta" type="date" required />
              </div>

              <div class="field">
                <label for="priority">Priorità</label>
                <select id="priority" name="priority">
                  <option>Alta</option>
                  <option>Media</option>
                  <option>Bassa</option>
                </select>
              </div>

              <div class="field">
                <label for="status">Stato</label>
                <select id="status" name="status">
                  <option>In attesa documenti</option>
                  <option>Operativa</option>
                  <option>Sdoganamento</option>
                </select>
              </div>

              <div class="field full">
                <label for="notes">Note operative</label>
                <textarea id="notes" name="notes" placeholder="Indicazioni operative, vincoli, priorità..."></textarea>
              </div>
            </div>

            <div class="action-row" style="margin-top:14px">
              <button class="btn" type="submit">Salva pratica</button>
            </div>
          </form>
        </article>

        <article class="panel">
          <div class="panel-head">
            <div>
              <h3 class="panel-title">Dettaglio pratica</h3>
              <p class="panel-subtitle">Seleziona una pratica dalla tabella.</p>
            </div>
          </div>

          ${
            selected
              ? `
                <div class="detail-grid">
                  <div class="detail-row"><div class="detail-label">ID</div><div>${U.escapeHtml(selected.id)}</div></div>
                  <div class="detail-row"><div class="detail-label">Rif.</div><div>${U.escapeHtml(selected.reference)}</div></div>
                  <div class="detail-row"><div class="detail-label">Cliente</div><div>${U.escapeHtml(selected.client)}</div></div>
                  <div class="detail-row"><div class="detail-label">Porto</div><div>${U.escapeHtml(selected.port)}</div></div>
                  <div class="detail-row"><div class="detail-label">ETA</div><div>${U.formatDate(selected.eta)}</div></div>
                  <div class="detail-row"><div class="detail-label">Stato</div><div><span class="badge ${selected.status === 'In attesa documenti' ? 'warning' : 'info'}">${U.escapeHtml(selected.status)}</span></div></div>
                  <div class="detail-row"><div class="detail-label">Note</div><div>${U.escapeHtml(selected.notes || '—')}</div></div>
                </div>
              `
              : `<div class="empty-text">Nessuna pratica selezionata.</div>`
          }
        </article>
      </section>

      <section class="table-panel">
        <div class="panel-head">
          <div>
            <h3 class="panel-title">Elenco pratiche</h3>
            <p class="panel-subtitle">Clicca una riga per selezionare il dettaglio.</p>
          </div>
        </div>

        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Riferimento</th>
                <th>Cliente</th>
                <th>Tipo</th>
                <th>Porto</th>
                <th>ETA</th>
                <th>Priorità</th>
                <th>Stato</th>
              </tr>
            </thead>
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
                </tr>
              `).join('')}
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
        <article class="kpi-card">
          <div class="kpi-label">Famiglie previste</div>
          <div class="kpi-value">${module.submodules.length}</div>
          <div class="kpi-hint">Master data condivisi</div>
        </article>
        <article class="kpi-card">
          <div class="kpi-label">Base contatti</div>
          <div class="kpi-value">${state.contacts.length}</div>
          <div class="kpi-hint">Stato attuale preservato</div>
        </article>
        <article class="kpi-card">
          <div class="kpi-label">STEP successivo</div>
          <div class="kpi-value">4C</div>
          <div class="kpi-hint">Anagrafiche reali e master data</div>
        </article>
      </section>

      <section class="table-panel">
        <div class="panel-head">
          <div>
            <h3 class="panel-title">Base attuale</h3>
            <p class="panel-subtitle">Dataset iniziale esistente non alterato.</p>
          </div>
        </div>

        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Città</th>
              </tr>
            </thead>
            <tbody>
              ${state.contacts.map((contact) => `
                <tr>
                  <td>${U.escapeHtml(contact.id)}</td>
                  <td>${U.escapeHtml(contact.name)}</td>
                  <td>${U.escapeHtml(contact.type)}</td>
                  <td>${U.escapeHtml(contact.city)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>

      <section class="panel">
        <div class="panel-head">
          <div>
            <h3 class="panel-title">Famiglie previste</h3>
            <p class="panel-subtitle">Architettura già predisposta per il passaggio allo STEP 4C.</p>
          </div>
        </div>
        <div class="tag-grid">
          ${module.submodules.map((submodule) => `<span class="tag-pill">${U.escapeHtml(submodule.label)}</span>`).join('')}
        </div>
      </section>
    `;
  }

  function moduleOverview(module) {
    return `
      <section class="hero">
        <div class="hero-meta">Modulo</div>
        <h2>${U.escapeHtml(module.label)}</h2>
        <p>${U.escapeHtml(module.description)}</p>
      </section>

      <section class="three-col compact-grid">
        <article class="panel">
          <div class="summary-kicker">Stato</div>
          <div class="summary-value">STEP 4A ready</div>
          <p class="summary-text">Routing attivo, sidebar dinamica e placeholder coerente predisposti.</p>
        </article>

        <article class="panel">
          <div class="summary-kicker">Commercial model</div>
          <div class="summary-value">${U.escapeHtml(module.tierHint)}</div>
          <p class="summary-text">Dato preparatorio per registry/licensing del prossimo step.</p>
        </article>

        <article class="panel">
          <div class="summary-kicker">Sottomoduli</div>
          <div class="summary-value">${module.submodules.length}</div>
          <p class="summary-text">Struttura navigabile e pronta per placeholder o implementazioni reali.</p>
        </article>
      </section>

      ${module.submodules.length ? `
        <section class="panel">
          <div class="panel-head">
            <div>
              <h3 class="panel-title">Sottomoduli previsti</h3>
              <p class="panel-subtitle">Clicca un sottomodulo dalla sidebar per verificare routing e placeholder.</p>
            </div>
          </div>

          <div class="module-card-grid">
            ${module.submodules.map((submodule) => `
              <article class="module-card">
                <div>
                  <div class="module-card-title">${U.escapeHtml(submodule.label)}</div>
                  <div class="module-card-meta">${U.escapeHtml(module.label)}</div>
                </div>
                <div class="action-row">
                  <button class="btn secondary" type="button" data-route-action="${U.escapeHtml(submodule.route)}">Apri</button>
                </div>
              </article>
            `).join('')}
          </div>
        </section>
      ` : `
        <section class="panel">
          <div class="panel-head">
            <div>
              <h3 class="panel-title">Modulo predisposto</h3>
              <p class="panel-subtitle">Nessun sottomodulo esplicito definito nello STEP 4A, ma route e spazio architetturale sono già attivi.</p>
            </div>
          </div>
        </section>
      `}
    `;
  }

  function submodulePlaceholder(module, meta) {
    const siblings = module.submodules.filter((item) => item.route !== meta.route).slice(0, 8);

    return `
      <section class="hero">
        <div class="hero-meta">Sottomodulo</div>
        <h2>${U.escapeHtml(meta.submoduleLabel)}</h2>
        <p>${U.escapeHtml(meta.fullTitle)} · placeholder coerente STEP 4A pronto per implementazione reale nei prossimi step.</p>
      </section>

      <section class="three-col compact-grid">
        <article class="panel">
          <div class="summary-kicker">Modulo padre</div>
          <div class="summary-value">${U.escapeHtml(module.label)}</div>
          <p class="summary-text">Allineato con sidebar, routing e gerarchia enterprise.</p>
        </article>

        <article class="panel">
          <div class="summary-kicker">Licensing readiness</div>
          <div class="summary-value">ready</div>
          <p class="summary-text">Compatibile con attivazione futura per azienda e per utente.</p>
        </article>

        <article class="panel">
          <div class="summary-kicker">Stato</div>
          <div class="summary-value">placeholder</div>
          <p class="summary-text">UI volutamente leggera per non introdurre regressioni premature.</p>
        </article>
      </section>

      <section class="panel">
        <div class="panel-head">
          <div>
            <h3 class="panel-title">Obiettivo di questo sottomodulo</h3>
            <p class="panel-subtitle">Punto di aggancio già attivo per componenti, dati e permessi dei prossimi step.</p>
          </div>
        </div>

        <div class="placeholder-box">
          <div class="placeholder-line"><strong>Route attiva:</strong> ${U.escapeHtml(meta.route)}</div>
          <div class="placeholder-line"><strong>Categoria:</strong> ${U.escapeHtml(module.category)}</div>
          <div class="placeholder-line"><strong>Tier hint:</strong> ${U.escapeHtml(module.tierHint)}</div>
          <div class="placeholder-line"><strong>Prossima implementazione:</strong> UI reale + data model + azioni modulo-specifiche.</div>
        </div>
      </section>

      ${siblings.length ? `
        <section class="panel">
          <div class="panel-head">
            <div>
              <h3 class="panel-title">Altri sottomoduli correlati</h3>
              <p class="panel-subtitle">Navigazione enterprise coerente all'interno dello stesso modulo.</p>
            </div>
          </div>
          <div class="tag-grid">
            ${siblings.map((item) => `<button class="tag-pill action-chip" type="button" data-route-action="${U.escapeHtml(item.route)}">${U.escapeHtml(item.label)}</button>`).join('')}
          </div>
        </section>
      ` : ''}
    `;
  }

  return {
    sidebar,
    dashboard,
    practices,
    contacts,
    moduleOverview,
    submodulePlaceholder
  };
})();
