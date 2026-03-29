#!/usr/bin/env python3
"""
Hardcode moodboard sticker positions via a JS lookup table.
Adds data-sid to each sticker, inserts HARDCODED_POSITIONS, applies on autoArrange.
Also fixes zoneTargets and updates map signpost/ground-label coords.
"""
import re

INPUT = 'public/moodboard.html'
OUTPUT = 'public/moodboard.html'

with open(INPUT, 'r', encoding='utf-8') as f:
    content = f.read()

# ─────────────────────────────────────────────────────────────────
# STEP 1 – add data-sid="s001"…s096 to every <div class="sticker
# ─────────────────────────────────────────────────────────────────
# Match the opening tag of each sticker div (possibly multi-attr on one line)
sticker_pattern = re.compile(
    r'(<div\s+class="sticker\s[^"]*"[^>]*)(>)',
    re.DOTALL
)

sid_counter = [0]

def add_sid(m):
    tag_before = m.group(1)
    closing    = m.group(2)
    # Don't double-add
    if 'data-sid=' in tag_before:
        return m.group(0)
    sid_counter[0] += 1
    sid = f's{sid_counter[0]:03d}'
    return f'{tag_before} data-sid="{sid}"{closing}'

content = sticker_pattern.sub(add_sid, content)
total_stickers = sid_counter[0]
print(f'Tagged {total_stickers} sticker elements with data-sid')

# ─────────────────────────────────────────────────────────────────
# STEP 2 – Build HARDCODED_POSITIONS lookup
#
# Sticker → data-sid mapping (verified from HTML line-number order):
#
# INTRO CARDS (skip layout — placed at zone center by autoArrange):
#   s001 zic-origin        origin
#   s002 zone-intro-creative portfolio
#   s003 zic-hobby          hobby
#   s004 zone-intro-creative fun
#   s072 intro-card         work
#
# ORIGIN (20):
#   s005 hero-blue(290w)   s006 hero-yellow(252w)
#   s031 postit-jeypore    s032 postit-btech      s033 postit-built
#   s034 meme-bounce       s035 meme-pop
#   s036 badge-scoliosis   s037 badge-comeback    s038 badge-mrpuchu
#   s039 meme-journeyMap(240) s040 scratch        s041 counter-comeback
#   s059 typewriter        s076 postit-welcome    s077 postit-scroll
#   s078 postit-dog        s080 factcard          s087 ribbon-origin
#   s088 tlpuzzle
#
# WORK (21):
#   s007 meme-wiggle   s008 meme-shake
#   s009 badge-sprint  s010 badge-prd  s011 badge-01builder
#   s012 postit-roadmap s013 postit-nobody s014 postit-friday
#   s015 meme-pivotSlot(200) s016 meme-jiraTicket(220)
#   s055 wheel(200)    s061 quiz-work(220)
#   s073 badge-8years  s074 badge-founder3  s075 badge-buildsAI
#   s081 dna(240)      s084 skillping(200)  s086 ribbon-work(200)
#   s089 stackbuilder(240) s090 badge-founderMode s091 stamp-shipped
#
# PORTFOLIO (16):
#   s017 startup-rand(240)
#   s018–s028 project-1 to project-11
#   s029 stamp-LAUNCHED  s030 meme-movieInvest(220)
#   s056 quiz-portfolio(220)  s079 sticker-text(280)
#
# FUN (18):
#   s054 emoji-kitchen(200)  s057 slots(200)   s060 dice(160)
#   s062 meme-jelly  s063 meme-bounce  s064 meme-flip  s065 meme-spin
#   s066 badge-friday  s067 badge-ctrlz  s068 badge-coffee
#   s069 meme-corpBS(220)  s070 meme-startupSound(200)  s071 meme-meetingBingo(220)
#   s082 hottake(200)  s083 currently(200)  s085 vibecheck(200)
#   s094 scratch-fun   s095 counter-bugs
#
# HOBBY (15):
#   s042 meme-flip  s043 meme-tada  s044 meme-heartbeat  s045 meme-rubberband
#   s046 badge-diamond  s047 badge-panipuri  s048 badge-binge  s049 badge-carguy
#   s050 meme-tradingMood(200)  s051 meme-puchuMood(200)  s052 fortune(180)
#   s053 counter-panipuri  s058 8ball(160)  s092 counter-chai  s093 throne-game(280)
# ─────────────────────────────────────────────────────────────────

