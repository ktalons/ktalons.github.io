---
title: "TalonSocLab"
date: 2026-05-20
weight: 1
summary: "My home SOC, built in public with Wazuh, Sysmon, and Suricata. The foundation and hardening are complete, and a Sigma-based detection pack is live and under test."
tags: ["SIEM", "Wazuh", "Detection Engineering", "MITRE ATT&CK", "Active Directory", "Honeynet", "OpenCTI", "Sigma", "Atomic Red Team", "Docker", "CASA"]
---

{{< pill "indev" >}}In Dev · Phase B{{< /pill >}}

**Repo:** [github.com/ktalons/talonsoclab](https://github.com/ktalons/talonsoclab)

TalonSocLab is my home SOC, built in public so I can work through what it takes to operate one end to end. I brought together Wazuh, Sysmon, and Suricata to collect endpoint and network telemetry and built dashboards to make it easier to investigate. With the noise baseline measured, I ported a pack of Sigma rules to Wazuh by hand, and I’m now testing them with Atomic Red Team on a real Windows endpoint.

## What's in the repo

- **SOC foundation:** Sensor and agent setup, Docker configuration, and dashboards for the lab.
- **Hardening runbooks:** Log retention, failure alerts, credential rotation, and encrypted backups.
- **Detection engineering:** The noise baseline, Sigma rules ported to Wazuh and mapped to MITRE ATT&CK, the test cases behind each rule, and an Atomic Red Team harness with its run records.

The lab is the telemetry side of [CASA](/projects/casa/). CASA can now build its intake from Wazuh alerts, and the live feed from the lab is still pending.
