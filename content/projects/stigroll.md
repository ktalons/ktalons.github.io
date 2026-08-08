---
title: "stigroll"
date: 2026-08-06
summary: "Rolls DISA STIG checklists and SCAP scan results up to NIST SP 800-53 control families via DISA's CCI mapping."
tags: ["STIG", "SCAP", "NIST 800-53", "Compliance", "Python"]
---

{{< pill "live" >}}Live{{< /pill >}}

**Repo:** [github.com/ktalons/stigroll](https://github.com/ktalons/stigroll) · **[3-minute walkthrough](https://youtu.be/V9yN8JgrrxU)**

A STIG finding is technology-specific, but a control assessor reports in NIST SP 800-53 controls. STIG Viewer resolves that mapping on screen, then drops it on export. stigroll applies DISA's CCI mapping to `.cklb`, `.ckl`, and XCCDF scan results and reports by control family in Markdown, CSV, or JSON, so the output answers "show me the evidence for AU-12" instead of handing someone a list of rule IDs.

## Why it matters

Python standard library only, one file, no install step. That matters on a hardened assessor workstation where installing a package is a change request. And nothing about the shape is STIG-specific: scan output plus a published mapping equals framework-level rollup, so the same three stages work against a different control framework by swapping the mapping file.
