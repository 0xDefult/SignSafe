# SIGNSAFE — Master Blueprint
> "Is it safe to sign?" · AI Contract Analyzer for Micro-Influencers

---

## STACK
- Backend: Python 3.11+ + FastAPI
- AI: Google Gemini 2.5 Flash (`gemini-2.5-flash`) via `google-genai` SDK
- Parsing: pdfplumber + python-docx + pytesseract
- Frontend: Next.js 14 App Router + TypeScript + Tailwind CSS
- Auth/DB: Supabase
- Deploy: Vercel (frontend) + Railway (backend)

---

## FOLDER STRUCTURE

```
SignSafe/
├── CLAUDE.md
├── README.md
├── .gitignore
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env / .env.example
│   ├── routers/__init__.py + analyze.py + counter.py + calculator.py + followup.py
│   ├── services/__init__.py + gemini_service.py + pdf_parser.py
│   ├── models/__init__.py + schemas.py
│   └── prompts/analyze_prompt.txt + counter_prompt.txt + followup_prompt.txt
└── frontend/
    ├── package.json / next.config.ts / tailwind.config.ts
    ├── .env.local / .env.local.example
    └── app/
        ├── layout.tsx / page.tsx / globals.css
        ├── analysis/page.tsx
        ├── calculator/page.tsx
        ├── history/page.tsx
        ├── login/page.tsx / signup/page.tsx
        └── components/
            ├── Sidebar.tsx       ← LEFT SIDEBAR
            ├── Navbar.tsx        ← TOP BAR
            ├── UploadZone.tsx
            ├── PlasmaOrb.tsx     ← AI ANIMATION
            ├── ClauseCard.tsx
            ├── RightPanel.tsx    ← RISK SUMMARY
            ├── RiskGauge.tsx     ← CIRCULAR GAUGE
            ├── VerdictBanner.tsx
            ├── FollowUpChat.tsx
            ├── ShareButtons.tsx
            └── HistoryCard.tsx
```

---

## BACKEND SCHEMAS (schemas.py)

```python
from pydantic import BaseModel, field_validator
from typing import List, Optional
from enum import Enum

class RiskLevel(str, Enum):
    RED = "red"
    YELLOW = "yellow"
    GREEN = "green"

class Clause(BaseModel):
    id: int
    type: str
    risk: RiskLevel
    title: str
    original_text: str
    plain_english: str
    why_bad: Optional[str] = None
    market_standard: Optional[str] = None

    @field_validator('type', mode='before')
    @classmethod
    def normalize_type(cls, v):
        valid = ['exclusivity','content_ownership','payment_terms','revision_limits',
                 'termination','usage_rights','deliverables','kill_fee','auto_renewal','other']
        return v if v in valid else 'other'

class AnalysisResponse(BaseModel):
    verdict: str
    verdict_reason: str
    overall_score: RiskLevel
    clauses: List[Clause]
    estimated_loss_inr: int
    red_count: int
    yellow_count: int
    green_count: int

class CounterOfferRequest(BaseModel):
    clause_id: int
    original_text: str
    clause_type: str
    context: Optional[str] = None

class CounterOfferResponse(BaseModel):
    rewritten_clause: str
    negotiation_script: str
    key_changes: List[str]

class CalculatorRequest(BaseModel):
    follower_count: int
    niche: str
    contract_payment_inr: int
    exclusivity_months: int
    hours_to_create: Optional[int] = 10

class CalculatorResponse(BaseModel):
    blocked_deals_estimate: int
    lost_revenue_inr: int
    effective_hourly_rate: int
    opportunity_cost_ratio: float
    verdict: str
    recommendation: str
    is_worth_it: bool

class FollowUpRequest(BaseModel):
    question: str
    contract_summary: str
    clauses: List[dict]

class FollowUpResponse(BaseModel):
    answer: str
```

---

## BACKEND GEMINI SERVICE (gemini_service.py)

