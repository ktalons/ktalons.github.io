/*
 * hackme-menu.js — H@ck m3 G@me menu controller
 * Scope: /h4ck-m3/ only. Renders the challenge picker, tracks earned
 * difficulty badges in localStorage, launches individual games (which
 * register themselves on window.HackMeGame), and handles the back-to-menu
 * + badge-award lifecycle.
 *
 * Tiers (two games each — pass both for a full tier badge):
 *   - rookie       : "Rookie"          (Easy)
 *   - itPerson     : "Cyber Student"   (Medium) — internal key kept for back-compat
 *   - cyberNinja   : "Cyber Ninja"     (Hard)
 *
 * A game earns half the tier pill when the player scores >= 80%.
 * Both games in a tier filled = full pill (★). Tier progress is
 * derived from per-game earned states, not stored separately.
 * Badges persist in localStorage under "hackme.badges.v1".
 */
(function () {
  'use strict';

  var path = window.location.pathname;
  if (path !== '/h4ck-m3/' && path !== '/h4ck-m3/index.html') return;

  var STORAGE_KEY = 'hackme.badges.v1';
  var PASS_THRESHOLD = 0.80;

  var TIERS = {
    rookie:     { label: 'Rookie',        short: 'Rookie',        className: 'tier-rookie' },
    itPerson:   { label: 'Cyber Student', short: 'Cyber Student', className: 'tier-itperson' },
    cyberNinja: { label: 'Cyber Ninja',   short: 'Cyber Ninja',   className: 'tier-ninja' }
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
      available: true
    },
    {
      id: 'cipher',
      title: 'Cipher Decoder',
      blurb: 'Caesar, ROT13, Base64, Hex, URL encoding, Binary. Decode the message — first try blind, then with a hint.',
      tier: 'itPerson',
      available: true
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
    },
    {
      id: 'hash-id',
      title: 'Hash Identifier',
      blurb: 'A hash string flashes up. Pick the algorithm — MD5, SHA1, SHA256, NTLM, bcrypt. Format and length are the tells.',
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
      tiers: {},    // legacy field — tier progress is now derived from games
      games: {}     // { phishing: { bestPct: 100, earned: true }, ... }
    };
  }

  function saveBadges(b) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(b)); } catch (e) {}
  }

  // Tier progress is derived: count earned games per tier (0..gamesInTier).
  function tierProgress(badges) {
    var counts = { rookie: 0, itPerson: 0, cyberNinja: 0 };
    var totals = { rookie: 0, itPerson: 0, cyberNinja: 0 };
    GAMES.forEach(function (g) {
      totals[g.tier]++;
      if (badges.games[g.id] && badges.games[g.id].earned) counts[g.tier]++;
    });
    return { counts: counts, totals: totals };
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

    // Hall of Honor strip — tier pills fill in halves based on per-game progress
    var progress = tierProgress(badges);
    var honor = document.createElement('div');
    honor.className = 'hm-honor';
    var honorLabel = document.createElement('span');
    honorLabel.className = 'hm-honor-label';
    honorLabel.textContent = 'Tiers earned:';
    honor.appendChild(honorLabel);
    Object.keys(TIERS).forEach(function (tierKey) {
      var count = progress.counts[tierKey];
      var total = progress.totals[tierKey] || 0;
      var stateClass, glyph;
      if (total > 0 && count >= total) { stateClass = 'earned';      glyph = '★ '; }
      else if (count > 0)              { stateClass = 'half-earned'; glyph = '◐ '; }
      else                              { stateClass = 'locked';      glyph = '○ '; }
      var pill = document.createElement('span');
      pill.className = 'hm-tier ' + TIERS[tierKey].className + ' ' + stateClass;
      pill.textContent = glyph + TIERS[tierKey].short;
      honor.appendChild(pill);
    });
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
      var prevProgress = tierProgress(loadBadges()).counts[game.tier];
      awardForGame(id, scorePct);
      var nextProgress = tierProgress(loadBadges());
      var nextCount = nextProgress.counts[game.tier];
      var nextTotal = nextProgress.totals[game.tier];
      var passed = scorePct >= PASS_THRESHOLD * 100;
      var advanced = nextCount > prevProgress;
      var tierComplete = nextCount >= nextTotal;

      // Show a small inline result + award notice in the same host
      var notice = document.createElement('div');
      notice.className = 'hm-award' + (advanced && tierComplete ? ' hm-award-new' : '');

      if (passed) {
        var strong = document.createElement('strong');
        strong.textContent = TIERS[game.tier].label;
        if (advanced && tierComplete) {
          notice.appendChild(document.createTextNode('Tier complete: '));
          notice.appendChild(strong);
          notice.appendChild(document.createTextNode(' ★ — both games passed.'));
        } else if (advanced) {
          notice.appendChild(strong);
          notice.appendChild(document.createTextNode(' tier — half filled (' + nextCount + '/' + nextTotal + '). One more game to complete.'));
        } else {
          notice.appendChild(strong);
          notice.appendChild(document.createTextNode(' tier progress confirmed (' + nextCount + '/' + nextTotal + ').'));
        }
      } else {
        notice.textContent = 'Score not high enough for the badge yet. ' + Math.ceil(PASS_THRESHOLD * 100) + '% needed.';
      }
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
