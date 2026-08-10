---
title: "TalonSocLab"
date: 2026-05-20
summary: "My first home lab: a self-hosted SOC built and documented publicly across four phases. The deterministic data plane that feeds CASA, my agentic reasoning layer."
tags: ["SIEM", "Wazuh", "Detection Engineering", "MITRE ATT&CK", "Active Directory", "Honeynet", "OpenCTI", "Sigma", "Docker", "CASA"]
---

{{< pill "indev" >}}In Dev · Phase B{{< /pill >}}

Latest: [Phase A complete, detection engineering next](/blog/phase-a-active-is-not-proof/).

**Repo:** [github.com/ktalons/talonsoclab](https://github.com/ktalons/talonsoclab)

A single coherent home SOC, built in four phases across a few machines on my home network. Each phase ships independently with its own folder, README, architecture diagram, and lessons-learned write-up. By the end it runs a small SOC end to end, from log ingest through detection engineering to threat intel.

## Two planes

TalonSocLab is the **data plane**: it collects, filters, and cites telemetry, then emits a structured intake artifact. It does not reason and it does not decide. [**CASA**](https://github.com/ktalons/casa-ai-agent), my senior capstone, is the separate **reasoning plane** that consumes it — deterministic infrastructure below, agentic reasoning on top.

## Milestones

- **Phase 0 — Hardware and network** {{< pill "live" >}}Complete{{< /pill >}} SOC host on Ubuntu and Docker, wired through the managed switch with a reserved address, Wazuh stack green.
- **Phase A — Foundation SOC stack** {{< pill "live" >}}Complete{{< /pill >}} Wazuh in containers with agents enrolled and verified on three real endpoints: Windows with Sysmon, macOS, and the Ubuntu host. Suricata on the host NIC and a SOC Overview dashboard in git.
- **Phase B — Detection engineering** {{< pill "indev" >}}In Dev{{< /pill >}} Atomic Red Team tests, a Sigma rule pack, and a MITRE ATT&CK coverage map.
- **Phase C — AD attack and defense** {{< pill "coming" >}}Planned{{< /pill >}} A mini Active Directory lab, the top five attack chain, and a purple-team report.
- **Phase D — Honeynet and threat intel** {{< pill "coming" >}}Planned{{< /pill >}} T-Pot feeding OpenCTI, enriched through the AbuseIPDB and VirusTotal APIs.

## Why

This is my first home lab. I learn by building the thing instead of reading about it, so I'm standing up a small SOC end to end and keeping it public for anyone coming up behind me.

## Follow along

- Blog posts here as each phase ships
- GitHub: [talonsoclab](https://github.com/ktalons/talonsoclab) (the SOC) and [casa-ai-agent](https://github.com/ktalons/casa-ai-agent) (the reasoning layer)
- LinkedIn: [www.linkedin.com/in/ta1ons](https://www.linkedin.com/in/ta1ons/)
