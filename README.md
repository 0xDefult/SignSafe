# SignSafe 🛡️
### Is it safe to sign?

AI-powered contract analyzer for content creators and micro-influencers.
Upload your brand deal. Know in 60 seconds if the terms are fair — or if you're getting exploited.

---

## Features

- **Contract Analysis** — Red/Yellow/Green clause-by-clause breakdown
- **Plain English** — Every clause explained in creator language, not legalese  
- **Opinionated Verdicts** — Not summaries. Actual verdicts. "DO NOT SIGN."
- **Counter-Offer Generator** — AI rewrites bad clauses in your favor, ready to send
- **True Cost Calculator** — See exactly how much that exclusivity clause will cost you in ₹
- **Indian Creator Context** — Built for India's creator economy, not Western standards

---

## Tech Stack

| Layer | Tech |
|---|---|
| AI | Google Gemma 4 via AI Studio API |
| Backend | Python 3.11 + FastAPI |
| PDF Parsing | pdfplumber + python-docx |
| Frontend | Next.js 14 + TypeScript + Tailwind |
| Hosting | Vercel (frontend) + Railway (backend) |

---

## Quick Start (macOS)

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Add your GEMINI_API_KEY to .env
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Open http://localhost:3000

---

## Environment Variables

### backend/.env
```
GEMINI_API_KEY=your_google_ai_studio_key
GEMMA_MODEL=gemma-3-27b-it
FRONTEND_URL=http://localhost:3000
```

### frontend/.env.local
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /analyze | Upload contract → get analysis |
| POST | /counter-offer | Get AI-rewritten clause |
| POST | /calculate | True cost calculator |
| GET | /health | Health check |

---

## Built for Hack Club Horizons

Open Source · MIT License · Built by creators, for creators.

*"Every creator deserves a lawyer in their pocket."*
