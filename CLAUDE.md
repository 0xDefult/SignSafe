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

