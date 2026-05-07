from fastapi import APIRouter, HTTPException
from services.gemini_service import generate_counter_offer
from models.schemas import CounterOfferRequest, CounterOfferResponse

router = APIRouter(prefix="/counter-offer", tags=["counter"])

@router.post("", response_model=CounterOfferResponse)
async def counter_offer_endpoint(request: CounterOfferRequest):
    """Generate a creator-friendly rewrite of a problematic clause."""
    try:
        result = await generate_counter_offer(
            clause_type=request.clause_type,
            original_text=request.original_text,
            context=request.context or ""
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
