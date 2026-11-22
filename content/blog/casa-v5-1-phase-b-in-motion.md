---
title: "CASA v5.1.0 | Phase B in Motion"
date: 2026-11-22T01:45:00-07:00
summary: "TalonSocLab has a measured noise baseline, 18 Sigma rules live in Wazuh, and its first Atomic Red Team runs. CASA v5.1.0 adds a Wazuh producer and a held-out evaluation set."
tags: ["TalonSocLab", "CASA", "Detection Engineering", "Wazuh"]
---

Both projects moved this month. Here is where each one stands.

## TalonSocLab

Phase B of [TalonSocLab](/projects/talonsoclab/) is detection engineering, and it started with the noise. On a quiet day the lab raised 20,708 alerts. One rule made up 96% of them, and it was the stack alerting on its own healthchecks. With that suppressed, the 7-day mean is 2,663 alerts a day against a target of 3,000. The details are in the [noise baseline](https://github.com/ktalons/talonsoclab/blob/main/phase-b-detection/NOISE-BASELINE.md).

- **Rule pack.** I ported 18 Sigma rules to Wazuh by hand and mapped each one to MITRE ATT&CK. They cover Sysmon network connections, registry changes, file events, process creation, and DNS queries. What each port taught me is in the [constructs notes](https://github.com/ktalons/talonsoclab/blob/main/phase-b-detection/CONSTRUCTS.md).
- **Tests.** Every rule has positive and negative cases, 431 in all. They run through a real `wazuh-analysisd` on a scratch manager. A pass means the engine alerted, not that my XML looked right.
- **Live fire.** I built a harness that runs Atomic Red Team tests on the Windows endpoint from a fixed allowlist. It takes a restore point first and checks that nothing is left behind. The first two sessions ran four tests, and the four rules behind them fired on real events.

## CASA

[CASA](/projects/casa/) shipped [v5.1.0](https://github.com/ktalons/casa-ai-agent/releases/tag/v5.1.0) on November 21.

- **Intake v3 and a Wazuh producer.** CASA can now build its own intake file from Wazuh alerts, from a recorded export or live over HTTPS.
- **More method.** Four new workflow cards bring the total to nine, one for each technique family it handles.
- **A held-out set.** I tune the prompts against one set of fixtures and score on another set the prompts never see. The held-out score is 36 of 36 on the machine checks and 29 of 30 on the rubric.

That score has limits. The held-out set is four synthetic fixtures that I wrote, and each one ran once. There is no score on live alerts yet.

## What's next

In the lab, I'm running the rest of the rule tests and then building a coverage tool with ATT&CK Navigator layers. After Phase B, the lab's alerts feed CASA for real. Follow along by [RSS](/blog/index.xml).
