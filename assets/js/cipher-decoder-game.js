/*
 * cipher-decoder-game.js — H@ck m3 G@me, round 3: Cipher Decoder
 *
 * IT-person tier. Six rounds, each presents an encoded message and asks the
 * player to type the decoded plaintext. First attempt is blind (no cipher
 * hint shown). A wrong answer reveals the cipher type and allows a second
 * attempt. Two-tries cap then the answer is revealed.
 *
 * Scoring (12-point scale): 2 pts first-try correct, 1 pt second-try correct,
 * 0 pts fail/reveal. Pass threshold = 80% = 10 of 12.
 *
 * Validation: case-insensitive, whitespace-collapsed, smart-quote normalized.
 *
 * Registers as window.HackMeGame.cipher. Pure DOM (createElement +
 * textContent), CSP-safe, no innerHTML.
 */
(function () {
  'use strict';

  var rounds = [
    {
      encoded: 'WKH SDVVZRUG LV VHFXULWB',
      answer: 'THE PASSWORD IS SECURITY',
      cipher: 'Caesar cipher, shift 3',
      hint: 'Each letter is shifted 3 positions forward in the alphabet (W→T, K→H, H→E). Shift each letter 3 positions BACKWARD to decode.',
      tells: [
        'Caesar shift 3 is the original Roman military cipher — Julius Caesar used it for personal correspondence.',
        '25 possible shifts make brute force trivial. Letter frequency analysis (E is the most common English letter) breaks it instantly.',
        'Decode in shell: tr "A-Z" "X-ZA-W" (rotates letters 3 backward). Or paste into any online Caesar cipher tool.'
      ]
    },
    {
      encoded: 'JRYPBZR NANYLFG',
      answer: 'WELCOME ANALYST',
      cipher: 'ROT13 (Caesar shift 13)',
      hint: 'ROT13 shifts every letter 13 positions. Special property: applying ROT13 twice returns the original — so the same algorithm encodes AND decodes.',
      tells: [
        'ROT13 is a Caesar shift of 13. Half the alphabet, self-inverse — applying it twice gives you back the original text.',
        'Common in Usenet, Reddit, and forums to hide spoilers and joke punchlines. Pure obfuscation, not encryption.',
        'Decode in shell: tr "A-Za-z" "N-ZA-Mn-za-m"  — or recognize that any text with a strange but pronounceable look (no numbers, all letters preserved) is likely ROT13.'
      ]
    },
    {
      encoded: 'U0VOSU9SIFNPQyBBTkFMWVNU',
      answer: 'SENIOR SOC ANALYST',
      cipher: 'Base64 encoding',
      hint: 'Base64 uses A–Z, a–z, 0–9, +, /, and trailing = for padding. Output length is roughly 4/3 the input. Decode in shell: echo "U0VOSU9SIFNPQyBBTkFMWVNU" | base64 -d',
      tells: [
        'Base64 encodes binary data as 64 printable ASCII characters. Not encryption — anyone can decode it.',
        'You will see it constantly in SOC work: HTTP basic auth, JWT tokens (Base64URL variant), email attachments, malware C2 payloads, smuggled binary in text fields.',
        'Recognize it by the alphabet (A–Z, a–z, 0–9, +, /) and the trailing = or == padding when the input length is not a multiple of 3.'
      ]
    },
    {
      encoded: '4C 4F 47 47 45 44 20 4F 55 54',
      answer: 'LOGGED OUT',
      cipher: 'Hex (ASCII bytes)',
      hint: 'Each two-character hex pair (00–FF) is one byte. 0x4C = "L", 0x20 = space. Convert each pair to its ASCII character.',
      tells: [
        'Hex represents bytes as base-16 pairs. 0x41 = "A", 0x20 = space. You will see hex everywhere in security work.',
        'Decode in shell: echo "4C 4F 47 47 45 44 20 4F 55 54" | xxd -r -p   — or use CyberChef "From Hex" recipe.',
        'Common contexts: memory dumps, packet captures, shellcode, hash values, MAC addresses, malware analysis. Hex is the lingua franca of binary data.'
      ]
    },
    {
      encoded: 'GET%20%2Fadmin%3Fid%3D1%27%20OR%20%271%27%3D%271',
      answer: "GET /admin?id=1' OR '1'='1",
      cipher: 'URL encoding (percent encoding)',
      hint: 'Each %XX is a percent-encoded byte: %20 = space, %2F = /, %3F = ?, %27 = single quote, %3D = =. Substitute and you get a familiar SQL injection request line.',
      tells: [
        'Percent encoding (RFC 3986) escapes unsafe characters in URLs. %20 = space, %3F = ?, %27 = single quote, %3D = =.',
        'Critical for SOC log analysis: attackers URL-encode SQLi/XSS payloads to bypass WAFs and IDS rules. Always decode URL parameters before triaging an alert.',
        'Double encoding (%2520 → %20 → space) is a real WAF-bypass technique — worth recognizing in raw logs.'
      ]
    },
    {
      encoded: '01000110 01001100 01000001 01000111',
      answer: 'FLAG',
      cipher: 'Binary (8-bit ASCII)',
      hint: 'Each 8-bit group is one byte. Convert each to its decimal value, then look up the ASCII character. 01000110 = 70 = "F".',
      tells: [
        'Each 8-bit binary group represents one byte. Convert to decimal, then to ASCII. 01000110 = 70 decimal = "F" in ASCII.',
        'Foundation of all digital encoding. Shows up in CTF warm-ups, steganography (LSB hiding), and low-level malware analysis.',
        'Decode in Python: "".join(chr(int(b, 2)) for b in s.split())  — or use any binary-to-text converter.'
      ]
    }
  ];

  var POINTS_FIRST_TRY = 2;
  var POINTS_SECOND_TRY = 1;
  var MAX_POINTS = rounds.length * POINTS_FIRST_TRY;
  var PASS_PCT = 80;

  var state = null;

  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); }

  function el(tag, className, text) {
    var n = document.createElement(tag);
    if (className) n.className = className;
    if (text != null) n.textContent = text;
    return n;
  }

  function normalize(s) {
    return String(s == null ? '' : s)
      .replace(/[‘’‚‛′❛❜]/g, "'")
      .replace(/[“”„‟″❝❞]/g, '"')
      .replace(/\s+/g, ' ')
      .trim()
      .toUpperCase();
  }

  function isCorrect(user, expected) {
    return normalize(user) === normalize(expected);
  }

  function start(host, onComplete) {
    state = {
      host: host,
      onComplete: onComplete,
      current: 0,
      score: 0,
      attempt: 1,
      hintShown: false
    };
    renderRound();
  }

  function cleanup() { state = null; }

  function renderRound() {
    if (!state) return;
    clear(state.host);

    state.attempt = 1;
    state.hintShown = false;
    var round = rounds[state.current];

    var wrap = el('div', 'cipher-decoder-game');
    var card = el('div', 'cd-card');

    // Header: round + score
    var header = el('div', 'cd-header');
    var progress = el('div', 'cd-progress');
    progress.appendChild(document.createTextNode('Round '));
    progress.appendChild(el('strong', null, String(state.current + 1)));
    progress.appendChild(document.createTextNode(' of ' + rounds.length));
    var scoreLine = el('div', 'cd-score');
    scoreLine.appendChild(document.createTextNode('Score: '));
    scoreLine.appendChild(el('strong', null, String(state.score)));
    scoreLine.appendChild(document.createTextNode(' / ' + MAX_POINTS));
    header.appendChild(progress);
    header.appendChild(scoreLine);
    card.appendChild(header);

    // Encoded message
    var label = el('div', 'cd-label', 'Encoded message:');
    card.appendChild(label);

    var encodedRow = el('div', 'cd-encoded-row');
    var encodedBox = el('div', 'cd-encoded', round.encoded);
    encodedRow.appendChild(encodedBox);
    var copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'cd-copy-btn';
    copyBtn.setAttribute('aria-label', 'Copy encoded message to clipboard');
    copyBtn.textContent = 'Copy';
    copyBtn.addEventListener('click', function () {
      copyToClipboard(round.encoded, copyBtn);
    });
    encodedRow.appendChild(copyBtn);
    card.appendChild(encodedRow);

    // Cipher hint (hidden until wrong answer or reveal)
    var hintBox = el('div', 'cd-cipher-hint cd-hidden');
    hintBox.setAttribute('aria-live', 'polite');
    card.appendChild(hintBox);

    // Input + submit + reveal
    var inputRow = el('div', 'cd-input-row');
    var input = document.createElement('input');
    input.type = 'text';
    input.className = 'cd-input';
    input.setAttribute('placeholder', 'Type the decoded message…');
    input.setAttribute('aria-label', 'Decoded message');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('autocapitalize', 'off');
    input.setAttribute('autocorrect', 'off');
    input.setAttribute('spellcheck', 'false');
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        submit();
      }
    });
    inputRow.appendChild(input);

    var submitBtn = document.createElement('button');
    submitBtn.type = 'button';
    submitBtn.className = 'cd-btn cd-btn-primary';
    submitBtn.textContent = 'Check answer';
    submitBtn.addEventListener('click', submit);
    inputRow.appendChild(submitBtn);

    var revealBtn = document.createElement('button');
    revealBtn.type = 'button';
    revealBtn.className = 'cd-btn cd-btn-secondary';
    revealBtn.textContent = 'Reveal answer';
    revealBtn.addEventListener('click', function () { reveal(round); });
    inputRow.appendChild(revealBtn);

    card.appendChild(inputRow);

    // Inline attempt feedback (wrong-then-hint area)
    var inline = el('div', 'cd-inline-feedback');
    inline.setAttribute('aria-live', 'polite');
    card.appendChild(inline);

    wrap.appendChild(card);
    state.host.appendChild(wrap);

    // Focus the input on render
    setTimeout(function () { input.focus(); }, 50);

    // Local helpers closing over the round + DOM nodes
    function submit() {
      if (!state) return;
      if (input.disabled) return;
      var val = input.value;
      if (!val.trim()) return;
      if (isCorrect(val, round.answer)) {
        var points = state.attempt === 1 ? POINTS_FIRST_TRY : POINTS_SECOND_TRY;
        state.score += points;
        finishRound(true, points, round);
      } else {
        if (state.attempt === 1) {
          state.attempt = 2;
          showHint(round, hintBox, inline);
        } else {
          finishRound(false, 0, round);
        }
      }
    }
  }

  function showHint(round, hintBox, inline) {
    state.hintShown = true;

    var hintLabel = el('strong', null, 'Cipher: ');
    var hintName = document.createTextNode(round.cipher);
    var hintP = el('p', 'cd-cipher-name');
    hintP.appendChild(hintLabel);
    hintP.appendChild(hintName);

    var hintBody = el('p', 'cd-cipher-body', round.hint);

    clear(hintBox);
    hintBox.appendChild(hintP);
    hintBox.appendChild(hintBody);
    hintBox.classList.remove('cd-hidden');
    hintBox.classList.add('cd-shown');

    clear(inline);
    var msg = el('div', 'cd-inline-msg cd-inline-wrong');
    msg.appendChild(el('span', 'cd-inline-icon', '✗'));
    msg.appendChild(el('span', null, 'Not quite. Cipher type revealed — try once more.'));
    inline.appendChild(msg);

    var card = state.host.querySelector('.cd-card');
    var input = card && card.querySelector('.cd-input');
    if (input) {
      input.value = '';
      input.focus();
    }
  }

  function reveal(round) {
    if (!state) return;
    finishRound(false, 0, round, true);
  }

  function finishRound(correct, points, round, revealed) {
    var card = state.host.querySelector('.cd-card');
    if (!card) return;

    var input = card.querySelector('.cd-input');
    var btns = card.querySelectorAll('.cd-btn');
    if (input) input.disabled = true;
    for (var i = 0; i < btns.length; i++) btns[i].disabled = true;

    // If hint never shown (first-try correct, or revealed without trying),
    // reveal the cipher in the hint box so feedback shows it.
    var hintBox = card.querySelector('.cd-cipher-hint');
    if (hintBox && !state.hintShown) {
      var hintLabel = el('strong', null, 'Cipher: ');
      var hintP = el('p', 'cd-cipher-name');
      hintP.appendChild(hintLabel);
      hintP.appendChild(document.createTextNode(round.cipher));
      var hintBody = el('p', 'cd-cipher-body', round.hint);
      clear(hintBox);
      hintBox.appendChild(hintP);
      hintBox.appendChild(hintBody);
      hintBox.classList.remove('cd-hidden');
      hintBox.classList.add('cd-shown');
      state.hintShown = true;
    }

    var feedback = el('div', 'cd-feedback ' + (correct ? 'correct' : 'incorrect'));
    feedback.setAttribute('role', 'status');
    feedback.setAttribute('aria-live', 'polite');

    var heading = el('div', 'cd-feedback-heading');
    heading.appendChild(el('span', 'cd-feedback-icon', correct ? '✓' : '✗'));
    var headingText;
    if (correct) {
      headingText = points === POINTS_FIRST_TRY
        ? 'Correct on the first try. +' + points + ' pts.'
        : 'Correct on the second try. +' + points + ' pt.';
    } else {
      headingText = revealed
        ? 'Answer revealed. +0 pts.'
        : 'Out of attempts. Answer revealed. +0 pts.';
    }
    heading.appendChild(el('span', 'cd-feedback-text', headingText));
    feedback.appendChild(heading);

    var answerRow = el('div', 'cd-answer-row');
    answerRow.appendChild(el('strong', null, 'Answer: '));
    answerRow.appendChild(el('code', 'cd-answer-text', round.answer));
    feedback.appendChild(answerRow);

    var ul = el('ul', 'cd-tells');
    for (var j = 0; j < round.tells.length; j++) {
      ul.appendChild(el('li', null, round.tells[j]));
    }
    feedback.appendChild(ul);

    card.appendChild(feedback);

    var next = document.createElement('button');
    next.type = 'button';
    next.className = 'cd-btn cd-btn-next';
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

    // Update the in-card score display (no full re-render)
    var scoreStrong = card.querySelector('.cd-score strong');
    if (scoreStrong) scoreStrong.textContent = String(state.score);
  }

  function copyToClipboard(text, btn) {
    var originalText = btn.textContent;
    function done() {
      btn.textContent = 'Copied!';
      btn.classList.add('cd-copy-done');
      setTimeout(function () {
        btn.textContent = originalText;
        btn.classList.remove('cd-copy-done');
      }, 1500);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () {
        legacyCopy(text);
        done();
      });
    } else {
      legacyCopy(text);
      done();
    }
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

  function renderResults() {
    if (!state) return;
    clear(state.host);

    var pct = Math.round((state.score / MAX_POINTS) * 100);
    var message;
    if (pct === 100) message = 'Perfect score. The decoder ring is yours.';
    else if (pct >= PASS_PCT) message = 'Strong. You can hold your own with substitution + encoding.';
    else if (pct >= 60) message = 'Decent. A couple of ciphers got past you — drill the ones you missed.';
    else message = 'Worth another round. Cipher recognition is a pattern-matching habit.';

    var wrap = el('div', 'cipher-decoder-game');
    var card = el('div', 'cd-card cd-results');

    var scoreLine = el('div', 'cd-results-score');
    scoreLine.appendChild(el('strong', null, String(state.score)));
    scoreLine.appendChild(document.createTextNode(' / ' + MAX_POINTS));
    card.appendChild(scoreLine);

    card.appendChild(el('div', 'cd-results-pct', pct + '%'));
    card.appendChild(el('div', 'cd-results-message', message));

    var replay = document.createElement('button');
    replay.type = 'button';
    replay.className = 'cd-btn cd-btn-replay';
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
  window.HackMeGame.cipher = {
    start: start,
    cleanup: cleanup
  };
})();
