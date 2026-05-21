---
title: "bashedlogs"
date: 2025-06-01
summary: "Fast, intelligent CLI for cybersecurity log analysis with automatic format detection."
tags: ["Bash", "Log Analysis", "SOC Tooling"]
weight: 8
---

{{< pill "live" >}}Live{{< /pill >}}

**Repo:** [github.com/ktalons/bashedlogs](https://github.com/ktalons/bashedlogs)

A fast, intelligent CLI tool for comprehensive cybersecurity log analysis with automatic format detection — built from real day-to-day patterns I kept rewriting in the FM OT SOC.

Focus areas:

- Fast filtering and pivoting across journald, syslog, and Wazuh exports
- Common-case enrichment (GeoIP, ASN, hostname resolution)
- Automatic format detection so the same invocation handles different log shapes
- Batch normalization for downstream ingest
- One-liner reporting

Built in shell so it deploys anywhere with no install footprint.
