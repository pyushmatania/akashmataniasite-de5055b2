Portfolio app for Akash Matania — Product Manager with 8+ years across fintech, media, Web3, edtech.

## Architecture
- Main app is a moodboard served via `public/moodboard.html` inside an iframe (`src/pages/Index.tsx`)
- Bottom nav bar: Home, Work, Play (active/default), Portfolio, About
- About section is an in-app slide-up panel (not a separate page)
- All new sections should follow the same pattern: in-app overlays/panels, not separate routes

## Canvas Size
- 7000×7000 square canvas
- Mobile scale: 0.6x, Desktop scale: 0.72x
- Page loads centered on guidance card at canvas center

## Map Zones (5 zones, no hub)
- **Introduction** 📸 (0-3500, 0-2333) — Personal & About (top-left) [renamed from Origin]
- **Work** 🎯 (3500-7000, 0-2333) — Work & Professional (top-right)
- **Portfolio** 🚀 (0-3500, 2333-4666) — Portfolio & Creative (mid-left)
- **Fun** 😂 (3500-7000, 2333-4666) — Fun & Memes (mid-right) [meme merged into fun]
- **Hobby** 🎮 (0-7000, 4666-7000) — Hobbies & Interests (full bottom row)

## Play Navigation Order
Guidance → Introduction → Work → Portfolio → Hobby → Fun

## Guidance Card (Center of Canvas ~3260,3260)
- The "intro card" — at canvas center, non-draggable welcome/guidance card
- "Akash Matania" with gold gradient, photo, role chips, stats
- No tap-to-open — just "hit play" guidance text

## Zone Cards (unique physical metaphors)
- **Introduction**: Polaroid terminal boot sequence (green hacker theme, `.zic-introduction`)
- **Work**: Mission Dossier / Classified file (red/dark, folder tabs, stamp, ops list, `.zic-work`)
- **Portfolio**: Laptop terminal (purple indigo, `.zic-portfolio`)
- **Hobby**: Vinyl record player (orange, `.zic-hobby`)
- **Fun**: Retro arcade TV (red/neon, `.zic-fun`)

## Critical Constraints
- NEVER change existing card designs without explicit permission
- Origin renamed to Introduction EVERYWHERE
- Meme category merged into Fun filter
- Old hw-piece/hw-doodle cutout stickers DELETED

## Key Info
- Email: pyushmatania@gmail.com
- Location: Bengaluru, India
- B.Tech CS from OUTR (CET) Bhubaneswar
- Companies: EnterCircles Labs (Founder), Freelance Web3, Recess EdTech (Founder), Freelance SaaS
