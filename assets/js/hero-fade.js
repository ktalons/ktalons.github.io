/*
 * hero-fade.js — splits the home hero into discrete lines so each can fade in
 * sequentially via CSS animation. Scoped to the homepage. Adds .hero-line to
 * the h1 and to each <br>-separated chunk of the h2.
 */
(function () {
  'use strict';

  // Home only
  var path = window.location.pathname;
  if (path !== '/' && path !== '/index.html') return;

  function tagHeroLines() {
    var about = document.querySelector('.centered .about');
    if (!about) return;

    var h1 = about.querySelector('h1');
    var h2 = about.querySelector('h2');
    if (!h1 || !h2) return;

    var lineIndex = 0;

    // Tag h1 as line 0
    h1.classList.add('hero-line');
    h1.style.setProperty('--line', lineIndex);
    lineIndex += 1;

    // Split h2 on <br> tags into separate spans, each tagged as a hero line
    var html = h2.innerHTML;
    var rawLines = html.split(/<br\s*\/?>/i)
      .map(function (s) { return s.trim(); })
      .filter(function (s) { return s.length > 0; });
    if (rawLines.length === 0) return;

    var newInner = rawLines.map(function (line) {
      var idx = lineIndex;
      lineIndex += 1;
      return '<span class="hero-line" style="--line:' + idx + ';">' + line + '</span>';
    }).join('');
    h2.innerHTML = newInner;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tagHeroLines);
  } else {
    tagHeroLines();
  }
})();