# Format: 'sXXX': (left, top, rotate_deg)
POSITIONS = {
    # ── ORIGIN zone (0,0)→(3500,2333) ── intro card at (1560,956) ──
    's005': (210,  220,  -3),   # hero-blue 290w — top-left
    's006': (560,  200,   3),   # hero-yellow 252w
    's088': (960,  215,  -2),   # tlpuzzle
    's059': (1730, 215,   1),   # typewriter  [intro card below at y=956]
    's039': (2350, 220,   2),   # meme-journeyMap 240w
    's080': (2680, 200,  -3),   # factcard

    's031': (210,  490,  -4),   # postit-jeypore
    's032': (455,  520,   3),   # postit-btech
    's033': (710,  490,  -2),   # postit-built
    's034': (1000, 505,   2),   # meme-bounce
    's087': (2680, 490,   3),   # ribbon-origin (tall~350h, right side)

    's036': (210,  760,  -4),   # badge-scoliosis
    's037': (445,  795,   3),   # badge-comeback
    's078': (700,  765,  -3),   # postit-dog

    # items left of intro card (x<1510, y 1000-1250)
    's076': (210, 1010,  -3),   # postit-welcome
    's077': (455, 1040,   3),   # postit-scroll
    's035': (730, 1010,   2),   # meme-pop

    # items right of intro card (x>2000, y 1000-1250)
    's040': (2100, 1000,  3),   # scratch-origin
    's041': (2400, 1015, -3),   # counter-comeback

    # bottom band (y 1500-1800)
    's038': (210,  1540,  2),   # badge-mrpuchu

    # ── WORK zone (3500,0)→(7000,2333) ── intro card at (5060,956) ──
    # Top-left cluster (x 3700-4900, y 200-700)
    's007': (3720, 235,   2),   # meme-wiggle
    's008': (4000, 220,  -3),   # meme-shake
    's009': (3720, 505,  -3),   # badge-sprint
    's010': (3960, 535,   2),   # badge-prd
    's011': (4200, 505,  -3),   # badge-01builder
    's012': (4510, 220,   3),   # postit-roadmap
    's013': (4810, 235,  -2),   # postit-nobody
    's014': (4510, 510,   3),   # postit-friday
    's015': (3720, 760,  -2),   # meme-pivotSlot 200w
    's016': (4010, 750,   3),   # meme-jiraTicket 220w
    's081': (4620, 750,   2),   # dna 240w

    # Top-right cluster (x 5500-6800, y 200-700)
    's061': (5530, 225,   2),   # quiz-work 220w
    's073': (5850, 215,  -3),   # badge-8years
    's074': (6100, 250,   3),   # badge-founder3
    's075': (6370, 220,  -2),   # badge-buildsAI
    's084': (5530, 500,  -3),   # skillping 200w
    's086': (5900, 490,   4),   # ribbon-work 200w (tall)

    # Left-mid (x 3700-4900, y 1000-1300)
    's090': (3730, 1060, -3),   # badge-founderMode
    's091': (3990, 1075,-15),   # stamp-SHIPPED
    's055': (3730, 1490, -3),   # wheel 200w

    # Right-mid (x 5500-6800, y 1400-1700)
    's089': (6100, 1470,  2),   # stackbuilder 240w

    # ── PORTFOLIO zone (0,2333)→(3500,4666) ── intro card at (1560,3289) ──
    # Projects in rows (each ~180×145)
    's018': (220,  2570, -3),   # project-1
    's019': (460,  2550,  3),   # project-2
    's020': (710,  2570, -2),   # project-3
    's021': (220,  2800,  3),   # project-4
    's022': (460,  2815, -3),   # project-5
    's023': (710,  2800,  2),   # project-6
    's024': (220,  3030, -2),   # project-7
    's025': (460,  3045,  3),   # project-8
    's026': (710,  3030, -3),   # project-9
    's027': (220,  3830,  2),   # project-10 — below intro card
    's028': (460,  3845, -3),   # project-11

    # Right side of portfolio (x 2000-3200)
    's017': (2100, 2560,  2),   # startup-rand 240w
    's029': (2450, 2580,-15),   # stamp-LAUNCHED
    's030': (2100, 2810, -2),   # meme-movieInvest 220w
    's079': (2380, 3060, -1),   # sticker-text 280w
    's056': (2100, 3830,  3),   # quiz-portfolio 220w

    # ── FUN zone (3500,2333)→(7000,4666) ── intro card at (5060,3289) ──
    # Top row (y 2560)
    's054': (3720, 2560, -2),   # emoji-kitchen 200w
    's057': (4010, 2545,  1),   # slots 200w
    's060': (4310, 2565,  3),   # dice 160w
    's062': (4570, 2548, -2),   # meme-jelly
    's063': (5560, 2565,  2),   # meme-bounce-fun
    's064': (5850, 2548, -3),   # meme-flip-fun
    's065': (6140, 2565,  3),   # meme-spin-fun
    's066': (6440, 2555, -2),   # badge-friday

    # Mid row (y 2810)
    's067': (3720, 2815,  3),   # badge-ctrlz
    's068': (3970, 2840, -2),   # badge-coffee
    's069': (4270, 2800,  2),   # meme-corpBS 220w
    's070': (4580, 2820, -3),   # meme-startupSound 200w
    's071': (5560, 2810,  2),   # meme-meetingBingo 220w
    's082': (5870, 2835, -3),   # hottake 200w
    's083': (6170, 2810,  2),   # currently 200w

    # Right of intro (x>5440, y 3300-3700)
    's085': (5560, 3340,  3),   # vibecheck 200w

    # Bottom-left (below intro card, y 3800)
    's094': (3720, 3830,  2),   # scratch-fun
    's095': (3990, 3845, -3),   # counter-bugs

    # ── HOBBY zone (0,4666)→(3500,7000) ── intro card at (1560,5623) ──
    # Top band (y 4880-5100)
    's042': (210,  4890, -3),   # meme-flip
    's043': (460,  4875,  3),   # meme-tada
    's044': (720,  4890, -2),   # meme-heartbeat
    's045': (990,  4875,  2),   # meme-rubberband
    's046': (1270, 4890, -3),   # badge-diamond
    's047': (1520, 4875,  3),   # badge-panipuri
    's048': (1780, 4890, -3),   # badge-binge
    's049': (2050, 4875,  2),   # badge-carguy

    # Left of intro (x<1510, y 5200-5560)
    's050': (210,  5200, -2),   # meme-tradingMood 200w
    's051': (490,  5230,  3),   # meme-puchuMood 200w
    's052': (780,  5200, -3),   # fortune 180w
    's053': (210,  5480,  2),   # counter-panipuri

    # Right of intro (x>1860, y 5200-5900)
    's058': (2100, 5215, -2),   # 8ball 160w
    's092': (2380, 5250,  3),   # counter-chai
    's093': (2070, 5570, -1),   # throne-game 280w
}

