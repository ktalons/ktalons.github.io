/*
 * phishing-game.js — E@st3r Egg Cyb3r Ski11 G@m3, round 1: Phishing or Legit?
 *
 * Registers as window.HackMeGame.phishing with a start(host, onComplete)
 * function the menu controller calls. No path guard, no auto-boot — the
 * menu in hackme-menu.js is responsible for launching this game.
 *
 * Six emails (3 phishing, 3 legit). Score reported back via onComplete(pct).
 * Pure client-side. CSP-safe (no inline scripts, no javascript: URIs).
 */
(function () {
  'use strict';

  var emails = [
    {
      from: 'IT Security <support@micros0ft-onIine.com>',
      subject: 'URGENT: Your Microsoft 365 password expires in 2 hours',
      body: "Dear User,\n\nOur system has detected that your password is set to expire. To prevent account lockout, please verify your credentials immediately.",
      linkText: 'Verify Now',
      linkUrl: 'http://micros0ft-onIine.com/verify',
      isPhishing: true,
      tells: [
        'Sender domain is a typosquat: "micros0ft" uses a zero, "onIine" uses a capital I that visually mimics a lowercase l.',
        'Urgency tactic ("expires in 2 hours", "account lockout") pressures the recipient past careful scrutiny.',
        'Link target points back to the same typosquat domain, not microsoft.com.',
        'Real password expiry warnings come from your own IT/IdP, not an outside support address.'
      ]
    },
    {
      from: 'GitHub <notifications@github.com>',
      subject: '[ktalons/PCAPpuller] PR #14 reviewed by @reviewer',
      body: "@reviewer left review comments on pull request #14: 'Add --tmpdir argument'.\n\nView this pull request on GitHub, or reply to this email to comment on the conversation.",
      linkText: 'View pull request',
      linkUrl: 'https://github.com/ktalons/PCAPpuller/pull/14',
      isPhishing: false,
      tells: [
        'Sender domain matches the real GitHub notifications address (notifications@github.com).',
        'Link target resolves to a real github.com URL on a repo the recipient actually owns.',
        'No urgency, no credential ask, content matches GitHub\'s normal PR notification format.',
        'Reply-by-email is a real GitHub feature for PR conversations.'
      ]
    },
    {
      from: 'HR Department <hr-payroll@arizonau-payroll.org>',
      subject: 'Updated W-4 form requires immediate action',
      body: "Dear Employee,\n\nPlease review the attached updated W-4 form by end of business today. Click the secure link below to access your tax document.",
      linkText: 'Access W-4',
      linkUrl: 'https://bit.ly/3xyz789',
      isPhishing: true,
      tells: [
        'Cousin domain: the real University of Arizona uses arizona.edu, not arizonau-payroll.org.',
        'URL shortener hides the real destination. HR communications never need bit.ly.',
        'Authority + urgency ("HR", "end of business today") pressures a fast click.',
        'W-4 / tax-form phishing is a long-running spear-phishing pattern, especially at tax season.'
      ]
    },
    {
      from: 'AWS Billing <no-reply@aws.amazon.com>',
      subject: 'Your AWS bill for April 2026 is now available',
      body: "Hello,\n\nYour AWS bill for April 2026 is now available. Total charge: $14.32.\n\nView your invoice and payment options in the AWS Billing Console.",
      linkText: 'View Invoice',
      linkUrl: 'https://console.aws.amazon.com/billing/',
      isPhishing: false,
      tells: [
        'Sender domain (no-reply@aws.amazon.com) matches real AWS transactional mail.',
        'Link target is the actual AWS Billing Console on aws.amazon.com.',
        'No credential ask, no urgency, just a billing notice with a console deep-link.',
        'Specific dollar amount and date match a normal monthly billing cadence.'
      ]
    },
    {
      from: 'GitHub Security <security@github-secure.com>',
      subject: 'Suspicious sign-in attempt detected on your account',
      body: "We detected a sign-in to your GitHub account from a new location.\n\nIf this wasn't you, secure your account immediately by reviewing recent activity.",
      linkText: 'Review activity',
      linkUrl: 'https://github-secure.com/account/security',
      isPhishing: true,
      tells: [
        'Cousin domain: real GitHub is github.com, never github-secure.com (which is unrelated and registered to impersonate).',
        'Phishers clone the wording of legit security-alert emails to harvest GitHub credentials.',
        'Real GitHub security alerts come from noreply@github.com and link back to github.com/settings/security.',
        'When in doubt, type github.com directly into the browser instead of clicking the link.'
      ]
    },
    {
      from: 'Sarah Chen <schen@arizona.edu>',
      subject: 'SOC team weekly sync — Thursday 2pm',
      body: "Hi all,\n\nSending out the recurring SOC sync invite for this week. Same time, same Zoom link in the calendar invite.\n\nSee you Thursday.",
      linkText: '',
      linkUrl: '',
      isPhishing: false,
      tells: [
        'Sender is a known colleague at a real arizona.edu address.',
        'No external links, no credential ask, no urgency.',
        'Content matches a normal recurring meeting reminder.',
        'Zoom link is referenced in the calendar invite, not as a clickable URL in the email body.'
      ]
    }
  ];

  var state = null;

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); }

  function start(host, onComplete) {
    state = { host: host, onComplete: onComplete, current: 0, score: 0 };
    renderEmail();
  }

  function cleanup() { state = null; }

  function renderEmail() {
    if (!state) return;
    clear(state.host);

    var email = emails[state.current];
    var card = document.createElement('div');
    card.className = 'pg-card';

    var header = document.createElement('div');
    header.className = 'pg-header';
    header.innerHTML =
      '<div class="pg-progress">Email <strong>' + (state.current + 1) + '</strong> of ' + emails.length + '</div>' +
      '<div class="pg-score">Score: <strong>' + state.score + '</strong></div>';
    card.appendChild(header);

    var emailEl = document.createElement('div');
    emailEl.className = 'pg-email';
    var html =
      '<div class="pg-row"><span class="pg-label">From:</span> <span class="pg-value">' + escapeHtml(email.from) + '</span></div>' +
      '<div class="pg-row"><span class="pg-label">Subject:</span> <span class="pg-value">' + escapeHtml(email.subject) + '</span></div>' +
      '<div class="pg-body">' + escapeHtml(email.body).replace(/\n/g, '<br>') + '</div>';
    if (email.linkText) {
      html +=
        '<div class="pg-link-row">' +
          '<span class="pg-link-text">' + escapeHtml(email.linkText) + '</span>' +
          '<span class="pg-link-arrow">→</span>' +
          '<span class="pg-link-url">' + escapeHtml(email.linkUrl) + '</span>' +
        '</div>';
    }
    emailEl.innerHTML = html;
    card.appendChild(emailEl);

    var buttons = document.createElement('div');
    buttons.className = 'pg-buttons';

    var phishBtn = document.createElement('button');
    phishBtn.type = 'button';
    phishBtn.className = 'pg-btn pg-btn-phishing';
    phishBtn.setAttribute('aria-label', 'Mark this email as phishing');
    phishBtn.innerHTML = '<span class="pg-btn-icon">🚩</span><span class="pg-btn-text">Phishing</span>';
    phishBtn.addEventListener('click', function () { answer(true); });

    var legitBtn = document.createElement('button');
    legitBtn.type = 'button';
    legitBtn.className = 'pg-btn pg-btn-legit';
    legitBtn.setAttribute('aria-label', 'Mark this email as legitimate');
    legitBtn.innerHTML = '<span class="pg-btn-icon">✓</span><span class="pg-btn-text">Legit</span>';
    legitBtn.addEventListener('click', function () { answer(false); });

    buttons.appendChild(phishBtn);
    buttons.appendChild(legitBtn);
    card.appendChild(buttons);

    state.host.appendChild(card);
  }

  function answer(playerSaysPhishing) {
    if (!state) return;
    var email = emails[state.current];
    var correct = playerSaysPhishing === email.isPhishing;
    if (correct) state.score++;
    showFeedback(correct, email);
  }

  function showFeedback(correct, email) {
    var card = state.host.querySelector('.pg-card');
    if (!card) return;

    var btns = card.querySelectorAll('.pg-btn');
    for (var i = 0; i < btns.length; i++) btns[i].disabled = true;

    var feedback = document.createElement('div');
    feedback.className = 'pg-feedback ' + (correct ? 'correct' : 'incorrect');
    feedback.setAttribute('role', 'status');
    feedback.setAttribute('aria-live', 'polite');

    var heading;
    if (correct) {
      heading = email.isPhishing
        ? 'Correct. This was a phishing attempt.'
        : 'Correct. This one was legitimate.';
    } else {
      heading = email.isPhishing
        ? 'Not quite. This was actually a phishing attempt.'
        : 'Not quite. This one was actually legitimate.';
    }

    var tellsHtml = '<ul class="pg-tells">';
    for (var j = 0; j < email.tells.length; j++) {
      tellsHtml += '<li>' + escapeHtml(email.tells[j]) + '</li>';
    }
    tellsHtml += '</ul>';

    feedback.innerHTML =
      '<div class="pg-feedback-heading">' +
        '<span class="pg-feedback-icon">' + (correct ? '✓' : '✗') + '</span>' +
        '<span class="pg-feedback-text">' + escapeHtml(heading) + '</span>' +
      '</div>' +
      tellsHtml;
    card.appendChild(feedback);

    var next = document.createElement('button');
    next.type = 'button';
    next.className = 'pg-btn pg-btn-next';
    next.textContent = state.current < emails.length - 1 ? 'Next →' : 'See results';
    next.addEventListener('click', function () {
      state.current++;
      if (state.current < emails.length) {
        renderEmail();
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

    var pct = Math.round((state.score / emails.length) * 100);
    var message;
    if (pct === 100) message = 'Perfect score. You\'ve got the eye.';
    else if (pct >= 80) message = 'Strong. You\'d catch most of these in the wild.';
    else if (pct >= 60) message = 'Decent. A few sneaky ones got past.';
    else message = 'Worth another round. Phishing is hard on purpose.';

    var card = document.createElement('div');
    card.className = 'pg-card pg-results';
    card.innerHTML =
      '<div class="pg-results-score"><strong>' + state.score + '</strong> / ' + emails.length + '</div>' +
      '<div class="pg-results-pct">' + pct + '%</div>' +
      '<div class="pg-results-message">' + escapeHtml(message) + '</div>';

    var replay = document.createElement('button');
    replay.type = 'button';
    replay.className = 'pg-btn pg-btn-replay';
    replay.textContent = 'Try again';
    replay.addEventListener('click', function () {
      state.current = 0;
      state.score = 0;
      renderEmail();
      state.host.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    card.appendChild(replay);

    state.host.appendChild(card);

    // Report final score to the menu controller for badge awarding
    if (typeof state.onComplete === 'function') {
      state.onComplete(pct);
    }
  }

  // Register on the global so the menu controller can launch us
  window.HackMeGame = window.HackMeGame || {};
  window.HackMeGame.phishing = {
    start: start,
    cleanup: cleanup
  };
})();
