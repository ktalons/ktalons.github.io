---
title: "TalonSocLab"
date: 2026-05-20
summary: "Flagship personal SOC home lab: Wazuh, Sysmon, Suricata, AD attack and defense, and a honeynet pipeline, documented publicly across four phases."
tags: ["SIEM", "Wazuh", "Detection Engineering", "MITRE ATT&CK", "Active Directory", "Honeynet", "OpenCTI", "Sigma"]
cover:
    image: ""
    alt: "TalonSocLab architecture"
    relative: false
---

{{< pill "indev" >}}In Dev · Phase A schedule update — [see blog](/blog/talonsoclab-phase-a-schedule-update/){{< /pill >}}

**Repo:** [github.com/ktalons/talonsoclab](https://github.com/ktalons/talonsoclab) — scaffold, [architecture diagram](https://github.com/ktalons/talonsoclab/blob/main/phase-a-foundation/architecture.mmd), and [six deployment runbooks](https://github.com/ktalons/talonsoclab/tree/main/phase-a-foundation/deployment) live. Working SOC stack ships June 9.

## What is it

A single coherent home SOC, built in four chapters over 10 weeks. Each chapter ships independently with its own GitHub folder, README, architecture diagram, and lessons-learned write-up. By the end, it'll be a working example of running a small SOC end to end: from log ingest, through detection engineering, to threat intel.

## The four phases

### Phase A: Foundation SOC Stack *(Weeks 1 to 3, May 20 to Jun 9)*

- Proxmox VMs: Wazuh manager (Ubuntu), 2× Windows endpoints, 1× Linux endpoint, pfSense edge
- Sysmon (Olaf Hartong modular config) on Windows endpoints with Windows Event Forwarding
- Suricata IDS on pfSense WAN
- Custom Wazuh dashboards: top alerts, MITRE coverage, endpoint health

### Phase B: Detection Engineering & Threat Hunting *(Weeks 3 to 6, Jun 3 to Jun 23)*

- 15 to 20 Atomic Red Team tests across Initial Access, Execution, Persistence, Priv Esc, Defense Evasion
- For each: run atomic → confirm Wazuh detection → if missing, author Sigma rule → confirm fire → document
- MITRE ATT&CK coverage heatmap (DeTT&CT or hand-built)
- Jupyter hunt notebooks: rare parent-child process pairs, anomalous service installs, lateral movement
- GitHub Action lints Sigma rules on PR

### Phase C: AD Attack & Defense *(Weeks 5 to 8, Jun 17 to Jul 21)*

- GOAD-style vulnerable Active Directory environment
- Top 5 AD attack chain documented: Kerberoasting, AS-REP, BloodHound, Pass-the-Hash, DCSync
- For each: attacker steps, Wazuh detection rule, screenshot of detection firing
- Purple-team report PDF in the format federal detection engineers actually deliver

### Phase D: Honeynet + Threat Intel Pipeline *(Weeks 7 to 10, Jul 1 to Aug 4)*

- T-Pot deployment on cheap cloud VM
- IOCs flow to MISP / OpenCTI
- Enrichment via AbuseIPDB and VirusTotal APIs
- Auto-feed enriched IOCs back to Wazuh as threat intel
- Weekly published "honeynet observation" markdown reports

## Why I'm building it

The OT SOC work and CTF leadership happened inside Arizona's networks. TalonSocLab is the public continuation. It matters most for senior SOC and federal detection engineering roles, where end to end SOC capability has to be visibly demonstrated, not just described.

## Follow along

- Blog posts here as each phase ships
- LinkedIn: [www.linkedin.com/in/ta1ons](https://www.linkedin.com/in/ta1ons/)
- GitHub: [github.com/ktalons/talonsoclab](https://github.com/ktalons/talonsoclab) — Phase A scaffold + architecture + runbooks live; pivoting Phase A substrate after host hardware fault — [details](/blog/talonsoclab-phase-a-schedule-update/)
