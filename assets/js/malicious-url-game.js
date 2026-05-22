/*
 * malicious-url-game.js — H@ck m3 G@me, round 2: Spot the Malicious URL
 *
 * Registers as window.HackMeGame['malicious-url'] with a start(host, onComplete)
 * function the menu controller calls. Six rounds; each round shows four URLs
 * around a brand-themed scenario, exactly one is malicious. Score reported back
 * via onComplete(pct). Pure client-side. CSP-safe (no inline scripts).
 *
 * Built with pure DOM (createElement + textContent) — no innerHTML.
 */
(function () {
  'use strict';

  var rounds = [
    {
      scenario: 'An email tells you to sign in to verify your Microsoft 365 account. Which link is malicious?',
      technique: 'Typosquat (zero-for-O)',
      urls: [
        { url: 'https://login.microsoftonline.com/', malicious: false },
        { url: 'https://account.microsoft.com/security', malicious: false },
        { url: 'https://login.live.com/', malicious: false },
        { url: 'https://login.micros0ft-online.com/', malicious: true }
      ],
      tells: [
        'The malicious URL replaces the letter "o" with a zero — "micros0ft". The actual registered domain is "micros0ft-online.com", owned by the attacker, nothing to do with Microsoft.',
        'The three legit URLs are real Microsoft properties: microsoftonline.com (enterprise SSO), microsoft.com (consumer accounts), live.com (Microsoft consumer identity).',
        'Always read URLs one character at a time around the brand name. Zero-for-O and capital-I-for-lowercase-l are the most common substitutions.'
      ]
    },
    {
      scenario: 'You are checking which link goes to your Bank of America account. Which one is the phishing site?',
      technique: 'Subdomain trick — brand appears, but registered domain is the bad one',
      urls: [
        { url: 'https://www.bankofamerica.com/', malicious: false },
        { url: 'https://secure.bankofamerica.com/login', malicious: false },
        { url: 'https://bankofamerica.com.secure-login.tk/', malicious: true },
        { url: 'https://promotions.bankofamerica.com/credit-cards', malicious: false }
      ],
      tells: [
        'The malicious URL is a subdomain trick: "bankofamerica.com" appears in the URL, but the actual registered domain is "secure-login.tk" — everything before that is just a subdomain the attacker created.',
        'Read URLs right-to-left to find the real domain. It is the last two labels before the path (ignoring known multi-part TLDs like .co.uk).',
        'The .tk TLD (Tokelau) is free to register and a common phishing host. Major US banks would never use it.'
      ]
    },
    {
      scenario: 'Pick the malicious link claiming to be one of Apple’s account pages.',
      technique: 'IDN homograph (Cyrillic а in place of Latin a)',
      urls: [
        { url: 'https://appleid.apple.com/', malicious: false },
        { url: 'https://support.apple.com/en-us/HT201355', malicious: false },
        { url: 'https://www.icloud.com/', malicious: false },
        { url: 'https://www.аpple.com/', malicious: true }
      ],
      tells: [
        'The malicious URL uses a Cyrillic "а" (U+0430) instead of a Latin "a" (U+0061). Visually identical in most fonts; computationally a completely different domain.',
        'This is an IDN homograph attack. Internationalized domain names allow non-Latin characters, which attackers abuse to clone brand names. Browsers sometimes show the punycode form (xn--pple-43d.com) for mixed-script domains, but not always.',
        'Apple’s real properties are apple.com, icloud.com, and me.com (legacy). Inspect the URL bar character-by-character on any login page.'
      ]
    },
    {
      scenario: 'Your inbox has four "PayPal" links. Which is the phishing attempt?',
      technique: 'Suspicious new TLD (.zip)',
      urls: [
        { url: 'https://www.paypal.com/signin', malicious: false },
        { url: 'https://paypal.zip/login', malicious: true },
        { url: 'https://www.paypal.com/us/webapps/mpp/security/security-protections', malicious: false },
        { url: 'https://www.paypal-community.com/', malicious: false }
      ],
      tells: [
        'The malicious URL uses the .zip TLD (released by Google in 2023). The brand "paypal" appears, but "paypal.zip" is owned by whoever registered it — not PayPal. PayPal does not use .zip.',
        '.zip is dangerous because users associate "zip" with file extensions, so a URL like "report.zip" can look like a download link. Attackers register brand.zip to confuse users.',
        'PayPal’s real properties live on paypal.com (and country variants like paypal.co.uk). The legit paypal-community.com is PayPal’s actual community forum. Treat any new TLD on a financial brand as suspicious until proven otherwise.'
      ]
    },
    {
      scenario: 'You get a text: "Your Amazon order needs attention." Which link is malicious?',
      technique: 'Third-party URL shortener hiding destination',
      urls: [
        { url: 'https://www.amazon.com/gp/your-account/order-history', malicious: false },
        { url: 'https://amzn.to/3xqp9Lk', malicious: false },
        { url: 'https://bit.ly/3xK9pQz', malicious: true },
        { url: 'https://www.amazon.com/orders', malicious: false }
      ],
      tells: [
        'The malicious URL uses bit.ly — a third-party URL shortener. The actual destination is hidden. Legitimate Amazon order notifications never use bit.ly.',
        'amzn.to IS legitimate — Amazon’s own short-link service. But even so, prefer typing amazon.com directly when handling an account.',
        'General rule: never click a shortened URL in an unsolicited message about an account you care about. If you must check, paste the short link into a URL expander (like checkshorturl.com) first, or navigate to the brand directly.'
      ]
    },
    {
      scenario: 'A coworker sends you a "Google Drive" link. Which is malicious?',
      technique: 'The @ trick — browser ignores everything before the @',
      urls: [
        { url: 'https://drive.google.com/file/d/1aBcDeFgHiJkLmN/view', malicious: false },
        { url: 'https://docs.google.com/document/d/1aBcD/edit', malicious: false },
        { url: 'https://drive.google.com@malicious-files.ru/share', malicious: true },
        { url: 'https://accounts.google.com/signin', malicious: false }
      ],
      tells: [
        'The malicious URL uses the @ symbol: everything BEFORE the @ in a URL is interpreted as a username, not a hostname. The browser ignores "drive.google.com" and actually connects to "malicious-files.ru". This is the userinfo subcomponent of a URL (RFC 3986).',
        'Modern browsers often strip or warn about this, but old browsers, link previews, and chat clients may not. Some phishing kits still rely on it.',
        'Hover any link before clicking and read the status bar. If you see "@" inside a URL that’s pretending to be a brand login, treat it as a confirmed phishing attempt.'
      ]
    }
  ];

  var state = null;

  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); }

  function el(tag, className, text) {
    var n = document.createElement(tag);
    if (className) n.className = className;
    if (text != null) n.textContent = text;
    return n;
  }

  function start(host, onComplete) {
    state = { host: host, onComplete: onComplete, current: 0, score: 0 };
    renderRound();
  }

  function cleanup() { state = null; }

  function renderRound() {
    if (!state) return;
    clear(state.host);

    var round = rounds[state.current];

    var wrap = el('div', 'malicious-url-game');
    var card = el('div', 'mu-card');

    var header = el('div', 'mu-header');
    var progress = el('div', 'mu-progress');
    progress.appendChild(document.createTextNode('Round '));
    progress.appendChild(el('strong', null, String(state.current + 1)));
    progress.appendChild(document.createTextNode(' of ' + rounds.length));
    var score = el('div', 'mu-score');
    score.appendChild(document.createTextNode('Score: '));
    score.appendChild(el('strong', null, String(state.score)));
    header.appendChild(progress);
    header.appendChild(score);
    card.appendChild(header);

    card.appendChild(el('div', 'mu-scenario', round.scenario));

    var urlsBox = el('div', 'mu-urls');
    round.urls.forEach(function (u, idx) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mu-url-btn';
      btn.setAttribute('data-idx', String(idx));
      btn.setAttribute('aria-label', 'Mark URL ' + (idx + 1) + ' as malicious');
      btn.appendChild(el('span', 'mu-url-marker', String(idx + 1)));
      btn.appendChild(el('span', 'mu-url-text', u.url));
      btn.addEventListener('click', function () { answer(idx); });
      urlsBox.appendChild(btn);
    });
    card.appendChild(urlsBox);

    wrap.appendChild(card);
    state.host.appendChild(wrap);
  }

  function answer(pickedIdx) {
    if (!state) return;
    var round = rounds[state.current];
    var maliciousIdx = round.urls.findIndex(function (u) { return u.malicious; });
    var correct = pickedIdx === maliciousIdx;
    if (correct) state.score++;
    showFeedback(correct, pickedIdx, maliciousIdx, round);
  }

  function showFeedback(correct, pickedIdx, maliciousIdx, round) {
    var card = state.host.querySelector('.mu-card');
    if (!card) return;

    var btns = card.querySelectorAll('.mu-url-btn');
    for (var i = 0; i < btns.length; i++) {
      btns[i].disabled = true;
      var idx = parseInt(btns[i].getAttribute('data-idx'), 10);
      if (idx === maliciousIdx) btns[i].classList.add('mu-url-malicious');
      if (idx === pickedIdx && idx !== maliciousIdx) btns[i].classList.add('mu-url-picked-wrong');
    }

    var feedback = el('div', 'mu-feedback ' + (correct ? 'correct' : 'incorrect'));
    feedback.setAttribute('role', 'status');
    feedback.setAttribute('aria-live', 'polite');

    var heading = el('div', 'mu-feedback-heading');
    heading.appendChild(el('span', 'mu-feedback-icon', correct ? '✓' : '✗'));
    heading.appendChild(el('span', 'mu-feedback-text',
      correct
        ? 'Correct. URL #' + (maliciousIdx + 1) + ' was the malicious one.'
        : 'Not quite. URL #' + (maliciousIdx + 1) + ' was the malicious one.'));
    feedback.appendChild(heading);

    var tech = el('div', 'mu-technique');
    tech.appendChild(el('strong', null, 'Technique: '));
    tech.appendChild(document.createTextNode(round.technique));
    feedback.appendChild(tech);

    var ul = el('ul', 'mu-tells');
    for (var j = 0; j < round.tells.length; j++) {
      ul.appendChild(el('li', null, round.tells[j]));
    }
    feedback.appendChild(ul);

    card.appendChild(feedback);

    var next = document.createElement('button');
    next.type = 'button';
    next.className = 'mu-btn mu-btn-next';
    next.textContent = state.current < rounds.length - 1 ? 'Next →' : 'See results';
    next.addEventListener('click', function () {
      state.current++;
      if (state.current < rounds.length) {
        renderRound();
        state.host.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        renderResults();
      }
    });
    card.appendChild(next);

    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function renderResults() {
    if (!state) return;
    clear(state.host);

    var pct = Math.round((state.score / rounds.length) * 100);
    var message;
    if (pct === 100) message = 'Perfect score. URLs do not get past you.';
    else if (pct >= 80) message = 'Strong. You’d catch most of these in the wild.';
    else if (pct >= 60) message = 'Decent. A few sneaky ones got past.';
    else message = 'Worth another round. URL inspection is a habit, not a trick.';

    var wrap = el('div', 'malicious-url-game');
    var card = el('div', 'mu-card mu-results');

    var scoreLine = el('div', 'mu-results-score');
    scoreLine.appendChild(el('strong', null, String(state.score)));
    scoreLine.appendChild(document.createTextNode(' / ' + rounds.length));
    card.appendChild(scoreLine);

    card.appendChild(el('div', 'mu-results-pct', pct + '%'));
    card.appendChild(el('div', 'mu-results-message', message));

    var replay = document.createElement('button');
    replay.type = 'button';
    replay.className = 'mu-btn mu-btn-replay';
    replay.textContent = 'Try again';
    replay.addEventListener('click', function () {
      state.current = 0;
      state.score = 0;
      renderRound();
      state.host.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    card.appendChild(replay);

    wrap.appendChild(card);
    state.host.appendChild(wrap);

    if (typeof state.onComplete === 'function') {
      state.onComplete(pct);
    }
  }

  window.HackMeGame = window.HackMeGame || {};
  window.HackMeGame['malicious-url'] = {
    start: start,
    cleanup: cleanup
  };
})();
