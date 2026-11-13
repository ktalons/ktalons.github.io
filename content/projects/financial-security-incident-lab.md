---
title: "Financial Security Incident Lab"
date: 2026-11-12
weight: 4
summary: "A synthetic account takeover and business email compromise investigation, from detection through containment and risk communication."
tags: ["Detection Engineering", "Incident Response", "Sigma", "MITRE ATT&CK", "Python"]
---

{{< pill "live" >}}Complete · v1.0.0{{< /pill >}}

**Repo:** [github.com/ktalons/financial-security-incident-lab](https://github.com/ktalons/financial-security-incident-lab)

I built a lab to work through an account takeover and business email compromise at a fictional credit union. It generates authentication and mailbox events, then correlates several findings into one incident for investigation. I used that evidence to reconstruct the timeline, document containment, and write a risk summary for a nontechnical reader.

## What's in the repo

- **Telemetry and detections:** A Python event generator and correlation engine, plus two Sigma rules and MITRE ATT&CK mappings.
- **Investigation notes:** A timeline, evidence assessment, and scope analysis based on the generated events.
- **Response and risk:** A containment checklist, incident report, and executive risk summary.

All events and identities are synthetic. The report separates what the evidence confirms from what an analyst would still need to investigate.
