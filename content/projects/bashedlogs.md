---
title: "bashedlogs"
date: 2025-10-21
weight: 5
summary: "A single-file Bash tool that detects log formats and surfaces findings for security triage."
tags: ["Bash", "Log Analysis", "SOC Tooling"]
---

{{< pill "live" >}}v2.1.0 shipped{{< /pill >}}

**Repo:** [github.com/ktalons/bashedlogs](https://github.com/ktalons/bashedlogs)

I built bashedlogs from the log analysis patterns I kept running into in SOC work and CTFs. Give it a log file and it identifies the format, looks for patterns such as bursts of failed logins, and summarizes what’s worth a closer look. It runs as one Bash file and can produce JSON for use in other tools.

## What's in the repo

- **Format analyzers:** SSH and authentication, system logs, web access, Wazuh, DNS, firewall logs, and a generic fallback. Wazuh and journald are read by their JSON fields.
- **Investigation helpers:** Time-windowed brute-force detection by source and destination host, indicator extraction for IPv4 and IPv6, and optional IP enrichment.
- **Tests and examples:** Fixtures that run on Linux, macOS, and a minimal BusyBox setup, including cases where crafted log text could mislead an analyst.

The tool treats logs as untrusted input. Version 2.1 shows how each SSH event was attributed, and a forged login line from another program can no longer complete a compromise finding.
