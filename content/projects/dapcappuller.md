---
title: "daPCAPpuller"
date: 2025-07-01
summary: "High-performance Python utility — tshark wrapper for large-scale packet capture analysis with batch processing."
tags: ["Python", "PCAP", "Network Forensics", "tshark"]
weight: 7
---

{{< pill "live" >}}Live{{< /pill >}}

**Repo:** [github.com/ktalons/PCAPpuller](https://github.com/ktalons/PCAPpuller)

A tshark wrapper for working with large PCAP corpuses. Built when I got tired of hand-running tshark filters across dozens of capture files for OT SOC investigations.

Features:

- Batch processing across PCAP directories
- Parallelized extraction
- Common-case filter presets (DNS, TLS SNI, HTTP user-agents, beaconing patterns)
- CSV / JSON output for downstream analysis

Used in real OT SOC workflows — works on multi-gigabyte capture sets without blowing up memory.
