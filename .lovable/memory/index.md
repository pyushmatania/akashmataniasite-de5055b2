# Memory: index.md
Updated: now

Portfolio app for Akash Matania — Product Manager with 8+ years across fintech, media, Web3, edtech.

## Architecture
- Main app is a moodboard served via `public/moodboard.html` inside an iframe (`src/pages/Index.tsx`)
- Bottom nav bar: Home, Work, Play (active/default), About, Contact
- About section is an in-app slide-up panel (not a separate page)
- All new sections should follow the same pattern: in-app overlays/panels, not separate routes

## Map Zones (5 zones + hub)
- **Origin Story** 📸 (0-3200, 0-1900) — Personal & About
- **The War Room** 🎯 (4200-9200, 0-1900) — Work & Professional
- **Launch Pad** 🚀 (0-5200, 2200-3700) — Portfolio & Creative
- **Akash Unplugged** ⭐ (3200-5200, 1900-3700) — Hub
- **The Playground** 🎮 (0-5000, 4100-10000) — Hobbies & Interests
- **Meme Alley** 😂 (5200-10000, 4100-10000) — Fun & Memes

## Canvas Size
- 10000×10000 square canvas
- Default view scale: 0.35x
- sy() is identity function (no Y scaling needed for square canvas)

## Map Filters (5 only, content-type based)
- All, Photos, Memes, Interactive, Others
- Uses `matchesFilter()` — mainCats=['photo','meme','interactive'], everything else is 'other'
- Interactive category includes onclick-based stickers (games, generators)

## Map Signposts
- Medium-sized with poles, NO descriptions below them
- Interactive stickers get a "🎮 Tap me" badge (top-right corner)
- Badge & emoji stickers are slightly tilted
- Signposts have immersive 3D marble pillars, ground shadows, planted-in effect
- Present on both moodboard canvas AND big map

## Map Zoom
- Big map zoom steps: [0.25, 0.35, 0.5, 0.75, 1, 1.25, 1.5, 2]
- Default zoom: 0.25x (most zoomed out)

## Design
- Clean, minimal style with colorful accents
- Skill tags use green (#3cd070), yellow (#f5c842), red (#e85050)
- Photo frame: rainbow gradient border with shadow
- Staggered fade-in animations on panels
- Bottom nav has press-scale (0.88) on touch
- Small minimap: blue theme with grid lines

## Content Source
- Resume: Akash_Matania_Product_Manager.pdf
- Photo: public/images/akash-photo.jpeg
- Skills: Product Strategy, User Research, Web3 & Fintech, Growth & Analytics, Technical PRDs, AI-Assisted Development

## Item Count (245 total stickers)
- 74 memes, 42 badges, 34 postits, 42 emojis, 15 projects, 13 stamps
- 2 hero photos, 5 counters, 2 fortunes, 1 mood, 2 scratches, 1 progress
- 3 texts, 1 highlight, 3 illustrated, 4 washi, 1 swatches, 6 zone signposts

## Key Info
- Email: pyushmatania@gmail.com
- Location: Bengaluru, India
- LinkedIn, GitHub, Portfolio links
- B.Tech CS from OUTR (CET) Bhubaneswar
- Companies: EnterCircles Labs (Founder), Freelance Web3, Recess EdTech (Founder), Freelance SaaS
