---
title: "CASA CyberAnalysis — Senior Capstone"
date: 2026-05-01
summary: "Docker-based multi-agent cybersecurity analysis platform built for the Arizona Cybersecurity Clinic senior capstone."
tags: ["Capstone", "Docker", "AI", "Security Analysis", "CASA", "MITRE ATT&CK"]
weight: 2
---

{{< pill "live" >}}Live{{< /pill >}}

**Org:** [github.com/Capstone-AI-Research-Project](https://github.com/Capstone-AI-Research-Project)
**My agent:** [github.com/Capstone-AI-Research-Project/pts-agent-kyle](https://github.com/Capstone-AI-Research-Project/pts-agent-kyle)
**Platform:** [github.com/Capstone-AI-Research-Project/Project-Twilight-Synapse](https://github.com/Capstone-AI-Research-Project/Project-Twilight-Synapse)

The senior capstone project for the **Arizona Cybersecurity Clinic Engineering Team** at the University of Arizona. CASA is built on **Project Twilight Synapse (PTS)** — a Docker-based multi-agent cybersecurity analysis platform that automates security log triage and produces analyst-friendly reports aligned to multiple frameworks (MITRE ATT&CK, CAR, NIST CSF, CIS Controls).

## My contribution — Agent Kyle

I built [`pts-agent-kyle`](https://github.com/Capstone-AI-Research-Project/pts-agent-kyle), the **CyberAnalysis Structured Agent** — a multi-agent cybersecurity investigation system with native MITRE ATT&CK/CAR, CIS Controls, and NIST CSF framework integration. It takes raw security data and produces framework-mapped analyst reports.

## The broader PTS platform

PTS is a team effort across multiple agents:

- **`Project-Twilight-Synapse`** — the core agentic platform foundation
- **`pts-agent-kyle`** *(mine)* — structured multi-agent CyberAnalysis with MITRE/CAR/NIST/CIS framework integration
- **`pts-agent-karen`** — behavior-based log and PCAP analysis agent
- **`PPP` (PTS PCAP Prep)** — Python intake script that converts raw `.pcap` files into PTS-ready JSON datasets

## Context

Built as part of an experiential learning initiative integrating hands-on security assessment work with enterprise-grade methodologies — delivering recommendations to community partners including K-12 institutions, critical infrastructure, small businesses, and non-profits. More on the clinic at [azcast.arizona.edu/arizona-cybersecurity-clinic](https://azcast.arizona.edu/arizona-cybersecurity-clinic).

**Stack:** Docker · multi-agent orchestration · Open WebUI · framework-mapped report generation

**Status:** Phases 1–4 complete (core pipeline + framework integrations). Phases 5–6 in progress (Open WebUI integration + hardening).