# Build JS string
js_lines = ['const HARDCODED_POSITIONS={']
for sid, (l, t, r) in POSITIONS.items():
    js_lines.append(f"  '{sid}':{{l:{l},t:{t},r:{r}}},")
js_lines.append('};')
HARDCODED_JS = '\n'.join(js_lines)

print(f'Built HARDCODED_POSITIONS for {len(POSITIONS)} stickers')

# ─────────────────────────────────────────────────────────────────
# STEP 3 – Insert HARDCODED_POSITIONS before autoArrangeMoodboardItems
# ─────────────────────────────────────────────────────────────────
ANCHOR = 'function autoArrangeMoodboardItems(){'
if ANCHOR not in content:
    print('ERROR: Could not find autoArrangeMoodboardItems anchor')
else:
    insert_block = HARDCODED_JS + '\n'
    content = content.replace(ANCHOR, insert_block + ANCHOR, 1)
    print('Inserted HARDCODED_POSITIONS before autoArrangeMoodboardItems')

# ─────────────────────────────────────────────────────────────────
# STEP 4 – Modify autoArrangeMoodboardItems to apply hardcoded positions
#           Replace the spiralLayout calls per zone with HARDCODED_POSITIONS lookup
# ─────────────────────────────────────────────────────────────────
OLD_SPIRAL_BLOCK = '''  // Rule 3+4: Place zone-specific items spiraling from zone center
  Object.entries(ZONE_DEFS).forEach(([zoneKey,zd])=>{
    const items=zoneItems[zoneKey];
    if(!items.length)return;
    const zoneW=zd.x2-zd.x1;
    const zoneH=zd.y2-zd.y1;
    const innerR=Math.min(zoneW,zoneH)*0.08; // dense near center
    const outerR=Math.min(zoneW,zoneH)*0.42; // but spread to fill
    spiralLayout(items,zd.center.x,zd.center.y,innerR,outerR,rng,allPlaced,zd);
  });'''

