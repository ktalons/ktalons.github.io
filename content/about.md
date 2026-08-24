---
title: "About"
url: "/about/"
summary: "Kyle Versluis, a cybersecurity analyst and engineer in Tucson building a personal SOC in public."
---

I'm Kyle, a cybersecurity analyst and engineer based in Tucson, Arizona. My real world experience so far is defensive security operations, with a particular interest in the places where IT security meets industrial and building systems.

I ran an OT security operations center for the University of Arizona's Facilities Management team, where I built and operated an ELK-based SIEM across three industrial sites. I captained [the Cyber Saguaros](https://cybersaguaros.com/) CTF team through national competitions and now hang out as an alum in the club's discord. Before security I spent sixteen years in claims and operations roles, learning how organizations actually run and how to talk to everyone from field techs to executives. It also taught me how businesses actually work and how to frame security problems in business terms fairly easily.

Outside of work hours I run [TalonSocLab](/projects/talonsoclab/), a personal SOC that feeds [CASA](https://github.com/ktalons/casa-ai-agent), an AI-assisted analysis project. My home lab also allows me to build and explore tools like [stigroll](https://github.com/ktalons/stigroll) and [PCAPpuller](/projects/pcappuller/) that ship along the way. The lab is where I pressure-test what I know and document what I learn.

Most of my attention lately has gone to FedRAMP. The 2026 Consolidated Rules hand providers a machine-readable rules dataset and official report schemas, and I wanted to see how well that holds up once you actually build against it. That turned into [ComplyRoll](/projects/complyroll/), which picks up where stigroll left off: it compiles STIG and SCAP output into schema-valid vulnerability reports and reads every response deadline out of FedRAMP's published rules instead of hardcoding it. Building against the dataset also turned up five rules that state a cadence in prose but never encode it, which I [raised with FedRAMP directly](https://github.com/FedRAMP/community/discussions/164).

If you want to talk security, critical infrastructure, compliance automation, or home labs, [let's connect](/contact/).
