# SignSafe 
### Is it safe to sign?

AI-powered contract analyzer for content creators, Agencies and micro-influencers.
Upload your brand deal. Know in 60 seconds if the terms are fair — or if you're getting exploited.

---

## Features

- **Contract Analysis** — Red/Yellow/Green clause-by-clause breakdown
- **Plain English** — Every clause explained in creator language, not legalese  
- **Opinionated Verdicts** — Not summaries. Actual verdicts. "DO NOT SIGN."
- **Counter-Offer Generator** — AI rewrites bad clauses in your favor, ready to send (Coming Soon)
- **True Cost Calculator** — See exactly how much that exclusivity clause will cost you in ₹
- **Indian Creator Context** — Built for India's creator economy, not Western standards

---

## Tech Stack

| Layer | Tech |
|---|---|
| AI | Google Gemini via AI Studio API |
| Backend | Python 3.11 + FastAPI |
| PDF Parsing | pdfplumber + python-docx |
| Frontend | Next.js 14 + TypeScript + Tailwind |
| Hosting | Vercel (frontend) + Railway (backend) |

---

## Quick Start ( Locally )

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

---
 
## Access Control & Roles (Rolling soon)
 
The system uses a team-based role system to manage permissions:
 
| Role | Permissions |
| :--- | :--- |
| **ADMIN** | **Full Control:** Create teams, invite new members, modify member roles, and remove members from a team. |
| **LEGAL_ANALYST** | **Member Access:** Access team dashboards and view members. (Analysis permissions pending). |
| **REVIEWER** | **Member Access:** Access team dashboards and view members. (Review permissions pending). |
| **VIEWER** | **Read-Only:** View team membership and basic team details. |
 
---
 
## Built for Hack Club Horizons

Open Source · MIT License · Built by creators, for creators.

*"Every creator deserves a lawyer in their pocket."*

---
 
## Project Issue -
 (Need to solve)
 1- Api used of free tier so get exhust easily 
 2- Intial implimented Email Verification. I production i removed Because of Cost issue 
---
 
## Ai Usages 

* Used to for writing Content on Site 
* Debegguing and understadning Tech 
* System Desing (Help how to Impliment )