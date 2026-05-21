---
title: "osTicket SOC Tooling"
date: 2024-12-21
summary: "Installation, configuration, and incident-workflow tutorials for deploying osTicket as a SOC ticketing system."
tags: ["osTicket", "SOC Tooling", "Incident Response", "Documentation"]
weight: 10
---

{{< pill "live" >}}Live{{< /pill >}}

A trio of tutorials I wrote for deploying [osTicket](https://osticket.com) as a SOC ticketing backbone — from bare-metal install through analyst workflows. Used in my OT SOC work at the University of Arizona Facilities Management department.

## The three repos

- **[osticket-install](https://github.com/ktalons/osticket-install)** — Prerequisites and installation tutorial. Walks through getting osTicket up on a clean host.
- **[osticket-config](https://github.com/ktalons/osticket-config)** — Post-install configuration outline. Roles, teams, departments, SLA settings, ticket templates — the stuff that actually makes a fresh install usable.
- **[osticket-ticketdemo](https://github.com/ktalons/osticket-ticketdemo)** — Intake-through-resolution tutorial. End-to-end ticket lifecycle from analyst submission, triage, escalation, and closure.

## Why this matters

In a small SOC, ticketing is the spine. Bad ticketing → silent SLA misses, lost context between shifts, no incident audit trail. These tutorials are the playbook I built so future student analysts could spin up their own osTicket instance and pick up live tickets without burning a week reading the official docs.

**Stack:** osTicket · Apache · MySQL · PHP · Linux

Used in production at UArizona Facilities Management — same instance that backs the OT SOC's day-to-day ticket flow alongside GLPI for asset/inventory management.
