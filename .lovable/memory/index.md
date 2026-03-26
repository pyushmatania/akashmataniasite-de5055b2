# Memory: index.md
Updated: now

Portfolio app for Akash Matania — Product Manager with 8+ years across fintech, media, Web3, edtech.

## Architecture
- Main app is a moodboard served via `public/moodboard.html` inside an iframe (`src/pages/Index.tsx`)
- Bottom nav bar: Home, Work, Play (active/default), About, Contact
- About section is an in-app slide-up panel (not a separate page)
- All new sections should follow the same pattern: in-app overlays/panels, not separate routes

## Map Zones (5 zones + hub)
- **Origin Story** 📸 (top-left 0-2800, 0-1800) — Personal & About: photos, bio, education
- **The War Room** 🎯 (top-right 4000-7000, 0-1800) — Work & Professional: skills, companies, stamps
- **Launch Pad** 🚀 (center-left 0-2800, 1800-3500) — Portfolio & Creative: projects, illustrations
- **Akash Unplugged** ⭐ (center 2800-4200, 1800-3200) — Hub: name, bitmoji
- **The Playground** 🎮 (bottom-left 0-5000, 3500-7000) — Hobbies & Interests: music, travel, recharge
- **Meme Alley** 😂 (bottom-right 5000-10000, 3500-7000) — Fun & Memes: memes, contra, fun interactive

## Map Filters (5 only, content-type based)
- All, Photos, Memes, Interactive, Others
- Uses `matchesFilter()` — mainCats=['photo','meme','interactive'], everything else is 'other'

## Map Signposts
- Medium-sized with poles, NO descriptions below them
- Interactive stickers get a "🎮 Tap me" badge (top-right corner)
- Badge & emoji stickers are slightly tilted

## Design
- Clean, minimal style with colorful accents
- Skill tags use green (#3cd070), yellow (#f5c842), red (#e85050)
- Photo frame: rainbow gradient border with shadow
- Staggered fade-in animations on panels
- Bottom nav has press-scale (0.88) on touch
- Small minimap: blue theme with grid lines
- Default map scale: 0.5x

## Content Source
- Resume: Akash_Matania_Product_Manager.pdf
- Photo: public/images/akash-photo.jpeg
- Skills: Product Strategy, User Research, Web3 & Fintech, Growth & Analytics, Technical PRDs, AI-Assisted Development

## Key Info
- Email: pyushmatania@gmail.com
- Location: Bengaluru, India
- LinkedIn, GitHub, Portfolio links
- B.Tech CS from OUTR (CET) Bhubaneswar
- Companies: EnterCircles Labs (Founder), Freelance Web3, Recess EdTech (Founder), Freelance SaaS
