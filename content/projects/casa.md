---
title: "CASA"
date: 2026-10-05
weight: 2
summary: "A Claude Code plugin for evidence-backed SOC triage, built with structured intake, held-out evaluation, and analyst review."
tags: ["CASA", "Claude Code", "SOC Tooling", "MITRE ATT&CK", "NIST CSF", "TalonSocLab", "AI"]
---

{{< pill "live" >}}v5.2.0 shipped{{< /pill >}}

**Repo:** [github.com/ktalons/casa-ai-agent](https://github.com/ktalons/casa-ai-agent)

CASA is a Claude Code plugin I built to help analysts work through log, network, and endpoint investigations. It reads a structured intake and produces a brief that ties findings to the underlying evidence. I score it on test scenarios with known outcomes, including a held-out set the prompts were never tuned on. Investigation and response decisions stay with the analyst.

## What's in the repo

- **The plugin:** Specialist agents, a workflow card for each technique family, and commands for investigation, evaluation, and analyst-reviewed learning.
- **Intake and validation:** JSON contracts, a producer that builds the intake from Wazuh alerts, and checks that flag unsupported claims and references.
- **Evaluation fixtures:** Authoring and held-out scenario sets, a grader that checks briefs against known outcomes, and a runner that isolates each run.
- **Portable skill pack:** Three Agent Skills generated from the plugin's own rules, for agents that cannot load the plugin.

Scores come from fixtures, not live alerts. The live telemetry feed from [TalonSocLab](/projects/talonsoclab/) is still pending.
