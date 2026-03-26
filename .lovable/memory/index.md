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

## Map Zones (5 zones, no hub)
- **Origin** 📸 (0-5800, 0-5600) — Personal & About (top-left)
- **Work** 🎯 (7700-14000, 0-5600) — Work & Professional (top-right)
- **Portfolio** 🚀 (0-5600, 6200-9800) — Portfolio & Creative (mid-left)
- **Hobby** 🎮 (0-6300, 10400-14000) — Hobbies & Interests (bottom-left)
- **Fun** 😂 (7700-14000, 6400-14000) — Fun & Memes (right side)
- Hub/Akash Unplugged zone was REMOVED — intro card still at center but no dedicated zone

## Signposts
- Wooden two-pole design with brown wood gradient (#8B6914 to #C4A44A)
- Small rounded wood knob caps, compact board with zone colors
- Placed on both moodboard canvas AND big map
- Ground-painted zone names on big map + dashed boundary lines between zones

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

## Key Info
- Email: pyushmatania@gmail.com
- Location: Bengaluru, India
- B.Tech CS from OUTR (CET) Bhubaneswar
- Companies: EnterCircles Labs (Founder), Freelance Web3, Recess EdTech (Founder), Freelance SaaS
