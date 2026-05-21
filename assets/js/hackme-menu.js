/*
 * hackme-menu.js — H@ck m3 G@me menu controller
 * Scope: /h4ck-m3/ only. Renders the challenge picker, tracks earned
 * difficulty badges in localStorage, launches individual games (which
 * register themselves on window.HackMeGame), and handles the back-to-menu
 * + badge-award lifecycle.
 *
 * Tiers:
 *   - rookie       : "Rookie"                       (Easy)
 *   - itPerson     : "I'm the family's IT person"   (Medium)
 *   - cyberNinja   : "Cyber Ninja"                  (Hard)
 *
 * A game earns its tier badge when the player scores >= 80%.
 * Badges persist in localStorage under "hackme.badges.v1".
 */
(function () {
  'use strict';

  var path = window.location.pathname;
  if (path !== '/h4ck-m3/' && path !== '/h4ck-m3/index.html') return;

  var STORAGE_KEY = 'hackme.badges.v1';
  var PASS_THRESHOLD = 0.80;

  var TIERS = {
    rookie:     { label: 'Rookie',                       short: 'Rookie',   className: 'tier-rookie' },
    itPerson:   { label: "I'm the family's IT person",   short: 'IT person', className: 'tier-itperson' },
    cyberNinja: { label: 'Cyber Ninja',                  short: 'Cyber Ninja', className: 'tier-ninja' }
  };

  // The 5 challenge cards. Order = display order on the menu.
  var GAMES = [
    {
      id: 'phishing',
      title: 'Phishing or Legit',
      blurb: 'Six emails. Pick the phishing attempts and see the tells either way.',
      tier: 'rookie',
      available: true
    },
    {
      id: 'malicious-url',
      title: 'Spot the Malicious URL',
      blurb: 'Four URLs at a time. Click the sketchy one. IDN homographs, typosquats, suspicious TLDs.',
      tier: 'rookie',
      available: false
    },
    {
      id: 'cipher',
      title: 'Cipher Decoder',
      blurb: 'Caesar, ROT13, Base64. Decode short messages under a timer.',
      tier: 'itPerson',
      available: false
    },
    {
      id: 'mitre',
      title: 'MITRE ATT&CK Match',
      blurb: 'Read attacker behavior in plain English. Pick the right ATT&CK technique.',
      tier: 'itPerson',
      available: false
    },
    {
      id: 'ioc',
      title: 'Find the IOC',
      blurb: 'Read a log snippet. Click the indicator-of-compromise. Hover to learn why.',
      tier: 'cyberNinja',
      available: false
    }
  ];

  function loadBadges() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultBadges();
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return defaultBadges();
      return Object.assign(defaultBadges(), parsed);
    } catch (e) {
      return defaultBadges();
    }
  }

  function defaultBadges() {
    return {
      tiers: { rookie: false, itPerson: false, cyberNinja: false },
      games: {}     // { phishing: { bestPct: 100, earned: true }, ... }
    };
  }

  function saveBadges(b) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(b)); } catch (e) {}
  }

  function awardForGame(gameId, scorePct) {
    var b = loadBadges();
    var game = GAMES.find(function (g) { return g.id === gameId; });
    if (!game) return b;

    var prev = b.games[gameId] || { bestPct: 0, earned: false };
    var bestPct = Math.max(prev.bestPct || 0, scorePct);
    var earnedNow = scorePct >= PASS_THRESHOLD * 100;
    var earnedEver = prev.earned || earnedNow;
    b.games[gameId] = { bestPct: bestPct, earned: earnedEver };

    if (earnedNow) b.tiers[game.tier] = true;

    saveBadges(b);
    return b;
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function clear(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  function $root() {
    return document.getElementById('hackme-menu');
  }

  function renderMenu() {
    var root = $root();
    if (!root) return;
    clear(root);
    var badges = loadBadges();

    // Hall of Honor strip
    var honor = document.createElement('div');
    honor.className = 'hm-honor';
    honor.innerHTML =
      '<span class="hm-honor-label">Tiers earned:</span>' +
      Object.keys(TIERS).map(function (tierKey) {
        var earned = badges.tiers[tierKey];
        return '<span class="hm-tier ' + TIERS[tierKey].className +
               (earned ? ' earned' : ' locked') + '">' +
               (earned ? '★ ' : '○ ') +
               escapeHtml(TIERS[tierKey].short) +
               '</span>';
      }).join('');
    root.appendChild(honor);

    // Card grid
    var grid = document.createElement('div');
    grid.className = 'hm-grid';

    GAMES.forEach(function (game) {
      var card = document.createElement('div');
      card.className = 'hm-card' +
        (game.available ? '' : ' hm-card-coming') +
        (badges.games[game.id] && badges.games[game.id].earned ? ' hm-card-earned' : '');

      var tier = TIERS[game.tier];
      var gameState = badges.games[game.id] || {};

      var inner =
        '<div class="hm-card-tier hm-tier ' + tier.className + '">' +
          escapeHtml(tier.short) +
        '</div>' +
        '<h3 class="hm-card-title">' + escapeHtml(game.title) + '</h3>' +
        '<p class="hm-card-blurb">' + escapeHtml(game.blurb) + '</p>';

      if (game.available) {
        var label = gameState.earned
          ? 'Play again ★'
          : (gameState.bestPct ? 'Try again (best: ' + gameState.bestPct + '%)' : 'Start challenge →');
        inner += '<button type="button" class="hm-card-btn" data-game="' + escapeHtml(game.id) + '" aria-label="Launch ' + escapeHtml(game.title) + '">' + escapeHtml(label) + '</button>';
      } else {
        inner += '<div class="hm-card-coming-pill">Coming soon</div>';
      }

      card.innerHTML = inner;
      grid.appendChild(card);
    });

    root.appendChild(grid);

    // Wire up launch buttons
    var btns = grid.querySelectorAll('.hm-card-btn');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function (e) {
        var id = e.currentTarget.getAttribute('data-game');
        launchGame(id);
      });
    }
  }

  function launchGame(id) {
    var root = $root();
    if (!root) return;
    var game = GAMES.find(function (g) { return g.id === id; });
    if (!game || !game.available) return;
    if (!window.HackMeGame || typeof window.HackMeGame[id] !== 'object' ||
        typeof window.HackMeGame[id].start !== 'function') {
      console.warn('HackMeGame.' + id + '.start not registered');
      return;
    }

    clear(root);

    // Back-to-menu strip
    var stripe = document.createElement('div');
    stripe.className = 'hm-game-stripe';
    stripe.innerHTML =
      '<button type="button" class="hm-back-btn" id="hm-back-btn">← Menu</button>' +
      '<span class="hm-game-stripe-title">' + escapeHtml(game.title) + '</span>' +
      '<span class="hm-tier ' + TIERS[game.tier].className + '">' + escapeHtml(TIERS[game.tier].short) + '</span>';
    root.appendChild(stripe);

    // Game host
    var host = document.createElement('div');
    host.id = 'hm-game-host';
    host.className = 'hm-game-host';
    root.appendChild(host);

    document.getElementById('hm-back-btn').addEventListener('click', function () {
      window.HackMeGame[id].cleanup && window.HackMeGame[id].cleanup();
      renderMenu();
      root.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Hand off to the game
    window.HackMeGame[id].start(host, function (scorePct) {
      // onComplete callback receives final score percentage
      var prev = loadBadges().tiers[game.tier];
      awardForGame(id, scorePct);
      var after = loadBadges();
      var newlyEarned = !prev && after.tiers[game.tier];

      // Show a small inline result + award notice in the same host
      var notice = document.createElement('div');
      notice.className = 'hm-award' + (newlyEarned ? ' hm-award-new' : '');
      var msg = '';
      if (scorePct >= PASS_THRESHOLD * 100) {
        msg = newlyEarned
          ? 'Tier unlocked: <strong>' + escapeHtml(TIERS[game.tier].label) + '</strong> ★'
          : '<strong>' + escapeHtml(TIERS[game.tier].label) + '</strong> tier confirmed.';
      } else {
        msg = 'Score not high enough for the badge yet. ' + Math.ceil(PASS_THRESHOLD * 100) + '% needed.';
      }
      notice.innerHTML = msg;
      host.appendChild(notice);
      // (Back-to-menu button lives in the persistent stripe at the top of the game view)
    });

    root.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Public API for games to register themselves
  window.HackMeGame = window.HackMeGame || {};

  function boot() {
    if (!$root()) return;
    renderMenu();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
