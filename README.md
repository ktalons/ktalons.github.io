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
├── _index.md              # Home (profile mode pulls from hugo.toml)
├── about.md
├── achievements.md
├── contact.md
├── resume.md
├── search.md              # Fuse.js client-side search
├── projects/
│   ├── _index.md
│   ├── talonsoclab.md     # Flagship lab (Phase A coming June 9)
│   ├── casa-capstone.md
│   ├── pwnagotchi.md
│   ├── cybersec-discord-bot.md
│   ├── dapcappuller.md
│   └── bashedlogs.md
└── blog/
    ├── _index.md
    └── welcome.md
```

## Theme customization

- `hugo.toml` — site config, social icons, top nav, FontAwesome icons
- `assets/css/custom.css` — Catppuccin Mocha overrides + status pills + hover polish
  - Swap primary/secondary accent by flipping `--accent-primary` and `--accent-secondary` in `:root`

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

Site content © Kyle Versluis. Site code (config + custom CSS) MIT.
