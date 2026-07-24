/* ============================================================
   EXECO — site behaviour
   - bilingual IT/EN (inline dual-language, persisted)
   - injected header + footer (single source of truth)
   - mobile nav, sticky header, scroll reveal, contact form
   ============================================================ */
(function () {
  'use strict';

  var STORE_KEY = 'execo-lang';
  var DEFAULT_LANG = 'it';

  /* ---- brand mark (inline SVG monogram) ---- */
  var MARK =
    '<svg class="mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">' +
    '<rect x="4" y="5" width="24" height="4" rx="1" fill="currentColor"/>' +
    '<rect class="bar" x="4" y="14" width="17" height="4" rx="1" fill="#536782"/>' +
    '<rect x="4" y="23" width="24" height="4" rx="1" fill="currentColor"/>' +
    '</svg>';

  function arrow() {
    return '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  /* dual-language helper: t(it, en) */
  function t(it, en) {
    return '<span data-lang="it">' + it + '</span><span data-lang="en">' + en + '</span>';
  }

  /* ---- nav model ---- */
  var NAV = [
    { href: 'index.html',     it: 'Home',       en: 'Home' },
    { href: 'expertise.html', it: 'Competenze', en: 'Expertise' },
    { href: 'approach.html',  it: 'Metodo DBI', en: 'The DBI Method' },
    { href: 'insights.html',  it: 'Insights',   en: 'Insights' },
    { href: 'about.html',     it: 'Team',       en: 'Team' },
    { href: 'contact.html',   it: 'Contatti',   en: 'Contact' }
  ];

  function currentFile() {
    var p = location.pathname.split('/').pop();
    return (!p || p === '') ? 'index.html' : p;
  }

  /* ============================================================
     HEADER
     ============================================================ */
  function buildHeader() {
    var here = currentFile();
    var links = NAV.map(function (n) {
      var active = (n.href === here) ? ' aria-current="page"' : '';
      return '<a href="' + n.href + '"' + active + '>' + t(n.it, n.en) + '</a>';
    }).join('');

    return '' +
      '<div class="wrap header-inner">' +
        '<a class="brand" href="index.html" aria-label="EXECO — Executive Engineering Consulting">' +
          MARK +
          '<span class="word">EXECO</span>' +
          '<span class="tag">Executive Engineering Consulting</span>' +
        '</a>' +
        '<nav class="nav-main" aria-label="Primary">' + links + '</nav>' +
        '<div class="header-actions">' +
          '<div class="lang-toggle" role="group" aria-label="Language / Lingua">' +
            '<button type="button" data-setlang="it" lang="it">IT</button>' +
            '<button type="button" data-setlang="en" lang="en">EN</button>' +
          '</div>' +
          '<a class="btn btn-primary header-cta-desktop" href="contact.html">' +
            t('Prenota una call', 'Book a call') + arrow() +
          '</a>' +
          '<button class="nav-toggle" type="button" aria-label="Menu" aria-expanded="false"><span></span></button>' +
        '</div>' +
      '</div>';
  }

  /* ============================================================
     FOOTER
     ============================================================ */
  function buildFooter() {
    var year = String(new Date().getFullYear());
    return '' +
      '<div class="wrap">' +
        '<div class="footer-top">' +
          '<div class="footer-brand">' +
            '<span class="word">EXECO</span>' +
            '<p>' + t(
              'Executive Engineering Consulting. Strategia, organizzazione e trasformazione per imprese che vogliono smettere di pensare e iniziare a fare.',
              'Executive Engineering Consulting. Strategy, organisation and transformation for companies ready to stop thinking and start doing.'
            ) + '</p>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4>' + t('Naviga', 'Explore') + '</h4>' +
            '<a href="expertise.html">' + t('Competenze', 'Expertise') + '</a>' +
            '<a href="approach.html">' + t('Metodo DBI', 'The DBI Method') + '</a>' +
            '<a href="insights.html">' + t('Insights', 'Insights') + '</a>' +
            '<a href="about.html">' + t('Team', 'Team') + '</a>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4>' + t('Servizi', 'Services') + '</h4>' +
            '<a href="expertise.html">' + t('Strategia & Business Case', 'Strategy & Business Cases') + '</a>' +
            '<a href="expertise.html">' + t('Riorganizzazione', 'Re-organisation') + '</a>' +
            '<a href="expertise.html">' + t('Temporary Management', 'Temporary Management') + '</a>' +
            '<a href="expertise.html">' + t('Executive Coaching', 'Executive Coaching') + '</a>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4>' + t('Contatti', 'Contact') + '</h4>' +
            '<a href="mailto:guido.gumiero@gmail.com">guido.gumiero@gmail.com</a>' +
            '<a href="mailto:execo.consulting@pec.it">PEC · execo.consulting@pec.it</a>' +
            '<a href="tel:+393337779756">+39 333 777 9756</a>' +
            '<a href="#">Torino, Italia</a>' +
            '<a href="https://www.linkedin.com" target="_blank" rel="noopener">LinkedIn</a>' +
          '</div>' +
        '</div>' +
        '<div class="footer-bottom">' +
          '<span>© <span data-year-out>' + year + '</span> EXECO — Guido Gumiero. ' +
            t('Tutti i diritti riservati.', 'All rights reserved.') + '</span>' +
          '<span>P.IVA IT13102370015 · ' +
            '<a href="#">Privacy</a> · <a href="#">Cookie</a></span>' +
        '</div>' +
      '</div>';
  }

  /* ============================================================
     LANGUAGE
     ============================================================ */
  function getLang() {
    try { return localStorage.getItem(STORE_KEY) || DEFAULT_LANG; }
    catch (e) { return DEFAULT_LANG; }
  }
  function setLang(lang) {
    var root = document.documentElement;
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang);
    try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}
    var btns = document.querySelectorAll('[data-setlang]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute('aria-pressed', btns[i].getAttribute('data-setlang') === lang ? 'true' : 'false');
    }
  }

  /* ============================================================
     BEHAVIOUR
     ============================================================ */
  function initNavToggle() {
    var toggle = document.querySelector('.nav-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // close on nav link click (mobile)
    var links = document.querySelectorAll('.nav-main a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    }
  }

  function initStickyHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var onScroll = function () {
      if (window.scrollY > 12) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function initReveal() {
    var els = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window) ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      for (var i = 0; i < els.length; i++) els[i].classList.add('in');
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  function initLangButtons() {
    var btns = document.querySelectorAll('[data-setlang]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () {
        setLang(this.getAttribute('data-setlang'));
      });
    }
  }

  function initForm() {
    var form = document.querySelector('.form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      // basic native validation already applies via required attrs
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var status = form.querySelector('.form-status');
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.setAttribute('disabled', 'true'); }
      // No backend in a static build: compose a mailto so the message is not lost.
      var data = new FormData(form);
      var subject = encodeURIComponent('EXECO — ' + (data.get('subject') || 'Richiesta'));
      var body = encodeURIComponent(
        'Nome: ' + (data.get('name') || '') + '\n' +
        'Azienda: ' + (data.get('company') || '') + '\n' +
        'Email: ' + (data.get('email') || '') + '\n\n' +
        (data.get('message') || '')
      );
      if (status) { status.classList.add('ok'); status.focus && status.focus(); }
      window.setTimeout(function () {
        window.location.href = 'mailto:guido.gumiero@gmail.com?subject=' + subject + '&body=' + body;
        if (btn) btn.removeAttribute('disabled');
      }, 600);
    });
  }

  /* ============================================================
     BOOT
     ============================================================ */
  function boot() {
    var header = document.getElementById('site-header');
    var footer = document.getElementById('site-footer');
    if (header) header.innerHTML = buildHeader();
    if (footer) footer.innerHTML = buildFooter();

    setLang(getLang());
    initLangButtons();
    initNavToggle();
    initStickyHeader();
    initReveal();
    initForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
