---
title: "stigroll"
date: 2026-08-06
summary: "Rolls DISA STIG checklists and SCAP scan results up to NIST SP 800-53 control families via DISA's CCI mapping."
tags: ["STIG", "SCAP", "NIST 800-53", "Compliance", "Python"]
---

{{< pill "live" >}}Live{{< /pill >}}

**Repo:** [github.com/ktalons/stigroll](https://github.com/ktalons/stigroll) · **[2-minute walkthrough](https://youtu.be/V9yN8JgrrxU)**

A STIG finding is technology-specific, but a control assessor reports in NIST SP 800-53 controls. STIG Viewer resolves that mapping on screen, then drops it on export. stigroll applies DISA's CCI mapping to `.cklb`, `.ckl`, and XCCDF scan results and reports by control family in Markdown, CSV, or JSON, so the output answers "show me the evidence for AU-12" instead of handing someone a list of rule IDs.

## Why it matters

Python standard library only, one file, no install step. That matters on a hardened assessor workstation where installing a package is a change request. And nothing about the shape is STIG-specific: scan output plus a published mapping equals framework-level rollup, so the same three stages work against a different control framework by swapping the mapping file.

## Successor

A control-family rollup is an assessment artifact. FedRAMP's 2026 rules ask providers for a persistent, machine-readable vulnerability record instead, required on December 7, 2026, with default grace to March 7, 2027. **[ComplyRoll](/projects/complyroll/)** reuses stigroll's hardened ingestion to compile that record, and carries the original rollup forward byte for byte as a bundled command. Verify any date or clock against [fedramp.gov/2026](https://www.fedramp.gov/2026/) before relying on it. stigroll itself stays as it is.
