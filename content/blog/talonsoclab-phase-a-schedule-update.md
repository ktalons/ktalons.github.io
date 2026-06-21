---
title: "TalonSocLab Phase A — schedule update"
date: 2026-06-09
summary: "Phase A was supposed to ship today. The Proxmox host my Wazuh stack lives on has been dark for ten days with a hardware fault I can't fix remotely. Here's where things stand and what I'm doing about it."
tags: ["TalonSocLab", "incident", "homelab", "Proxmox", "Docker"]
---

> **Update — June 20, 2026:** Decision made. I took the BUY path — a dedicated HP
> EliteDesk 800 G4 Mini I own outright — and committed to docker-compose. The full
> reasoning, the 16 GB constraints, and the new architecture (why I split the SOC into a
> data plane and a CASA reasoning plane) are in the follow-up:
> [The BUY Path, and Why I Split the SOC Into a Data Plane and a Reasoning Plane](/blog/the-buy-path-data-plane-and-casa-reasoning-plane/).

Phase A of [TalonSocLab](/projects/talonsoclab/) was scheduled to ship today. It isn't shipping today.

The short version: the Proxmox host my Phase A VMs run on — an HP ProLiant DL385 Gen10 Plus living on a shared lab cluster I have test tenancy on — has been offline since roughly **2026-05-29**. I noticed it on June 8 when I sat down for the planned build session and couldn't reach the host on either Proxmox 8006 or SSH. I don't have physical access to the box, so I can't fix it on my own. Phase A's ship date slips while I sort out the next move.

This post is a status update. The full diagnosis is interesting and I'll write that up separately. What follows is the part that matters for anyone following this build.

## What I checked

From the firewall side, the host's last outbound traffic was on May 29 — normal Proxmox repo and update calls — and then nothing. No ARP entry for it on the lab VLAN since. So it dropped off the wire entirely; this wasn't a service crash or a misconfiguration.

The BMC (iLO 5) is on a separate management VLAN and still reachable. That let me get inside the box without physical access. Health was reporting **Critical**. The Integrated Management Log showed the chain clearly:

- PSU input power lost
- BIOS defaults restored (NVRAM event, likely tied to the power loss)
- **Processor VRD critical fault** on CPU 1 (voltage regulator)
- Power supplies not redundant

The console showed the server powered on but stuck at *Start PXE over IPv4* with POST code 003E. Persistent boot order had been wiped to defaults, so the RAID-installed OS UEFI entry was buried under PXE attempts and raw bay entries. I tried reordering boot from System Utilities; the firmware refused the save with *"Boot order cannot be changed during POST."* By that point the console was also flagging *"Failed power supply, replace faulty power supply"* — the box was halting before the bootloader had a chance to run.

So even if I could fix the boot order, the firmware won't POST cleanly past the power-supply and VRD faults. This needs hands on the chassis.

## What's actually needed

Someone with physical access has to inspect both PSU modules, reseat AC cables, and almost certainly swap the failed PSU. If it really is a Processor VRD issue and not just power-event noise, that's a mainboard service event. I don't have a timeline for any of that.

## What this changes

I'm not committing a new ship date for Phase A in this post. That decision is the next thing I work on, and I'd rather pick once than pick twice.

What I want to flag is what *didn't* change:

- The architecture diagram, the deployment runbooks, the build schedule, the pfSense config export, the tenant-isolation runbook, and the PHOENIX recovery doc are all in the [TalonSocLab repo](https://github.com/ktalons/talonsoclab) and stay there. The work survived the hardware.
- Phases B, C, and D were always designed to be loosely coupled to Phase A. They don't all need the same host. Some of them don't need Proxmox at all.
- The repo's structure makes a pivot straightforward — I can re-target Phase A onto a different substrate (a single-node Proxmox, a docker-compose lab, or a cloud host) without rewriting the architecture.

The option I'm leaning toward is **docker-compose**. Wazuh ships an official compose stack, so the SIEM core comes up in minutes on anything that runs Docker — my workstation, a $200 SFF PC, a small cloud VM. That portability also sets up a downstream goal: once Phase A is stable I want to layer in my [CASA SOC analysis agent](https://github.com/ktalons/casa-ai-agent) on top, and a compose-defined lab is far easier to spin up, tear down, and ship to other people for that experimentation than a bespoke Proxmox build. I lose a little of the network-level realism (VLANs, pfSense, true bare-metal endpoints), but the detection engineering and analyst-workflow story — which is where the portfolio value actually sits — gets stronger, not weaker. The Proxmox-on-cluster build doesn't disappear; it becomes the "real iron" version I rebuild later when I'm not at the mercy of a single shared host.

## What I'm taking from this

Running your own lab means owning the infrastructure incident response too. A hardware fault on a shared cluster is, in miniature, the same problem a real SOC team deals with the week before a deliverable: the platform breaks, the deadline doesn't move on its own, and the answer is a sober look at what's recoverable, what's stranded, and what the cheapest viable pivot is.

I'll post the pivot decision and the new ship date as soon as I have them. The build continues.
