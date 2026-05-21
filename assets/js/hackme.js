/*
 * hackme.js — easter-egg "H@ck m3 G@me" popup link
 * Scoped to the homepage only. Cycles a small floating link that fades in/out
 * at random positions every ~6 seconds. Pauses on hover/focus or when the tab
 * is hidden. Respects prefers-reduced-motion.
 */
(function () {
  'use strict';

  // Home only — bail on any other route
  var path = window.location.pathname;
  if (path !== '/' && path !== '/index.html') return;

  var LINK_TEXT = '🦉';
  var LINK_HREF = '/h4ck-m3/';
  // Faster cycle: ~2.4s total (was ~5.2s)
  var FADE_MS = 300;
  var VISIBLE_MS = 1800;
  var MIN_DIST_VW = 25;
  var MIN_DIST_VH = 25;
  // Safe zone (vw/vh) — keeps the popup off the nav, footer, and screen edges
  var TOP_MIN_VH = 12;
  var TOP_MAX_VH = 78;
  var LEFT_MIN_VW = 6;
  var LEFT_MAX_VW = 78;

  function createLink() {
    var a = document.createElement('a');
    a.className = 'hackme-popup';
    a.href = LINK_HREF;
    a.textContent = LINK_TEXT;
    a.setAttribute('aria-label', 'H@ck m3 G@me — easter egg challenge');
    a.setAttribute('role', 'button');
    a.setAttribute('title', 'H@ck m3 G@me');
    return a;
  }

  var lastTop = -100;
  var lastLeft = -100;

  function randInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  function reposition(el) {
    var top, left, attempts = 0;
    do {
      top = randInRange(TOP_MIN_VH, TOP_MAX_VH);
      left = randInRange(LEFT_MIN_VW, LEFT_MAX_VW);
      attempts++;
    } while (
      attempts < 8 &&
      Math.abs(top - lastTop) < MIN_DIST_VH &&
      Math.abs(left - lastLeft) < MIN_DIST_VW
    );
    lastTop = top;
    lastLeft = left;
    el.style.top = top + 'vh';
    el.style.left = left + 'vw';
  }

  function sleep(ms) {
    return new Promise(function (r) { setTimeout(r, ms); });
  }

  function fadeIn(el) {
    reposition(el);
    // Force layout so the opacity transition fires from the new position
    void el.offsetHeight;
    el.classList.add('visible');
    return sleep(FADE_MS);
  }

  function fadeOut(el) {
    el.classList.remove('visible');
    return sleep(FADE_MS);
  }

  function insertStaticLink() {
    var a = createLink();
    a.classList.add('visible');
    document.body.appendChild(a);
  }

  function init() {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      // Respect motion preference: pin a static link in the bottom-right corner.
      // CSS handles the positioning override via the media query.
      insertStaticLink();
      return;
    }

    var link = createLink();
    document.body.appendChild(link);

    var paused = false;
    var pause = function () { paused = true; };
    var resume = function () { paused = false; };
    link.addEventListener('mouseenter', pause);
    link.addEventListener('mouseleave', resume);
    link.addEventListener('focus', pause);
    link.addEventListener('blur', resume);
    document.addEventListener('visibilitychange', function () {
      paused = document.hidden;
    });

    (async function cycle() {
      // brief settle delay so it doesn't pop in immediately on page load
      await sleep(800);
      while (true) {
        // wait if paused before fading in
        while (paused) await sleep(300);
        await fadeIn(link);

        // remain visible for VISIBLE_MS, but extend the dwell whenever paused
        var elapsed = 0;
        while (elapsed < VISIBLE_MS) {
          if (paused) { await sleep(300); continue; }
          await sleep(200);
          elapsed += 200;
        }
        while (paused) await sleep(300);

        await fadeOut(link);
      }
    })();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
