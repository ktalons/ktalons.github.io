---
title: "bashedlogs"
date: 2025-10-21
summary: "Zero-dependency Bash CLI for SOC log triage with automatic format detection."
tags: ["Bash", "Log Analysis", "SOC Tooling"]
---

{{< pill "live" >}}v2 shipped{{< /pill >}}

**Repo:** [github.com/ktalons/bashedlogs](https://github.com/ktalons/bashedlogs) · **Release:** [v2.0.0](https://github.com/ktalons/bashedlogs/releases/tag/v2.0.0)

Security log triage in one Bash file. Point it at a log, it works out the format, and it tells you what is worth looking at. Built from the log analysis patterns I kept hitting in CTF competitions and SOC work.

Install is one file with nothing to build:

```bash
curl -LO https://github.com/ktalons/bashedlogs/releases/latest/download/bashedlogs && chmod +x bashedlogs
```

## What it does

- Eight analyzers: SSH/auth, journald, syslog, web access (Apache and NGINX), Wazuh alerts, DNS, firewall (iptables and pfSense), plus a generic fallback that says so.
- Time-windowed brute-force detection, so ten failures in a second and ten spread over a day are not treated the same.
- JSON and NDJSON output with a real exit-code contract, which makes it usable in cron and pipelines instead of just readable in a terminal.
- IOC extraction with defang, and optional GeoIP/ASN enrichment. It makes no network call unless you explicitly ask for one.
- Handles IPv4 and IPv6, and treats log content as untrusted input.

## v1 to v2

v1 was one 3,682-line script with 572 shellcheck findings and no tests. v2 is a rewrite: real detections instead of keyword counts, structured output, and 106 tests running in CI on Linux and macOS against both the source tree and the built single-file artifact.

A cross-vendor audit before tagging found five real defects that the tests had missed. Two were worth the whole exercise. On Debian and Ubuntu, sshd writes two lines for one failed login, and counting both doubled every number and halved the effective brute-force threshold. And IPv6 sources were invisible to every per-source detector, so an IPv6 attack got counted in the totals but produced no finding at all, which reads to an analyst as nothing happening. Both are fixed with regression tests that record what the tool used to report.

The lesson I kept: two of those bugs were hidden because my test fixtures were unrealistically clean. Real Wazuh alerts carry three different `name` fields, and mine only had one, so nothing exercised the code path that was picking the wrong one.

The CTF-oriented v1 analyzers (payments, IoT telemetry, Android logcat, SQLite, Squid, VSFTPD) were dropped to keep this focused on SOC triage. They are still available at tag v1.0.0.

Built in shell so it deploys anywhere with no install footprint.
