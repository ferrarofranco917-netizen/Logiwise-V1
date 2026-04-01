(() => {
  'use strict';

  const Storage = window.KedrixOneStorage;
  const Data = window.KedrixOneData;
  const Utils = window.KedrixOneUtils;
  const Modules = window.KedrixOneModules;
  const Licensing = window.KedrixOneLicensing;
  const Templates = window.KedrixOneTemplates;
  const I18N = window.KedrixOneI18N;
  const PracticeSchemas = window.KedrixOnePracticeSchemas;

  const state = Storage.load(() => Data.initialState());

  const main = document.getElementById('mainContent');
  const title = document.getElementById('pageTitle');
  const toastRegion = document.getElementById('toastRegion');
  const sidebarNav = document.getElementById('sidebarNav');
  const brandCompany = document.getElementById('brandCompany');
  const brandProduct = document.getElementById('brandProduct');
  const brandSubtitle = document.getElementById('brandSubtitle');
  const pageEyebrow = document.getElementById('pageEyebrow');
  const saveBackupButton = document.getElementById('saveBackupButton');
  const newPracticeButton = document.getElementById('newPracticeButton');

  function save() {
    Storage.save(state);
  }

  function toast(text) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = text;
    toastRegion.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  }

  function updateStaticLabels() {
    document.documentElement.lang = I18N.getLanguage();
    document.title = I18N.t('brand.product', 'Kedrix One');
    if (brandCompany) brandCompany.textContent = I18N.t('brand.company', 'Kedrix');
    if (brandProduct) brandProduct.textContent = I18N.t('brand.product', 'Kedrix One');
    if (brandSubtitle) brandSubtitle.textContent = I18N.t('brand.subtitle', 'Operational Workspace');
    if (pageEyebrow) pageEyebrow.textContent = I18N.t('brand.eyebrow', 'Kedrix One');
    if (saveBackupButton) saveBackupButton.textContent = I18N.t('ui.saveBackup', 'Salva backup locale');
    if (newPracticeButton) newPracticeButton.textContent = I18N.t('ui.newPractice', 'Nuova pratica');
  }

  function filteredPractices() {
    const query = Utils.normalize(state.filterText);
    return state.practices.filter((practice) => {
      const okStatus = state.statusFilter === 'Tutti' || practice.status === state.statusFilter;
      const okQuery = !query || [practice.reference, practice.client, practice.port, practice.id, practice.practiceType, practice.containerCode, practice.goodsDescription].some((value) => Utils.normalize(value).includes(query));
      return okStatus && okQuery;
    });
  }

  function selectedPractice() {
    return state.practices.find((practice) => practice.id === state.selectedPracticeId) || null;
  }

  function getClientById(clientId) {
    return (state.clients || []).find((client) => client.id === clientId) || null;
  }

  function practiceTypeLabel(value) {
    const map = {
      sea_import: I18N.t('ui.typeSeaImport', 'Mare Import'),
      sea_export: I18N.t('ui.typeSeaExport', 'Mare Export'),
      air_import: I18N.t('ui.typeAirImport', 'Aerea Import'),
      air_export: I18N.t('ui.typeAirExport', 'Aerea Export'),
      road_import: I18N.t('ui.typeRoadImport', 'Terra Import'),
      road_export: I18N.t('ui.typeRoadExport', 'Terra Export'),
      warehouse: I18N.t('ui.typeWarehouse', 'Magazzino')
    };
    return map[value] || value || '—';
  }


  function getPracticeSchema(type) {
    return PracticeSchemas.getSchema(type);
  }

  function practiceTypeLabel(value) {
    const map = {
      sea_import: I18N.t('ui.typeSeaImport', 'Mare Import'),
      sea_export: I18N.t('ui.typeSeaExport', 'Mare Export'),
      air_import: I18N.t('ui.typeAirImport', 'Aerea Import'),
      air_export: I18N.t('ui.typeAirExport', 'Aerea Export'),
      road_import: I18N.t('ui.typeRoadImport', 'Terra Import'),
      road_export: I18N.t('ui.typeRoadExport', 'Terra Export'),
      warehouse: I18N.t('ui.typeWarehouse', 'Magazzino')
    };
    return map[value] || value || '—';
  }

  function renderDynamicFieldsHTML(type, tab) {
    const schema = getPracticeSchema(type);
    if (!schema) {
      return `<div class="empty-text">${Utils.escapeHtml(I18N.t('ui.tabInstruction', 'Seleziona una tipologia pratica per caricare i campi corretti.'))}</div>`;
    }

    const fields = (schema.tabs && schema.tabs[tab]) ? schema.tabs[tab] : [];
    if (!fields.length) {
      return `<div class="empty-text">${Utils.escapeHtml(I18N.t('ui.noDataYet', 'Nessun dato'))}</div>`;
    }

    return `<div class="dynamic-section-grid">` + fields.map((field) => {
      if (field.type === 'derived') {
        return `<div class="field"><label>${Utils.escapeHtml(I18N.t(field.labelKey, field.name))}</label><div class="derived-chip">${Utils.escapeHtml(I18N.t('ui.clientRequired', 'Cliente'))}</div></div>`;
      }
      if (field.type === 'select-derived') {
        return '';
      }
      if (field.type === 'textarea') {
        return `<div class="field full"><label for="dyn_${field.name}">${Utils.escapeHtml(I18N.t(field.labelKey, field.name))}</label><textarea id="dyn_${field.name}" name="${field.name}" rows="4"></textarea></div>`;
      }
      if (field.type === 'select') {
        return `<div class="field"><label for="dyn_${field.name}">${Utils.escapeHtml(I18N.t(field.labelKey, field.name))}</label><select id="dyn_${field.name}" name="${field.name}"><option value="">—</option>${(field.options || []).map((option) => `<option value="${Utils.escapeHtml(option)}">${Utils.escapeHtml(option)}</option>`).join('')}</select></div>`;
      }
      if (field.type === 'checkbox-group') {
        return `<div class="field full"><label>${Utils.escapeHtml(I18N.t(field.labelKey, field.name))}</label><div class="checkbox-group">${(field.options || []).map((option) => `<label class="checkbox-chip"><input type="checkbox" name="${field.name}" value="${Utils.escapeHtml(option)}" /> ${Utils.escapeHtml(I18N.t(option, option))}</label>`).join('')}</div></div>`;
      }
      return `<div class="field"><label for="dyn_${field.name}">${Utils.escapeHtml(I18N.t(field.labelKey, field.name))}</label><input id="dyn_${field.name}" name="${field.name}" type="${field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}" ${field.type === 'number' ? 'step="0.01" min="0"' : ''} /></div>`;
    }).join('') + `</div>`;
  }


  function currentRoute() {
    return Modules.normalizeRoute(state.currentRoute);
  }

  function currentRouteMeta() {
    return Modules.getRouteMeta(currentRoute());
  }

  function expandedModules() {
    return Array.isArray(state.expandedModules) ? [...state.expandedModules] : [];
  }

  function ensureCurrentModuleExpanded() {
    const moduleKey = Modules.getModuleKeyFromRoute(currentRoute());
    if (!moduleKey) return;
    const current = new Set(Array.isArray(state.expandedModules) ? state.expandedModules : []);
    if (!current.has(moduleKey)) {
      current.add(moduleKey);
      state.expandedModules = Array.from(current);
    }
  }

  function syncHash(replace = false) {
    const target = `#/${currentRoute()}`;
    if (window.location.hash === target) return;
    if (replace) {
      window.history.replaceState(null, '', target);
    } else {
      window.location.hash = target;
    }
  }

  function safeRoute(route) {
    const normalized = Modules.normalizeRoute(route);
    if (!Licensing.routeAllowed(normalized, Modules, state)) return 'dashboard';
    return normalized;
  }

  function navigate(route, options = {}) {
    const normalized = safeRoute(route);
    const changed = normalized !== state.currentRoute;
    state.currentRoute = normalized;
    ensureCurrentModuleExpanded();
    save();
    render();

    if (options.syncHash !== false) syncHash(Boolean(options.replaceHash));
    if (changed) {
      main.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function toggleModule(moduleKey) {
    const current = new Set(Array.isArray(state.expandedModules) ? state.expandedModules : []);
    if (current.has(moduleKey)) current.delete(moduleKey); else current.add(moduleKey);
    state.expandedModules = Array.from(current);
    save();
    renderSidebar();
  }

  function licensingSummary() {
    const visible = Licensing.visibleModules(Modules.list(), state);
    return {
      visibleModules: visible.length,
      visibleSubmodules: visible.reduce((acc, module) => acc + module.submodules.length, 0),
      hiddenSubmodules: Modules.summary().totalSubmodules - visible.reduce((acc, module) => acc + module.submodules.length, 0)
    };
  }

  function bindPracticeEvents() {
    const form = document.getElementById('practiceForm');
    const filter = document.getElementById('filterText');
    const status = document.getElementById('statusFilter');
    const practiceType = document.getElementById('practiceType');
    const clientId = document.getElementById('clientId');
    const practiceDate = document.getElementById('practiceDate');
    const generatedReference = document.getElementById('generatedReference');
    const lockedBanner = document.getElementById('practiceLockedBanner');
    const dynamicFields = document.getElementById('practiceDynamicFields');
    const dependentFields = Array.from(main.querySelectorAll('[data-practice-dependent]')).flatMap((node) => {
      if (['INPUT','SELECT','TEXTAREA','BUTTON'].includes(node.tagName)) return [node];
      return Array.from(node.querySelectorAll('input, select, textarea, button'));
    });

    function syncPracticeLock() {
      const unlocked = Boolean(practiceType?.value);
      dependentFields.forEach((field) => {
        if (field.id !== 'practiceType') field.disabled = !unlocked;
      });
      if (lockedBanner) lockedBanner.style.display = unlocked ? 'none' : 'block';
      if (!unlocked) {
        if (generatedReference) generatedReference.value = '';
        if (dynamicFields) dynamicFields.innerHTML = renderDynamicFieldsHTML('', state.practiceTab);
      } else {
        updatePracticeReference();
        renderDynamicPanels();
      }
    }

    function updatePracticeReference() {
      const client = getClientById(clientId?.value);
      const dateValue = practiceDate?.value || new Date().toISOString().slice(0, 10);
      if (!practiceType?.value || !client || !generatedReference) {
        if (generatedReference) generatedReference.value = '';
        return;
      }
      generatedReference.value = Utils.buildPracticeReference(client.numberingRule, dateValue);
    }

    function renderDynamicPanels() {
      if (!dynamicFields) return;
      dynamicFields.innerHTML = renderDynamicFieldsHTML(practiceType?.value || '', state.practiceTab || 'practice');
    }

    filter?.addEventListener('input', (event) => {
      state.filterText = event.target.value || '';
      save();
      render();
    });

    status?.addEventListener('change', (event) => {
      state.statusFilter = event.target.value || 'Tutti';
      save();
      render();
    });

    practiceType?.addEventListener('change', () => {
      state.practiceTab = 'practice';
      syncPracticeLock();
    });
    clientId?.addEventListener('change', updatePracticeReference);
    practiceDate?.addEventListener('change', updatePracticeReference);

    main.querySelectorAll('[data-practice-tab]').forEach((button) => {
      button.addEventListener('click', () => {
        state.practiceTab = button.dataset.practiceTab;
        save();
        render();
      });
    });

    form?.addEventListener('submit', (event) => {
      event.preventDefault();

      const fd = new FormData(form);
      const selectedClient = getClientById(String(fd.get('clientId') || '').trim());
      const typeValue = String(fd.get('practiceType') || '').trim();
      const dateValue = String(fd.get('practiceDate') || '').trim();

      if (!typeValue || !selectedClient || !dateValue) {
        toast(I18N.t('ui.mandatoryFieldsMissing', 'Compila i campi obbligatori bloccanti prima di salvare la pratica.'));
        return;
      }

      const schema = getPracticeSchema(typeValue);
      const reference = Utils.buildPracticeReference(selectedClient.numberingRule, dateValue);
      Utils.commitPracticeNumber(selectedClient.numberingRule, dateValue);

      const dynamicData = {};
      const dynamicLabels = {};
      if (schema && schema.tabs) {
        Object.values(schema.tabs).flat().forEach((field) => {
          if (field.type === 'derived' || field.type === 'select-derived') return;
          if (field.type === 'checkbox-group') {
            dynamicData[field.name] = fd.getAll(field.name).map((item) => I18N.t(item, item));
          } else {
            dynamicData[field.name] = String(fd.get(field.name) || '').trim();
          }
          dynamicLabels[field.name] = I18N.t(field.labelKey, field.name);
        });
      }

      const practice = {
        id: Utils.nextPracticeId(state.practices),
        reference,
        clientId: selectedClient.id,
        client: selectedClient.name,
        practiceType: typeValue,
        practiceTypeLabel: practiceTypeLabel(typeValue),
        schemaGroup: schema ? schema.group : '',
        category: String(fd.get('category') || '').trim(),
        practiceDate: dateValue,
        status: String(fd.get('status') || '').trim() || 'Operativa',
        priority: 'Media',
        importer: dynamicData.importer || '',
        consignee: dynamicData.consignee || '',
        portLoading: dynamicData.portLoading || dynamicData.airportDeparture || '',
        portDischarge: dynamicData.portDischarge || dynamicData.airportDestination || '',
        containerCode: dynamicData.containerCode || '',
        packageCount: dynamicData.packageCount || '',
        grossWeight: dynamicData.grossWeight || '',
        goodsDescription: dynamicData.goodsDescription || '',
        booking: dynamicData.booking || '',
        customsOffice: dynamicData.customsOffice || '',
        eta: dynamicData.arrivalDate || dateValue,
        type: typeValue.includes('export') ? 'Export' : typeValue.includes('import') ? 'Import' : 'Magazzino',
        port: dynamicData.portDischarge || dynamicData.airportDestination || dynamicData.deliveryPlace || '',
        notes: dynamicData.internalNotes || '',
        dynamicData,
        dynamicLabels
      };

      state.practices.unshift(practice);
      state.selectedPracticeId = practice.id;
      state.operatorLogs.unshift({
        id: Utils.nextLogId(state.operatorLogs),
        when: Utils.nowStamp(),
        practiceId: practice.id,
        text: `${I18N.getLanguage() === 'en' ? 'Practice created' : 'Creata pratica'} ${practice.reference}.`
      });

      save();
      render();
      toast(I18N.t('ui.practiceSaved', 'Pratica salvata'));
    });

    main.querySelectorAll('tbody tr[data-practice-id]').forEach((row) => {
      row.addEventListener('click', () => {
        state.selectedPracticeId = row.dataset.practiceId;
        save();
        render();
      });
    });

    if (dynamicFields) dynamicFields.innerHTML = renderDynamicFieldsHTML('', state.practiceTab || 'practice');
    syncPracticeLock();
  }

  function bindSettingsEvents() {
    const plan = document.getElementById('companyPlan');
    const activeUser = document.getElementById('activeUserId');
    const settingsModule = document.getElementById('settingsModuleKey');
    const languageSelect = document.getElementById('languageSelect');
    const numberingClientId = document.getElementById('numberingClientId');
    const numberingPrefix = document.getElementById('numberingPrefix');
    const numberingSeparator = document.getElementById('numberingSeparator');
    const numberingNextNumber = document.getElementById('numberingNextNumber');
    const numberingIncludeYear = document.getElementById('numberingIncludeYear');
    const numberingPreview = document.getElementById('numberingPreview');
    const saveNumberingRule = document.getElementById('saveNumberingRule');

    plan?.addEventListener('change', (event) => {
      Licensing.setCompanyPlan(state, event.target.value);
      state.currentRoute = safeRoute(currentRoute());
      save();
      render();
      toast(`${I18N.t('ui.companyPlan', 'Piano azienda')}: ${String(event.target.value).toUpperCase()}`);
    });

    activeUser?.addEventListener('change', (event) => {
      Licensing.setActiveUser(state, event.target.value);
      state.currentRoute = safeRoute(currentRoute());
      save();
      render();
      toast(I18N.t('ui.activeUserUpdated', 'Utente attivo aggiornato'));
    });

    settingsModule?.addEventListener('change', (event) => {
      state.settingsModuleKey = event.target.value;
      save();
      render();
    });

    languageSelect?.addEventListener('change', (event) => {
      state.language = event.target.value;
      I18N.setLanguage(state.language);
      save();
      render();
      toast(I18N.t('ui.languageUpdated', 'Lingua aggiornata'));
    });

    function updateNumberingPreview() {
      const client = getClientById(numberingClientId?.value);
      if (!client || !numberingPreview) return;
      const tempRule = {
        ...client.numberingRule,
        prefix: numberingPrefix?.value || '',
        separator: numberingSeparator?.value || '-',
        nextNumber: Number(numberingNextNumber?.value || 1),
        includeYear: Boolean(numberingIncludeYear?.checked)
      };
      numberingPreview.value = Utils.buildPracticeReference(tempRule, new Date().toISOString().slice(0, 10));
    }

    numberingClientId?.addEventListener('change', (event) => {
      state.settingsClientId = event.target.value;
      save();
      render();
    });

    numberingPrefix?.addEventListener('input', updateNumberingPreview);
    numberingSeparator?.addEventListener('input', updateNumberingPreview);
    numberingNextNumber?.addEventListener('input', updateNumberingPreview);
    numberingIncludeYear?.addEventListener('change', updateNumberingPreview);

    saveNumberingRule?.addEventListener('click', () => {
      const client = getClientById(numberingClientId?.value);
      if (!client) return;
      client.numberingRule.prefix = String(numberingPrefix?.value || '').trim().toUpperCase();
      client.numberingRule.separator = String(numberingSeparator?.value || '-');
      client.numberingRule.nextNumber = Math.max(1, Number(numberingNextNumber?.value || 1));
      client.numberingRule.includeYear = Boolean(numberingIncludeYear?.checked);
      state.settingsClientId = client.id;
      save();
      render();
      toast(I18N.t('ui.numberingSaved', 'Regola numerazione cliente aggiornata'));
    });

    main.querySelectorAll('[data-toggle-company-module]').forEach((button) => {
      button.addEventListener('click', () => {
        Licensing.toggleCompanyModule(state, button.dataset.toggleCompanyModule);
        state.currentRoute = safeRoute(currentRoute());
        save();
        render();
        toast(I18N.t('ui.companyUpdated', 'Acquisti azienda aggiornati'));
      });
    });

    main.querySelectorAll('[data-toggle-user-module]').forEach((button) => {
      button.addEventListener('click', () => {
        Licensing.toggleUserModule(state, button.dataset.toggleUserModule);
        state.currentRoute = safeRoute(currentRoute());
        save();
        render();
        toast(I18N.t('ui.userModuleUpdated', 'Permessi modulo utente aggiornati'));
      });
    });

    const selectedModule = Modules.getModule(state.settingsModuleKey);
    main.querySelectorAll('[data-toggle-company-submodule]').forEach((button) => {
      button.addEventListener('click', () => {
        Licensing.toggleCompanySubmodule(state, selectedModule, button.dataset.toggleCompanySubmodule);
        state.currentRoute = safeRoute(currentRoute());
        save();
        render();
        toast(I18N.t('ui.companySubmoduleUpdated', 'Permessi sottomodulo azienda aggiornati'));
      });
    });

    main.querySelectorAll('[data-toggle-user-submodule]').forEach((button) => {
      button.addEventListener('click', () => {
        Licensing.toggleUserSubmodule(state, selectedModule, button.dataset.toggleUserSubmodule);
        state.currentRoute = safeRoute(currentRoute());
        save();
        render();
        toast(I18N.t('ui.userSubmoduleUpdated', 'Permessi sottomodulo utente aggiornati'));
      });
    });
  }

  function renderSidebar() {
    const visibleModules = Licensing.visibleModules(Modules.list(), state);
    sidebarNav.innerHTML = Templates.sidebar(visibleModules, currentRoute(), expandedModules());
  }

  function renderMain() {
    const route = currentRoute();
    const routeMeta = currentRouteMeta();
    const module = Modules.getModule(routeMeta.moduleKey);

    title.textContent = routeMeta.fullTitle;

    if (route === 'dashboard') {
      main.innerHTML = Templates.dashboard(state, Modules.summary(), licensingSummary());
      return;
    }

    if (route === 'practices' || route === 'practices/elenco-pratiche') {
      main.innerHTML = Templates.practices(state, selectedPractice(), filteredPractices());
      bindPracticeEvents();
      return;
    }

    if (route === 'master-data') {
      main.innerHTML = Templates.contacts(state, module);
      return;
    }

    if (route === 'settings') {
      main.innerHTML = Templates.settings(state, Modules.list(), Licensing.getActiveUser(state));
      bindSettingsEvents();
      return;
    }

    if (routeMeta.type === 'module') {
      main.innerHTML = Templates.moduleOverview(module, state);
      return;
    }

    main.innerHTML = Templates.submodulePlaceholder(module, routeMeta);
  }

  function render() {
    updateStaticLabels();
    renderSidebar();
    renderMain();
  }

  document.addEventListener('click', (event) => {
    const nav = event.target.closest('[data-route]');
    if (nav) {
      navigate(nav.dataset.route);
      return;
    }

    const routeAction = event.target.closest('[data-route-action]');
    if (routeAction) {
      navigate(routeAction.dataset.routeAction);
      return;
    }

    const toggle = event.target.closest('[data-module-toggle]');
    if (toggle) {
      toggleModule(toggle.dataset.moduleToggle);
      return;
    }

    const action = event.target.closest('[data-action]');
    if (!action) return;

    if (action.dataset.action === 'save-backup') {
      save();
      toast(I18N.t('ui.backupUpdated', 'Backup locale aggiornato'));
    }

    if (action.dataset.action === 'reset-demo') {
      const fresh = Data.initialState();
      Object.assign(state, fresh, { practiceTab: 'practice' });
      state.currentRoute = safeRoute(state.currentRoute);
      ensureCurrentModuleExpanded();
      save();
      render();
      toast(I18N.t('ui.demoReset', 'Dati demo ripristinati'));
    }
  });

  window.addEventListener('hashchange', () => {
    const routeFromHash = safeRoute(window.location.hash || state.currentRoute);
    if (routeFromHash === currentRoute()) return;
    state.currentRoute = routeFromHash;
    ensureCurrentModuleExpanded();
    save();
    render();
  });

  I18N.setLanguage(state.language || 'it');
  state.currentRoute = safeRoute(window.location.hash || state.currentRoute);
  ensureCurrentModuleExpanded();
  save();
  render();
  syncHash(true);
})();