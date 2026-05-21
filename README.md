# ktalons.github.io

Personal portfolio site for **Kyle Versluis** — Cybersecurity Engineer.

Live at: [https://ktalons.github.io](https://ktalons.github.io)

## Stack

- [Hugo Extended](https://gohugo.io) (static site generator)
- [PaperMod](https://github.com/adityatelange/hugo-PaperMod) theme (vendored as a git submodule)
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

- `hugo.toml` — site config, social icons, profile mode, nav menu
- `assets/css/extended/custom.css` — accent color (Saguaro-cyan) and small polish

## Adding a new blog post

```bash
hugo new content blog/your-post-slug.md
```

## License

Site content © Kyle Versluis. Site code (config + custom CSS) MIT.
