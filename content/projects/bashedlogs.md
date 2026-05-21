---
title: "bashedlogs"
date: 2025-06-01
summary: "Fast, intelligent CLI for cybersecurity log analysis with automatic format detection."
tags: ["Bash", "Log Analysis", "SOC Tooling"]
weight: 8
---

{{< pill "indev" >}}In Dev{{< /pill >}}

**Repo:** [github.com/ktalons/bashedlogs](https://github.com/ktalons/bashedlogs)

A fast, intelligent CLI tool for comprehensive cybersecurity log analysis with automatic format detection. Built from the log and network analysis patterns I encountered repeatedly in CTF competitions.

Active development. Functional today, more capability and testing planned.

## Focus areas

- Fast filtering and pivoting across journald, syslog, and Wazuh exports.
- Common-case enrichment (GeoIP, ASN, hostname resolution).
- Automatic format detection so the same invocation handles different log shapes.
- Batch normalization for downstream ingest.
- One-liner reporting.

Built in shell so it deploys anywhere with no install footprint.
