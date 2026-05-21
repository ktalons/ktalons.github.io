---
title: "Violent Python"
date: 2026-05-01
summary: "A curated, runnable collection of cyber operations Python scripting assignments, with a cross-platform launcher and interactive showcase."
tags: ["Python", "Scripting", "Security Automation", "Forensics", "Network"]
weight: 9
---

{{< pill "indev" >}}In Dev{{< /pill >}}

**Repo:** [github.com/ktalons/Violent-Python](https://github.com/ktalons/Violent-Python)

A curated, runnable collection of my Python scripting assignments from cyber operations coursework. Informally named for the canonical *Violent Python* book by TJ O'Connor.

Active development. Functional today, more assignments and capability planned, with the showcase and test coverage expanded alongside the script collection.

## What's in the catalog

A growing set of scripts spanning the practical Python toolkit a SOC analyst or detection engineer ends up writing in production:

- **Parsing and extraction:** firewall log parser, memory regex extraction, memory unique-string mining, EXIF geotag extraction, MP3 ID3 carving.
- **Network:** TCP client and server, packet sniffer, PCAP asset mapping.
- **Forensics:** hashing forensics, LSB steganography, image search.
- **Threat intel and OSINT:** VirusTotal client, social-graph harvester, hashtag collector.
- **Data processing:** string search, file processor (OOP), web crawler / scraper, NLTK transcript analysis.

## How it ships

- **Cross-platform bootstrap:** `start.sh` for macOS and Linux, `start.ps1` for Windows.
- **Interactive showcase:** `main.py` lets you browse the catalog and run scripts in place, with persisted user preferences via `.vp_showcase_prefs.json`.
- **Per-OS requirements:** separate `requirements-linux.txt`, `requirements-macos.txt`, and `requirements-windows.txt` keep dependencies clean on every host.
