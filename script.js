(function () {
  const config = window.ACALO_CONFIG || {};
  const state = {
    currency: localStorage.getItem('acalo_currency') || 'USD',
    notes: [],
    downloads: [],
    courses: [],
    faqs: []
  };

  const byId = (id) => document.getElementById(id);
  const toast = byId('toast');

  function showToast(message) {
    if (!toast) return alert(message);
    toast.textContent = message;
    toast.hidden = false;
    setTimeout(() => { toast.hidden = true; }, 2600);
  }

  async function fetchJSON(path) {
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error(path);
      return await res.json();
    } catch (e) {
      console.error('Data load error:', e);
      return [];
    }
  }

  function amountFor(id) {
    const p = config.pricing?.[id];
    if (!p) return '';
    return state.currency === 'USD' ? p.usd : p.inr;
  }

  function updateCurrencyUI() {
    document.querySelectorAll('[data-currency-btn]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.currencyBtn === state.currency);
      btn.setAttribute('aria-pressed', String(btn.dataset.currencyBtn === state.currency));
    });
    document.querySelectorAll('[data-price-id]').forEach((el) => {
      el.textContent = amountFor(el.dataset.priceId);
    });
    document.querySelectorAll('[data-currency-label]').forEach((el) => {
      el.textContent = state.currency;
    });
  }

  function bindCurrencyToggles() {
    document.querySelectorAll('[data-currency-btn]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.currency = btn.dataset.currencyBtn;
        localStorage.setItem('acalo_currency', state.currency);
        updateCurrencyUI();
      });
    });
  }

  function setupNav() {
    const topbar = document.querySelector('.topbar');
    const menuBtn = byId('menuBtn');
    const navLinks = byId('navLinks');
    if (menuBtn && navLinks) {
      menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
      navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => navLinks.classList.remove('open'));
      });
    }
    document.addEventListener('scroll', () => {
      if (!topbar) return;
      topbar.classList.toggle('scrolled', window.scrollY > 8);
      const backTop = byId('backTop');
      if (backTop) backTop.hidden = window.scrollY < 400;
    });

    const sectionLinks = document.querySelectorAll('[data-section-link]');
    if (sectionLinks.length) {
      const sections = [...sectionLinks].map((l) => document.querySelector(l.getAttribute('href'))).filter(Boolean);
      if (sections.length) {
        window.addEventListener('scroll', () => {
          const y = window.scrollY + 130;
          sections.forEach((sec, i) => {
            if (sec.offsetTop <= y && sec.offsetTop + sec.offsetHeight > y) {
              sectionLinks.forEach((l) => l.classList.remove('active'));
              sectionLinks[i].classList.add('active');
            }
          });
        });
      }
    }
  }

  function setupBackTop() {
    const btn = byId('backTop');
    if (!btn) return;
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  function setupExpanders() {
    document.querySelectorAll('[data-expand-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = byId(btn.dataset.expandToggle);
        if (!target) return;
        const isHidden = target.hasAttribute('hidden');
        if (isHidden) target.removeAttribute('hidden'); else target.setAttribute('hidden', '');
        btn.textContent = isHidden ? 'Show less' : 'Read more';
      });
    });

    document.querySelectorAll('.faq-trigger, .details-toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const panel = byId(btn.getAttribute('aria-controls'));
        if (!panel) return;
        const open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        if (open) panel.setAttribute('hidden', ''); else panel.removeAttribute('hidden');
      });
    });
  }

  function integrationAction(type, key) {
    const routes = {
      booking: config.bookingUrl,
      whatsapp: config.whatsappUrl,
      payment: config.payments?.[key],
      portal: config.portalUrl
    };
    const url = routes[type];
    if (url) {
      window.open(url, '_blank', 'noopener');
      return;
    }
    showToast('This link is not configured yet. Please use the contact form to enquire.');
  }

  function bindIntegrationButtons() {
    document.querySelectorAll('[data-action]').forEach((btn) => {
      btn.addEventListener('click', () => integrationAction(btn.dataset.action, btn.dataset.key));
    });
  }

  function validateForm(form) {
    let valid = true;
    form.querySelectorAll('[required]').forEach((field) => {
      const errorEl = form.querySelector(`[data-error-for="${field.name}"]`);
      if (!field.value.trim()) {
        valid = false;
        if (errorEl) errorEl.textContent = 'This field is required.';
      } else if (field.type === 'email' && !/^\S+@\S+\.\S+$/.test(field.value.trim())) {
        valid = false;
        if (errorEl) errorEl.textContent = 'Enter a valid email address.';
      } else if (errorEl) {
        errorEl.textContent = '';
      }
    });
    return valid;
  }

  async function postForm(url, payload) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Submit failed');
  }

  function setupForms() {
    document.querySelectorAll('[data-form-type]').forEach((form) => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const status = form.querySelector('.form-status');
        if (!validateForm(form)) {
          if (status) status.textContent = 'Please fix the highlighted fields.';
          return;
        }
        const type = form.dataset.formType;
        const endpoint = type === 'lead' ? config.leadMagnetFormEndpoint : config.contactFormEndpoint;
        if (!endpoint) {
          if (status) status.textContent = 'Form endpoint not configured yet. Please email us directly.';
          return;
        }

        const payload = Object.fromEntries(new FormData(form).entries());
        try {
          await postForm(endpoint, payload);
          form.reset();
          if (status) status.textContent = 'Thanks. Your request has been received.';
        } catch (_) {
          if (status) status.textContent = 'There was a submission issue. Please try again or email us.';
        }
      });
    });
  }

  function renderFaqs() {
    const wrap = byId('faqList');
    if (!wrap || !state.faqs.length) return;
    wrap.innerHTML = state.faqs.map((f, i) => `
      <div class="faq-item">
        <button class="faq-trigger" aria-expanded="false" aria-controls="faq-${i}">${f.question}</button>
        <div class="faq-panel muted" id="faq-${i}" hidden>${f.answer}</div>
      </div>
    `).join('');
    setupExpanders();
  }

  function renderPrograms(targetId, featuredOnly = false) {
    const wrap = byId(targetId);
    if (!wrap) return;
    const list = featuredOnly ? state.courses.filter((c) => c.featured) : state.courses;
    wrap.innerHTML = list.map((c, i) => `
      <article class="card program-card ${c.featured ? 'featured' : ''} reveal">
        <span class="badge">Best for: ${c.bestFor}</span>
        <h3>${c.name}</h3>
        <div class="price" data-price-id="${c.id}"></div>
        <p class="muted">${c.summary}</p>
        <button class="btn btn-secondary details-toggle" aria-expanded="false" aria-controls="inc-${targetId}-${i}">View inclusions</button>
        <div id="inc-${targetId}-${i}" class="details-content" hidden>
          <ul>${c.includes.map((x) => `<li>${x}</li>`).join('')}</ul>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" data-action="payment" data-key="${c.id}">Pay & Reserve</button>
          <button class="btn btn-secondary" data-action="booking">Book Session</button>
        </div>
      </article>
    `).join('');
    bindIntegrationButtons();
    setupExpanders();
    updateCurrencyUI();
    revealObserver();
  }

  function setupSearchFilters(opts) {
    const input = byId(opts.inputId);
    const chips = document.querySelectorAll(`[data-chip-group="${opts.chipGroup}"] .chip`);
    const container = byId(opts.containerId);
    const empty = byId(opts.emptyId);
    if (!input || !container) return;

    let active = 'All';

    function render() {
      const query = input.value.toLowerCase().trim();
      const rows = opts.items.filter((item) => {
        const hay = `${item.title} ${item.excerpt || ''} ${item.description || ''}`.toLowerCase();
        const catOk = active === 'All' || item.category === active || item.type === active;
        return catOk && hay.includes(query);
      });

      if (!rows.length) {
        container.innerHTML = '';
        if (empty) empty.hidden = false;
        return;
      }
      if (empty) empty.hidden = true;

      container.innerHTML = rows.map((item) => opts.card(item)).join('');
      setupExpanders();
      bindIntegrationButtons();
      revealObserver();
    }

    input.addEventListener('input', render);
    chips.forEach((chip) => chip.addEventListener('click', () => {
      active = chip.dataset.category;
      chips.forEach((c) => c.classList.toggle('active', c === chip));
      render();
    }));
    render();
  }

  function renderNotes() {
    if (!byId('notesGrid')) return;
    const featured = byId('featuredNotes');
    if (featured) {
      featured.innerHTML = state.notes.filter((n) => n.featured).map((n, i) => `
        <article class="card reveal">
          <span class="badge">Featured</span>
          <h3>${n.title}</h3>
          <p class="muted">${n.excerpt}</p>
          <button class="btn-link details-toggle" aria-expanded="false" aria-controls="note-feature-${i}">Read preview</button>
          <div id="note-feature-${i}" class="details-content muted" hidden>${n.content}</div>
        </article>
      `).join('');
    }

    setupSearchFilters({
      inputId: 'notesSearch',
      chipGroup: 'notes',
      containerId: 'notesGrid',
      emptyId: 'notesEmpty',
      items: state.notes,
      card: (n) => `
        <article class="card reveal">
          <span class="badge">${n.category}</span>
          <h3>${n.title}</h3>
          <p class="muted">${n.excerpt}</p>
          <button class="btn-link details-toggle" aria-expanded="false" aria-controls="note-${n.id}">Read more</button>
          <div id="note-${n.id}" class="details-content muted" hidden>${n.content}</div>
        </article>
      `
    });
  }

  function renderDownloads() {
    if (!byId('downloadsGrid')) return;
    setupSearchFilters({
      inputId: 'downloadsSearch',
      chipGroup: 'downloads',
      containerId: 'downloadsGrid',
      emptyId: 'downloadsEmpty',
      items: state.downloads,
      card: (d) => `
        <article class="card reveal">
          <span class="badge">${d.type}</span>
          <h3>${d.title}</h3>
          <p class="muted">${d.description}</p>
          <div class="btn-row">
            ${d.access === 'free'
              ? `<button class="btn btn-secondary" data-action="booking">Get via email</button>`
              : `<button class="btn btn-primary" data-action="payment" data-key="${d.program || 'pack4'}">Unlock resource</button>`}
            <a href="contact.html" class="btn btn-secondary">Enquire</a>
          </div>
        </article>
      `
    });
  }

  function revealObserver() {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || !els.length) {
      els.forEach((e) => e.classList.add('visible'));
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    els.forEach((el) => obs.observe(el));
  }

  async function initData() {
    const [courses, notes, downloads, faqs] = await Promise.all([
      fetchJSON('assets/data/courses.json'),
      fetchJSON('assets/data/notes.json'),
      fetchJSON('assets/data/downloads.json'),
      fetchJSON('assets/data/faqs.json')
    ]);
    state.courses = courses;
    state.notes = notes;
    state.downloads = downloads;
    state.faqs = faqs;
  }

  async function init() {
    setupNav();
    setupBackTop();
    bindCurrencyToggles();
    setupForms();
    setupExpanders();
    bindIntegrationButtons();

    await initData();
    renderPrograms('programCards', true);
    renderPrograms('allProgramCards', false);
    renderFaqs();
    renderNotes();
    renderDownloads();
    updateCurrencyUI();
    revealObserver();
  }

  init();
})();
