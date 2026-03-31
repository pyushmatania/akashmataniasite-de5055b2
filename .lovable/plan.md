## Akash Matania — Portfolio Moodboard

### Architecture
- Single-file moodboard (`public/moodboard.html`) served via iframe in a React/Vite wrapper
- Infinite pannable canvas with drag-and-drop stickers organized into themed zones
- Bottom nav: Home, Work, Play, About, Contact — all in-app overlays, no routing
- Cloud persistence via Supabase edge functions with PIN-protected save/load

### Zones
- **Origin** — Intro card with Akash's photo, roles, tutorial
- **Work** — Professional experience, portfolio panel with case studies
- **Fun** — Hand Cricket game (Quick Match + IPL 2026 mode), wicket counter, memes, companion stickers
- **About** — Slide-up panel with skills, education, experience
- **Contact** — Email, links

### Key Features & Systems

#### Hand Cricket Game — IPL 2026 Edition
- **Mode selector**: Quick Match (1 wicket) or IPL 2026 (10 wickets)
- **IPL 2026**: 10 real IPL teams (CSK, MI, RCB, KKR, SRH, DC, GT, LSG, PBKS, RR) with real player names
- **Team selection**: Pick your team → pick opponent → choose overs (1/2/3/5)
- **Full batting lineup**: 11 players per team, select next batsman after wickets
- **Bowling lineup**: Display current bowler, rotate after overs
- **10 wickets system**: Full innings with wicket tracking
- **Over-end scorecard**: Popup after each over showing batting card (R, B, 4s, 6s, SR)
- **Innings break scorecard**: Shows target for chasing team
- **Live stats**: Overs, balls, CRR, strike rate, wickets display
- **Defence logic**: DEF+DEF = OUT, DEF+run = runs scored
- **Crowd cheers**: Procedural audio crowd roar on boundaries, boo on wickets
- **Crowd roar overlay**: Visual pulse effect on boundaries/wickets
- **Crazy effects**: Confetti cannon (40 particles) on SIX, earthquake shake on wicket
- **Fireworks**: Enhanced particle explosion on SIX (20 particles)
- **50% bigger game window**: 630px width (was 420px)
- **Pan-to-ground**: Fun panel cricket launcher scrolls canvas to cricket sticker and auto-opens
- **Cloud-saved match history** with team names

#### Canvas & Navigation
- Infinite canvas with momentum scrolling and viewport-aware scaling
- Minimap + expandable Big Map with zone boundaries
- Organic country-style SVG zone boundaries with ray-casting containment
- Play button cycles through zones starting from Origin

#### Drag & Drop
- All stickers draggable with touch/mouse via drag handles
- Position memory saved to cloud (singleton record architecture)

#### Portfolio Panel
- Slide-up overlay with project cards (glassmorphism, hover effects)

#### Easter Eggs
- Triple-tap name → Build Specs panel
- Photo tap counter with milestone messages and confetti

### Tech Stack
- Vanilla HTML/CSS/JS (moodboard)
- React + Vite + Tailwind (wrapper)
- Supabase Edge Functions (PIN verify, layout CRUD)
- Web Audio API (procedural SFX + crowd cheers)
- SVG + ray-casting (zone boundaries)
