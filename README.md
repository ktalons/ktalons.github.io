# ktalons.github.io

Personal portfolio site for **Kyle Versluis** — Cybersecurity Engineer.

Live at: [https://ktalons.github.io](https://ktalons.github.io)

## Stack

- [Hugo Extended](https://gohugo.io) (static site generator)
- [hugo-coder](https://github.com/luizdepra/hugo-coder) theme (vendored as a git submodule)
- [Catppuccin Mocha](https://catppuccin.com/palette/) palette — Mauve `#cba6f7` primary, Peach `#fab387` secondary
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
├── _index.md                       # Home (profile + "Currently building" hero)
├── about.md
├── contact.md
├── blog/
│   ├── _index.md
│   └── welcome.md
├── projects/
│   ├── _index.md
│   ├── talonsoclab.md              # Flagship — scaffold complete, builds May 27, ships Jun 9
│   ├── casa-capstone.md            # CASA / Project Twilight Synapse capstone
│   ├── iaessoc-elk-snapshot.md     # OT SOC snapshot (U of A Facilities Management)
│   ├── osticket-soc.md             # osTicket-based SOC ticketing
│   ├── pcappuller.md               # PCAP retrieval tool
│   ├── bashedlogs.md               # Bash log analysis tooling
│   ├── cybersec-discord-bot.md     # Discord bot for cyber comms
│   └── violent-python.md           # Python offensive-security work
└── h4ck-m3/
    └── _index.md                   # Easter-egg mini-game menu (hidden from nav)
```

Top nav (set in `hugo.toml`): **About · Projects · Blog · Contact**. The H@ck m3 page is intentionally hidden (`build.list = never`) and only reachable by typing `/h4ck-m3/` in the URL bar.

## Site features

- **Status pills** — `{{< pill "indev" >}}…{{< /pill >}}` shortcode (variants: `indev`, `live`, others in `layouts/shortcodes/pill.html`) used on the homepage hero + project cards to communicate state
- **Light / dark toggle** — theme default; Catppuccin Mocha (dark) and Catppuccin Latte (light) variants of the same accents
- **H@ck m3 easter egg** at `/h4ck-m3/` — 3-tier badge menu (Rookie · Cyber Student · Cyber Ninja), 6 browser-side mini-games, no backend or telemetry:
  - **Phishing or Legit** (Rookie)
  - **Spot the Malicious URL** (Rookie)
  - **Cipher Decoder** (Cyber Student)
  - **Hash Identifier** (Cyber Student)
  - **MITRE ATT&CK Match** (Cyber Ninja)
  - **Find the IOC** (Cyber Ninja)
- **Hero fade-in** animation via `assets/js/hero-fade.js`

## Theme customization

- `hugo.toml` — site config, top nav, social icons, FontAwesome, custom JS bundle
- `assets/css/custom.css` — Catppuccin Mocha overrides + status pills + hover polish
  - Swap primary/secondary accent by flipping `--accent-primary` and `--accent-secondary` in `:root`
- `assets/js/` — `hero-fade.js` + 7 H@ck m3 game scripts (`hackme.js`, `hackme-menu.js`, `phishing-game.js`, `malicious-url-game.js`, `cipher-decoder-game.js`, `mitre-match-game.js`, `hash-id-game.js`, `find-ioc-game.js`)
- `layouts/shortcodes/` — `pill.html` (status badges), `hackme-menu.html`, `phishing-game.html`
- `layouts/_partials/` — `head/extensions.html` (extra `<head>` content), `list.html` (list page override)

## Catppuccin reference

Site uses the [Catppuccin Mocha](https://catppuccin.com/palette/) (dark) palette:

| Slot | Hex |
|---|---|
| Base (background) | `#1e1e2e` |
| Text | `#cdd6f4` |
| **Mauve (primary accent)** | `#cba6f7` |
| **Peach (secondary accent)** | `#fab387` |

Light-mode toggle uses [Catppuccin Latte](https://catppuccin.com/palette/) variants of the same accents.

## Adding a new blog post

```bash
hugo new content blog/your-post-slug.md
```

## License

Site content © Kyle Versluis. Site code (config + custom CSS + custom JS + custom shortcodes) MIT.
