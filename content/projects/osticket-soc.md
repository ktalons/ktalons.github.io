---
title: "osTicket SOC Tooling"
date: 2024-12-21
summary: "Installation, configuration, and incident-workflow tutorials for deploying osTicket as a SOC ticketing system."
tags: ["osTicket", "SOC Tooling", "Incident Response", "Documentation", "OT"]
---

{{< pill "live" >}}Live{{< /pill >}}

A trio of reference tutorials I wrote for deploying [osTicket](https://osticket.com) as a SOC ticketing backbone, from bare-metal install through analyst workflows. Captured during a CourseCareers IT Lab exercise.

## The three repos

- **[osticket-install](https://github.com/ktalons/osticket-install):** prerequisites and installation tutorial. Walks through getting osTicket up on a clean host.
- **[osticket-config](https://github.com/ktalons/osticket-config):** post-install configuration outline. Roles, teams, departments, SLA settings, ticket templates: the stuff that actually makes a fresh install usable.
- **[osticket-ticketdemo](https://github.com/ktalons/osticket-ticketdemo):** intake-through-resolution tutorial. End to end ticket lifecycle from analyst submission through triage, escalation, and closure.

## Why this matters

In a small SOC, ticketing is the spine. Bad ticketing → silent SLA misses, lost context between shifts, no incident audit trail. These tutorials are the playbook I built so future student analysts could spin up their own osTicket instance and pick up live tickets without burning a week reading the official docs.

**Stack:** osTicket · Apache · MySQL · PHP · Linux

This osTicket knowledge later transferred when our OT SOC team at UArizona Facilities Management evaluated and deployed [GLPI](https://glpi-project.org/), the similar IT service management platform we chose for day-to-day ticketing and asset and inventory management. The osTicket tutorials remain public for anyone standing up a similar small-SOC stack.
