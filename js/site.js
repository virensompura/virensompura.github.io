// Site behaviour — progressive enhancement only. Every page works without this file.
(() => {
  const doc = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Light / dark theme. The initial theme is set by an inline script in <head> to avoid a flash.
  const themeBtn = document.querySelector('[data-theme-toggle]');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const applyTheme = (theme) => {
    doc.setAttribute('data-theme', theme);
    if (themeMeta) themeMeta.setAttribute('content', theme === 'dark' ? '#0B1217' : '#F5F6F3');
    if (themeBtn) themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  };
  applyTheme(doc.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = doc.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('theme', next); } catch { /* storage unavailable */ }
    });
  }
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch { /* storage unavailable */ }
    if (!saved) applyTheme(e.matches ? 'dark' : 'light');
  });

  // Mobile navigation
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if (toggle && nav) {
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      doc.classList.toggle('nav-open', open);
      if (open) { const first = nav.querySelector('a'); if (first) first.focus(); }
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && doc.classList.contains('nav-open')) { setOpen(false); toggle.focus(); }
    });
    window.matchMedia('(min-width: 1025px)').addEventListener('change', (e) => { if (e.matches) setOpen(false); });
  }

  // Header border once the page scrolls
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Current year
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  // Muted autoplay for project previews and case-study videos while they are on screen.
  // Skipped for reduced-motion and data-saver users; the poster image stays visible instead.
  const saveData = navigator.connection && navigator.connection.saveData;
  const autoVideos = document.querySelectorAll('video[data-autoplay]');
  if (autoVideos.length && !reduceMotion && !saveData && 'IntersectionObserver' in window) {
    const vio = new IntersectionObserver((entries) => {
      entries.forEach(({ target: v, isIntersecting }) => {
        if (isIntersecting) {
          if (v.dataset.userControlled) return;
          v.muted = true;
          v.loop = true;
          const p = v.play();
          if (p && p.catch) p.catch(() => {});
        } else if (v.muted && !v.paused) {
          v.dataset.autoPaused = '1';
          v.pause();
        }
      });
    }, { threshold: 0.35 });
    autoVideos.forEach((v) => {
      v.addEventListener('playing', () => v.classList.add('is-playing'));
      // Once someone unmutes or pauses via the controls, stop managing that video automatically.
      v.addEventListener('volumechange', () => { if (!v.muted) v.dataset.userControlled = '1'; });
      v.addEventListener('pause', () => {
        if (v.dataset.autoPaused) delete v.dataset.autoPaused;
        else if (v.controls) v.dataset.userControlled = '1';
      });
      vio.observe(v);
    });
  }

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach((el) => io.observe(el));
  }

  // Category filters (work + notes)
  document.querySelectorAll('[data-filter-group]').forEach((group) => {
    const name = group.dataset.filterGroup;
    const target = document.querySelector(`[data-filter-target="${name}"]`);
    const live = group.nextElementSibling && group.nextElementSibling.matches('[data-filter-status]') ? group.nextElementSibling : null;
    if (!target) return;
    const items = target.querySelectorAll('[data-filter-item]');
    group.hidden = false;
    group.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-filter]');
      if (!btn) return;
      const key = btn.dataset.filter;
      group.querySelectorAll('[data-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      let shown = 0;
      items.forEach((item) => {
        const match = key === 'all' || item.dataset.categories.split(' ').includes(key);
        item.hidden = !match;
        if (match) { shown += 1; item.classList.add('is-visible'); }
      });
      if (live) live.textContent = `Showing ${shown} ${shown === 1 ? 'item' : 'items'}.`;
    });
  });

  // Case-study table of contents: highlight the section in view
  const tocLinks = document.querySelectorAll('.case-toc a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    const byId = new Map([...tocLinks].map((a) => [a.getAttribute('href').slice(1), a]));
    const tocIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        tocLinks.forEach((a) => a.classList.remove('is-active'));
        const link = byId.get(entry.target.id);
        if (link) link.classList.add('is-active');
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    byId.forEach((_, id) => { const s = document.getElementById(id); if (s) tocIO.observe(s); });
  }

  // Contact form (Web3Forms). Without JS the form posts normally to the same endpoint.
  const form = document.querySelector('[data-contact-form]');
  if (form) {
    const statusEl = form.querySelector('[data-form-status]');
    const button = form.querySelector('button[type="submit"]');
    const email = 'sompuraviren03@gmail.com';
    const setStatus = (msg, kind) => {
      statusEl.textContent = '';
      statusEl.className = `form-status${kind ? ` is-${kind}` : ''}`;
      if (typeof msg === 'string') statusEl.textContent = msg; else statusEl.append(...msg);
    };
    const fallback = (lead) => {
      const a = document.createElement('a');
      a.href = `mailto:${email}`;
      a.textContent = email;
      return [`${lead} Please email me directly at `, a, '.'];
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let firstInvalid = null;
      form.querySelectorAll('[required]').forEach((field) => {
        const ok = field.checkValidity() && field.value.trim() !== '';
        field.setAttribute('aria-invalid', String(!ok));
        if (!ok && !firstInvalid) firstInvalid = field;
      });
      if (firstInvalid) {
        setStatus('Please fill in your name, a valid email address, and a message.', 'error');
        firstInvalid.focus();
        return;
      }
      if (form.botcheck && form.botcheck.checked) return;

      button.disabled = true;
      setStatus('Sending…');
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(Object.fromEntries(new FormData(form))),
        });
        const json = await res.json().catch(() => ({}));
        if (res.ok && json.success) {
          form.reset();
          form.querySelectorAll('[aria-invalid]').forEach((f) => f.removeAttribute('aria-invalid'));
          setStatus('Thank you — your message has been sent. I’ll reply by email.', 'success');
        } else {
          setStatus(fallback('Your message could not be sent.'), 'error');
        }
      } catch {
        setStatus(fallback('There was a network problem.'), 'error');
      } finally {
        button.disabled = false;
      }
    });
  }
})();
