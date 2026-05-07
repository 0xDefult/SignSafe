from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import analyze, counter, calculator, followup
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

# Include routers
app.include_router(analyze.router)
app.include_router(counter.router)
app.include_router(calculator.router)
app.include_router(followup.router)

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
