## Dark Mode Implementation Plan

### Phase 1: CSS Dark Mode Variables & Overrides
- Add `body.dark-mode` CSS block that overrides all `:root` variables
- Dark background (#0a0812 matching splash), gradient accents (gold→purple)
- Override canvas, viewport, sticker, card backgrounds

### Phase 2: Component-Specific Dark Overrides
- **Stickers**: Dark glassmorphism (dark frosted glass + gradient borders)
- **Zone intro cards**: Dark backgrounds with gradient accents
- **Bottom nav**: Dark background matching theme
- **Project cards**: Dark glass style
- **Post-its, memes, badges**: All dark variants
- **Settings panel**: Already dark, minimal changes
- **Canvas edges, labels**: Dark-appropriate colors

### Phase 3: Toggle Button
- Add dark/light mode toggle button (sun/moon icon) in the top bar
- Store preference in localStorage
- Smooth transition between modes

### Phase 4: Gradient Accents
- Apply splash screen palette (gold #C9A96E → purple #CE93D8) as accent gradients throughout
- Text gradients, border glows, button highlights all use this palette