```python
import json, os, re
from dotenv import load_dotenv
from google import genai
from google.genai import types
from models.schemas import *

load_dotenv()
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def _load_prompt(f):
    with open(os.path.join(os.path.dirname(__file__), "..", "prompts", f)) as fp: return fp.read()

def _clean_json(raw):
    c = re.sub(r'```json\s*|```\s*', '', raw).strip()
    s, e = c.find('{'), c.rfind('}') + 1
    if s != -1 and e > s: c = c[s:e]
    return json.loads(c)

def _call(prompt, temp=0.1, max_tokens=8192):
    return client.models.generate_content(
        model=GEMINI_MODEL, contents=prompt,
        config=types.GenerateContentConfig(
            temperature=temp, max_output_tokens=max_tokens,
            response_mime_type="application/json"
        )
    ).text

async def analyze_contract(contract_text, follower_count=50000, niche="lifestyle"):
    t = _load_prompt("analyze_prompt.txt")
    if len(contract_text) > 40000: contract_text = contract_text[:40000] + "\n[TRUNCATED]"
    try:
        return AnalysisResponse(**_clean_json(_call(
            t.format(contract_text=contract_text, follower_count=follower_count, niche=niche), 0.05
        )))
    except Exception as e: raise ValueError(f"Analysis failed: {e}")

async def generate_counter_offer(clause_type, original_text, context=""):
    t = _load_prompt("counter_prompt.txt")
    try:
        return CounterOfferResponse(**_clean_json(_call(
            t.format(clause_type=clause_type, original_text=original_text, context=context), 0.3
        )))
    except Exception as e: raise ValueError(f"Counter-offer failed: {e}")

async def answer_followup(question, context):
    t = _load_prompt("followup_prompt.txt")
    try:
        return client.models.generate_content(
            model=GEMINI_MODEL, contents=t.format(context=context, question=question),
            config=types.GenerateContentConfig(temperature=0.4, max_output_tokens=512)
        ).text
    except Exception as e: raise ValueError(f"Followup failed: {e}")

def calculate_deal_value(req: CalculatorRequest) -> CalculatorResponse:
    freq = {"beauty":3.5,"tech":2.5,"food":3.0,"fitness":3.0,"travel":2.0,
            "lifestyle":3.5,"gaming":2.0,"fashion":4.0,"finance":2.0,"education":2.0}
    def avg(f): return 5000 if f<10000 else 15000 if f<50000 else 35000 if f<100000 else 85000 if f<500000 else 200000
    blocked = round(freq.get(req.niche.lower(),2.5)*0.45*req.exclusivity_months)
    lost = round(blocked * avg(req.follower_count))
    ratio = round(lost / max(req.contract_payment_inr,1), 1)
    return CalculatorResponse(
        blocked_deals_estimate=blocked, lost_revenue_inr=lost,
        effective_hourly_rate=round(req.contract_payment_inr/max(req.hours_to_create or 10,1)),
        opportunity_cost_ratio=ratio,
        verdict=f"You earn ₹{req.contract_payment_inr:,} but lose ~₹{lost:,} in blocked deals over {req.exclusivity_months} months.",
        recommendation="Negotiate exclusivity to 60 days." if ratio>2 else "Reasonable deal. Push for 30-day exclusivity.",
        is_worth_it=ratio<2.0
    )
```

---

## BACKEND ENV

```
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
FRONTEND_URL=http://localhost:3000
```

## BACKEND requirements.txt

```
fastapi==0.111.0
uvicorn==0.30.1
pdfplumber==0.11.0
python-docx==1.1.2
python-multipart==0.0.9
google-genai>=0.3.0
pillow>=10.4.0
pytesseract==0.3.10
python-dotenv==1.0.1
pydantic==2.7.4
```

---

## FRONTEND ENV

```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://yllgpwpmwtkczpclknwu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
```

---

## SUPABASE TABLE

```sql
create table contract_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  filename text not null,
  verdict text not null,
  overall_score text not null,
  estimated_loss_inr integer default 0,
  analysis_data jsonb not null,
  created_at timestamp with time zone default now()
);
alter table contract_history enable row level security;
create policy "own" on contract_history for all using (auth.uid() = user_id);
```

---

## UI DESIGN SPEC — TARGET DESIGN

### Color Tokens (globals.css CSS variables)
```css
:root {
  --bg:            #08080F;
  --bg-2:          #0D0D1A;
  --surface:       #12121F;
  --surface-2:     #1A1A2E;
  --border:        #1E1E35;
  --border-light:  #252540;
  --text:          #F0F0FF;
  --text-muted:    #6B6B8A;
  --text-faint:    #2E2E50;
  --violet:        #7C3AED;
  --violet-soft:   #7C3AED20;
  --violet-glow:   #7C3AED40;
  --cyan:          #06B6D4;
  --cyan-soft:     #06B6D415;
  --red:           #FF4560;
  --red-soft:      #FF456015;
  --yellow:        #F5A623;
  --yellow-soft:   #F5A62315;
  --green:         #00D084;
  --green-soft:    #00D08415;
}
```

### Fonts (import in globals.css)
```css
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); }
.font-serif { font-family: 'Instrument Serif', serif; }
.font-mono  { font-family: 'JetBrains Mono', monospace; }
```

