---
title: "Home VPN Lab"
date: 2026-07-31
summary: "A WireGuard server on consumer router hardware, documented as a sanitized public reference build."
tags: ["WireGuard", "VPN", "Networking", "Homelab"]
---

{{< pill "live" >}}Complete{{< /pill >}}

**Repo:** [github.com/ktalons/home-vpn-lab](https://github.com/ktalons/home-vpn-lab)

A WireGuard server on the router I already own, built to be understood as well as to work. I wanted an authenticated way into my home network so I never have to forward a port to a service again. It runs on consumer hardware behind an ISP gateway I do not control, which turned out to be where most of the learning was.

## What's in the docs

- **The build**, from recon to first handshake, double NAT and all: NAT layers, CGNAT, DDNS, and DNAT.
- **The lessons**, how I proved it worked and what I got wrong: leak tests, MTU, TTL, ARP, and hairpin NAT.
- **A DDNS drift monitor**, the check the router cannot do, built on DNS over HTTPS.

Every address, subnet, and port in the repo is a placeholder or representative stand-in. The shape of the network is real, and the mistakes stayed in the docs on purpose.
