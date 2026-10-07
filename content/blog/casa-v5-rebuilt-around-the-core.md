---
title: "CASA v5: Rebuilt Around the Core"
date: 2026-10-06T22:00:00-07:00
summary: "CASA was a fork of PAI with my SOC work layered on top, and about five percent of the tree was mine. v5 keeps that five percent, drops the rest, and ships as a Claude Code plugin with a fabrication lint and graded fixtures."
tags: ["CASA", "Claude Code", "SOC Tooling", "TalonSocLab", "MITRE ATT&CK"]
---

CASA started in February as a fork of Daniel Miessler's PAI, trimmed down, with my SOC agents and skills added on top. By July the parts that mattered were in: the intake contract TalonSocLab writes for it, three fixtures with ground truth, and the triage workflow. When I sat down this month to extend it, the question was whether to keep patching the fork or start over. The numbers decided. About five percent of the repository was CASA. The other ninety five was recon tooling, OSINT lookups, a voice server and a hook runtime, most of it dead and all of it inherited.

Worse, the parts I thought were working were not. The agents declared their tool restrictions in a frontmatter key Claude Code never reads, so every analyst could write files and fetch from the web. The orchestrator was itself a subagent, and subagents cannot spawn subagents. The eval loop had never run once. The official plugin validator passed all of it.

So v5 is a rebuild. The old tree is preserved at a tag, and the five percent came across by hand: the frozen v1 contract, the fixtures, and the rules I still agree with. Absence of an alert is not absence of activity. Group, don't itemize. Do not manufacture findings. Every hostname, rule ID and technique must trace to the intake.

That last rule is now code instead of prose. A deterministic lint reads every brief and every specialist finding and checks each rule ID, host, ATT&CK technique, CSF subcategory and IPv4 address against the intake or a reference table. The tables are regenerated from MITRE's STIX data and NIST's CSF 2.0 export, which is how I found that the old standards file cited the wrong sections of two NIST documents, right under its own line about never inventing section numbers. A brief that fails lint does not ship: the citation is stripped and the confidence drops a level.

The loop is OBSERVE, HYPOTHESIZE, INVESTIGATE, VERIFY, MAP, BRIEF, LEARN, run from the main thread with the specialists fanned out in parallel. There are eight of them now, with tool lists the plugin actually enforces, and a write guard that lets the detection engineer write only under proposed detections and the evaluator only under results. Alert text, hostnames and the recon delta are attacker influenced, so every agent treats them as data, and anything instruction shaped lands in a flag field instead of being followed.

The fixtures earned their keep. The quiet day fixture is an empty intake, and it exists to prove the system reports nothing when there is nothing, without inventing a host to worry about. It passes, but it also showed that v1 cannot tell a quiet night from a dead collector. The v2 intake adds a pipeline block for exactly that, along with the window, the cap, and a source address and account on each alert, so a chain across two hosts is data rather than inference. The brute force fixture failed its rubric once: three specialists disagreed on confidence and the orchestrator took the lowest. The fix was a rule to count independent evidence references instead, and the next run was six of six.

Packaging the lab integration turned up the bug I am most glad to have caught myself. Installed into another project, the skills told the model to run the validator by a path relative to the working directory, so it only ever worked from the CASA checkout. Every plugin path now goes through the plugin root variable, with a test that fails on a bare one. CodeQL then flagged two regex injections in the lint's host matcher, which took a regular expression from the command line. It takes a prefix now, validated and escaped. Both fixes are in 5.0.1.

The honest limits. The rubric judge is a model grading a model, so it stays advisory and the deterministic checks carry the gate. Permissions do not travel with a Claude Code plugin, so the shell allowlist has to be merged into each project; the install script does that. And the one status row still red is live telemetry, which waits on Phase B of the lab.

Release notes are in the [changelog](https://github.com/ktalons/casa-ai-agent/blob/main/CHANGELOG.md). The release is [v5.0.1](https://github.com/ktalons/casa-ai-agent/releases/tag/v5.0.1).
