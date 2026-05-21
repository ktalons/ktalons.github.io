---
title: "TalonSocLab"
date: 2026-05-20
summary: "Flagship personal SOC home lab — Wazuh + Sysmon + Suricata + AD attack/defense + honeynet, documented publicly across four phases."
tags: ["SIEM", "Wazuh", "Detection Engineering", "MITRE ATT&CK", "Active Directory", "Honeynet", "OpenCTI", "Sigma"]
cover:
    image: ""
    alt: "TalonSocLab architecture"
    relative: false
weight: 1
---

<span class="status-pill coming">Coming · Phase A — June 9</span>

**Repo:** [github.com/ktalons/talonsoclab](https://github.com/ktalons/talonsoclab) *(under construction)*

## What is it

A single coherent home SOC, built in four chapters over 10 weeks. Each chapter ships independently with its own GitHub folder, README, architecture diagram, and lessons-learned write-up. By the end, it'll be a working end-to-end example of "I can run a small SOC" — from log ingest through detection engineering through threat intel.

## The four phases

### Phase A — Foundation SOC Stack *(Weeks 1–3, May 20 – Jun 9)*

- Proxmox VMs: Wazuh manager (Ubuntu), 2× Windows endpoints, 1× Linux endpoint, pfSense edge
- Sysmon (Olaf Hartong modular config) on Windows endpoints with Windows Event Forwarding
- Suricata IDS on pfSense WAN
- Custom Wazuh dashboards: top alerts, MITRE coverage, endpoint health

### Phase B — Detection Engineering & Threat Hunting *(Weeks 3–6, Jun 3 – Jun 23)*

- 15–20 Atomic Red Team tests across Initial Access, Execution, Persistence, Priv Esc, Defense Evasion
- For each: run atomic → confirm Wazuh detection → if missing, author Sigma rule → confirm fire → document
- MITRE ATT&CK coverage heatmap (DeTT&CT or hand-built)
- Jupyter hunt notebooks: rare parent-child process pairs, anomalous service installs, lateral movement
- GitHub Action lints Sigma rules on PR

### Phase C — AD Attack & Defense *(Weeks 5–8, Jun 17 – Jul 21)*

- GOAD-style vulnerable Active Directory environment
- Top-5 AD attack chain documented: Kerberoasting, AS-REP, BloodHound, Pass-the-Hash, DCSync
- For each: attacker steps, Wazuh detection rule, screenshot of detection firing
- Purple-team report PDF in the format federal detection engineers actually deliver

### Phase D — Honeynet + Threat Intel Pipeline *(Weeks 7–10, Jul 1 – Aug 4)*

- T-Pot deployment on cheap cloud VM
- IOCs flow to MISP/OpenCTI
- Enrichment via AbuseIPDB + VirusTotal APIs
- Auto-feed enriched IOCs back to Wazuh as threat intel
- Weekly published "honeynet observation" markdown reports

## Why I'm building it

I have strong CTF and OT SOC experience but no public home-lab artifact a hiring manager can click on. TalonSocLab fixes that — particularly for senior SOC and federal detection engineering roles where end-to-end SOC capability needs to be visibly demonstrated, not just described.

## Follow along

- Blog posts here as each phase ships
- LinkedIn: [linkedin.com/in/ta1ons](https://linkedin.com/in/ta1ons/)
- GitHub: [github.com/ktalons/talonsoclab](https://github.com/ktalons/talonsoclab) (live by June 9)
