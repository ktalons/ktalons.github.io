---
title: "CASA"
date: 2026-10-05
weight: 2
summary: "A Claude Code plugin for evidence-backed SOC triage, built with structured intake, graded fixtures, and analyst review."
tags: ["CASA", "Claude Code", "SOC Tooling", "MITRE ATT&CK", "NIST CSF", "TalonSocLab", "AI"]
---

{{< pill "live" >}}v5.0.1 shipped{{< /pill >}}

**Repo:** [github.com/ktalons/casa-ai-agent](https://github.com/ktalons/casa-ai-agent)

CASA is a Claude Code plugin I built to help analysts work through log, network, and endpoint investigations. It reads a structured intake and produces a brief that ties findings to the underlying evidence. I use test scenarios with known outcomes to check the brief and leave investigation and response decisions with the analyst.

## What's in the repo

- **The plugin:** Specialist agents and workflows for investigation, evaluation, and analyst-reviewed learning.
- **Intake and validation:** JSON contracts, sample telemetry, and checks that flag unsupported claims and references.
- **Evaluation fixtures:** Reproducible scenarios and a grader that checks briefs against known outcomes.

The plugin ships with fixture-based evaluation. The live telemetry feed from [TalonSocLab](/projects/talonsoclab/) is still pending.
