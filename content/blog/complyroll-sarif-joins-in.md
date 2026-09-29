---
title: "ComplyRoll: SARIF Joins In"
date: 2026-09-28T20:00:00-07:00
summary: "Phase 1 is closed. FedRAMP fixed a gap in its rules dataset that ComplyRoll turned up. Phase 2 opens with SARIF input and a CISA KEV clock."
tags: ["ComplyRoll", "FedRAMP 20x", "Compliance", "SARIF", "Python"]
---

When I [announced ComplyRoll](/blog/complyroll-a-rollup-is-not-a-report/) last month, the next steps were the accepted-vulnerability and historical-activity reports, then SARIF. Both are on the main branch now, and so is the first enrichment that reads outside data.

Phase 1 closed when the Accepted Vulnerability Information report and the Historical VER Activity report merged on September 7. The compiler now builds one record set. All three reports are projections of it, so they read the same records instead of keeping three copies. One test records the same evaluations in two stores eleven days apart and proves the report bytes come out identical, so the time something was stored never leaks into a report.

Back in August I noticed five rules in FedRAMP's dataset that spell out a timeframe in the text but never fill in the structured field for it. A tool reading the dataset had no clock for them. I [raised it in FedRAMP's community discussions](https://github.com/FedRAMP/community/discussions/164). They answered on September 13. Most of the timeframes had been entered by hand. These five were missed. They fixed all five in release `2026.09.13.01`. `VDR-TFR-NMV`, the one inside the vulnerability rules ComplyRoll reads, now carries its three-month timeframe as data. ComplyRoll re-pinned to the corrected dataset on September 20. A tool that reads the rules instead of copying them ends up testing the rules too. That fix now reaches everyone who builds on the dataset.

Phase 2 opened on September 22 with a SARIF 2.1.0 adapter. Output from Trivy, Grype, Semgrep, CodeQL, Checkov, or any conforming producer now goes through the same pipeline as the STIG checklists, into all three reports and the event store. The adapter records what the log says and infers nothing past it. Scanner severity is kept as evidence and never sets PAIN, the same rule the STIG path follows. A suppressed result stays open with a warning instead of quietly disappearing.

Every imported log is treated as untrusted input. One folded observation is capped at 512 KiB, one artifact's observations at 256 MiB, and results per run at 50,000. Crossing any of those limits refuses the artifact instead of ingesting part of it.

The second slice merged on September 28. `--kev` takes a CISA Known Exploited Vulnerabilities catalog that you download yourself. ComplyRoll reads it from disk and never fetches it. A record is known exploited when one of its CVE identifiers matches the catalog exactly and that entry was added on or before the date you are reporting as of. The catalog's own due date becomes the clock, which is what `VDR-TFR-KEV` asks for, and that clock keeps running on a mitigated record until it is remediated or ruled a false positive. So passing `--kev` can raise the overdue count on a report that showed none. The summary prints both numbers rather than merging them. The fourteen goldens from before come out byte-identical, which is the proof that a run without `--kev` changed nothing.

The two pull requests ([18](https://github.com/ComplyRoll/ComplyRoll/pull/18) and [19](https://github.com/ComplyRoll/ComplyRoll/pull/19)) landed with 1332 tests passing on Python 3.11, 3.13, and 3.14. Review ran across two vendor families again: Claude for the skeptic and verify passes, OpenAI for the audit legs. Every confirmed finding is either fixed with a test or recorded in the architecture decision record as a trade-off.

Everything in this post is on the main branch and not yet in a PyPI release. `pip install --pre complyroll` still installs 0.3.0a0 from August. The [changelog](https://github.com/ComplyRoll/ComplyRoll/blob/main/CHANGELOG.md) and [build plan](https://github.com/ComplyRoll/ComplyRoll/blob/main/docs/BUILD_PLAN.md) have the full detail. This is informational tooling, not compliance advice, so verify every clock against [fedramp.gov/2026](https://www.fedramp.gov/2026/) before you rely on it.

Next up: CycloneDX or SPDX input.

*FedRAMP® is a registered trademark of the U.S. General Services Administration. ComplyRoll is an independent project, not affiliated with, endorsed by, or approved by GSA or the FedRAMP Program Management Office.*
