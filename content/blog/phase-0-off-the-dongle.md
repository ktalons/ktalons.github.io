---
title: "Phase 0: Off the Dongle"
date: 2026-07-24
summary: "Phase 0 is complete: host hardened, stack green, backups proven, default credentials gone."
tags: ["TalonSocLab", "homelab", "Networking", "Wazuh", "Docker"]
---

Phase 0 is complete. The SOC box runs Ubuntu Server on hardware I own, wired through the managed switch instead of hanging off a WiFi dongle, with its address reserved and the BIOS set to power back on after an outage.

More importantly, the boring but critical items are done and verified. The Wazuh stack is green in Docker Compose. Volume snapshots restore cleanly to an external drive, tested, not assumed. Default credentials are gone: the stack's admin accounts were rotated to new secrets and the old passwords now return 401s, which is the only proof of rotation that counts.

Next up: Phase A, agents on real endpoints.
