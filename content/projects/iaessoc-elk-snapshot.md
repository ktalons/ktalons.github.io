---
title: "IAES SOC — ELK Stack Snapshot"
date: 2026-05-21
summary: "Public snapshot of my OT SOC engineering work at UArizona FM: ECS-mapped Logstash ingestion pipelines plus three custom operations tools — DLQ Watcher, DLQ Manager, and UTIS Reports Ingestion Helper."
tags: ["ELK", "Logstash", "Elasticsearch", "ECS", "OT", "ICS", "SIEM", "Suricata", "Zeek", "SOC Tooling"]
weight: 3
---

{{< pill "live" >}}Live{{< /pill >}}

**Repo:** [github.com/ktalons/IAESsoc-elk-snapshot](https://github.com/ktalons/IAESsoc-elk-snapshot)

A public repo snapshot of the work I completed at the University of Arizona **IAES FM SOC** as a student SOC engineer and analyst — the production ELK estate that monitors building automation systems across three Facilities Management ICS sites supporting the campus.

## What's in here

The repo captures both the **ingestion plumbing** (Logstash pipelines mapped to Elastic Common Schema) and the **operations tooling** that keeps that plumbing healthy in production.

### ECS-mapped Logstash pipelines

Multi-pipeline Logstash topology with an input router fanning out to data-source-specific parsers, every field aligned to **Elastic Common Schema** so downstream Wazuh dashboards, hunts, and saved searches behave consistently across sources:

- **`00-input-router.conf`** — top-level pipeline that classifies inbound events by source and routes to the right parser
- **`10-ics-alert.conf`** — custom ICS alert ingestion for building-automation-system telemetry (HVAC, metering, electricity)
- **`20-suricata.conf`** — Suricata EVE-JSON ingestion with ECS field mapping
- **`30-zeek-conn.conf`** — Zeek `conn.log` ingestion (and the foundation for adding other Zeek logs)
- **`pipelines.yml`** — the multi-pipeline topology binding it all together

Architecture and reference docs (`00-architecture.md`, `03-pipelines-reference.md`) and 7 architecture diagrams document the data flow end-to-end.

### Custom Logstash operations tools

Real-world SOC tooling I wrote to handle the rough edges of running Logstash in production:

- **DLQ Watcher** — monitors the Logstash Dead Letter Queue and surfaces parse / pipeline failures before they pile up silently. See [`DLQ-WATCHER-README.md`](https://github.com/ktalons/IAESsoc-elk-snapshot/blob/main/DLQ-WATCHER-README.md).
- **DLQ Manager** — companion tool for triaging and replaying DLQ entries once the underlying parse issue is fixed. Closes the loop so events aren't lost. See [`DLQ-MANAGER-README.md`](https://github.com/ktalons/IAESsoc-elk-snapshot/blob/main/DLQ-MANAGER-README.md).
- **UTIS Reports Ingestion Helper** — purpose-built helper for ingesting UTIS reports into the ELK estate with proper ECS shape. See [`UTIS-REPORTS-README.md`](https://github.com/ktalons/IAESsoc-elk-snapshot/blob/main/UTIS-REPORTS-README.md).

## Why this matters

OT SOC environments live and die on log-pipeline reliability. A silently-failing parser is worse than no parser — it gives analysts false confidence that they're seeing what's there. The DLQ Watcher + DLQ Manager pair was built specifically to make Logstash failures *visible and recoverable* instead of opaque and lossy. Standard SOC-engineering hygiene that you usually have to learn the hard way.

## Stack

Elasticsearch · Logstash · Kibana · Filebeat · Suricata · Zeek · ECS · custom Python tooling
