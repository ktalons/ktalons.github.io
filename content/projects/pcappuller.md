---
title: "PCAPpuller"
url: "/projects/pcappuller/"
aliases:
  - /projects/dapcappuller/
date: 2025-07-01
summary: "Python utility for high-volume packet collections: low memory, batch merges, parallel metadata scans."
tags: ["Python", "PCAP", "Network Forensics", "tshark"]
weight: 7
---

{{< pill "indev" >}}In Dev{{< /pill >}}

**Repo:** [github.com/ktalons/PCAPpuller](https://github.com/ktalons/PCAPpuller)

A small Python utility for high-volume packet collections. Built for speed and scale: low memory, batch merges, parallel metadata scans, and a `--tmpdir` argument so your `/tmp` doesn't blow up.

Active development. Functional today, more capability and testing planned.

## Origin

Built when I got tired of hand-running tshark filters across dozens of capture files for OT SOC investigations. Used in real OT SOC workflows.
