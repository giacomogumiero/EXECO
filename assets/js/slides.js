/* ============================================================
   EXECO — presentation deck controller
   nav (keys / buttons / swipe) · progress · bilingual toggle
   ============================================================ */
(function () {
  'use strict';
  var STORE = 'execo-lang', DEFAULT = 'it';
  var slides = [], i = 0;

  function q(s, c) { return (c || document).querySelector(s); }
  function qa(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  /* ---- language ---- */
  function getLang() { try { return localStorage.getItem(STORE) || DEFAULT; } catch (e) { return DEFAULT; } }
  function setLang(l) {
    var r = document.documentElement;
    r.setAttribute('data-lang', l); r.setAttribute('lang', l);
    try { localStorage.setItem(STORE, l); } catch (e) {}
    qa('[data-setlang]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-setlang') === l ? 'true' : 'false');
    });
  }

  /* ---- navigation ---- */
  function show(n) {
    i = Math.max(0, Math.min(slides.length - 1, n));
    slides.forEach(function (s, k) { s.classList.toggle('active', k === i); });
    var dark = slides[i].classList.contains('ink');
    var ui = q('.deck-ui'), prog = q('.deck-progress'), body = document.body;
    if (ui) ui.classList.toggle('on-ink', dark);
    if (prog) prog.classList.toggle('on-ink', dark);
    body.classList.toggle('on-ink', dark);
    var cur = q('.deck-count .cur'); if (cur) cur.textContent = pad(i + 1);
    if (prog) prog.style.width = ((i) / (slides.length - 1) * 100) + '%';
    if (location.hash !== '#' + (i + 1)) history.replaceState(null, '', '#' + (i + 1));
    slides[i].scrollTop = 0;
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function next() { show(i + 1); }
  function prev() { show(i - 1); }

  function boot() {
    slides = qa('.slide');
    setLang(getLang());

    var tot = q('.deck-count .tot'); if (tot) tot.textContent = pad(slides.length);

    qa('[data-setlang]').forEach(function (b) {
      b.addEventListener('click', function () { setLang(this.getAttribute('data-setlang')); });
    });
    var nb = q('[data-next]'), pb = q('[data-prev]');
    if (nb) nb.addEventListener('click', next);
    if (pb) pb.addEventListener('click', prev);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prev(); }
      else if (e.key === 'Home') { show(0); }
      else if (e.key === 'End') { show(slides.length - 1); }
    });

    // touch swipe
    var x0 = null;
    document.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    document.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 55) { dx < 0 ? next() : prev(); }
      x0 = null;
    }, { passive: true });

    // click right/left third of screen to advance (ignoring UI/links)
    document.addEventListener('click', function (e) {
      if (e.target.closest('a,button,.deck-ui')) return;
      if (e.clientX > window.innerWidth * 0.6) next();
      else if (e.clientX < window.innerWidth * 0.4) prev();
    });

    var start = parseInt((location.hash || '').replace('#', ''), 10);
    show(isNaN(start) ? 0 : start - 1);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
