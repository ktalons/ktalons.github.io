/*
 * hero-fade.js — splits the home hero into discrete lines so each can fade in
 * sequentially via CSS animation. Scoped to the homepage. Adds .hero-line to
 * the h1 and to each <br>-separated chunk of the h2.
 *
 * Pure-DOM implementation: walks h2.childNodes and uses textContent + createElement.
 * No innerHTML reads or writes — safe even if upstream content ever contains
 * special characters.
 */
(function () {
  'use strict';

  // Home only
  var path = window.location.pathname;
  if (path !== '/' && path !== '/index.html') return;

  function extractLines(h2) {
    // The theme renders h2 as text<br>text<br>text. Walk childNodes and group
    // text nodes between <br> boundaries into separate line strings.
    var lines = [];
    var current = '';
    var nodes = h2.childNodes;
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (n.nodeType === Node.ELEMENT_NODE && n.nodeName === 'BR') {
        if (current.trim()) lines.push(current.trim());
        current = '';
      } else {
        // Text nodes (most common) and any other elements (unlikely) — take their text
        current += (n.textContent || '');
      }
    }
    if (current.trim()) lines.push(current.trim());
    return lines;
  }

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

    var lines = extractLines(h2);
    if (lines.length === 0) return;

    // Build new children with createElement + textContent (safe from HTML injection)
    var spans = lines.map(function (line) {
      var span = document.createElement('span');
      span.className = 'hero-line';
      span.style.setProperty('--line', lineIndex);
      span.textContent = line;
      lineIndex += 1;
      return span;
    });

    // Replace h2 contents in one call (modern browsers)
    if (typeof h2.replaceChildren === 'function') {
      h2.replaceChildren.apply(h2, spans);
    } else {
      // Legacy fallback
      while (h2.firstChild) h2.removeChild(h2.firstChild);
      spans.forEach(function (s) { h2.appendChild(s); });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tagHeroLines);
  } else {
    tagHeroLines();
  }
})();
