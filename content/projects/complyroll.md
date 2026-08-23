---
title: "ComplyRoll"
date: 2026-08-23
summary: "Compiles STIG and SCAP scanner output into schema-valid FedRAMP 20x vulnerability reports, with every response clock read from FedRAMP's published rules dataset."
tags: ["FedRAMP 20x", "Compliance", "Vulnerability Management", "STIG", "Python"]
---

{{< pill "indev" >}}In Dev · v0.3.0a0{{< /pill >}}

**Repo:** [github.com/ComplyRoll/ComplyRoll](https://github.com/ComplyRoll/ComplyRoll) · **PyPI:** [complyroll](https://pypi.org/project/complyroll/)

Announcement: [ComplyRoll: A Rollup Is Not a Report](/blog/complyroll-a-rollup-is-not-a-report/)

FedRAMP's Vulnerability Detection and Response and Vulnerability Evaluation and Reporting rules ask providers for a persistent, machine-readable vulnerability record with a response target on rated findings. Those rules become required on December 7, 2026, with default grace to March 7, 2027, and they reach Class B, C, and D certifications on both the 20x and Rev5 tracks. ComplyRoll compiles that record from the scanner output a provider already has. Today it reads the Class B and Class C rules on the 20x track; Class D and Rev5 are not implemented. It succeeds [stigroll](/projects/stigroll/): same hardened ingestion, aimed at the report the 2026 rules actually require.

## What it does

- Compiles CKLB, CKL, XCCDF, and ARF into a Vulnerability Detail Report in FedRAMP's official format plus a Markdown twin rendered from the same records. Schema-valid is not a compliance determination, and the tool says so in its own output
- Reads every response clock out of FedRAMP's published rules dataset, pinned by commit and digest. No deadline is hardcoded, impact ratings are never inferred from scanner severity, and a SHOULD target is labeled as one rather than reported as a violation
- Validates against the official schemas offline, printing a JSON Pointer for every failure plus the schema file's version and digest
- Records the same compile as an append-only event log and rebuilds the report from it byte for byte, so changing an evaluation creates history instead of overwriting it
- `store verify` walks the whole log: payload digests, sequence contiguity, schema objects, then every payload against its published contract

## Why it matters

FedRAMP's [20x assessor guidance](https://www.fedramp.gov/2026/assessors/fedramp-assessments/20x/) says to test whether automated validation runs at the stated cadence, covers the full scope, and produces the same result from the same facts, and that automation is not proof by itself: an assessor has to understand it well enough to test it. So the same artifacts in the same order, with the same `--as-of` instant, produce identical bytes, and that equality is enforced by a test rather than promised in a README. The tool also refuses to invent what it cannot know: a missing detection time has to be attested by an operator, never taken from file modification or ingestion time, and the report records that the time came from an attestation.

It is built for the assessor's side of the line as much as the provider's. Assessors do not configure or operate ComplyRoll on a provider's behalf, because under the 2026 recognition rules advisory work on an offering bars assessing that offering for two years. The assessor use is cold recomputation: run it over the provider's own artifacts and compare.

Pre-alpha and Apache-2.0. `pip install --pre complyroll`. It does not produce a FedRAMP submission package and is not FedRAMP approved. This is informational tooling, not compliance advice, so verify every clock against [fedramp.gov/2026](https://www.fedramp.gov/2026/) before you rely on it.

*FedRAMP® is a registered trademark of the U.S. General Services Administration. ComplyRoll is an independent project, not affiliated with, endorsed by, or approved by GSA or the FedRAMP Program Management Office.*
