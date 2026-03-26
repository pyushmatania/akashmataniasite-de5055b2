Portfolio app for Akash Matania — Product Manager with 8+ years across fintech, media, Web3, edtech.

## Architecture
- Main app is a moodboard served via `public/moodboard.html` inside an iframe (`src/pages/Index.tsx`)
- Bottom nav bar: Home, Work, Play (active/default), About, Contact
- About section is an in-app slide-up panel (not a separate page)
- All new sections should follow the same pattern: in-app overlays/panels, not separate routes

## Canvas Size
- 21000×21000 square canvas (tripled from 7000)
- Default view scale: 0.5x
- sy() is identity function (no Y scaling needed for square canvas)

## Map Zones (5 zones + hub)
- **Origin Story** 📸 (0-7200, 0-4500) — Personal & About
- **The War Room** 🎯 (8400-21000, 0-4500) — Work & Professional
- **Launch Pad** 🚀 (0-10800, 4800-8400) — Portfolio & Creative
- **Akash Unplugged** ⭐ (6600-12000, 4200-9000) — Hub
- **The Playground** 🎮 (0-10200, 9000-21000) — Hobbies & Interests
- **Meme Alley** 😂 (10800-21000, 9000-21000) — Fun & Memes

## Map Filters (5 only, content-type based)
- All, Photos, Memes, Interactive, Others

## Map Signposts
- 3D marble pillars, ground shadows, planted-in effect
- Interactive stickers get a "🎮 Tap me" badge

## Map Zoom
- Big map zoom steps: [0.15, 0.2, 0.25, 0.35, 0.5, 0.75, 1, 1.25, 1.5, 2]
- Default zoom: 0.15x (most zoomed out)
- Big map base scale doubled (mw*16)

## Design
- Clean, minimal style with colorful accents
- Skill tags use green (#3cd070), yellow (#f5c842), red (#e85050)

## Item Count (~251 total stickers)
- 74 memes, 42 badges, 34 postits, 42 emojis, 15 projects, 13 stamps
- 2 hero photos, 5 counters, 2 fortunes, 1 mood, 2 scratches, 1 progress
- 3 texts, 1 highlight, 3 illustrated, 4 washi, 1 swatches, 6 zone signposts

## Key Info
- Email: pyushmatania@gmail.com
- Location: Bengaluru, India
- B.Tech CS from OUTR (CET) Bhubaneswar
- Companies: EnterCircles Labs (Founder), Freelance Web3, Recess EdTech (Founder), Freelance SaaS
