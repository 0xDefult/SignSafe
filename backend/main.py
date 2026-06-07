from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from routers import analyze, counter, calculator, followup, teams
from services.auth import get_current_user
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="SignSafe API",
    description="AI Contract Analyzer for Content Creators",
    version="1.0.0"
)

# CORS — allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        os.getenv("FRONTEND_URL", "*"),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Protected Routes Group
# Routes in auth_router require a valid Supabase JWT
from fastapi import APIRouter
auth_router = APIRouter(dependencies=[Depends(get_current_user)])

auth_router.include_router(counter.router)
auth_router.include_router(followup.router)
auth_router.include_router(teams.router)

app.include_router(auth_router)

# Public Routes
# These are available to guests
app.include_router(analyze.router)
app.include_router(calculator.router)

@app.get("/")
async def root():
    return {
        "service": "SignSafe API",
        "status": "running",
        "version": "1.0.0",
        "tagline": "Is it safe to sign?"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}
