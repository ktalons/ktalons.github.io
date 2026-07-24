---
title: "Phase 0: Off the Dongle"
date: 2026-07-24
summary: "A short one after a quiet stretch. The delay was equipment; Phase 0 is now wired through the switch and the Wazuh stack is green on the new link."
tags: ["TalonSocLab", "homelab", "Networking", "Wazuh", "Docker"]
---

Short update after a quiet stretch. The pause was equipment. I'd rather stage the next phase right than half-build it, so I spent it lining up a RAM bump for the Dell (my AD-lab box), a Raspberry Pi 5 kit for a future Zeek/Suricata sensor, and the long ethernet run to wire the rack properly instead of leaning on a WiFi dongle.

That last piece unblocked Phase 0. The SOC box is now wired through the managed switch, its address reserved, the BIOS set to power back on after an outage, and the Wazuh stack came back green on the new link. No more "interim" anything.

One gotcha worth writing down: the wired NIC came up at full gigabit but never pulled an IP. The installer had brought the interface up without DHCP. It's ten minutes of netplan once you see it, or an hour if you assume it's the cable.

Next up: agents on real endpoints. Phase A.
