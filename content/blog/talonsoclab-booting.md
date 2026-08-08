---
title: "TalonSocLab Booting..."
date: 2026-06-20
summary: "TalonSocLab stops being a plan: the hardware, the stack, and the phased buildout ahead."
tags: ["TalonSocLab", "homelab", "Docker", "Wazuh"]
aliases:
  - /blog/the-buy-path-data-plane-and-casa-reasoning-plane/
  - /blog/talonsoclab-phase-a-schedule-update/
---

TalonSocLab is my personal SOC, and this is the post where it stops being a plan and starts being a machine in my office. The short version: I bought an HP EliteDesk 800 G4 Mini, put Ubuntu Server on it, and moved the whole stack to Docker Compose. The lab now lives on hardware I own, and the entire deployment rebuilds from a git clone and a couple of volume snapshots.

The stack is Wazuh end to end: manager, indexer, and dashboard, with Suricata and Sysmon feeding it as the phases progress. Instead of simulated endpoints in VMs, the agents go on machines I actually use, a Windows box with Sysmon, my Mac, and the Ubuntu host itself. The telemetry is real because the computers are real.

The build runs in phases. Phase 0 is the substrate: host hardened, stack green, backups proven. Phase A puts agents on real endpoints. After that comes detection engineering against Atomic Red Team, an Active Directory attack and defense lab, and eventually a honeypot feeding an IOC pipeline. Each phase gets a write-up here, including whatever goes wrong along the way.
