---
title: "Phase A: Active Is Not Proof"
date: 2026-08-09
summary: "Phase A is complete: agents on three real endpoints, Suricata on the wire, and a SOC dashboard in git. The recurring lesson: Active is a liveness signal, not an acceptance test."
tags: ["TalonSocLab", "homelab", "Wazuh", "Sysmon", "Suricata"]
---

Phase A is complete. The lab now ingests telemetry from three real endpoints: a Windows box running Sysmon with the sysmon-modular ruleset, my Mac shipping a deliberately narrow slice of the unified log, and the Ubuntu SOC host itself with auditd watching every command it runs. Suricata sits on the host NIC with the full ET Open ruleset loaded, and it all rolls up into a SOC Overview dashboard that lives in git like everything else.

The lesson that kept repeating: an agent reporting Active proves almost nothing. Wrong group, an undelivered config, a stock Sysmon ruleset, a transport mismatch. Every one of those failures still shows Active. It is a liveness check masquerading as an acceptance test. So each endpoint had to close on evidence that cannot be true unless the whole chain works. The Windows box proved itself by the Sysmon event distribution in the indexer, nine event IDs the stock config cannot emit. Config delivery proved itself by the manager's hash of the merged group config matching the hash the agent reports back. Staged and delivered are different states, and Active cannot tell them apart.

The best catch of the phase came from install order. Sysmon goes on before the Wazuh agent, which means a careless install command would hand the enrollment password to the very sensor being deployed, and the SIEM would index its own secret as searchable event data. So the password moved between machines as bytes, never on a command line. The query for it in the indexer came back empty, and deleting it afterward left the agent connected, which proves the secret really is single-use.

Suricata loaded 52,245 rules and the positive control landed in the indexer within seconds. Then the tuning started. In its first eleven minutes on the wire it produced 214 noise documents against one real alert, mostly the switch's management chatter tripping a decoder event at a rate of about 95,000 a day. I suppressed that at the manager instead of the sensor, so the raw eve.json on disk stays a full-fidelity record of the network.

The dashboard almost got called done on a lie. The import API reported success on every object while one panel refused to render, because the dashboard caches its field list as a snapshot and every field Suricata introduced was missing from it. A clean import is not evidence a panel works. It got verified the only way that counts, rendered in a real browser.

Next up: Phase B, detection engineering. Atomic Red Team on offense, Sigma rules on defense, and all this telemetry finally gets put to work.