### Global Animations (globals.css)
```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; } to { opacity: 1; }
}
@keyframes shimmer {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}
@keyframes orbPulse {
  0%,100% { transform: scale(1);    box-shadow: 0 0 40px #7c3aed60, 0 0 80px #7c3aed30; }
  50%      { transform: scale(1.08); box-shadow: 0 0 60px #7c3aed80, 0 0 120px #7c3aed40; }
}
@keyframes orbRotate {
  0%   { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(360deg); }
}
@keyframes ringExpand {
  0%   { transform: scale(0.8); opacity: 0.8; }
  100% { transform: scale(1.4); opacity: 0; }
}
@keyframes cardFloat {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes countUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.animate-fade-up   { animation: fadeUp 0.5s ease forwards; }
.animate-fade-in   { animation: fadeIn 0.4s ease forwards; }
.animate-card      { opacity: 0; animation: cardFloat 0.6s ease forwards; }
```

---

## COMPONENT SPECS

### Sidebar.tsx
```
Width: 240px, fixed left, full height
bg: var(--bg-2) = #0D0D1A
border-right: 1px solid var(--border)

TOP SECTION:
  - Logo: 36px circle, violet-to-cyan gradient, "S" letter white bold
  - "SignSafe" text: DM Sans 600, 15px, white, tracking-wide

USER SECTION (below logo, separated by subtle divider):
  - Avatar: 40px circle, gradient border violet-cyan, initials fallback
  - Name: DM Sans 500 14px white
  - Role badge: "CREATOR" or "ADMIN" — 10px, violet pill

NAV ITEMS (icons from lucide-react):
  Main:
  - Dashboard      → LayoutDashboard
  - Contracts      → FileText
  - Analytics      → BarChart2
  Divider (1px #1E1E35)
  Bottom:
  - Settings       → Settings
  - Team           → Users  
  - Support        → MessageCircle

NAV ITEM STYLE:
  - Container: flex items-center gap-3, px-4 py-2.5, rounded-xl mx-2, cursor-pointer
  - Icon: 18px
  - Text: DM Sans 14px
  - INACTIVE: text-[#6B6B8A], hover → bg-[#7C3AED08] text-white (transition 150ms)
  - ACTIVE: bg-[#7C3AED15] border-l-2 border-violet-500 text-white
    (use -ml-px to align border flush with sidebar border)

BOTTOM: logout button
  - "Sign out" with LogOut icon
  - 12px text-[#6B6B8A] hover:text-red-400
  - absolute bottom-6 left-0 right-0 px-4

MOBILE: hidden below lg breakpoint
```

### Navbar.tsx (top bar)
```
Height: 56px
bg: transparent
border-bottom: 1px solid var(--border)
Layout: flex items-center justify-between px-6

LEFT:  Page title — DM Sans 16px #F0F0FF (e.g. "Dashboard", "Analysis")
       On mobile: hamburger menu icon + "SignSafe" logo

RIGHT: 
  - "Upload New" button:
    bg: linear-gradient(135deg, #7C3AED, #6D28D9)
    text: white, 13px DM Sans 600
    padding: px-4 py-2
    border-radius: 10px
    icon: Upload (16px) left of text
    hover: brightness(1.1), transform scale(1.02)
    active: scale(0.98)  ← weight/press feel
    box-shadow: 0 4px 15px #7C3AED40
    transition: all 150ms

  - "+" circle button:
    38px circle, bg #1A1A2E, border #252540
    icon: Plus 16px white
    hover: bg-[#7C3AED20] border-violet-500
```

### app/page.tsx (Landing + Upload)
```
Layout: WITH sidebar. Main content centered.
No right panel on landing — full width main area.

Main content (flex-1, flex col items-center justify-center, min-h-screen):

1. Small badge pill:
   border border-[#1E1E35] rounded-full px-4 py-1.5
   flex items-center gap-2
   - Pulsing dot: 6px circle, bg-[#00D084], animate-pulse
   - Text: "AI-Powered Contract Review" — 12px DM Sans #6B6B8A tracking-wide

2. Headline (Instrument Serif italic):
   "Is it safe to sign?"
   font-size: 72px desktop / 48px tablet / 36px mobile
   color: white
   line-height: 1.1
   text-align: center
   margin: 24px 0

3. Subtext: "Upload your brand deal. Know in 60 seconds."
   DM Sans 16px #6B6B8A, text-center

4. Upload Zone (UploadZone.tsx):
   max-w-lg, w-full, mx-auto, mt-10
   border: 1px dashed #1E1E35
   border-radius: 20px
   padding: 48px 32px
   text-align: center
   transition: border-color 300ms, background 300ms
   
   HOVER: border-color #252540, bg #12121F08
   DRAG ACTIVE: border-color #7C3AED, bg #7C3AED08
   
   Inside:
   - FileText icon 32px color #2E2E50
   - "Drop your contract here" — DM Sans 15px white, mt-4
   - "PDF · DOCX · DOC · TXT · PNG · JPG" — 12px #2E2E50, mt-2
   - Browse Files button:
     mt-6, px-6 py-2.5
     border: 1px solid #252540
     border-radius: 10px
     DM Sans 13px 500 #6B6B8A
     hover: border-[#7C3AED50] text-white bg-[#7C3AED08]
     active: scale(0.97)
     transition: all 150ms

5. Trust badges row:
   mt-6, flex gap-6, justify-center
   "⚡ 60 seconds" · "🔒 Private" · "🎯 Creator-specific"
   12px #2E2E50

6. Sample link:
   mt-4, "No contract? Try a sample →"
   12px #2E2E50, hover: #7C3AED, transition 150ms
```

