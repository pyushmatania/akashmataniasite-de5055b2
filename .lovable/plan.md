

## Plan: Sync Organic Zone Boundaries to Maps + Enforce Item Containment

### What's happening now
- The **canvas** has organic country-shaped SVG boundaries (lines 1846-1857) with zone-specific colored dashed lines
- The **big map** has its own simplified zone boundary paths (lines 7230-7256) that don't match the canvas shapes
- The **small map** shows no zone boundaries at all
- Items (stickers) have `data-zone` attributes but their positions are hardcoded — some may fall outside the organic boundary paths
- Zone containment is checked via rectangular `mapZones` (line 8453-8458), not the organic paths

### Changes

#### 1. Unify zone boundary definitions
Create a single `ZONE_BOUNDARY_PATHS` object containing the exact SVG path data from the canvas (lines 1847-1856). Both the canvas SVG and map decoration functions will reference this same data, ensuring identical shapes everywhere.

#### 2. Update big map boundaries
Replace the current `zonePaths` array in `addMapDecorations()` (lines 7230-7246) with scaled-down versions of the exact canvas paths (canvas uses 0-14000 coords, map uses 0-100 viewBox). Use thinner stroke (`stroke-width: 0.3`) and subtler opacity per user preference.

#### 3. Add boundaries to small map
When the small map renders (`drawMapLayoutOnly` / `drawMapLayout`), append an SVG overlay with the same zone boundary paths, using even thinner/subtler strokes for readability at small scale.

#### 4. Point-in-polygon zone containment
Replace the rectangular `mapZones` check (line 8453) with a point-in-polygon test against the organic SVG paths. Create a `pointInZonePath(x, y, zoneName)` function that parses each zone's SVG path into polygon segments and uses ray-casting to test containment.

#### 5. Re-center all items within boundaries
Add/update the auto-rearrange logic so that on page load (or rearrange trigger), every sticker with a `data-zone` is checked against its zone's organic boundary. Items outside the boundary get repositioned to the zone's centroid area using the existing spiral placement with the polygon boundary as constraint instead of a rectangle.

#### 6. Update `getZoneName()` 
Change `getZoneName(px, py)` (line 8460) to use the point-in-polygon test instead of rectangular bounds, so the minimap zone label accurately reflects the organic shapes.

### Technical details

- **SVG path parsing**: Extract coordinate pairs from the canvas `d` attribute strings, convert to polygon vertices for ray-casting
- **Scaling**: Canvas coords (0-14000) → big map viewBox (0-100) = divide by 140; small map uses same viewBox
- **Stroke styling on maps**: `stroke-width: 0.3`, `stroke-dasharray: 2 1`, opacity reduced by ~30% vs canvas
- **Performance**: Parse paths once at init, cache polygon arrays; point-in-polygon is O(n) per vertex count (~20-30 vertices per zone)

### Files modified
- `public/moodboard.html` — all changes in this single file

