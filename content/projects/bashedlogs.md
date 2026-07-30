---
title: "bashedlogs"
date: 2025-10-21
summary: "Fast, intelligent CLI for cybersecurity log analysis with automatic format detection."
tags: ["Bash", "Log Analysis", "SOC Tooling"]
---

{{< pill "indev" >}}v1 — v2 in progress{{< /pill >}}

**Repo:** [github.com/ktalons/bashedlogs](https://github.com/ktalons/bashedlogs)

A fast CLI tool for cybersecurity log analysis with automatic format detection. Built from the log and network analysis patterns I encountered repeatedly in CTF competitions.

v1 is functional today as a single-file tool. A ground-up v2 rewrite is in progress, rebuilding it as a modular, tested SOC triage tool.

## Working today (v1)

- Automatic format detection across 25+ log types.
- Specialized analyzers for SSH/auth, web access, DNS, and more.
- Brute-force and injection-probe heuristics with threat-scored reports.
- Single-file, zero-dependency Bash.

## In progress (v2)

- journald and Wazuh alert analyzers.
- JSON/NDJSON output with a real exit-code contract for pipelines and cron.
- Time-windowed brute-force detection instead of raw counts.
- IOC extraction with defang support.
- Optional offline GeoIP/ASN enrichment.
- shellcheck-clean, bats-tested, CI on Linux and macOS.

Built in shell so it deploys anywhere with no install footprint.
