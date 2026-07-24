---
title: "TalonSocLab Phase A: schedule update"
date: 2026-06-09
summary: "Phase A slipped. The Proxmox host running my Wazuh stack died with a hardware fault I can't reach. Here's the short version and the pivot."
tags: ["TalonSocLab", "incident", "homelab", "Proxmox", "Docker"]
---

> **Update, June 20, 2026:** I made the call and took the BUY path, a dedicated HP EliteDesk 800 G4 Mini I own outright, on docker-compose. Full reasoning in [The BUY Path](/blog/the-buy-path-data-plane-and-casa-reasoning-plane/).

Phase A was supposed to ship today. It isn't.

The Proxmox host my Phase A VMs run on has been offline since around May 29. It sits on a shared lab cluster I have test tenancy on, so I have no physical access. I found it dead on June 8 when I sat down to build and couldn't reach it on Proxmox or SSH.

I got in through the BMC, which lives on its own management VLAN. Health was Critical, and the log told the story: PSU input power lost, then a processor VRD fault on CPU 1. The box powers on but halts at POST before it ever reaches the bootloader. This one needs hands on the chassis and a PSU swap at minimum, and I don't control that timeline.

Here's the part I care about: the work survived the hardware. Every runbook, the architecture, the build schedule, and the recovery doc are all in the [repo](https://github.com/ktalons/talonsoclab). Phases B through D were never tightly coupled to this host, and the repo structure makes a pivot easy. I'm leaning toward docker-compose, which brings the Wazuh core up in minutes on anything that runs Docker.

The lesson is one I got to feel for real. Run your own lab and you own the infrastructure incident too. The platform breaks, the deadline doesn't move on its own, and the job is a clear-eyed look at what's recoverable and what the cheapest pivot is.

New ship date once I pick the substrate. The build continues.
