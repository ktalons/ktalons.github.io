---
title: "bashedlogs"
date: 2025-06-01
summary: "Shell-based log analysis and management toolkit for security operations."
tags: ["Bash", "Log Analysis", "SOC Tooling"]
weight: 8
---

{{< pill "live" >}}Live{{< /pill >}}

A collection of shell utilities for SOC log triage and analysis — built from real day-to-day patterns I kept rewriting in the FM OT SOC.

Focus areas:

- Fast filtering / pivoting across journald, syslog, and Wazuh exports
- Common-case enrichment (GeoIP, ASN, hostname resolution)
- Batch normalization for downstream ingest
- One-liner reporting

Built in pure bash so it deploys anywhere with no install footprint.