NEW_SPIRAL_BLOCK = '''  // Rule 3+4: Apply hardcoded positions; spiral-fallback for any unhandled stickers
  Object.entries(ZONE_DEFS).forEach(([zoneKey,zd])=>{
    const items=zoneItems[zoneKey];
    if(!items.length)return;
    const unhandled=[];
    items.forEach(sticker=>{
      const sid=sticker.dataset.sid;
      const pos=sid&&HARDCODED_POSITIONS[sid];
      if(pos){
        sticker.style.left=pos.l+'px';
        sticker.style.top=pos.t+'px';
        sticker.style.transform='rotate('+pos.r+'deg)';
        allPlaced.push({left:pos.l,top:pos.t,w:sticker.offsetWidth||180,h:sticker.offsetHeight||120});
      } else {
        unhandled.push(sticker);
      }
    });
    if(unhandled.length){
      const zoneW=zd.x2-zd.x1;
      const zoneH=zd.y2-zd.y1;
      const innerR=Math.min(zoneW,zoneH)*0.12;
      const outerR=Math.min(zoneW,zoneH)*0.42;
      spiralLayout(unhandled,zd.center.x,zd.center.y,innerR,outerR,rng,allPlaced,zd);
    }
  });'''

if OLD_SPIRAL_BLOCK in content:
    content = content.replace(OLD_SPIRAL_BLOCK, NEW_SPIRAL_BLOCK, 1)
    print('Replaced spiralLayout block with HARDCODED_POSITIONS application')
else:
    print('WARNING: Could not find exact spiral block — checking for close match...')
    # Try finding it with flexible whitespace
    idx = content.find('Rule 3+4: Place zone-specific items spiraling from zone center')
    if idx != -1:
        print(f'  Found Rule 3+4 comment at position {idx}')
    else:
        print('  Rule 3+4 comment not found either')

# ─────────────────────────────────────────────────────────────────
# STEP 5 – Fix zoneTargets: add work/portfolio/fun/hobby aliases
#           Fix hub to point to canvas center (hub zone dissolved)
# ─────────────────────────────────────────────────────────────────
OLD_ZONE_TARGETS = '''const zoneTargets={
  hub:{x:1750,y:1166},
  origin:{x:1750,y:1166},
  warroom:{x:5250,y:1166},
  launchpad:{x:1750,y:3499},
  playground:{x:1750,y:5833},
  memealley:{x:5250,y:3499}
};'''

NEW_ZONE_TARGETS = '''const zoneTargets={
  hub:{x:3500,y:3500},       // canvas center — hub zone dissolved
  origin:{x:1750,y:1166},
  work:{x:5250,y:1166},      warroom:{x:5250,y:1166},
  portfolio:{x:1750,y:3499}, launchpad:{x:1750,y:3499},
  hobby:{x:1750,y:5833},     playground:{x:1750,y:5833},
  fun:{x:5250,y:3499},       memealley:{x:5250,y:3499}
};'''

if OLD_ZONE_TARGETS in content:
    content = content.replace(OLD_ZONE_TARGETS, NEW_ZONE_TARGETS, 1)
    print('Updated zoneTargets with proper zone aliases')
else:
    print('WARNING: zoneTargets not found with exact match — trying partial...')
    idx = content.find('const zoneTargets={')
    print(f'  zoneTargets found at char position: {idx}')

# ─────────────────────────────────────────────────────────────────
# STEP 6 – Update map signpost & ground-label positions
#           Old coords were designed for 14000px world.
#           New world is 7000px. Recalculate % to center each zone.
#
# Zone centers (7000 canvas):
#   origin:    (1750,1166) → 25.0%,  16.7%
#   work:      (5250,1166) → 75.0%,  16.7%
#   portfolio: (1750,3499) → 25.0%,  50.0%
#   hobby:     (1750,5833) → 25.0%,  83.3%
#   fun:       (5250,3499) → 75.0%,  50.0%
# ─────────────────────────────────────────────────────────────────

