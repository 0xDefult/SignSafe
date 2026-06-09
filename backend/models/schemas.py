from pydantic import BaseModel, field_validator, model_validator
from typing import List, Optional
from enum import Enum
from datetime import datetime

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

class TeamRole(str, Enum):
    ADMIN = "ADMIN"
    MEMBER = "MEMBER"
    VIEWER = "VIEWER"

class TeamStatus(str, Enum):
    PENDING = "PENDING"
    ACCEPTED = "ACCEPTED"
    EXPIRED = "EXPIRED"

class Team(BaseModel):
    id: str
    name: str
    owner_id: Optional[str] = None
    created_at: Optional[datetime] = None

class TeamMember(BaseModel):
    team_id: str
    user_id: str
    role: TeamRole
    joined_at: Optional[datetime] = None

class Invitation(BaseModel):
    id: str
    team_id: str
    email: str
    role: TeamRole
    token: str
    invited_by: Optional[str] = None
    status: TeamStatus
    expires_at: datetime
    created_at: Optional[datetime] = None

class InvitationRequest(BaseModel):
    email: str
    name: str
    role: TeamRole

class JoinRequest(BaseModel):
    token: str

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
    overall_score: RiskLevel = RiskLevel.GREEN  # default: overridden by safety net in gemini_service
    clauses: List[Clause]
    estimated_loss_inr: int = 0
    red_count: int = 0
    yellow_count: int = 0
    green_count: int = 0

    @model_validator(mode='after')
    def compute_counts(self):
        """Auto-compute risk counts and overall_score from clauses if the AI omitted them."""
        if self.clauses:
            # Compute counts if all are still at their default (0)
            if not self.red_count and not self.yellow_count and not self.green_count:
                self.red_count = sum(1 for c in self.clauses if c.risk == RiskLevel.RED)
                self.yellow_count = sum(1 for c in self.clauses if c.risk == RiskLevel.YELLOW)
                self.green_count = sum(1 for c in self.clauses if c.risk == RiskLevel.GREEN)
            # Compute overall_score if it looks like AI didn't provide a meaningful one
            # (still at default GREEN but counts say otherwise)
            if self.overall_score == RiskLevel.GREEN and (self.red_count > 0 or self.yellow_count > 0):
                if self.red_count >= 2 or (self.red_count >= 1 and self.yellow_count >= 3):
                    self.overall_score = RiskLevel.RED
                elif self.yellow_count >= 2:
                    self.overall_score = RiskLevel.YELLOW
        return self

class CounterOfferRequest(BaseModel):
    clause_id: int
    original_text: str
    clause_type: str
    context: Optional[str] = None

class CounterOfferResponse(BaseModel):
    rewritten_clause: str = ""
    negotiation_script: str = ""
    key_changes: List[str] = []

    @model_validator(mode='after')
    def ensure_not_empty(self):
        """Catch cases where the AI returned nothing useful."""
        if not self.rewritten_clause and not self.negotiation_script:
            self.rewritten_clause = "Unable to generate a counter-offer. Please try again."
            self.negotiation_script = "We encountered an issue generating your negotiation script. Please retry or contact support."
            self.key_changes = ["AI generation incomplete — please retry"]
        return self

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
