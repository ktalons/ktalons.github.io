# ktalons.github.io

Personal portfolio site for **Kyle Versluis** — Cybersecurity Engineer.

Live at: [https://ktalons.github.io](https://ktalons.github.io)

## Stack

- [Hugo Extended](https://gohugo.io) (static site generator)
- [hugo-coder](https://github.com/luizdepra/hugo-coder) theme (vendored as a git submodule)
- [Catppuccin Mocha](https://catppuccin.com/palette/) palette — Peach `#fab387` primary, Mauve `#cba6f7` secondary
- Deployed to GitHub Pages via GitHub Actions on every push to `main`

## Local development

```bash
# Clone with submodules
git clone --recurse-submodules https://github.com/ktalons/ktalons.github.io.git
cd ktalons.github.io

# Run dev server
hugo server -D
# Visit http://localhost:1313
```

## Content layout

```
content/
├── _index.md                       # Home (hero only; body intentionally empty, `description` drives meta tags)
├── about.md
├── contact.md
├── blog/
│   ├── _index.md                   # cascade: posts get type "posts" (date, reading time, tags)
│   ├── welcome.md                  # "What's brewing?"
│   ├── talonsoclab-booting.md      # TalonSocLab kickoff (aliases cover two retired URLs)
│   ├── phase-0-off-the-dongle.md
│   ├── phase-a-active-is-not-proof.md
│   ├── complyroll-a-rollup-is-not-a-report.md
│   ├── still-searching-still-building.md
│   ├── complyroll-sarif-joins-in.md
│   ├── bashedlogs-dont-trust-the-tag.md
│   └── casa-v5-rebuilt-around-the-core.md
├── projects/                       # listed by `weight` (1 = first), one page (pagerSize 20)
│   ├── _index.md
│   ├── talonsoclab.md              # 1  Flagship: personal SOC built in public
│   ├── casa.md                     # 2  CASA: the reasoning plane over TalonSocLab (ties with complyroll; newer date lists first)
│   ├── complyroll.md               # 2  FedRAMP 20x vulnerability reports
│   ├── iaessoc-elk-snapshot.md     # 3  OT SOC snapshot (U of A Facilities Management)
│   ├── bashedlogs.md               # 4  Bash log triage CLI
│   ├── stigroll.md                 # 5  STIG/SCAP to NIST 800-53 rollup tool
│   ├── pcappuller.md               # 6  PCAP retrieval tool
│   ├── home-vpn-lab.md             # 7  Sanitized WireGuard reference build
│   ├── violent-python.md           # 8  Python offensive-security work
│   ├── osticket-soc.md             # 9  osTicket-based SOC ticketing
│   ├── casa-capstone.md            # 10 CASA / Project Twilight Synapse capstone
│   └── cybersec-discord-bot.md     # 11 Discord bot for cyber comms
└── h4ck-m3/
    └── _index.md                   # Easter-egg mini-game menu (hidden from nav)
```

Top nav (set in `hugo.toml`): **About · Projects · Blog · Contact**. The E@st3r Egg Cyb3r Ski11 G@m3 page is intentionally hidden (`build.list = never`) and reachable at `/h4ck-m3/` via the roaming owl popup on the homepage (or by typing the URL).

## Site features

- **Status pills** — `{{< pill "indev" >}}…{{< /pill >}}` shortcode (variants: `indev`, `live`, others in `layouts/shortcodes/pill.html`) used on the homepage hero + project cards to communicate state
- **Light / dark toggle** — theme default; Catppuccin Mocha (dark) and Catppuccin Latte (light) variants of the same accents
- **E@st3r Egg Cyb3r Ski11 G@m3** at `/h4ck-m3/` — 3-tier badge menu (Rookie · Cyber Student · Cyber Ninja), 6 browser-side mini-games, no backend or telemetry:
  - **Phishing or Legit** (Rookie)
  - **Spot the Malicious URL** (Rookie)
  - **Cipher Decoder** (Cyber Student)
  - **MITRE ATT&CK Match** (Cyber Student)
  - **Hash Identifier** (Cyber Ninja)
  - **Find the IOC** (Cyber Ninja)
- **Hero fade-in** animation via `assets/js/hero-fade.js`

## Theme customization

- `hugo.toml` — site config, top nav, social icons, FontAwesome, custom JS bundle
- `assets/css/custom.css` — Catppuccin Mocha overrides + status pills + hover polish
  - Swap primary/secondary accent by flipping `--accent-primary` and `--accent-secondary` in `:root`
- `assets/js/` — `hero-fade.js` + 8 easter-egg game scripts (`hackme.js`, `hackme-menu.js`, `phishing-game.js`, `malicious-url-game.js`, `cipher-decoder-game.js`, `mitre-match-game.js`, `hash-id-game.js`, `find-ioc-game.js`)
- `layouts/shortcodes/` — `pill.html` (status badges), `hackme-menu.html`, `gif.html` (CSP-safe inline GIFs)
- `layouts/_partials/` — `head/extensions.html` (extra `<head>` content), `list.html` (list page override), `home/extensions.html` (the "Latest:" line under the hero, newest blog post)

## Catppuccin reference

Site uses the [Catppuccin Mocha](https://catppuccin.com/palette/) (dark) palette:

| Slot | Hex |
|---|---|
| Base (background) | `#1e1e2e` |
| Text | `#cdd6f4` |
| **Peach (primary accent)** | `#fab387` |
| **Mauve (secondary accent)** | `#cba6f7` |

Light-mode toggle uses [Catppuccin Latte](https://catppuccin.com/palette/) variants of the same accents.

## Adding a new blog post

```bash
hugo new content blog/your-post-slug.md
```

## License

Site content © Kyle Versluis. Site code (config + custom CSS + custom JS + custom shortcodes) MIT.
