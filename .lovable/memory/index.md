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
- Hub/Akash Unplugged zone was REMOVED — guidance card still at center but no dedicated zone

## Signposts
- Wooden two-pole design with brown wood gradient (#8B6914 to #C4A44A)
- Small rounded wood knob caps, compact board with zone colors
- Placed on both moodboard canvas AND big map
- Ground-painted zone names on big map + dashed boundary lines between zones

## Guidance Card (Center of Canvas ~3260,3260)
- Formerly the "intro card" — moved to canvas center as the guidance/welcome card
- "Akash Matania" with Matania in gold gradient highlight
- Subtitle: PM · Founder · Builder
- Photo, role chips, location, stats
- Floating animation, NOT draggable
- No tap-to-open hint — just a "hit play" guidance text
- Old hw-piece/hw-doodle cutout stickers DELETED

## Work Zone Card (Blue Laptop Terminal)
- `.zic-work` — blue laptop/terminal design matching Portfolio card style
- Blue accent color (#64B5F6), dark blue background
- Shows career experience list, code tags, stats
- Tap to open work panel

## Map Filters (5 only, content-type based)
- All, Photos, Fun (includes meme), Interactive, Others

## Design
- Clean, minimal style with colorful accents
- Skill tags use green (#3cd070), yellow (#f5c842), red (#e85050)

## Key Info
- Email: pyushmatania@gmail.com
- Location: Bengaluru, India
- B.Tech CS from OUTR (CET) Bhubaneswar
- Companies: EnterCircles Labs (Founder), Freelance Web3, Recess EdTech (Founder), Freelance SaaS

## Critical Constraints
- NEVER change existing card designs without explicit permission
- Origin has been renamed to Introduction EVERYWHERE (code, attributes, labels, signposts, map, nav)
- Meme category merged into Fun filter