### PlasmaOrb.tsx (AI Processing Animation)
Show this FULL SCREEN overlay (or center of main) when analyzing.

```tsx
"use client";
import { useEffect, useState } from "react";

const MESSAGES = [
  "Reading your contract...",
  "Identifying risk clauses...",
  "Checking market standards...",
  "Calculating your exposure...",
  "Almost there...",
];

export default function PlasmaOrb({ filename, progress }: { filename: string; progress: number }) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setMsgIndex(i => (i + 1) % MESSAGES.length);
        setVisible(true);
      }, 400);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-6 py-16">
      {/* Orb */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Rings */}
        <div className="absolute w-48 h-48 rounded-full border border-violet-500/20"
             style={{ animation: 'ringExpand 3s ease-out infinite' }} />
        <div className="absolute w-40 h-40 rounded-full border border-cyan-400/15"
             style={{ animation: 'ringExpand 3s ease-out infinite', animationDelay: '1s' }} />
        {/* Core orb */}
        <div className="w-32 h-32 rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #a78bfa 0%, #7c3aed 35%, #4f46e5 65%, #06b6d4 100%)',
            boxShadow: '0 0 40px #7c3aed60, 0 0 80px #7c3aed30, 0 0 120px #7c3aed15, inset 0 0 30px #ffffff15',
            animation: 'orbPulse 3s ease-in-out infinite, orbRotate 8s linear infinite',
          }}
        />
      </div>

      {/* Status text */}
      <div className="text-center space-y-2">
        <p className="text-xs font-semibold tracking-[0.15em] text-white uppercase">
          AI Analysis In Progress
        </p>
        <p
          className="text-sm text-[#6B6B8A] transition-opacity duration-400"
          style={{ opacity: visible ? 1 : 0 }}
        >
          {MESSAGES[msgIndex]}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-48 h-0.5 bg-[#1E1E35] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
          }}
        />
      </div>

      {/* Filename */}
      <p className="text-xs text-[#2E2E50] font-mono">{filename}</p>
    </div>
  );
}
```

### RightPanel.tsx (Risk Summary sidebar)
```
Width: 300px, fixed right on desktop
bg: var(--bg-2)
border-left: 1px solid var(--border)
padding: 24px
hidden on mobile

SECTIONS:

1. Header: "Risk Summary" — DM Sans 13px 600 #F0F0FF

2. RiskGauge component (SVG arc gauge):
   - 140px wide SVG
   - Arc from bottom-left to bottom-right (270deg sweep)
   - Background arc: #1E1E35
   - Score arc: color based on score (red/yellow/green)
   - Center: score number in Instrument Serif 36px, color matches
   - Below: "Risk Score: X% (Medium)" 12px #6B6B8A

3. Divider

4. "Document Details" section:
   - "X pages · Y flags" — 13px #6B6B8A
   
5. Expandable rows with chevron:
   - "Key Actions" → chevron right
   - "Contract & Flags" → chevron right
   Each: flex justify-between items-center, py-3, border-b border-[#1E1E35]
   hover: text-white, cursor-pointer
   Text: 13px DM Sans #6B6B8A

Show RightPanel ONLY on /analysis page when results exist.
On landing page: hide right panel.
```

