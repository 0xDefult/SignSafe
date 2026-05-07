from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.gemini_service import answer_followup

router = APIRouter(prefix="/followup", tags=["followup"])

class FollowupRequest(BaseModel):
    question: str
    contract_summary: str
    clauses: list

@router.post("")
async def followup_endpoint(request: FollowupRequest):
    """Answer follow-up questions about a contract analysis."""
    try:
        # Combine summary and clauses for context
        context = f"Contract Summary: {request.contract_summary}\n\nClauses: {request.clauses}"
        result = await answer_followup(
            question=request.question,
            context=context
        )
        return {"answer": result}
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
