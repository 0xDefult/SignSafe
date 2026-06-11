# SignSafe

Live link: https://sign-safe-bay.vercel.app/

This is an AI contract analyzer I built for content creators, agencies, and micro-influencers in India. You just upload your brand deal contract, and it tells you in about 60 seconds if the terms are fair or if you're getting exploited.

What it does:
- Breaks down the contract into red, yellow, and green clauses so it's easy to read.
- Explains the legal jargon in plain English.
- Gives you a straight answer on whether you should sign it or not, instead of just a summary.
- Shows you the true cost of exclusivity clauses in rupees.
- I'm also working on a feature that rewrites bad clauses in your favor so you can send them as a counter-offer.

Demo (the video is AI generated):
<img width="1280" height="667" alt="Screenshot 2026-06-10 at 6 14 43 PM" src="https://github.com/user-attachments/assets/f30ce0a5-cfc8-42de-ae68-dc67828d264d" />

https://github.com/user-attachments/assets/2f785c9c-c879-42d2-a832-2ddfdafa43e9

Tech stack:
- AI: Google Gemini (AI Studio API)
- Backend: Python 3.11 and FastAPI
- File parsing: pdfplumber and python-docx
- Frontend: Next.js 14, TypeScript, Tailwind
- Hosting: Vercel for the frontend, Railway for the backend

How to run it locally:

For the backend:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Make sure to add your GEMINI_API_KEY to the .env file
uvicorn main:app --reload --port 8000
```


For the frontend:

Bash```
cd frontend
npm install
cp .env.local.example .env.local
pnpm run dev```

Then just open http://localhost:3000 in your browser.

## Env variables needed:
In your backend/.env you need your GEMINI_API_KEY and FRONTEND_URL=http://localhost:3000.
In your frontend/.env.local you need NEXT_PUBLIC_API_URL=http://localhost:8000.

## Main API endpoints:
POST /analyze - Upload a contract to get it analyzed
POST /counter-offer - Generate an AI rewritten clause
POST /calculate - True cost calculator
GET /health - Server health check

## Roles (coming soon):
I'm adding an access control system so teams can use this. It will have Admin (full control), Legal Analyst, Reviewer, and Viewer (read-only) roles.

Known issues I need to fix:

I'm using the free tier for the API right now, so the limits get exhausted pretty easily.

I originally implemented email verification, but I had to remove it for production because of cost issues.

## AI usage:
Just to be transparent, I used AI to help write some of the text on the website itself, debug my code, and help me figure out the system design.

Built for Hack Club Horizons. MIT License.
