## Akash Matania — Portfolio Moodboard

### Architecture
- Single-file moodboard (`public/moodboard.html`) served via iframe in a React/Vite wrapper
- Infinite pannable canvas with drag-and-drop stickers organized into themed zones
- Bottom nav: Home, Work, Play, About, Contact — all in-app overlays, no routing
- Cloud persistence via Supabase edge functions with PIN-protected save/load

### Zones
- **Origin** — Intro card with Akash's photo, roles, tutorial
- **Work** — Professional experience, portfolio panel with case studies (EnterCircles, Recess, Hushh, SmartBhubaneswar, Aribasda)
- **Fun** — Hand Cricket game, wicket counter, memes, companion stickers
- **About** — Slide-up panel with skills, education, experience
- **Contact** — Email, links

### Key Features & Systems

#### Canvas & Navigation
- Infinite canvas with momentum scrolling and viewport-aware scaling
- Minimap (small) + expandable Big Map with zone boundaries
- Organic country-style SVG zone boundaries with ray-casting containment
- Play button cycles through zones starting from Origin
- Zone ground labels, zone counters using polygon containment

#### Drag & Drop
- All stickers draggable with touch/mouse via drag handles
- Position memory saved to cloud (singleton record architecture)
- Auto-arrange with spiral placement constrained to zone boundaries

#### Hand Cricket Game (Stadium Edition)
- Full toss system (odd/even call → number reveal → bat/bowl choice)
- Defence logic: DEF+DEF = OUT, DEF+run = runs scored (for both batting/bowling)
- Overs, balls, and current run rate (CRR) live tracking
- Boundary animations (FOUR/SIX flash overlays, fireworks, text pops)
- Web Audio API procedural SFX (no audio files)
- Cloud-saved match history via Supabase

#### Portfolio Panel
- Slide-up overlay with project cards (glassmorphism, hover effects)
- Each project has a detail page with case study content
- Project metrics, tech tags, role badges

#### Easter Eggs
- Triple-tap name → Build Specs panel (features, tech stack, live stats)
- Photo tap counter with milestone messages and confetti
- Random wisdom quotes
- Hidden sticker interactions

#### Performance
- IntersectionObserver pauses off-screen animations
- CSS containment on stickers
- Lazy loading images
- Gzip compression via vite plugin
- Single-file architecture for minimal network requests

### Tech Stack
- Vanilla HTML/CSS/JS (moodboard)
- React + Vite + Tailwind (wrapper)
- Supabase Edge Functions (PIN verify, layout CRUD)
- Web Audio API (procedural SFX)
- SVG + ray-casting (zone boundaries)
- Framer Motion (wrapper animations)
