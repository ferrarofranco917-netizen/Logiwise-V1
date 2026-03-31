(() => {
  'use strict';

  const Storage = window.KedrixOneStorage;
  const Data = window.KedrixOneData;
  const Utils = window.KedrixOneUtils;
  const Modules = window.KedrixOneModules;
  const Templates = window.KedrixOneTemplates;

  const state = Storage.load(() => Data.initialState());

  const main = document.getElementById('mainContent');
  const title = document.getElementById('pageTitle');
  const toastRegion = document.getElementById('toastRegion');
  const sidebarNav = document.getElementById('sidebarNav');

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

  function filteredPractices() {
    const query = Utils.normalize(state.filterText);

    return state.practices.filter((practice) => {
      const okStatus = state.statusFilter === 'Tutti' || practice.status === state.statusFilter;
      const okQuery =
        !query ||
        [practice.reference, practice.client, practice.port, practice.id]
          .some((value) => Utils.normalize(value).includes(query));

      return okStatus && okQuery;
    });
  }

  function selectedPractice() {
    return state.practices.find((practice) => practice.id === state.selectedPracticeId) || null;
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

  function navigate(route, options = {}) {
    const normalized = Modules.normalizeRoute(route);
    const changed = normalized !== state.currentRoute;

    state.currentRoute = normalized;
    ensureCurrentModuleExpanded();
    save();
    render();

    if (options.syncHash !== false) {
      syncHash(Boolean(options.replaceHash));
    }

    if (changed) {
      main.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function toggleModule(moduleKey) {
    const current = new Set(Array.isArray(state.expandedModules) ? state.expandedModules : []);
    if (current.has(moduleKey)) {
      current.delete(moduleKey);
    } else {
      current.add(moduleKey);
    }
    state.expandedModules = Array.from(current);
    save();
    renderSidebar();
  }

  function bindPracticeEvents() {
    const form = document.getElementById('practiceForm');
    const filter = document.getElementById('filterText');
    const status = document.getElementById('statusFilter');

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

    form?.addEventListener('submit', (event) => {
      event.preventDefault();

      const fd = new FormData(form);
      const practice = {
        id: Utils.nextPracticeId(state.practices),
        reference: String(fd.get('reference') || '').trim(),
        client: String(fd.get('client') || '').trim(),
        type: String(fd.get('type') || '').trim(),
        port: String(fd.get('port') || '').trim(),
        eta: String(fd.get('eta') || '').trim(),
        priority: String(fd.get('priority') || '').trim(),
        status: String(fd.get('status') || '').trim(),
        notes: String(fd.get('notes') || '').trim()
      };

      if (!practice.reference || !practice.client || !practice.port || !practice.eta) {
        toast('Compila i campi obbligatori.');
        return;
      }

      state.practices.unshift(practice);
      state.selectedPracticeId = practice.id;
      state.operatorLogs.unshift({
        id: Utils.nextLogId(state.operatorLogs),
        when: Utils.nowStamp(),
        practiceId: practice.id,
        text: `Creata pratica ${practice.reference}.`
      });

      save();
      render();
      toast('Pratica salvata');
    });

    main.querySelectorAll('tbody tr[data-practice-id]').forEach((row) => {
      row.addEventListener('click', () => {
        state.selectedPracticeId = row.dataset.practiceId;
        save();
        render();
      });
    });
  }

  function renderSidebar() {
    sidebarNav.innerHTML = Templates.sidebar(Modules.list(), currentRoute(), expandedModules());
  }

  function renderMain() {
    const route = currentRoute();
    const routeMeta = currentRouteMeta();
    const module = Modules.getModule(routeMeta.moduleKey);

    title.textContent = routeMeta.fullTitle;

    if (route === 'dashboard') {
      main.innerHTML = Templates.dashboard(state, Modules.summary());
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

    if (routeMeta.type === 'module') {
      main.innerHTML = Templates.moduleOverview(module);
      return;
    }

    main.innerHTML = Templates.submodulePlaceholder(module, routeMeta);
  }

  function render() {
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
      toast('Backup locale aggiornato');
    }

    if (action.dataset.action === 'reset-demo') {
      const fresh = Data.initialState();
      Object.assign(state, fresh, { currentRoute: currentRoute() });
      save();
      render();
      toast('Dati demo ripristinati');
    }
  });

  window.addEventListener('hashchange', () => {
    const routeFromHash = Modules.normalizeRoute(window.location.hash);
    if (routeFromHash === currentRoute()) return;
    state.currentRoute = routeFromHash;
    ensureCurrentModuleExpanded();
    save();
    render();
  });

  state.currentRoute = Modules.normalizeRoute(window.location.hash || state.currentRoute);
  ensureCurrentModuleExpanded();
  save();
  render();
  syncHash(true);
})();
