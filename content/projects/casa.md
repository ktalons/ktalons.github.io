---
title: "CASA"
date: 2026-10-05
weight: 2
summary: "The reasoning plane over TalonSocLab: a Claude Code plugin that turns the lab's intake artifact into one explainable analyst brief, every claim traced to its evidence, nothing acted on without a human."
tags: ["CASA", "Claude Code", "SOC Tooling", "MITRE ATT&CK", "NIST CSF", "TalonSocLab", "AI"]
---

{{< pill "live" >}}v5.0.1 shipped{{< /pill >}}

**Repo:** [github.com/ktalons/casa-ai-agent](https://github.com/ktalons/casa-ai-agent) · **Release:** [v5.0.1](https://github.com/ktalons/casa-ai-agent/releases/tag/v5.0.1)

Latest: [CASA v5: Rebuilt Around the Core](/blog/casa-v5-rebuilt-around-the-core/)

CASA is the reasoning plane over [TalonSocLab](/projects/talonsoclab/). The lab collects, filters and cites; CASA reads the intake artifact the lab writes and produces one analyst brief where every claim points at the evidence behind it. It is a Claude Code plugin: eight specialist agents (log, network and endpoint analysts, a purple team mapper, a detection engineer, threat intel, an evaluator, and a scope gated pentester stub) run under one investigation loop, OBSERVE, HYPOTHESIZE, INVESTIGATE, VERIFY, MAP, BRIEF, LEARN. CASA remediates nothing, and nothing it learns is kept without an analyst signing off.

## What makes it trustworthy

- **A fabrication lint.** Every rule ID, host, ATT&CK technique, CSF subcategory and address in a brief must trace to the intake or to a reference table, or the brief does not ship. The tables are regenerated from MITRE's STIX data (ATT&CK v19.2) and NIST's CSF 2.0 export, and every NIST section citation was checked against the published PDF.
- **Graded fixtures.** Three hand built intakes with machine checkable ground truth, including a quiet day negative control that must produce no findings. A grader runs nine checks on every brief; an evaluator agent judges the rest with verbatim quotes and stays advisory.
- **Untrusted telemetry.** Alert text, hostnames and the recon delta are attacker influenced. Every agent treats them as data, and anything instruction shaped is flagged, never followed.
- **A small blast radius.** Agents carry explicit tool lists, a write guard limits the two agents that write files to their own directories, and the shell allowlist admits only read only analysis commands.

## Status

Every brief kept from the fixture runs grades nine of nine on the machine checks. The one open row is live telemetry: the lab's digest producer now emits the v2 intake (window, filter, pipeline liveness, per alert correlation fields) but is not deployed until Phase B of the lab lands. The PAI derived v4 tree is preserved at `v4.0.0-pai-legacy`.

**Stack:** Claude Code plugin · Bun and TypeScript, zero runtime dependencies · JSON Schema contracts · MITRE ATT&CK · NIST CSF 2.0 · Sigma and Wazuh rule drafts
