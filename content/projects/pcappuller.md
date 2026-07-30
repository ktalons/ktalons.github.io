---
title: "PCAPpuller"
url: "/projects/pcappuller/"
aliases:
  - /projects/dapcappuller/
date: 2025-07-01
summary: "Python utility for high-volume packet collections: exact time windows, batch merges, resumable three-step workflow."
tags: ["Python", "PCAP", "Network Forensics", "tshark"]
---

{{< pill "indev" >}}In Dev · v0.4.0{{< /pill >}}

**Repo:** [github.com/ktalons/PCAPpuller](https://github.com/ktalons/PCAPpuller) · **Release:** [v0.4.0](https://github.com/ktalons/PCAPpuller/releases/latest)

Pull an exact time window out of a large rolling PCAP collection, merge it into one capture, and clean it for analysis. Built for the SOC case where the evidence you need is 15 minutes spread across thousands of rotating capture files.

## What it does

- Three-step resumable workflow: Select (mtime + patterns, no data copied) → Process (packet-time filter, batch merge, exact trim) → Clean (snaplen, convert, gzip)
- Batch merging with per-batch trimming keeps temp space bounded on long windows
- capinfos results cached, so re-runs over the same collection are fast
- CLI and GUI over the same engine; unit suite plus an end-to-end CI smoke test

## Install

```bash
pipx install "git+https://github.com/ktalons/PCAPpuller"
```

Or `brew install ktalons/tap/pcappuller` (CLI) / `brew install --cask ktalons/tap/pcappuller` (macOS GUI app). Needs the Wireshark CLI tools on PATH.

**Stack:** Python 3.10+, Wireshark CLI tools (mergecap, editcap, capinfos, tshark), FreeSimpleGUI

## Origin

Built when I got tired of hand-running tshark filters across dozens of capture files for OT SOC investigations. Used in real OT SOC workflows.
