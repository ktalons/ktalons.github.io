---
title: "ComplyRoll"
date: 2026-08-23
weight: 3
summary: "A pre-alpha Python tool that turns scanner output into traceable vulnerability records and schema-validated FedRAMP 20x reports."
tags: ["FedRAMP 20x", "Compliance", "Vulnerability Management", "STIG", "SARIF", "Python"]
---

{{< pill "indev" >}}Pre-alpha{{< /pill >}}

**Repo:** [github.com/ComplyRoll/ComplyRoll](https://github.com/ComplyRoll/ComplyRoll)

I built ComplyRoll to turn scanner output into vulnerability reports that someone else can reproduce and check. It preserves the source evidence, tracks decisions about each finding, and compiles reports in the FedRAMP 20x formats. Response deadlines trace back to the applicable rule or catalog, and the output can be validated offline against pinned schemas.

## What's in the repo

- **Evidence ingestion:** Readers for STIG, SCAP, SARIF, and other scanner formats that retain the original observations.
- **Report generation:** Vulnerability detail, accepted vulnerability information, and historical activity reports.
- **Reproducible history:** An append-only event store with tools to verify the history and rebuild a report.

ComplyRoll is independent, pre-alpha reporting tooling. Schema validation checks the report structure. Compliance determinations are outside the project’s scope.
