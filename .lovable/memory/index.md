Portfolio app for Akash Matania — Product Manager with 8+ years across fintech, media, Web3, edtech.

## Architecture
- Main app is a moodboard served via `public/moodboard.html` inside an iframe (`src/pages/Index.tsx`)
- Bottom nav bar: Home, Work, Play (active/default), About, Contact
- About section is an in-app slide-up panel (not a separate page)
- All new sections should follow the same pattern: in-app overlays/panels, not separate routes

## Canvas Size
- 14000×14000 square canvas
- Default view scale: 0.5x
- sy() is identity function (no Y scaling needed for square canvas)
- Page loads centered on intro card at (7000, 7000)

## Map Zones (5 zones + hub at center)
- **Origin Story** 📸 (0-5800, 0-5600) — Personal & About (top-left)
- **The War Room** 🎯 (7700-14000, 0-5600) — Work & Professional (top-right)
- **Launch Pad** 🚀 (0-5600, 6200-9800) — Portfolio & Creative (mid-left)
- **Akash Unplugged** ⭐ (5200-8800, 5200-8800) — Hub/Intro center
- **The Playground** 🎮 (0-6300, 10400-14000) — Hobbies & Interests (bottom-left)
- **Meme Alley** 😂 (7700-14000, 6400-14000) — Fun & Memes (right side)

## Intro Card (Center)
- "Akash Matania" with Matania in gold gradient highlight
- Subtitle: Product Manager · Dreamer · Founder
- Photo, role chips, location, scroll CTA
- Floating animation, surrounded by decorative stickers

## Map Filters (5 only, content-type based)
- All, Photos, Memes, Interactive, Others

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