OLD_SIGNPOSTS = '''   const signposts=[
     {x:8.57,y:8.57,label:'📸 ORIGIN',color:'#00BCD4',bg:'linear-gradient(135deg,#00838F,#00BCD4,#4DD0E1)',emoji:'📸'},
     {x:87.14,y:8.57,label:'🎯 WORK',color:'#E53935',bg:'linear-gradient(135deg,#C62828,#E53935,#EF5350)',emoji:'🎯'},
     {x:8.57,y:47.14,label:'🚀 PORTFOLIO',color:'#42A5F5',bg:'linear-gradient(135deg,#1565C0,#42A5F5,#64B5F6)',emoji:'🚀'},
     {x:8.57,y:77.14,label:'🎮 HOBBY',color:'#FF9800',bg:'linear-gradient(135deg,#E65100,#FF9800,#FFB74D)',emoji:'🎮'},
     {x:87.14,y:51.43,label:'😂 FUN',color:'#AB47BC',bg:'linear-gradient(135deg,#7B1FA2,#AB47BC,#CE93D8)',emoji:'😂'},
   ];'''

NEW_SIGNPOSTS = '''   const signposts=[
     {x:16,y:10,label:'📸 ORIGIN',color:'#00BCD4',bg:'linear-gradient(135deg,#00838F,#00BCD4,#4DD0E1)',emoji:'📸'},
     {x:76,y:10,label:'🎯 WORK',color:'#E53935',bg:'linear-gradient(135deg,#C62828,#E53935,#EF5350)',emoji:'🎯'},
     {x:16,y:43,label:'🚀 PORTFOLIO',color:'#42A5F5',bg:'linear-gradient(135deg,#1565C0,#42A5F5,#64B5F6)',emoji:'🚀'},
     {x:16,y:76,label:'🎮 HOBBY',color:'#FF9800',bg:'linear-gradient(135deg,#E65100,#FF9800,#FFB74D)',emoji:'🎮'},
     {x:76,y:43,label:'😂 FUN',color:'#AB47BC',bg:'linear-gradient(135deg,#7B1FA2,#AB47BC,#CE93D8)',emoji:'😂'},
   ];'''

if OLD_SIGNPOSTS in content:
    content = content.replace(OLD_SIGNPOSTS, NEW_SIGNPOSTS, 1)
    print('Updated map signpost positions')
else:
    print('WARNING: signpost block not found with exact match')

OLD_GROUND_LABELS = '''   const mapGroundLabels=[
     {x:12.86,y:15.71,label:'ORIGIN',color:'rgba(0,188,212,0.28)',rot:-25},
     {x:62.86,y:14.29,label:'WORK',color:'rgba(229,57,53,0.25)',rot:-20},
     {x:8.57,y:51.43,label:'PORTFOLIO',color:'rgba(66,165,245,0.24)',rot:-30},
     {x:10,y:80,label:'HOBBY',color:'rgba(255,152,0,0.25)',rot:-22},
     {x:61.43,y:64.29,label:'FUN',color:'rgba(171,71,188,0.25)',rot:-28},
   ];'''

NEW_GROUND_LABELS = '''   const mapGroundLabels=[
     {x:14,y:22,label:'ORIGIN',color:'rgba(0,188,212,0.28)',rot:-25},
     {x:64,y:22,label:'WORK',color:'rgba(229,57,53,0.25)',rot:-20},
     {x:14,y:55,label:'PORTFOLIO',color:'rgba(66,165,245,0.24)',rot:-30},
     {x:14,y:80,label:'HOBBY',color:'rgba(255,152,0,0.25)',rot:-22},
     {x:64,y:55,label:'FUN',color:'rgba(171,71,188,0.25)',rot:-28},
   ];'''

if OLD_GROUND_LABELS in content:
    content = content.replace(OLD_GROUND_LABELS, NEW_GROUND_LABELS, 1)
    print('Updated map ground label positions')
else:
    print('WARNING: ground labels block not found with exact match')

# ─────────────────────────────────────────────────────────────────
# Write output
# ─────────────────────────────────────────────────────────────────
with open(OUTPUT, 'w', encoding='utf-8') as f:
    f.write(content)

print(f'\n✓ Written to {OUTPUT}')
print(f'  Total stickers tagged: {total_stickers}')
print(f'  Hardcoded positions: {len(POSITIONS)}')
