from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from services.pdf_parser import extract_text
from services.gemini_service import analyze_contract
from models.schemas import AnalysisResponse
from services.auth import get_current_user, get_optional_user
from services.supabase_client import supabase_client

router = APIRouter(prefix="/analyze", tags=["analyze"])

@router.post("", response_model=AnalysisResponse)
async def analyze_contract_endpoint(
    file: UploadFile = File(...),
    follower_count: int = Form(default=50000),
    niche: str = Form(default="lifestyle"),
    user=Depends(get_optional_user)
):
    """
    Main endpoint: Upload a contract PDF/DOCX and get full analysis.
    """
    # Validate file size (max 10MB)
    MAX_SIZE = 10 * 1024 * 1024
    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(status_code=413, detail="File too large. Maximum 10MB.")

    # Reset file position after reading
    await file.seek(0)

    # Extract text
    contract_text = await extract_text(file)

    if len(contract_text.strip()) < 200:
        raise HTTPException(
            status_code=422,
            detail="Contract text too short. Please upload a complete contract document."
        )

    # Analyze with Gemma
    result = await analyze_contract(
        contract_text=contract_text,
        follower_count=follower_count,
        niche=niche
    )

    # Save analysis to history only if user is authenticated
    if user:
        try:
            supabase_client.table("analysis_history").insert({
                "user_id": user.id,
                "filename": file.filename,
                "verdict": result.verdict,
                "overall_score": result.overall_score,
                "estimated_loss_inr": result.estimated_loss_inr,
                "analysis_data": result.model_dump()
            }).execute()
        except Exception as e:
            # Log error but don't fail the request as analysis is the primary goal
            print(f"Error saving analysis to history: {e}")

    return result
