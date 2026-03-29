#!/usr/bin/env python3
"""
Fix script:
1. Scale: 1.0/0.85 → 0.72/0.6
2. getAllStickers: include ALL stickers (intro cards must be in list for zone-center placement)
3. Pre-position every sticker within its zone bounds with a natural spread grid
4. Zone intro cards pre-positioned at zone centers so JS can verify/keep them
"""
import re

FILE = "/home/user/akashmataniamax/public/moodboard.html"

with open(FILE, 'r', encoding='utf-8') as f:
    lines = f.readlines()

content = ''.join(lines)
print(f"Loaded {len(lines)} lines")

# ── 1. FIX SCALE ──────────────────────────────────────────────────────────────
content = content.replace(
    "const MOODBOARD_VIEW_SCALE=window.innerWidth<=768?0.85:1.0;",
    "const MOODBOARD_VIEW_SCALE=window.innerWidth<=768?0.6:0.72;"
)
content = content.replace(
    "const MOODBOARD_VIEW_SCALE_NAV=window.innerWidth<=768?0.85:1.0;",
    "const MOODBOARD_VIEW_SCALE_NAV=window.innerWidth<=768?0.6:0.72;"
)
print("1. Scale fixed: 1.0/0.85 → 0.72/0.6")

# ── 2. FIX getAllStickers — include ALL stickers so intro cards get detected ───
# The layout engine calls isIntroCard() on each item to route them to zone centers.
# By excluding intro cards from getAllStickers(), they were never placed at centers.
content = content.replace(
    "function getAllStickers(){\n  return Array.from(document.querySelectorAll('#canvas > .sticker:not(.intro-card):not(.zic-origin):not(.zic-hobby):not(.zone-intro-creative)'));\n}",
    "function getAllStickers(){\n  // Include ALL stickers — isIntroCard() routes zone intro cards to zone centers\n  return Array.from(document.querySelectorAll('#canvas > .sticker'));\n}"
)
print("2. getAllStickers fixed — includes all stickers for proper intro card detection")

with open(FILE, 'w', encoding='utf-8') as f:
    f.write(content)

# ── 3. PRE-POSITION ALL STICKERS within zone bounds ───────────────────────────
# Zone bounding boxes (world coordinates, 7000×7000 canvas)
ZONE_BOUNDS = {
    'origin':    (0,    0,    3500, 2333),
    'work':      (3500, 0,    7000, 2333),
    'portfolio': (0,    2333, 3500, 4666),
    'fun':       (3500, 2333, 7000, 4666),
    'hobby':     (0,    4666, 3500, 7000),
}

# Zone intro card target positions (center of each zone, card ~380×420px)
INTRO_CARD_POS = {
    'origin':    (1560, 956),   # center (1750,1166) - half card size
    'work':      (5060, 956),   # center (5250,1166) - half
    'portfolio': (1560, 3289),  # center (1750,3499) - half
    'fun':       (5060, 3289),  # center (5250,3499) - half
    'hobby':     (1560, 5623),  # center (1750,5833) - half
}

