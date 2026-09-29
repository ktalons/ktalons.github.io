---
title: "bashedlogs: Don't Trust the Tag"
date: 2026-09-28T21:00:00-07:00
summary: "v2.0.1 is a security release. A Claude Code security review found five ways a crafted log could mislead the analyst reading the report. Fixing them turned up six more bugs, most of them cases where the tool quietly found nothing."
tags: ["bashedlogs", "Bash", "Log Analysis", "SOC Tooling"]
---

bashedlogs v2.0.1 started as housekeeping. I applied my code notation standard to all 32 source files. Each one now opens with a header that says what it does. Sections have headings. The spots where text from a log crosses a trust boundary carry `SECURITY:` markers. The change touched comments only. No executable line changed.

With the trust boundaries marked, I ran a Claude Code security review against the repo at medium effort. Fourteen researcher agents worked across four components and raised seven candidates. After deduplication, a panel checked six of them for reachability, impact, and defenses. Five held up: two medium, three low, and nothing critical or high. All five are fixed in this release, along with six more bugs I found while fixing them.

Three of the five were about the terminal. bashedlogs printed usernames, request paths, and DNS names straight from the log. An escape sequence hidden in one of those could erase findings already on screen or retitle the terminal. On terminals that allow it, it could even write to the clipboard. `--no-color` didn't help, since it only drops the tool's own colors. Now every control character in log text prints as a visible escape like `\x1b[2J`.

One was in the web log parser. Apache logs a double quote inside a request as `\"`. bashedlogs split fields on every quote, so a SQL injection placed after an escaped quote never reached the checks meant to catch it.

The last one cost the most to fix. sshd logs the username a client sends word for word, and the analyzer took the source address from the first `from` on the line. Someone attempting a login as `x from` plus an address of their choosing put that address on the brute force, cleared the machine actually attacking, and turned a later real login from the framed address into a critical finding naming a real user. My first fix required the program tag to say ssh. That fix hid a real brute force against sshd in a container, which reported no failures at all, because relays, rsyslog templates, and container runtimes all rewrite the tag. Position decides now. The address comes from sshd's own message, which starts after the tag, whatever the tag says.

Chasing that one turned up four more bugs that failed the same way. RFC 5424 keeps the program name in a field of its own. A container rewrites that field just as readily, and it was still required to name ssh. RFC 5424 also puts its timestamp after the priority and version. Only the first field was ever read as a time, so a brute force in any 5424 log raised no finding at all. A Solaris message id and an rsyslog repeat wrapper both sit between the tag and the event. Only one of each was stripped, so a re-stamped six-attempt burst counted as one. A journald JSON export glues a quote onto the last field, and `user=root"` was not counted as an attempt on root.

The last two came out of the escape work. Error messages printed file names raw to the same terminal. On macOS, one invalid byte under a UTF-8 locale could end a run with no report at all, so the analyzers now read log text as bytes under the C locale.

That is the pattern worth keeping. A tool that reports nothing looks exactly like a quiet night. The test suite went from 106 to 150 to pin each of these down.

One thing is still open, and it is the honest limit of a log reader. Attribution is trusted, not proved. Any program that writes attacker-controlled text at the start of its own message into the same file can plant a line. A cross-vendor audit of this release found three more cases of it. Closing them means the report has to say how it attributed each line instead of assuming it, which is the next release rather than a patch to this one. The [changelog](https://github.com/ktalons/bashedlogs/blob/master/CHANGELOG.md) lists all four under Known issues.

Grab it from the [v2.0.1 release](https://github.com/ktalons/bashedlogs/releases/tag/v2.0.1). It's still one file with nothing to build.
