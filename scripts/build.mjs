// Static site generator for virensompura.github.io — zero dependencies (Node 18+).
// Usage: node scripts/build.mjs
// Reads content/site.mjs and content/notes/*.html, writes plain HTML pages that are committed
// and served directly by GitHub Pages.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as C from '../content/site.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const { site } = C;
const BUILD_DATE = new Date().toISOString().slice(0, 10);
const YEAR = new Date().getFullYear();
const pages = [];

// ─── helpers ─────────────────────────────────────────────
const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = (n) => String(n).padStart(2, '0');
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthLabel = (ym) => { const [y, m] = ym.split('-'); return `${MONTHS[+m - 1]} ${y}`; };
const ext = (href) => /^https?:/.test(href);
const projectById = Object.fromEntries(C.projects.map((p) => [p.id, p]));
const noteBySlug = Object.fromEntries(C.notes.map((n) => [n.slug, n]));

const icons = {
  arrow: '<svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  external: '<svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14"><path d="M5 11l6-6M6 5h5v5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  download: '<svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16"><path d="M8 2v8M4.5 6.5L8 10l3.5-3.5M3 13h10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  moon: '<svg class="icon-moon" aria-hidden="true" viewBox="0 0 24 24" width="18" height="18"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  sun: '<svg class="icon-sun" aria-hidden="true" viewBox="0 0 24 24" width="18" height="18"><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
};

// Per-page path context: relative prefix so the site works at the domain root and from a local server.
function ctx(outPath, absolute = false) {
  const depth = outPath.split('/').length - 1;
  const prefix = absolute ? '/' : '../'.repeat(depth);
  const u = (p = '') => (ext(p) || p.startsWith('mailto:') || p.startsWith('#') ? p : prefix + p || './');
  return { u, prefix };
}

function linkAttrs(href) {
  return ext(href) ? ' target="_blank" rel="noopener noreferrer"' : '';
}

// ─── layout ──────────────────────────────────────────────
const NAV = [
  { key: 'work', label: 'Work', href: 'work/' },
  { key: 'experience', label: 'Experience', href: 'experience/' },
  { key: 'about', label: 'About', href: 'about/' },
  { key: 'lab', label: 'Engineering Lab', href: 'lab/' },
  { key: 'notes', label: 'Notes', href: 'blog/' },
];

function header(c, active) {
  const items = NAV.map((n) => `<li><a href="${c.u(n.href)}"${n.key === active ? ' aria-current="page"' : ''}>${n.label}</a></li>`).join('');
  return `<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="${c.u('')}" aria-label="Viren Sompura — home"><span class="brand-mark" aria-hidden="true">VS</span><span class="brand-text" aria-hidden="true"><span class="brand-name">Viren Sompura</span><span class="brand-role">${esc(site.role)}</span></span></a>
    <nav id="site-nav" class="site-nav" aria-label="Primary">
      <ul>${items}<li><a href="${c.u(site.resume)}" target="_blank" rel="noopener">Resume</a></li></ul>
      <a class="btn btn-primary btn-sm nav-cta" href="${c.u('contact/')}"${active === 'contact' ? ' aria-current="page"' : ''}>Get in touch</a>
    </nav>
    <div class="header-tools">
      <button class="theme-toggle" type="button" data-theme-toggle aria-label="Switch to dark theme">${icons.moon}${icons.sun}</button>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav"><span class="sr-only">Menu</span><span class="nav-toggle-icon" aria-hidden="true"></span></button>
    </div>
  </div>
</header>`;
}

function footer(c) {
  const nav = [...NAV, { label: 'Contact', href: 'contact/' }].map((n) => `<li><a href="${c.u(n.href)}">${n.label}</a></li>`).join('');
  return `<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <p class="footer-name">Viren Sompura</p>
        <p class="footer-role">${esc(site.role)}</p>
        <p class="footer-tagline">${esc(site.tagline)}</p>
      </div>
      <nav aria-label="Footer"><h2 class="footer-heading">Explore</h2><ul class="footer-list">${nav}</ul></nav>
      <div><h2 class="footer-heading">Connect</h2><ul class="footer-list">
        <li><a href="mailto:${site.email}">Email</a></li>
        <li><a href="${site.links.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
        <li><a href="${site.links.github}" target="_blank" rel="noopener noreferrer">GitHub</a></li>
        <li><a href="${c.u(site.resume)}" target="_blank" rel="noopener">Resume (PDF)</a></li>
      </ul></div>
    </div>
    <div class="footer-bottom"><p>© <span data-year>${YEAR}</span> Viren Sompura</p><p>Designed and engineered in-house · Hosted on GitHub Pages</p></div>
  </div>
</footer>`;
}

const DEFAULT_IMAGE = { src: site.ogImage, w: 1200, h: 630, alt: `${site.name} — ${site.role}` };