### ClauseCard.tsx (floating glassmorphism)
```
Style matches target design — cards appear BELOW orb after analysis:

Container: grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mt-8

Each card:
  bg: #12121F
  border: 1px solid #1E1E35
  border-radius: 16px
  padding: 20px
  animation: cardFloat with staggered delay (index * 120ms)
  hover: border-color #7C3AED30, transform translateY(-3px)
  transition: all 200ms
  cursor: pointer → expands to show full details

Card top:
  - Title: DM Sans 15px 600 white
  - Description: DM Sans 13px #6B6B8A mt-1, 2 lines max

Card bottom:
  flex justify-between items-center mt-4
  - Risk badge:
    HIGH RISK: bg-[#FF456020] border border-[#FF456040] text-[#FF4560] — 11px rounded-full px-3 py-1
    MODERATE: bg-[#F5A62320] border border-[#F5A62340] text-[#F5A623]
    CLEAR: bg-[#00D08420] border border-[#00D08440] text-[#00D084]
  - Date: "Just analyzed" or timestamp — 11px #2E2E50 font-mono

Expanded state (onClick toggle):
  - Shows: plain_english, why_bad, market_standard
  - Counter-offer button: text-[#7C3AED] text-xs hover:underline "Get counter-offer →"
```

### ShareButtons.tsx
```
Minimal text links row:
flex gap-4 flex-wrap

"Share on WhatsApp ↗" — 12px #6B6B8A hover:#7C3AED
"Email report ↗" — 12px #6B6B8A hover:#06B6D4
"Copy summary" — 12px #6B6B8A hover:white

No buttons — pure text with hover color transition 150ms
Separated visually by spacing only
```

### FollowUpChat.tsx
```
Section label: "Ask about your contract" — 11px #6B6B8A uppercase tracking-wider

Suggested question chips:
  border border-[#1E1E35] rounded-full px-3 py-1.5 text-xs #6B6B8A
  hover: border-[#7C3AED40] text-white bg-[#7C3AED08]

Chat bubbles:
  User: bg-[#1A1A2E] border border-[#252540] rounded-2xl rounded-br-sm text-white text-sm
  AI: no background, text #6B6B8A, left aligned, small violet dot prefix (·)

Input:
  border-b only: border-b border-[#1E1E35]
  bg: transparent
  placeholder: "Ask anything..." color #2E2E50
  Send: "→" — #6B6B8A hover:#7C3AED
```

### Login/Signup pages
```
Full screen centered, NO sidebar
bg: var(--bg)

Card: bg-[#0D0D1A] border border-[#1E1E35] rounded-2xl p-8 max-w-sm w-full

Logo + "SignSafe" centered top
Headline: "Welcome back" / "Create account" — Instrument Serif 28px
Subtext: 14px #6B6B8A

Inputs:
  bg: #12121F
  border: 1px solid #1E1E35
  border-radius: 12px
  px-4 py-3, text-white 14px
  focus: border-[#7C3AED50] outline-none
  transition: border-color 150ms

Submit button:
  w-full py-3
  bg: linear-gradient(135deg, #7C3AED, #6D28D9)
  border-radius: 12px
  text-white DM Sans 600 14px
  hover: brightness(1.1)
  active: scale(0.98)  ← press feel
  box-shadow: 0 4px 20px #7C3AED35
  transition: all 150ms

"Continue as guest →" link below: 12px #2E2E50 hover:#6B6B8A
```

---

## COMPLETE DEFINITION OF DONE

```
BACKEND:
✅ POST /analyze → AnalysisResponse (gemini-2.5-flash)
✅ POST /counter-offer → CounterOfferResponse
✅ POST /calculate → CalculatorResponse
✅ POST /followup → FollowUpResponse
✅ ClauseType is str with normalize validator
✅ No hardcoded API keys

FRONTEND LAYOUT:
✅ Left sidebar 240px — logo, user, nav, logout
✅ Top navbar — page title + Upload New button
✅ Right panel 300px — only on /analysis
✅ Mobile: sidebar hidden, hamburger menu

PAGES:
✅ /         Upload zone, serif headline, trust badges
✅ /analysis PlasmaOrb while loading → clause cards + right panel after
✅ /calculator Split layout, violet accents, live loss counter
✅ /history  HistoryCard list, requires login
✅ /login    Minimal card, no sidebar
✅ /signup   Minimal card, no sidebar

INTERACTIONS:
✅ Button press feel: active:scale(0.97-0.98)
✅ Hover transitions: 150-200ms all
✅ Clause cards: staggered cardFloat animation (index * 120ms)
✅ PlasmaOrb: orbPulse + orbRotate + ringExpand + rotating messages
✅ Progress bar: violet-to-cyan gradient, smooth width transition

DATA:
✅ sessionStorage key: "signsafe_analysis" and "signsafe_filename"
✅ Supabase null-safe (no crash without keys)
✅ All ₹ in Indian format: toLocaleString('en-IN')
✅ Mobile responsive: every component works at 375px
```

---

*SignSafe · "Is it safe to sign?" · MIT License*
