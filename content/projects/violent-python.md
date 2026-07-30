---
title: "Violent Python"
date: 2025-05-01
summary: "A curated, runnable collection of cyber operations Python scripting assignments, with a cross-platform launcher and interactive showcase."
tags: ["Python", "Scripting", "Security Automation", "Forensics", "Network"]
---

{{< pill "indev" >}}In Dev{{< /pill >}}

**Repo:** [github.com/ktalons/Violent-Python](https://github.com/ktalons/Violent-Python)

A curated, runnable collection of my Python scripting assignments from cyber operations coursework. Informally named for the canonical *Violent Python* book by TJ O'Connor.

Active development. Ten of the twenty-one assignments are written and running; the rest are placeholders on the roadmap.

## In the catalog today

Scripts spanning the practical Python toolkit a SOC analyst or detection engineer ends up writing:

- **Parsing and extraction:** firewall log parser, memory regex extraction, memory unique-string mining, EXIF geotag extraction.
- **Forensics:** hashing forensics with duplicate detection, PIL image search.
- **Data processing:** string search, file processor (OOP), web crawler / scraper.

## Planned

TCP client and server, packet sniffer, PCAP asset mapping, LSB steganography, MP3 ID3 carving, NLTK transcript analysis, VirusTotal client, hashtag collector, social-graph harvester. The directories exist with a README stating what each will do.

## How it ships

- **Cross-platform bootstrap:** `start.sh` for macOS and Linux, `start.ps1` for Windows. Python 3.10 or newer, with Tk.
- **Interactive showcase:** `main.py` lets you browse the catalog and run scripts in place, in your own preferred terminal, with preferences persisted outside version control.
- **Checked on every push:** ruff, byte-compilation, and a pytest suite on 3.10 and 3.13. The tests cover the seams worth covering, including a property that a chunked memory scan returns the same result at any chunk size.