function layout({ out, title, description, active, body, absolute = false, jsonLd = null, image = DEFAULT_IMAGE, type = 'website', published = null, noindex = false }) {
  const c = ctx(out, absolute);
  const urlPath = out.replace(/index\.html$/, '');
  const canonical = `${site.url}/${urlPath}`;
  const suffixed = `${title} · ${site.name}`;
  const fullTitle = title === site.name ? site.homeTitle : suffixed.length > 65 ? title : suffixed;
  const ld = jsonLd && (Array.isArray(jsonLd) ? { '@context': 'https://schema.org', '@graph': jsonLd } : { '@context': 'https://schema.org', ...jsonLd });
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${canonical}">`}
<meta name="author" content="${site.name}">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#F5F6F3">
<script>(function(d){d.classList.add('js');var t;try{t=localStorage.getItem('theme')}catch(e){}d.setAttribute('data-theme',t||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'))})(document.documentElement)</script>
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="${site.name}">
<meta property="og:locale" content="en_US">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${site.url}/${image.src}">
<meta property="og:image:width" content="${image.w}">
<meta property="og:image:height" content="${image.h}">
<meta property="og:image:alt" content="${esc(image.alt)}">
${published ? `<meta property="article:published_time" content="${published}">\n<meta property="article:author" content="${site.url}/about/">\n` : ''}<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@${site.links.x.split('/').pop()}">
<meta name="twitter:title" content="${esc(fullTitle)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${site.url}/${image.src}">
<meta name="twitter:image:alt" content="${esc(image.alt)}">
<link rel="icon" href="${c.u('assets/img/favicon.svg')}" type="image/svg+xml">
<link rel="apple-touch-icon" href="${c.u('assets/img/apple-touch-icon.png')}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&amp;display=swap">
<link rel="stylesheet" href="${c.u('style/style.css')}">
<script src="${c.u('js/site.js')}" defer></script>
${ld ? `<script type="application/ld+json">${JSON.stringify(ld)}</script>` : ''}
</head>
<body>
${header(c, active)}
<main id="main">
${body(c)}
</main>
${footer(c)}
</body>
</html>
`;
  const file = join(ROOT, out);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  if (!noindex) pages.push(urlPath);
}

// ─── components ──────────────────────────────────────────
function sectionHead({ eyebrow, title, lead, level = 2, action = '' }) {
  return `<div class="section-head reveal">
  <div>${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}<h${level} class="section-title">${esc(title)}</h${level}>${lead ? `<p class="section-lead">${esc(lead)}</p>` : ''}</div>${action}
</div>`;
}

function pageHead({ eyebrow, title, lead, crumbs = null, c }) {
  const bc = crumbs ? `<nav class="breadcrumb" aria-label="Breadcrumb"><ol>${crumbs.map(([l, h]) => (h ? `<li><a href="${c.u(h)}">${esc(l)}</a></li>` : `<li aria-current="page">${esc(l)}</li>`)).join('')}</ol></nav>` : '';
  return `<section class="page-head"><div class="container">${bc}<p class="eyebrow">${esc(eyebrow)}</p><h1 class="page-title">${esc(title)}</h1>${lead ? `<p class="page-lead">${esc(lead)}</p>` : ''}</div></section>`;
}

const status = (s) => `<span class="status status-${s.toLowerCase().replace(/\s+/g, '-')}">${esc(s)}</span>`;
const arrowLink = (c, href, label, cls = 'link-arrow') => `<a class="${cls}" href="${c.u(href)}"${linkAttrs(href)}>${esc(label)} ${ext(href) ? icons.external : icons.arrow}</a>`;

function media(c, image, { sizes = '(min-width: 900px) 50vw, 100vw', eager = false, cls = 'card-media', label = '', video = null } = {}) {
  if (!image) return `<div class="${cls} media-placeholder" aria-hidden="true"><span>${esc(label)}</span></div>`;
  const clip = video ? `<video class="media-video" data-autoplay muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"${image.pos ? ` style="object-position:${image.pos}"` : ''}><source src="${c.u(video)}" type="video/mp4"></video>` : '';
  return `<div class="${cls}"><img src="${c.u(image.src)}" width="${image.w}" height="${image.h}" alt="${esc(image.alt)}"${image.pos ? ` style="object-position:${image.pos}"` : ''} ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" sizes="${sizes}">${clip}</div>`;
}

const previewOf = (p) => (p.video ? `assets/videos/previews/${p.id}.mp4` : null);

function projectCard(c, p, { level = 3 } = {}) {
  const initials = p.title.split(/\s+/).filter((w) => /^[A-Z]/.test(w)).slice(0, 2).map((w) => w[0]).join('');
  return `<article class="project-card reveal" data-filter-item data-categories="${p.categories.join(' ')}">
  ${media(c, p.cover, { label: initials, video: previewOf(p) })}
  <div class="card-body">
    <p class="card-meta"><span>${esc(p.domain)}</span>${status(p.status)}</p>
    <h${level} class="card-title"><a class="stretched" href="${c.u(`work/${p.id}.html`)}">${esc(p.title)}</a></h${level}>
    <p class="card-text">${esc(p.short)}</p>
    <p class="card-tech">${p.tech.slice(0, 4).map(esc).join('<span aria-hidden="true"> · </span>')}</p>
    <span class="link-arrow" aria-hidden="true">View project ${icons.arrow}</span>
  </div>
</article>`;
}

function noteCard(c, n, { level = 3 } = {}) {
  return `<article class="note-card reveal" data-filter-item data-categories="${n.category}">
  <p class="card-meta"><span>${esc(C.noteCategories[n.category])}</span><span>${monthLabel(n.date)} · ${n.minutes} min read</span></p>
  <h${level} class="card-title"><a class="stretched" href="${c.u(`blog/${n.slug}.html`)}">${esc(n.title)}</a></h${level}>
  <p class="card-text">${esc(n.summary)}</p>
  <span class="link-arrow" aria-hidden="true">Read note ${icons.arrow}</span>
</article>`;
}

function labLinks(c, links) {
  return links.map((l) => {
    if (l.href) return arrowLink(c, l.href, l.label);
    if (l.note) return arrowLink(c, `blog/${l.note}.html`, `${l.label}: ${noteBySlug[l.note].title}`);
    if (l.project) return arrowLink(c, `work/${l.project}.html`, `${l.label}: ${projectById[l.project].title}`);
    return '';
  }).join('');
}

function labItem(c, e, { level = 3 } = {}) {
  return `<article class="lab-item reveal">
  <div class="lab-aside"><p class="lab-period">${esc(e.period)}</p>${status(e.status)}</div>
  <div class="lab-main">
    <h${level} class="lab-title">${esc(e.title)}</h${level}>
    <p>${esc(e.description)}</p>
    <ul class="tech-list" aria-label="Technologies">${e.tech.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
    ${e.links.length ? `<div class="lab-links">${labLinks(c, e.links)}</div>` : ''}
  </div>
</article>`;
}

function filters(group, entries) {
  const btns = [['all', 'All'], ...entries].map(([k, l], i) => `<button type="button" class="filter-btn" data-filter="${k}" aria-pressed="${i === 0}">${esc(l)}</button>`).join('');
  return `<div class="filters" data-filter-group="${group}" role="group" aria-label="Filter by category" hidden>${btns}</div><p class="sr-only" aria-live="polite" data-filter-status></p>`;
}

function archDiagram(layers, caption) {
  return `<figure class="arch">
  <ol class="arch-layers">${layers.map((l) => `<li class="arch-layer"><span class="arch-label">${esc(l.name)}</span><ul class="arch-items">${l.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></li>`).join('')}</ol>
  <figcaption>${esc(caption)}</figcaption>
</figure>`;
}

function contactCta(c) {
  return `<section class="section cta-section"><div class="container cta reveal">
  <div>
    <p class="eyebrow">Contact</p>
    <h2 class="section-title">Have an interesting robotics challenge?</h2>
    <p class="section-lead">Let’s connect and build something meaningful.</p>
  </div>
  <div class="cta-actions">
    <a class="btn btn-primary" href="mailto:${site.email}">${esc(site.email)}</a>
    <div class="cta-links">
      <a href="${site.links.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn ${icons.external}</a>
      <a href="${site.links.github}" target="_blank" rel="noopener noreferrer">GitHub ${icons.external}</a>
      <a href="${c.u(site.resume)}" target="_blank" rel="noopener">Resume ${icons.external}</a>
    </div>
  </div>
</div></section>`;
}

function timeline(c, items, { compact = false, level = 3 } = {}) {
  return `<ol class="timeline${compact ? ' timeline-compact' : ''}">${items.map((e) => `<li class="timeline-item reveal">
  <p class="timeline-period">${esc(e.period)}</p>
  <div class="timeline-body">
    <h${level} class="timeline-role">${esc(e.role)}</h${level}>
    <p class="timeline-org">${esc(e.org)}${e.location ? ` <span>· ${esc(e.location)}</span>` : ''}</p>
    ${compact ? '' : `<p class="timeline-summary">${esc(e.summary)}</p>
    ${e.points.length ? `<ul class="bullets">${e.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}
    <ul class="tech-list" aria-label="Technologies">${e.tech.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
    ${e.projects.length ? `<p class="timeline-projects"><span>Related projects:</span> ${e.projects.map((id) => `<a href="${c.u(`work/${id}.html`)}">${esc(projectById[id].title)}</a>`).join(', ')}</p>` : ''}`}
  </div>
</li>`).join('')}</ol>`;
}

// ─── notes: load bodies, compute reading time ────────────
for (const n of C.notes) {
  n.body = readFileSync(join(ROOT, 'content/notes', `${n.slug}.html`), 'utf8');
  const words = n.body.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  n.minutes = Math.max(1, Math.round(words / 200));
}
const notesSorted = [...C.notes].sort((a, b) => b.date.localeCompare(a.date));

// ─── HOME ────────────────────────────────────────────────
const personLd = {
  '@type': 'Person',
  '@id': `${site.url}/#person`,
  name: site.name,
  jobTitle: site.role,
  url: `${site.url}/`,
  email: `mailto:${site.email}`,
  image: `${site.url}/${site.portrait.src}`,
  sameAs: [site.links.linkedin, site.links.github, site.links.x],
  worksFor: { '@type': 'Organization', name: C.experience[0].org },
  alumniOf: C.education.map((e) => ({ '@type': 'CollegeOrUniversity', name: e.org })),
  knowsAbout: ['Robotics', 'ROS 2', 'Autonomous navigation', 'SLAM', 'Embedded systems', 'Sensor fusion'],
};
const websiteLd = { '@type': 'WebSite', '@id': `${site.url}/#website`, url: `${site.url}/`, name: site.name, description: site.description, inLanguage: 'en', publisher: { '@id': `${site.url}/#person` } };
const crumbsLd = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: [['Home', ''], ...items].map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${site.url}/${path}` })),
});

layout({
  out: 'index.html',
  title: site.name,
  description: site.description,
  active: 'home',
  jsonLd: [personLd, websiteLd],
  body: (c) => {
    const [lead, rest] = site.tagline.split(/,\s*/);
    return `
<section class="hero">
  <div class="container hero-grid">
    <div class="hero-copy">
      <p class="eyebrow">${esc(site.role)}</p>
      <h1 class="hero-title">${esc(lead)}, <span class="text-gradient">${esc(rest)}</span></h1>
      <p class="hero-lead">${esc(site.intro)}</p>
      <div class="actions">
        <a class="btn btn-primary" href="${c.u('work/')}">Explore my work</a>
        <a class="btn btn-secondary" href="${c.u(site.resume)}" download>${icons.download} Download resume</a>
        <a class="link-arrow" href="${c.u('contact/')}">Get in touch ${icons.arrow}</a>
      </div>
    </div>
    <figure class="hero-media">
      <div class="hero-visual">
        ${media(c, site.hero.image, { eager: true, cls: 'hero-image', sizes: '(min-width: 900px) 480px, 100vw', video: site.hero.video })}
        <span class="hero-chip hero-chip-1" aria-hidden="true"><span class="live-dot"></span>ROS 2 · Nav2 · SLAM</span>
        <span class="hero-chip hero-chip-2" aria-hidden="true">Jetson Nano · Custom PCB</span>
      </div>
      <figcaption><a href="${c.u('work/curio.html')}">Curio</a> — museum guidance robot at the Kolkata Museum. Footage from the project video.</figcaption>
    </figure>
  </div>
</section>

<section class="snapshot" aria-label="Professional snapshot">
  <div class="container">
    <dl class="stats">
      <div class="stat"><dt>Robotics engineering</dt><dd>Since 2023</dd><p>Full-time roles at Vama Communications and Kion Group</p></div>
      <div class="stat"><dt>Documented projects</dt><dd>${C.projects.length}</dd><p>From museum robots to embedded drivers</p></div>
      <div class="stat"><dt>Education</dt><dd>M.Tech</dd><p>Robotics Engineering · CGPA 9.0</p></div>
      <div class="stat"><dt>Core domains</dt><dd>4</dd><p>Autonomy · Embedded · Simulation · Hardware</p></div>
    </dl>
  </div>
</section>

<section class="section">
  <div class="container">
    ${sectionHead({ eyebrow: 'Selected work', title: 'Engineering complete robotic systems', lead: 'A selection of robots and subsystems I have designed, integrated, and tested.', action: arrowLink(c, 'work/', 'All projects') })}
    <div class="project-grid">${C.featuredProjectIds.map((id) => projectCard(c, projectById[id])).join('')}</div>
  </div>
</section>

<section class="section section-dark">
  <div class="container">
    ${sectionHead({ eyebrow: 'Approach', title: 'Understanding the complete robotic system.', lead: 'A robot only works when hardware, embedded control, perception, decision-making, and physical execution work together. I approach every system as one connected loop.' })}
    <ol class="system reveal">${C.approach.map((s, i) => `<li class="system-step"><span class="system-index">${pad(i + 1)}</span><h3 class="system-name">${esc(s.name)}</h3><p>${esc(s.body)}</p><p class="system-examples">${esc(s.examples)}</p></li>`).join('')}</ol>
  </div>
</section>

<section class="section">
  <div class="container split">
    ${sectionHead({ eyebrow: 'Experience', title: 'Professional journey', lead: 'Robotics roles across R&D, warehouse automation, and industrial systems.', action: arrowLink(c, 'experience/', 'View professional journey') })}
    ${timeline(c, C.experience, { compact: true })}
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    ${sectionHead({ eyebrow: 'Engineering Lab', title: 'Currently exploring', lead: 'Experiments and work in progress — separate from completed projects.', action: arrowLink(c, 'lab/', 'Visit the lab') })}
    <div class="lab-list">${C.lab.slice(0, 3).map((e) => labItem(c, e)).join('')}</div>
  </div>
</section>

<section class="section">
  <div class="container">
    ${sectionHead({ eyebrow: 'Notes', title: 'Technical writing', lead: 'Practical notes on ROS 2, navigation, SLAM, simulation, and embedded robotics.', action: arrowLink(c, 'blog/', 'All notes') })}
    <div class="note-grid">${notesSorted.slice(0, 3).map((n) => noteCard(c, n)).join('')}</div>
  </div>
</section>
${contactCta(c)}`;
  },
});

// ─── WORK ────────────────────────────────────────────────
layout({
  out: 'work/index.html',
  title: 'Robotics Projects & Case Studies',
  description: 'Robotics projects by Viren Sompura: autonomous mobile robots, ROS 2 navigation, SLAM, embedded firmware, and robot hardware.',
  active: 'work',
  body: (c) => `
${pageHead({ c, eyebrow: 'Work', title: 'Projects and case studies', lead: 'Robots and subsystems I have built — with the architecture, hardware, software, and results behind them.' })}
<section class="section section-tight">
  <div class="container">
    ${filters('work', Object.entries(C.categories))}
    <div class="project-grid project-grid-3" data-filter-target="work">${C.projects.map((p) => projectCard(c, p, { level: 2 })).join('')}</div>
  </div>
</section>
${contactCta(c)}`,
});

// ─── CASE STUDIES ────────────────────────────────────────
C.projects.forEach((p, idx) => {
  const prev = C.projects[(idx - 1 + C.projects.length) % C.projects.length];
  const next = C.projects[(idx + 1) % C.projects.length];
  const sections = [];
  const add = (id, title, html) => html && sections.push({ id, title, html });

  add('overview', 'Project overview', `
    <p class="lead-text">${esc(p.overview)}</p>
    ${p.objective ? `<h3>Objective</h3><p>${esc(p.objective)}</p>` : ''}
    ${p.contributions.length ? `<h3>My contribution</h3><ul class="bullets">${p.contributions.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}`);
  add('problem', 'Problem statement', p.problem);
  add('architecture', 'System architecture', p.architecture.length ? archDiagram(p.architecture, 'Layered overview built only from documented components. Communication interfaces are shown where they are documented.') : '');
  add('hardware', 'Hardware architecture', p.hardware.length ? `<dl class="spec-list">${p.hardware.map((h) => `<div><dt>${esc(h.group)}</dt><dd>${h.items.map(esc).join(', ')}</dd></div>`).join('')}</dl>` : '');
  add('software', 'Software architecture', p.software.length ? `<ul class="tech-list tech-list-lg">${p.software.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>` : '');
  add('challenges', 'Engineering challenges', p.challenges.length ? `<div class="challenges">${p.challenges.map((ch) => `<article class="challenge"><h3>${esc(ch.title)}</h3><p>${esc(ch.body)}</p></article>`).join('')}</div>` : '');
  add('results', 'Validation and results', p.results.length ? `<ul class="bullets">${p.results.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>` : '');
  add('gallery', 'Gallery', p.gallery.length ? `<div class="gallery">${p.gallery.map((g) => `<figure><a href="${c0(g.src)}" aria-label="Open full image: ${esc(g.alt)}"><img src="${c0(g.src)}" width="${g.w}" height="${g.h}" alt="${esc(g.alt)}" loading="lazy" decoding="async"></a><figcaption>${esc(g.alt)}</figcaption></figure>`).join('')}</div>` : '');
  add('resources', 'Resources', p.resources.length ? `<ul class="resource-list">${p.resources.map((r) => `<li><a href="${r.href}" target="_blank" rel="noopener noreferrer"><span>${esc(r.label)}</span><span class="resource-note">${esc(r.note)} ${icons.external}</span></a></li>`).join('')}</ul>` : '');

  function c0(src) { return `../${src}`; }

  const meta = [['Status', status(p.status)], ['Domain', esc(p.domain)], p.context && ['Context', esc(p.context)], p.role && ['Role', esc(p.role)]].filter(Boolean);
  const hero = p.video
    ? `<figure class="case-media"><video controls data-autoplay preload="none" playsinline poster="../${p.video.poster}" width="${p.video.w}" height="${p.video.h}"><source src="../${p.video.src}" type="video/mp4">Your browser does not support embedded video. <a href="../${p.video.src}">Download the project video</a>.</video><figcaption>Project video — plays muted while in view. Use the controls for sound.</figcaption></figure>`
    : p.cover ? `<figure class="case-media">${media({ u: (x) => `../${x}` }, p.cover, { eager: true, cls: 'case-image' })}</figure>` : '';

  layout({
    out: `work/${p.id}.html`,
    title: p.title,
    description: p.short,
    active: 'work',
    type: 'article',
    image: p.cover ? { src: p.cover.src, w: p.cover.w, h: p.cover.h, alt: p.cover.alt } : DEFAULT_IMAGE,
    jsonLd: [
      crumbsLd([['Work', 'work/'], [p.title, `work/${p.id}.html`]]),
      { '@type': 'CreativeWork', name: p.title, description: p.short, url: `${site.url}/work/${p.id}.html`, ...(p.cover ? { image: `${site.url}/${p.cover.src}` } : {}), keywords: p.tech.join(', '), creator: { '@type': 'Person', name: site.name, url: `${site.url}/` } },
    ],
    body: (c) => `
<article class="case">
  <header class="case-head"><div class="container">
    <nav class="breadcrumb" aria-label="Breadcrumb"><ol><li><a href="${c.u('work/')}">Work</a></li><li aria-current="page">${esc(p.title)}</li></ol></nav>
    <p class="eyebrow">${esc(p.domain)}</p>
    <h1 class="page-title">${esc(p.title)}</h1>
    <p class="page-lead">${esc(p.short)}</p>
    <dl class="case-meta">${meta.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
    <ul class="tech-list" aria-label="Key technologies">${p.tech.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
  </div></header>
  ${hero ? `<div class="container">${hero}</div>` : ''}
  <div class="container case-layout">
    <nav class="case-toc" aria-label="On this page"><p class="case-toc-title">On this page</p><ol>${sections.map((s, i) => `<li><a href="#${s.id}"><span>${pad(i + 1)}</span>${esc(s.title)}</a></li>`).join('')}</ol></nav>
    <div class="case-content">
      ${sections.map((s, i) => `<section class="case-section" id="${s.id}" aria-labelledby="${s.id}-title"><h2 id="${s.id}-title"><span class="case-num">${pad(i + 1)}</span>${esc(s.title)}</h2>${s.html}</section>`).join('')}
    </div>
  </div>
  <nav class="container pager" aria-label="More projects">
    <a href="${c.u(`work/${prev.id}.html`)}" rel="prev"><span>Previous project</span>${esc(prev.title)}</a>
    <a href="${c.u(`work/${next.id}.html`)}" rel="next"><span>Next project</span>${esc(next.title)}</a>
  </nav>
</article>
${contactCta(c)}`,
  });
});

// ─── EXPERIENCE ──────────────────────────────────────────
layout({
  out: 'experience/index.html',
  title: 'Experience & Education',
  description: 'Professional experience and education of Viren Sompura, Robotics Engineer — Kion Group, Vama Communications, F.A.R., and Raicam Automotive.',
  active: 'experience',
  body: (c) => `
${pageHead({ c, eyebrow: 'Experience', title: 'Professional journey', lead: 'From automotive manufacturing to robotics R&D and industrial automation — building ownership across the full robotic system.' })}
<section class="section section-tight">
  <div class="container">
    <h2 class="sr-only">Professional experience</h2>
    ${timeline(c, C.experience)}
  </div>
</section>
<section class="section section-alt">
  <div class="container">
    ${sectionHead({ eyebrow: 'Education', title: 'Academic background' })}
    <div class="edu-grid">${C.education.map((e) => `<article class="edu-card reveal"><p class="timeline-period">${esc(e.period)}</p><h3>${esc(e.degree)}</h3><p class="timeline-org">${esc(e.org)} <span>· ${esc(e.location)}</span></p><p class="edu-detail">${esc(e.detail)}</p></article>`).join('')}</div>
    <h3 class="subhead">Certification</h3>
    <ul class="plain-list">${C.certifications.map((x) => `<li><strong>${esc(x.title)}</strong> — ${esc(x.org)}, ${esc(x.period)}</li>`).join('')}</ul>
    <div class="actions"><a class="btn btn-secondary" href="${c.u(site.resume)}" download>${icons.download} Download resume</a></div>
  </div>
</section>
${contactCta(c)}`,
});

// ─── ABOUT ───────────────────────────────────────────────
layout({
  out: 'about/index.html',
  title: 'About',
  description: 'About Viren Sompura — a Robotics Engineer building complete robotic systems across electronics, embedded control, sensors, software, and autonomous navigation.',
  active: 'about',
  body: (c) => `
${pageHead({ c, eyebrow: 'About', title: 'Building complete intelligent robotic systems' })}
<section class="section section-tight">
  <div class="container about-intro">
    <figure class="portrait">${media(c, site.portrait, { cls: 'portrait-image', sizes: '320px' })}</figure>
    <div class="prose-block">
      <h2 class="subhead-lg">Who I am</h2>
      <p class="lead-text">I am a Robotics Engineer interested in building complete intelligent robotic systems. My work involves understanding how electronics, embedded systems, control algorithms, sensors, software architecture, and autonomous navigation come together to create machines that operate in the real world.</p>
      <p>I hold an M.Tech in Robotics Engineering from M.S. Ramaiah University of Applied Sciences and a B.Tech in Mechatronics. I currently work as a Robotics Engineer at Kion Group. Before that, I led the hardware and software development of Curio, a museum guidance robot, at Vama Communications.</p>
      <div class="actions"><a class="btn btn-primary" href="${c.u('work/')}">See my work</a><a class="btn btn-secondary" href="${c.u(site.resume)}" download>${icons.download} Download resume</a></div>
    </div>
  </div>
</section>
<section class="section section-dark">
  <div class="container">
    ${sectionHead({ eyebrow: 'Engineering approach', title: 'Sense, perceive, decide, act.', lead: 'I work at the boundaries between subsystems, where most robot problems actually live.' })}
    <ol class="system reveal">${C.approach.map((s, i) => `<li class="system-step"><span class="system-index">${pad(i + 1)}</span><h3 class="system-name">${esc(s.name)}</h3><p>${esc(s.body)}</p></li>`).join('')}</ol>
  </div>
</section>
<section class="section">
  <div class="container split">
    ${sectionHead({ eyebrow: 'Interests', title: 'What I like to work on' })}
    <ul class="interest-list reveal">${C.interests.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
  </div>
</section>
<section class="section section-alt">
  <div class="container">
    ${sectionHead({ eyebrow: 'Capabilities', title: 'Technologies and domains', lead: 'Grouped by engineering discipline.' })}
    <div class="skill-grid">${C.skills.map((g) => `<article class="skill-group reveal"><h3>${esc(g.group)}</h3><ul>${g.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></article>`).join('')}</div>
  </div>
</section>
<section class="section">
  <div class="container split">
    ${sectionHead({ eyebrow: 'Education', title: 'Academic background' })}
    <ol class="timeline timeline-compact">${C.education.map((e) => `<li class="timeline-item reveal"><p class="timeline-period">${esc(e.period)}</p><div class="timeline-body"><h3 class="timeline-role">${esc(e.degree)}</h3><p class="timeline-org">${esc(e.org)} <span>· ${esc(e.detail)}</span></p></div></li>`).join('')}</ol>
  </div>
</section>
<section class="section section-alt">
  <div class="container split">
    ${sectionHead({ eyebrow: 'Professional journey', title: 'Where I have worked', action: arrowLink(c, 'experience/', 'Full experience') })}
    ${timeline(c, C.experience, { compact: true })}
  </div>
</section>
${contactCta(c)}`,
});

// ─── LAB ─────────────────────────────────────────────────
layout({
  out: 'lab/index.html',
  title: 'Engineering Lab',
  description: 'Engineering experiments and work in progress by Viren Sompura: ROS 2 simulation, micro-ROS, Isaac Sim, and sensor bring-up.',
  active: 'lab',
  body: (c) => `
${pageHead({ c, eyebrow: 'Engineering Lab', title: 'Experiments, prototypes, and explorations', lead: 'This is where I try new tools and ideas before they become projects. Entries are marked by status and are not presented as finished products.' })}
<section class="section section-tight">
  <div class="container">
    <ul class="status-legend" aria-label="Status legend">
      <li>${status('Exploring')} Learning and evaluating</li>
      <li>${status('In Progress')} Actively being built</li>
      <li>${status('Completed')} Finished experiment</li>
    </ul>
    <div class="lab-list">${C.lab.map((e) => labItem(c, e, { level: 2 })).join('')}</div>
  </div>
</section>
${contactCta(c)}`,
});

// ─── NOTES ───────────────────────────────────────────────
const usedCats = Object.entries(C.noteCategories).filter(([k]) => C.notes.some((n) => n.category === k));
layout({
  out: 'blog/index.html',
  title: 'ROS 2 & Robotics Notes',
  description: 'Technical notes by Viren Sompura on ROS 2, Nav2, SLAM, Isaac Sim, and micro-ROS.',
  active: 'notes',
  body: (c) => `
${pageHead({ c, eyebrow: 'Notes', title: 'Technical notes and tutorials', lead: 'Practical writing on robot software, navigation, simulation, and embedded systems.' })}
<section class="section section-tight">
  <div class="container">
    ${filters('notes', usedCats)}
    <div class="note-grid" data-filter-target="notes">${notesSorted.map((n) => noteCard(c, n, { level: 2 })).join('')}</div>
  </div>
</section>
${contactCta(c)}`,
});

notesSorted.forEach((n) => {
  const related = [...notesSorted.filter((o) => o !== n && o.category === n.category), ...notesSorted.filter((o) => o !== n && o.category !== n.category)].slice(0, 2);
  layout({
    out: `blog/${n.slug}.html`,
    title: n.title,
    description: n.summary,
    active: 'notes',
    type: 'article',
    published: n.date,
    jsonLd: [
      crumbsLd([['Notes', 'blog/'], [n.title, `blog/${n.slug}.html`]]),
      { '@type': 'TechArticle', headline: n.title, description: n.summary, datePublished: n.date, image: `${site.url}/${site.ogImage}`, mainEntityOfPage: `${site.url}/blog/${n.slug}.html`, author: { '@type': 'Person', name: site.name, url: `${site.url}/` } },
    ],
    body: (c) => `
<article class="article">
  <header class="article-head"><div class="container container-narrow">
    <nav class="breadcrumb" aria-label="Breadcrumb"><ol><li><a href="${c.u('blog/')}">Notes</a></li><li aria-current="page">${esc(n.title)}</li></ol></nav>
    <p class="eyebrow">${esc(C.noteCategories[n.category])}</p>
    <h1 class="page-title">${esc(n.title)}</h1>
    <p class="page-lead">${esc(n.summary)}</p>
    <p class="article-meta">By ${site.name} · <time datetime="${n.date}">${monthLabel(n.date)}</time> · ${n.minutes} min read</p>
  </div></header>
  <div class="container container-narrow prose">
${n.body}
  </div>
</article>
<section class="section section-alt">
  <div class="container">
    ${sectionHead({ eyebrow: 'Keep reading', title: 'Related notes', action: arrowLink(c, 'blog/', 'All notes') })}
    <div class="note-grid note-grid-2">${related.map((r) => noteCard(c, r)).join('')}</div>
  </div>
</section>`,
  });
});

// ─── CONTACT ─────────────────────────────────────────────
layout({
  out: 'contact/index.html',
  title: 'Contact',
  description: 'Contact Viren Sompura about robotics engineering roles, ROS 2 development, autonomous systems, and collaborations.',
  active: 'contact',
  body: (c) => `
${pageHead({ c, eyebrow: 'Contact', title: 'Have an interesting robotics challenge?', lead: 'I’m open to robotics engineering roles, ROS 2 development, and autonomous systems work, as well as select freelance projects and research collaborations.' })}
<section class="section section-tight">
  <div class="container contact-grid">
    <div>
      <h2 class="subhead">Reach me directly</h2>
      <ul class="contact-list">
        <li><span>Email</span><a href="mailto:${site.email}">${site.email}</a></li>
        <li><span>LinkedIn</span><a href="${site.links.linkedin}" target="_blank" rel="noopener noreferrer">linkedin.com/in/viren-sompura</a></li>
        <li><span>GitHub</span><a href="${site.links.github}" target="_blank" rel="noopener noreferrer">github.com/virensompura</a></li>
        <li><span>X</span><a href="${site.links.x}" target="_blank" rel="noopener noreferrer">@VirenSompura01</a></li>
        <li><span>Resume</span><a href="${c.u(site.resume)}" download>Download PDF</a></li>
      </ul>
      <p class="muted">Email is the most reliable way to reach me.</p>
    </div>
    <form class="contact-form" data-contact-form action="https://api.web3forms.com/submit" method="POST" novalidate>
      <h2 class="subhead">Send a message</h2>
      <input type="hidden" name="access_key" value="${site.web3formsKey}">
      <input type="hidden" name="from_name" value="Portfolio contact form">
      <input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
      <div class="field-row">
        <div class="field"><label for="f-name">Name</label><input id="f-name" name="name" type="text" autocomplete="name" required></div>
        <div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
      </div>
      <div class="field"><label for="f-subject">Subject</label><input id="f-subject" name="subject" type="text" value="Portfolio enquiry"></div>
      <div class="field"><label for="f-message">Message</label><textarea id="f-message" name="message" rows="6" required></textarea></div>
      <button class="btn btn-primary" type="submit">Send message</button>
      <p class="form-status" role="status" aria-live="polite" data-form-status></p>
    </form>
  </div>
</section>`,
});

// ─── 404 ─────────────────────────────────────────────────
layout({
  out: '404.html',
  absolute: true,
  noindex: true,
  title: 'Page not found',
  description: 'The page you were looking for does not exist.',
  active: '',
  body: (c) => `
<section class="page-head page-404"><div class="container">
  <p class="eyebrow">404</p>
  <h1 class="page-title">This page could not be found.</h1>
  <p class="page-lead">The link may be outdated or mistyped.</p>
  <div class="actions"><a class="btn btn-primary" href="${c.u('')}">Go to homepage</a><a class="btn btn-secondary" href="${c.u('work/')}">View work</a></div>
</div></section>`,
});

// ─── sitemap & robots ────────────────────────────────────
writeFileSync(join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${site.url}/${p}</loc><lastmod>${BUILD_DATE}</lastmod></url>`).join('\n')}
</urlset>
`);
writeFileSync(join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);

console.log(`Built ${pages.length + 1} pages.`);
