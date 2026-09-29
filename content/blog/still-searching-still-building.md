---
title: "Still Searching, Still Building"
date: 2026-09-28T19:00:00-07:00
summary: "Two first-round interviews, two rejections, and full-time driving to cover the bills. The job search continues. ComplyRoll, bashedlogs, and TalonSocLab keep moving at a slower pace."
tags: ["Job Search", "ComplyRoll", "bashedlogs", "TalonSocLab"]
---

I got two first-round interviews out of this job search. One was for a junior FedRAMP cybersecurity analyst role and the other was for an IT specialist role. Both ended in a no.

Since late May I have sent more than 100 applications to over 80 employers. Most of them get no response at all. The rest come back as rejections. Most postings ask for an active security clearance, two or more years of professional experience, or both. I have a little over a year of paid SOC work. I'm a U.S. citizen and eligible for a clearance. Getting one takes an employer willing to sponsor it. Most postings want it finished before day one.

To pay the bills I started driving rideshare and food delivery full time. That leaves a lot less time at the keyboard, so ComplyRoll and TalonSocLab are both running behind the timelines I set for them.

ComplyRoll has still moved the most. Phase 1 is finished, which added the accepted-vulnerability and historical-activity reports alongside the detail report. Along the way I noticed five rules that spell out a timeframe in the text but leave it blank in the data a tool actually reads. I [flagged it with FedRAMP](https://github.com/FedRAMP/community/discussions/164). They said it was a data-entry miss and fixed it. ComplyRoll now uses the corrected rules. Two pieces of Phase 2 have merged since. One reads SARIF, so output from scanners like Trivy, Grype, and Semgrep lands in the same pipeline as the STIG checklists. The other reads CISA's catalog of known exploited vulnerabilities and puts the deadline FedRAMP attaches to those findings on a clock. The [project page](/projects/complyroll/) has the details.

bashedlogs got two kinds of attention. First I applied my code notation standard across the whole codebase. Every source file now has a consistent header. The spots where untrusted log content crosses a trust boundary are marked in the code. Then I ran a Claude Code security review against it at medium effort. It came back with five findings: two medium, three low, and nothing critical or high. All five are fixed in v2.0.1, along with six more bugs I found while fixing them. Most of those were cases where the tool quietly reported nothing. The [project page](/projects/bashedlogs/) has the details.

TalonSocLab is still in Phase B, detection engineering. Progress there is slower, but the plan hasn't changed. Atomic Red Team tests go on offense and Sigma rules go on defense, all running against the telemetry Phase A already collects.

I'm still looking for my first full-time role in SOC analysis, detection engineering, security engineering, or FedRAMP compliance engineering, in Tucson or remote. Everything above is work I would be glad to do full time on a team. If your team is hiring, or you just want to talk shop, my [contact page](/contact/) has the best ways to reach me.
