---
title: "TalonSocLab"
date: 2026-05-20
weight: 1
summary: "My home SOC, built in public with Wazuh, Sysmon, and Suricata. The foundation and hardening are complete, with detection engineering underway."
tags: ["SIEM", "Wazuh", "Detection Engineering", "MITRE ATT&CK", "Active Directory", "Honeynet", "OpenCTI", "Sigma", "Docker", "CASA"]
---

{{< pill "indev" >}}In Dev · Phase B{{< /pill >}}

**Repo:** [github.com/ktalons/talonsoclab](https://github.com/ktalons/talonsoclab)

TalonSocLab is my home SOC, built in public so I can work through what it takes to operate one end to end. I brought together Wazuh, Sysmon, and Suricata to collect endpoint and network telemetry and built dashboards to make it easier to investigate. With the foundation hardened, I’m moving into detection engineering, starting with a noise baseline before testing new rules.

## What's in the repo

- **SOC foundation:** Sensor and agent setup, Docker configuration, and dashboards for the lab.
- **Hardening runbooks:** Log retention, failure alerts, credential rotation, and encrypted backups.
- **Detection engineering:** Phase B notes for testing Sigma rules in Wazuh and mapping them to MITRE ATT&CK.

The lab is the telemetry side of [CASA](/projects/casa/). Their shared intake format is in place, with the live feed still pending.
