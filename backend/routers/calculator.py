from fastapi import APIRouter
from services.gemini_service import calculate_deal_value
from models.schemas import CalculatorRequest, CalculatorResponse

router = APIRouter(prefix="/calculate", tags=["calculator"])

@router.post("", response_model=CalculatorResponse)
async def calculate_endpoint(request: CalculatorRequest):
    """Calculate the true cost of an exclusivity clause."""
    return calculate_deal_value(request)
