window.KedrixOneTemplates = (() => {
  'use strict';

  const U = window.KedrixOneUtils;
  const W = window.KedrixOneWiseMind;

  function dashboard(state) {
    const alerts = W.alerts(state.practices);
    const summary = W.summary(alerts);

    return `
      <section class="hero">
        <h2>Kedrix One</h2>
        <p>Repo completa, coerente e pronta da sostituire integralmente. Base stabile per continuare senza altri problemi di struttura o path.</p>
      </section>

      <section class="kpi-grid">
        <article class="kpi-card">
          <div class="kpi-label">Pratiche</div>
          <div class="kpi-value">${state.practices.length}</div>
          <div class="kpi-hint">Dataset operativo corrente</div>
        </article>
        <article class="kpi-card">
          <div class="kpi-label">Alert</div>
          <div class="kpi-value">${summary.total}</div>
          <div class="kpi-hint">WiseMind operativo</div>
        </article>
        <article class="kpi-card">
          <div class="kpi-label">Anagrafiche</div>
          <div class="kpi-value">${state.contacts.length}</div>
          <div class="kpi-hint">Base contatti iniziale</div>
        </article>
        <article class="kpi-card">
          <div class="kpi-label">Moduli JS</div>
          <div class="kpi-value">6</div>
          <div class="kpi-hint">Repo più leggibile</div>
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

  function contacts(state) {
    return `
      <section class="hero">
        <h2>Anagrafiche</h2>
        <p>Base iniziale pronta per evoluzione STEP 4.</p>
      </section>

      <section class="table-panel">
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
    `;
  }

  function placeholder(title) {
    return `
      <section class="hero">
        <h2>${title}</h2>
        <p>Modulo predisposto a livello di navigazione. In questo pacchetto il focus resta su Dashboard, Pratiche e base Anagrafiche.</p>
      </section>
    `;
  }

  return { dashboard, practices, contacts, placeholder };
})();