def gen_zone_grid(x1, y1, x2, y2, margin=200):
    """Generate a natural spread of ~30 positions covering the zone area.
    Avoids the center region (for intro card) and stays within margins."""
    cx, cy = (x1+x2)//2, (y1+y2)//2
    positions = []
    # Outer ring: 8 positions around zone in a loose circle
    radii = [600, 750, 850]
    angles_outer = [20, 65, 110, 155, 200, 245, 290, 335]
    import math
    for r in radii:
        offset = 15 * radii.index(r)
        for deg in angles_outer:
            ang = math.radians(deg + offset)
            px = cx + int(r * math.cos(ang) * 0.75)  # squish x slightly
            py = cy + int(r * math.sin(ang) * 0.6)   # squish y more (zone is wider than tall)
            # Clamp to zone bounds with margin
            px = max(x1 + margin, min(x2 - margin - 200, px))
            py = max(y1 + margin, min(y2 - margin - 160, py))
            positions.append((px, py))
    # Add corner clusters
    offsets = [(250,200),(600,200),(900,200),(250,400),(600,400),(250,600),(600,600)]
    for ox, oy in offsets:
        # 4 corners of zone
        for qx, qy in [(x1+ox, y1+oy), (x2-ox-200, y1+oy),
                       (x1+ox, y2-oy-160), (x2-ox-200, y2-oy-160)]:
            if (x1+margin < qx < x2-margin-200) and (y1+margin < qy < y2-margin-160):
                positions.append((int(qx), int(qy)))
    # Deduplicate and limit to 40 positions
    seen = set()
    unique = []
    for p in positions:
        k = (p[0]//80, p[1]//80)
        if k not in seen:
            seen.add(k)
            unique.append(p)
    return unique[:40]

# Pre-generate positions for each zone
ZONE_POSITIONS = {}
for zone, (x1,y1,x2,y2) in ZONE_BOUNDS.items():
    ZONE_POSITIONS[zone] = gen_zone_grid(x1,y1,x2,y2)

zone_pos_idx = {z: 0 for z in ZONE_POSITIONS}

def next_pos(zone):
    positions = ZONE_POSITIONS.get(zone, [])
    if not positions:
        x1,y1,x2,y2 = ZONE_BOUNDS.get(zone, (0,0,3500,2333))
        return (x1+500, y1+400)
    idx = zone_pos_idx[zone] % len(positions)
    zone_pos_idx[zone] += 1
    return positions[idx]

# Now re-read and process line by line
with open(FILE, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
modified = 0

for line in lines:
    # Check for sticker div with data-zone
    if 'class="sticker ' not in line or 'data-zone=' not in line:
        new_lines.append(line)
        continue

    zone_match = re.search(r'data-zone="(\w+)"', line)
    if not zone_match:
        new_lines.append(line)
        continue

    zone = zone_match.group(1)
    if zone not in ZONE_BOUNDS:
        new_lines.append(line)
        continue

    x1, y1, x2, y2 = ZONE_BOUNDS[zone]
    margin = 200

    # Check if this is a zone intro card (zic-origin, zic-hobby, zone-intro-creative, intro-card)
    is_intro = any(cls in line for cls in ['zic-origin', 'zic-hobby', 'zone-intro-creative has-drag-handle', 'intro-card'])

    if is_intro:
        # Place at zone center
        new_left, new_top = INTRO_CARD_POS.get(zone, (x1+500, y1+500))
        line = re.sub(r'left:\s*\d+px', f'left:{new_left}px', line)
        line = re.sub(r'top:\s*\d+px', f'top:{new_top}px', line)
        modified += 1
    else:
        # Check if current position is within zone bounds
        left_match = re.search(r'left:\s*(\d+)px', line)
        top_match = re.search(r'top:\s*(\d+)px', line)
        if left_match and top_match:
            left = int(left_match.group(1))
            top = int(top_match.group(1))
            # If out of bounds, reposition
            if not (x1 + margin <= left <= x2 - margin and
                    y1 + margin <= top <= y2 - margin):
                new_left, new_top = next_pos(zone)
                line = re.sub(r'left:\s*\d+px', f'left:{new_left}px', line)
                line = re.sub(r'top:\s*\d+px', f'top:{new_top}px', line)
                modified += 1

    new_lines.append(line)

print(f"3. Pre-positioned {modified} stickers within zone bounds")

with open(FILE, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

# Verify
with open(FILE, 'r') as f:
    final = f.read()

print("\n=== Final sticker counts per zone ===")
for z in ['origin', 'work', 'portfolio', 'fun', 'hobby', 'hub']:
    c = final.count(f'data-zone="{z}"')
    print(f"  {z}: {c}")

# Check scale
if "?0.6:0.72" in final:
    print("\n✓ Scale correctly set to 0.72 desktop / 0.6 mobile")
else:
    print("\n✗ Scale fix not found!")

if "return Array.from(document.querySelectorAll('#canvas > .sticker'));" in final:
    print("✓ getAllStickers correctly returns all stickers")
else:
    print("✗ getAllStickers fix not found!")
