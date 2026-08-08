/*
 * hash-id-game.js — E@st3r Egg Cyb3r Ski11 G@m3: Hash Identifier (Cyber Ninja tier)
 *
 * 10 rounds. Each round shows one hash string. Player picks the algorithm
 * from 4 options. Tells explain format/length/prefix giveaways.
 *
 * Score: 1 point per round, pass at 80% (8/10).
 *
 * Registers as window.HackMeGame['hash-id']. Pure DOM, CSP-safe.
 */
(function () {
  'use strict';

  var rounds = [
    {
      hash: '5d41402abc4b2a76b9719d911017c592',
      options: [
        { name: 'MD5', correct: true },
        { name: 'SHA1', correct: false },
        { name: 'NTLM', correct: false },
        { name: 'CRC32', correct: false }
      ],
      tells: [
        '32 hexadecimal characters with no prefix is the MD5 signature. 128 bits, 4 bits per hex char = 32 chars.',
        'NTLM is also 32 hex chars and is indistinguishable from MD5 by format alone — context (Windows SAM dump, hashcat mode 1000) is the only tell.',
        'MD5 is broken cryptographically (collisions trivial) but still used for non-security purposes like integrity checks. Hashcat mode 0.'
      ]
    },
    {
      hash: 'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
      options: [
        { name: 'SHA1', correct: true },
        { name: 'SHA256', correct: false },
        { name: 'RIPEMD-160', correct: false },
        { name: 'MD5', correct: false }
      ],
      tells: [
        '40 hexadecimal characters = 160 bits = SHA1. Same shape every time.',
        'RIPEMD-160 is also 160 bits (40 hex) but extremely rare outside Bitcoin internals — in practice if you see 40 hex chars, treat as SHA1 until proven otherwise.',
        'SHA1 is deprecated for security (Google SHAttered, 2017). Git still uses it for commit IDs. Hashcat mode 100.'
      ]
    },
    {
      hash: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
      options: [
        { name: 'SHA256', correct: true },
        { name: 'SHA512', correct: false },
        { name: 'SHA3-256', correct: false },
        { name: 'Whirlpool', correct: false }
      ],
      tells: [
        '64 hexadecimal characters = 256 bits = SHA256. Most common hash you will see in modern systems (TLS certs, code signing, blockchain).',
        'SHA512 is 128 hex chars (double the length). SHA3-256 has the same length as SHA2-256 but is virtually never emitted raw in practice.',
        'Hashcat mode 1400. SHA256 is the workhorse hash in 2026 — recognize it instantly.'
      ]
    },
    {
      hash: '9b74c9897bac770ffc029102a200c5de',
      options: [
        { name: 'NTLM', correct: true },
        { name: 'MD5', correct: false },
        { name: 'MD4', correct: false },
        { name: 'LM', correct: false }
      ],
      tells: [
        'NTLM is MD4 of the UTF-16-LE-encoded password. 32 hex chars — identical format to MD5. The tell is context: Windows credentials, SAM/NTDS.dit dumps, hashcat mode 1000.',
        'LM hashes are 32 hex chars in the same dump but always appear in pairs split at character 7, and end in aad3b435b51404eeaad3b435b51404ee if shorter than 14 chars.',
        'If you see hashes labeled "hash" in a Windows pen-test report and the format is 32 hex chars, default assumption is NTLM, not MD5.'
      ]
    },
    {
      hash: '$2b$12$KIXxPfnK3Q9zVtj7w7Z8oOZxQRzv6yE1u4N9w7QzB1RZxXxXxXxXq',
      options: [
        { name: 'bcrypt', correct: true },
        { name: 'scrypt', correct: false },
        { name: 'Argon2', correct: false },
        { name: 'MD5-crypt', correct: false }
      ],
      tells: [
        'Bcrypt prefix is $2a$, $2b$, or $2y$ followed by the cost factor ($12$ = 2^12 rounds) and a 22-char salt + 31-char hash. Total length always 60 characters.',
        'Cost factor is the security knob — each increment doubles the time. $12$ to $14$ is typical for 2026 web apps.',
        'Hashcat mode 3200. Bcrypt is intentionally slow, making brute force expensive. Recognize it by the $2[aby]$ prefix.'
      ]
    },
    {
      hash: '$1$abcdefgh$Aks1d7QV.MmDeFC92HnP01',
      options: [
        { name: 'MD5-crypt', correct: true },
        { name: 'bcrypt', correct: false },
        { name: 'SHA-512-crypt', correct: false },
        { name: 'DES-crypt', correct: false }
      ],
      tells: [
        '$1$ prefix = MD5-crypt, the legacy Linux /etc/shadow format. Format: $1$<salt>$<22-char-hash>.',
        'Other crypt(3) prefixes: $2$ family = bcrypt, $5$ = SHA-256-crypt, $6$ = SHA-512-crypt. DES-crypt has no $ prefix at all.',
        'MD5-crypt is considered weak in 2026 — modern distros default to $6$ (SHA-512-crypt) or $y$ (yescrypt). Hashcat mode 500.'
      ]
    },
    {
      hash: 'cbfdac6008f9cab4083784cbd1874f76618d2a97',
      options: [
        { name: 'SHA1', correct: true },
        { name: 'NTLM', correct: false },
        { name: 'RIPEMD-160', correct: false },
        { name: 'SHA256', correct: false }
      ],
      tells: [
        '40 hex characters again — pattern recognition. Same length as round 2 because the algorithm is the same.',
        'Repetition is the point: SHA1 is so common (git, TLS legacy, file integrity checks) that recognizing 40-hex on sight saves time.',
        'If a hash you see is 40 hex chars and the context is web/git/legacy crypto, it is almost certainly SHA1.'
      ]
    },
    {
      hash: '$6$wQ8VqVqVqVqVqV8N$Xqj7N3aB1cD3eF4gH5iJ6kL7mN8oP9qR0sT1uV2wX3yZ4aB5cD6eF7gH8iJ9kL0mN1oP2',
      options: [
        { name: 'SHA-512-crypt', correct: true },
        { name: 'bcrypt', correct: false },
        { name: 'Argon2', correct: false },
        { name: 'MD5-crypt', correct: false }
      ],
      tells: [
        '$6$ prefix = SHA-512-crypt, the default password hash on most modern Linux distros (/etc/shadow).',
        'Format: $6$<salt up to 16 chars>$<86-char hash>. Salt and hash separated by $ — total length around 106 chars.',
        'Hashcat mode 1800. Slower than MD5-crypt but faster than bcrypt for equivalent security. Increasingly being replaced by yescrypt ($y$).'
      ]
    },
    {
      hash: '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$RdescudvJCsgt3ub+b+dWRWJTmaaJObG',
      options: [
        { name: 'Argon2', correct: true },
        { name: 'bcrypt', correct: false },
        { name: 'scrypt', correct: false },
        { name: 'PBKDF2', correct: false }
      ],
      tells: [
        '$argon2i$, $argon2d$, or $argon2id$ prefix gives it away. Parameters follow: v=19 is version, m= memory cost (KiB), t= time cost (iterations), p= parallelism.',
        'Argon2 won the 2015 Password Hashing Competition. It is memory-hard, defeating GPU brute force more effectively than bcrypt.',
        '$argon2id$ is the recommended variant (combines i and d). New systems in 2026 should default to it. Hashcat mode 13700.'
      ]
    },
    {
      hash: '0xDEADBEEF',
      options: [
        { name: 'CRC32', correct: true },
        { name: 'MD5 (truncated)', correct: false },
        { name: 'Adler-32', correct: false },
        { name: 'FNV-32', correct: false }
      ],
      tells: [
        '8 hex characters = 32 bits. Far too short for any cryptographic hash. CRC32 is the most common 32-bit non-cryptographic hash (error detection, ZIP files, Ethernet frames).',
        'Adler-32 and FNV-32 are also 32-bit but rare in security contexts. CRC32 wins by ubiquity.',
        'The lesson: anything under 128 bits / 32 hex chars cannot be a cryptographic hash. Treat it as a checksum, not a fingerprint.'
      ]
    }
  ];

  var PASS_PCT = 80;
  var state = null;

  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); }
  function el(tag, className, text) {
    var n = document.createElement(tag);
    if (className) n.className = className;
    if (text != null) n.textContent = text;
    return n;
  }

  function copyToClipboard(text, btn) {
    var originalText = btn.textContent;
    function done() {
      btn.textContent = 'Copied!';
      btn.classList.add('hi-copy-done');
      setTimeout(function () {
        btn.textContent = originalText;
        btn.classList.remove('hi-copy-done');
      }, 1500);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () { legacyCopy(text); done(); });
    } else { legacyCopy(text); done(); }
  }
  function legacyCopy(text) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'absolute';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    } catch (e) { /* noop */ }
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

    var wrap = el('div', 'hash-id-game');
    var card = el('div', 'hi-card');

    var header = el('div', 'hi-header');
    var progress = el('div', 'hi-progress');
    progress.appendChild(document.createTextNode('Round '));
    progress.appendChild(el('strong', null, String(state.current + 1)));
    progress.appendChild(document.createTextNode(' of ' + rounds.length));
    var score = el('div', 'hi-score');
    score.appendChild(document.createTextNode('Score: '));
    score.appendChild(el('strong', null, String(state.score)));
    header.appendChild(progress);
    header.appendChild(score);
    card.appendChild(header);

    card.appendChild(el('div', 'hi-label', 'Hash:'));

    var hashRow = el('div', 'hi-hash-row');
    hashRow.appendChild(el('div', 'hi-hash', round.hash));
    var copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'hi-copy-btn';
    copyBtn.setAttribute('aria-label', 'Copy hash to clipboard');
    copyBtn.textContent = 'Copy';
    copyBtn.addEventListener('click', function () { copyToClipboard(round.hash, copyBtn); });
    hashRow.appendChild(copyBtn);
    card.appendChild(hashRow);

    card.appendChild(el('div', 'hi-label hi-options-label', 'Identify the algorithm:'));

    var optsBox = el('div', 'hi-options');
    round.options.forEach(function (opt, idx) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'hi-option-btn';
      btn.setAttribute('data-idx', String(idx));
      btn.textContent = opt.name;
      btn.addEventListener('click', function () { answer(idx); });
      optsBox.appendChild(btn);
    });
    card.appendChild(optsBox);

    wrap.appendChild(card);
    state.host.appendChild(wrap);
  }

  function answer(pickedIdx) {
    if (!state) return;
    var round = rounds[state.current];
    var correctIdx = round.options.findIndex(function (o) { return o.correct; });
    var correct = pickedIdx === correctIdx;
    if (correct) state.score++;
    showFeedback(correct, pickedIdx, correctIdx, round);
  }

  function showFeedback(correct, pickedIdx, correctIdx, round) {
    var card = state.host.querySelector('.hi-card');
    if (!card) return;
    var btns = card.querySelectorAll('.hi-option-btn');
    for (var i = 0; i < btns.length; i++) {
      btns[i].disabled = true;
      var idx = parseInt(btns[i].getAttribute('data-idx'), 10);
      if (idx === correctIdx) btns[i].classList.add('hi-option-correct');
      if (idx === pickedIdx && idx !== correctIdx) btns[i].classList.add('hi-option-wrong');
    }

    var feedback = el('div', 'hi-feedback ' + (correct ? 'correct' : 'incorrect'));
    feedback.setAttribute('role', 'status');
    feedback.setAttribute('aria-live', 'polite');

    var heading = el('div', 'hi-feedback-heading');
    heading.appendChild(el('span', 'hi-feedback-icon', correct ? '✓' : '✗'));
    heading.appendChild(el('span', 'hi-feedback-text',
      correct ? 'Correct. This is ' + round.options[correctIdx].name + '.'
              : 'Not quite. This is ' + round.options[correctIdx].name + '.'));
    feedback.appendChild(heading);

    var ul = el('ul', 'hi-tells');
    for (var j = 0; j < round.tells.length; j++) {
      ul.appendChild(el('li', null, round.tells[j]));
    }
    feedback.appendChild(ul);

    card.appendChild(feedback);

    var next = document.createElement('button');
    next.type = 'button';
    next.className = 'hi-btn hi-btn-next';
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

    var scoreStrong = card.querySelector('.hi-score strong');
    if (scoreStrong) scoreStrong.textContent = String(state.score);

    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function renderResults() {
    if (!state) return;
    clear(state.host);
    var pct = Math.round((state.score / rounds.length) * 100);
    var message;
    if (pct === 100) message = 'Perfect score. Hash format recognition is muscle memory.';
    else if (pct >= PASS_PCT) message = 'Strong. You can triage a hash dump at a glance.';
    else if (pct >= 60) message = 'Decent. Spend an hour with hashcat\'s --example-hashes flag.';
    else message = 'Worth another round. The hashcat wiki "example_hashes" page is the cheat sheet.';

    var wrap = el('div', 'hash-id-game');
    var card = el('div', 'hi-card hi-results');

    var scoreLine = el('div', 'hi-results-score');
    scoreLine.appendChild(el('strong', null, String(state.score)));
    scoreLine.appendChild(document.createTextNode(' / ' + rounds.length));
    card.appendChild(scoreLine);
    card.appendChild(el('div', 'hi-results-pct', pct + '%'));
    card.appendChild(el('div', 'hi-results-message', message));

    var replay = document.createElement('button');
    replay.type = 'button';
    replay.className = 'hi-btn hi-btn-replay';
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

    if (typeof state.onComplete === 'function') state.onComplete(pct);
  }

  window.HackMeGame = window.HackMeGame || {};
  window.HackMeGame['hash-id'] = { start: start, cleanup: cleanup };
})();
