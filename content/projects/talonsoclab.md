---
title: "TalonSocLab"
date: 2026-05-20
summary: "Flagship personal SOC home lab on hardware I own: a deterministic Wazuh, Suricata, and Sysmon data plane that feeds CASA, my agentic reasoning layer. Built and documented publicly across four phases."
tags: ["SIEM", "Wazuh", "Detection Engineering", "MITRE ATT&CK", "Active Directory", "Honeynet", "OpenCTI", "Sigma", "Docker", "CASA"]
cover:
    image: ""
    alt: "TalonSocLab architecture"
    relative: false
---

{{< pill "indev" >}}In Dev · Pivoted to docker-compose on owned hardware, [read the latest](/blog/the-buy-path-data-plane-and-casa-reasoning-plane/){{< /pill >}}

**Repo:** [github.com/ktalons/talonsoclab](https://github.com/ktalons/talonsoclab). The [architecture diagram](https://github.com/ktalons/talonsoclab/blob/main/phase-a-foundation/architecture.mmd), the docker-compose deploy bundle ([`deploy/soc-recon`](https://github.com/ktalons/talonsoclab/tree/main/deploy/soc-recon)), and the recovery runbook are live. The original Proxmox build is archived in the repo as provenance for the pivot.

## What is it

A single coherent home SOC, built in four chapters. Each chapter ships independently with its own GitHub folder, README, architecture diagram, and lessons-learned write-up. By the end it runs a small SOC end to end, from log ingest, through detection engineering, to threat intel.

It runs on a dedicated HP EliteDesk 800 G4 Mini (i5-8500T, 16 GB RAM, 256 GB NVMe) that I own outright. Started on a shared university Proxmox cluster, the lab moved to docker-compose on my own box after that host died. The portability is the point.

## Two planes

TalonSocLab is the **data plane**. It collects, filters, and cites telemetry, then emits a structured intake artifact. It does not reason and it does not decide.

[**CASA**](https://github.com/ktalons/casa-ai-agent), my Cybersecurity Analysis Support Agent, is the separate **reasoning plane**. It consumes that intake and produces the analysis, with specialist agents that are NIST-aligned and human-in-the-loop. Deterministic infrastructure below, agentic reasoning on top. CASA is also my senior capstone.

## The four phases

### Phase A: Foundation SOC Stack

- Ubuntu Server and Docker on the owned EliteDesk
- Wazuh single-node (manager, indexer, dashboard) in containers
- Real-device Wazuh agents: my Windows machine with Sysmon (Olaf Hartong modular config), my Mac, and the Ubuntu host itself
- Suricata IDS as a container, eve.json shipped to Wazuh
- Custom Wazuh dashboards: top alerts, MITRE coverage, endpoint health

### Phase B: Detection Engineering & Threat Hunting

- 15 to 20 Atomic Red Team tests across Initial Access, Execution, Persistence, Priv Esc, and Defense Evasion
- For each: run the atomic, confirm the Wazuh detection, author a Sigma rule if it is missing, confirm it fires, then document it
- A MITRE ATT&CK coverage map
- Hunt notebooks: rare parent-child process pairs, anomalous service installs, lateral movement
- A GitHub Action that lints Sigma rules on every PR

### Phase C: AD Attack & Defense

- A vulnerable Active Directory lab, GOAD-style
- The top 5 AD attack chain: Kerberoasting, AS-REP roasting, BloodHound, Pass-the-Hash, DCSync
- For each: the attacker steps, the Wazuh detection rule, and a screenshot of it firing
- A purple-team report in the format federal detection engineers actually deliver
- This is the phase 16 GB cannot hold on its own, so it runs as a trimmed mini-AD or a short cloud burst

### Phase D: Honeynet + Threat Intel Pipeline

- T-Pot on a cheap cloud VM, since a honeypot belongs off the home network by design
- IOCs flow to OpenCTI, enriched through the AbuseIPDB and VirusTotal APIs
- Enriched intel feeds back into Wazuh, and into CASA's analysis
- Published honeynet observation reports

## Why

I learn by building the thing, not reading about it. TalonSocLab is me standing up a small SOC end to end so I actually understand how the pieces fit. It is public so it is useful to someone coming up behind me.

## Follow along

- Blog posts here as each phase ships
- LinkedIn: [www.linkedin.com/in/ta1ons](https://www.linkedin.com/in/ta1ons/)
- GitHub: [talonsoclab](https://github.com/ktalons/talonsoclab) (the SOC) and [casa-ai-agent](https://github.com/ktalons/casa-ai-agent) (the reasoning layer)
