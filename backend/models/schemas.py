from pydantic import BaseModel, field_validator
from typing import List, Optional
from enum import Enum

class RiskLevel(str, Enum):
    RED = "red"
    YELLOW = "yellow"
    GREEN = "green"

class ClauseType(str, Enum):
    EXCLUSIVITY = "exclusivity"
    CONTENT_OWNERSHIP = "content_ownership"
    PAYMENT_TERMS = "payment_terms"
    REVISION_LIMITS = "revision_limits"
    TERMINATION = "termination"
    USAGE_RIGHTS = "usage_rights"
    DELIVERABLES = "deliverables"
    KILL_FEE = "kill_fee"
    AUTO_RENEWAL = "auto_renewal"
    OTHER = "other"

class Clause(BaseModel):
    id: int
    type: str
    risk: RiskLevel
    title: str
    original_text: str
    plain_english: str
    why_bad: Optional[str] = None
    market_standard: Optional[str] = None

    @field_validator('type', mode='before')
    @classmethod
    def normalize_type(cls, v):
        valid = ['exclusivity','content_ownership','payment_terms',
                 'revision_limits','termination','usage_rights',
                 'deliverables','kill_fee','auto_renewal','other']
        return v if v in valid else 'other'

class AnalysisResponse(BaseModel):
    verdict: str  # "DO NOT SIGN" | "SIGN WITH CHANGES" | "SAFE TO SIGN"
    verdict_reason: str
    overall_score: RiskLevel
    clauses: List[Clause]
    estimated_loss_inr: int
    red_count: int
    yellow_count: int
    green_count: int

class CounterOfferRequest(BaseModel):
    clause_id: int
    original_text: str
    clause_type: str
    context: Optional[str] = None

class CounterOfferResponse(BaseModel):
    rewritten_clause: str
    negotiation_script: str
    key_changes: List[str]

class CalculatorRequest(BaseModel):
    follower_count: int
    niche: str  # beauty, tech, food, fitness, travel, lifestyle, gaming
    contract_payment_inr: int
    exclusivity_months: int
    hours_to_create: Optional[int] = 10

class CalculatorResponse(BaseModel):
    blocked_deals_estimate: int
    lost_revenue_inr: int
    effective_hourly_rate: int
    opportunity_cost_ratio: float
    verdict: str
    recommendation: str
    is_worth_it: bool
