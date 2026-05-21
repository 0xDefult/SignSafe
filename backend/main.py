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
        "https://*.vercel.app",
        os.getenv("FRONTEND_URL", "")
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Protected Routes Group
# All routers included here will require a valid Supabase JWT
protected_router = FastAPI() # Using a sub-app or just a router
# To keep it simple and compatible with the existing structure,
# we'll create a wrapper router that applies the dependency to all its children.
from fastapi import APIRouter
auth_router = APIRouter(dependencies=[Depends(get_current_user)])

auth_router.include_router(analyze.router)
auth_router.include_router(counter.router)
auth_router.include_router(calculator.router)
auth_router.include_router(followup.router)
auth_router.include_router(teams.router)

app.include_router(auth_router)

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
