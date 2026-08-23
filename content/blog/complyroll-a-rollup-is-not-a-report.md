---
title: "ComplyRoll: A Rollup Is Not a Report"
date: 2026-08-23
summary: "Pre-alpha. ComplyRoll compiles STIG and SCAP output into a schema-valid FedRAMP 20x Vulnerability Detail Report, with every response clock read from FedRAMP's published rules dataset instead of guessed from scanner severity."
tags: ["ComplyRoll", "FedRAMP 20x", "Compliance", "STIG", "Python"]
---

FedRAMP's 2026 rules ask providers for a document [stigroll](/projects/stigroll/) cannot produce. ComplyRoll is my attempt at that document. It is pre-alpha, it is public, and it installs with `pip install --pre complyroll`.

Two rulesets carry the requirement, Vulnerability Detection and Response and Vulnerability Evaluation and Reporting, and they become required on December 7, 2026, with default grace to March 7, 2027. What gets published is persistent and machine-readable, and rated findings carry a response target.

Those targets do not come from severity. A provider rates each vulnerability three separate ways: the Potential Agency Impact rating (PAIN) from N1 to N5, whether it is reachable from the internet, and whether exploitation is likely. Crossing those picks the clock, and the clock runs from completed evaluation rather than from detection. At Class C an N5 finding carries a 2-day target when it is internet reachable and likely exploitable, 4 days when exploitation is likely but it is not reachable, and 16 days when exploitation is not likely. Those are SHOULD targets rather than MUST, and collapsing that distinction reports a violation the provider did not commit. Those numbers live in a [rules dataset](https://github.com/FedRAMP/rules) FedRAMP maintains in git, so a tool should read them instead of keeping its own copy. Reachability and exploitability are facts about the provider's environment, and a scanner does not decide them.

ComplyRoll compiles CKLB, CKL, XCCDF, and ARF into a schema-valid Vulnerability Detail Report with a Markdown twin, validated offline against schemas pinned by digest inside the package. Every deadline it prints names the rule it came from and whether that rule is a MUST or a SHOULD. The [project page](/projects/complyroll/) covers the rest.

FedRAMP's [20x assessor guidance](https://www.fedramp.gov/2026/assessors/fedramp-assessments/20x/) says to test whether automated validation "runs at the stated cadence, covers the full scope, and produces the same result from the same facts," and that automation is not proof by itself. So the same artifacts in the same order, with the same `--as-of` instant, produce identical bytes. A persisted path records the same compile as an append-only event log and rebuilds the report from that history byte for byte. Change an evaluation and the store appends a second one. The first stays readable, which is the difference between a system of record and a spreadsheet.

Two refusals took the longest to get right. The schema requires a detection time on every vulnerability and real checklists routinely carry none, so the tool will not substitute file modification time or the time you happened to run it. You attest a time yourself, and the report says the time came from an attestation. The second refusal is the one above: PAIN never comes from a scanner's severity field. Both failures are quiet. They produce a document that validates cleanly and is wrong, which is the worst output a compliance tool can give you.

I wrote the spec and the architecture decision records, then had AI write most of the code against them. The work that mattered was proving it wrong, across two vendor families rather than one, because same-family reviewers agree with each other too easily. The second family's pass caught two bugs the first missed: a race where two concurrent runs could commit the same tracking ID, and a failed ingest that deleted a store another run had just written. Both only appear under concurrency, in an append-only store where a lost write is the whole point of failure. Five rounds later the goldens match byte for byte whether the tool runs from source or from an installed wheel.

Version 0.3.0a0, Apache-2.0, on PyPI with build provenance attestations. It does not produce a FedRAMP submission package and it is not FedRAMP approved. This is informational tooling, not compliance advice, so verify every clock against [fedramp.gov/2026](https://www.fedramp.gov/2026/) before you rely on it.

Next up: the accepted-vulnerability and historical-activity reports, then adapters past the STIG family, SARIF and SBOM first, so Trivy and Grype output lands in the same pipeline.

*FedRAMP® is a registered trademark of the U.S. General Services Administration. ComplyRoll is an independent project, not affiliated with, endorsed by, or approved by GSA or the FedRAMP Program Management Office.*
