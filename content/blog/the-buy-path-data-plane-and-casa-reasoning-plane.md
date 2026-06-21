---
title: "The BUY Path, and Why I Split the SOC Into a Two Planes"
date: 2026-06-20
summary: "I bought the box, committed to docker-compose, and in the process drew a hard line between the SOC that collects data and the agent that reasons over it."
tags: ["TalonSocLab", "homelab", "Docker", "Wazuh", "Detection Engineering", "CASA", "AI"]
---

Last time I left [Phase A](/blog/talonsoclab-phase-a-schedule-update/) on a cliffhanger.

## I bought the box

I went with the BUY path: an HP EliteDesk 800 G4 Mini — i5-8500T, 16 GB RAM, 256 GB NVMe. Small, quiet, cheap, and most importantly *mine*. The lab no longer lives at the mercy of a shared cyber-range host that admin policy can wipe without notice. That single fact changes the whole risk model of the project. My recovery runbook used to be about surviving someone else's wipe; now it's about surviving my own hardware, and that's a problem I actually control.

And I committed to **docker-compose** over the old Proxmox VM topology. I'd been leaning that way in the last post, and standing the stack up in containers on a box I own made it obvious. Portable, reproducible, version-controlled, and it rebuilds from a `git clone` plus a couple of volume snapshots in under an hour.

## 16 GB is a constraint, and I'm not going to pretend it isn't

Here's the honest part. 16 GB carries Phases A and B comfortably — Wazuh single-node in containers, tuned so the indexer never starves the manager, with headroom left for an fleeting recon job. It does **not** carry Phase C's Active Directory range or Phase D's honeynet-plus-OpenCTI stack. Those are RAM- and disk-hungry, and pretending otherwise would just set up a face-plant later.

So I scoped around it. C and D get cloud-bursted or wait on a planned 64 GB + 1 TB upgrade — and Phase D's honeynet belongs in the cloud anyway right? I believe the constraint forced a more correct architecture, not a worse one.

The other thing docker-compose cost me was network realism: no more pfSense edge, no more VLAN segmentation, no Windows endpoint VMs. Endpoints are now **Wazuh agents on real devices** — my daily Windows machine with Sysmon, my Mac, the Ubuntu host itself. Zero extra RAM, and the telemetry is *more* real, not less, because it's coming off machines I actually use. The old Proxmox design isn't deleted; it's archived in the repo as provenance. The pivot is part of the story.

## The line I actually care about: data plane vs. reasoning plane

The decision I'm proudest of isn't the hardware. It's a line I drew through the middle of the system.

**TalonSocLab is the data plane.** Its job is to collect, filter, and cite Wazuh alerts, Suricata events, recon deltas deterministically. It produces a structured intake artifact. It does not reason, and it does not decide. That's it. Boring on purpose.

**CASA is the reasoning plane.** [CASA](https://github.com/ktalons/casa-ai-agent) — Cybersecurity Analysis Support Agent — is a separate project: a PAI-based multi-agent system on Claude, with specialist agents for log analysis, network analysis, and purple-team mapping, all NIST-aligned and human-in-the-loop. It consumes the data plane's intake and does the actual analysis.

Keeping these two apart is the whole point. Deterministic infrastructure underneath, agentic reasoning on top, with a clean, well-cited artifact as the contract between them. When the reasoning layer hallucinates or drifts and it will, I can see exactly what data it was handed because the data plane stamped and cited all of it. You can't audit an agent's judgment if you can't reproduce its inputs.

It also means I'm not locked to one model or one vendor. Today CASA runs on Claude. The interface between the planes is a JSON schema, not an API key.

## Where this is heading

That separation opens a door I want to walk through eventually. Right now the data plane hands its intake straight to an external agent. The version in my head puts a **guarded local tier** in between and it does two jobs.

First, an environment-aware local model, fine-tuned on my own network's baseline, that knows what "normal for us" looks like and pre-triages before anything leaves the box. Most of what a SOC sees is familiar; a model that recognizes its own environment can shrink the external surface dramatically.

Second, and this is the one I really care about: an **egress privacy gateway**. Before any artifact goes to Claude, OpenAI, Gemini, whoever — encrypt, redact, tokenize the sensitive and protected fields. The external agent reasons over sanitized data; raw PII, secrets, and internal identifiers never cross the perimeter. Security by separation of data, enforced in code, not in a policy doc.

That's not built yet, and I'm not going to over-engineer toward it before the basics ship. But the reason it's *addable* later instead of a rewrite is that the intake is already a deterministic, well-cited chokepoint. Get the boring part right and the ambitious part becomes a stage you bolt on, not a foundation you tear out.

## Next

The box lands Wednesday. Phase 0 is the cutover — Ubuntu, Docker, the stack green, backups verified — and then Phase A is real telemetry from real endpoints with dashboards on top. I'll post when it's live, with screenshots, not promises.

Let's Go.
