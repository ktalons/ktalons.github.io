---
title: "The BUY Path, and Why I Split the SOC Into Two Planes"
date: 2026-06-20
summary: "I bought the box, moved to docker-compose, and drew a hard line between the SOC that collects data and the agent that reasons over it."
tags: ["TalonSocLab", "homelab", "Docker", "Wazuh", "Detection Engineering", "CASA", "AI"]
---

Last post ended on a [cliffhanger](/blog/talonsoclab-phase-a-schedule-update/): my Proxmox host died and I hadn't picked a way forward. I picked.

## I bought the box

I went with the BUY path, an HP EliteDesk 800 G4 Mini. Small, quiet, cheap, and mine. The lab no longer lives on a shared host someone else can wipe. I also moved from the old Proxmox VMs to docker-compose, so the whole stack now rebuilds from a git clone and a couple of volume snapshots in under an hour.

The box has 16 GB of RAM, and I won't pretend that's plenty. It carries Phases A and B fine. It does not carry Phase C's Active Directory range or Phase D's honeynet, so those get cloud-bursted or wait on an upgrade. The constraint pushed me toward a cleaner design, not a worse one.

Containers did cost me some network realism: no pfSense edge, no VLANs, no Windows endpoint VMs. So endpoints are now Wazuh agents on machines I actually use, my Windows daily driver with Sysmon, my Mac, and the Ubuntu host itself. Zero extra RAM, and the telemetry is more real, not less.

## The line I actually care about

The decision I'm proudest of isn't the hardware. It's a line I drew through the middle of the system.

TalonSocLab is the data plane. Its only job is to collect, filter, and cite: Wazuh alerts, Suricata events, and recon deltas, all turned into one structured intake file. It doesn't reason and it doesn't decide. Boring on purpose.

[CASA](https://github.com/ktalons/casa-ai-agent) is the reasoning plane. It's a separate project, a multi-agent system on Claude with specialists for log, network, and purple-team analysis, NIST-aligned and human-in-the-loop. It reads the intake and does the actual thinking.

Keeping them apart is the whole point. When the reasoning layer drifts, and it will, I can see exactly what data it was handed, because the data plane stamped and cited all of it. You can't audit an agent's judgment if you can't reproduce its inputs. It also means I'm not married to one model or vendor. The contract between the planes is a JSON schema, not an API key.

## Where it's heading

Eventually I want a guarded local tier sitting between the two. One piece is an environment-aware model that knows what normal looks like for my network and pre-triages before anything leaves the box. The other is an egress gateway that redacts and tokenizes sensitive fields, so the external agent only ever sees sanitized data. None of that is built yet, and I won't over-engineer toward it before the basics ship. It's addable later precisely because the intake is already a clean, deterministic chokepoint.

## Next

The box lands Wednesday. Phase 0 is the cutover: Ubuntu, Docker, stack green, backups verified. Then Phase A brings real telemetry from real endpoints. I'll post when it's live, with screenshots instead of promises.
