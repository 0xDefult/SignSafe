import json
import os
import re
from dotenv import load_dotenv
from google import genai
from google.genai import types
from models.schemas import (
    AnalysisResponse, CounterOfferResponse,
    CalculatorResponse, CalculatorRequest,
)

load_dotenv()
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def _load_prompt(filename):
    path = os.path.join(os.path.dirname(__file__), "..", "prompts", filename)
    with open(path) as f: return f.read()

def _clean_json(raw):
    c = re.sub(r'```json\s*|```\s*', '', raw).strip()
    s, e = c.find('{'), c.rfind('}') + 1
    if s != -1 and e > s: c = c[s:e]
    return json.loads(c)

def _call_gemini(prompt, temperature=0.1):
    response = client.models.generate_content(
        model=GEMINI_MODEL, contents=prompt,
        config=types.GenerateContentConfig(
            temperature=temperature,
            max_output_tokens=8192,
            response_mime_type="application/json",
        )
    )
    return response.text

def _sanitize_input(text: str) -> str:
    """
    Prevents basic prompt injection by removing common attack patterns
    and ensuring the text is treated as data.
    """
    if not text:
        return ""
    # Remove common prompt injection keywords if they appear as commands
    patterns = [
        r"ignore all previous instructions",
        r"disregard the above",
        r"system prompt",
        r"forget your rules",
        r"new instructions:",
        r"stop analyzing and instead",
    ]
    sanitized = text
    for pattern in patterns:
        sanitized = re.sub(pattern, "[SENSITIVE CONTENT REMOVED]", sanitized, flags=re.IGNORECASE)
    return sanitized

async def analyze_contract(contract_text, follower_count=50000, niche="lifestyle"):
    template = _load_prompt("analyze_prompt.txt")

    # Sanitize input to prevent prompt injection
    sanitized_text = _sanitize_input(contract_text)

    if len(sanitized_text) > 40000:
        sanitized_text = sanitized_text[:40000] + "\n[TRUNCATED]"

    prompt = template.format(contract_text=sanitized_text, follower_count=follower_count, niche=niche)
    try:
        return AnalysisResponse(**_clean_json(_call_gemini(prompt, 0.05)))
    except Exception as e:
        raise ValueError(f"Analysis failed: {e}")

async def generate_counter_offer(clause_type, original_text, context=""):
    template = _load_prompt("counter_prompt.txt")
    prompt = template.format(clause_type=clause_type, original_text=original_text, context=context)
    try:
        return CounterOfferResponse(**_clean_json(_call_gemini(prompt, 0.3)))
    except Exception as e:
        raise ValueError(f"Counter-offer failed: {e}")

async def answer_followup(question, context):
    template = _load_prompt("followup_prompt.txt")
    prompt = template.format(context=context, question=question)
    try:
        r = client.models.generate_content(
            model=GEMINI_MODEL, contents=prompt,
            config=types.GenerateContentConfig(temperature=0.4, max_output_tokens=512)
        )
        return r.text
    except Exception as e:
        raise ValueError(f"Followup failed: {e}")

def calculate_deal_value(req: CalculatorRequest) -> CalculatorResponse:
    freq = {"beauty":3.5,"tech":2.5,"food":3.0,"fitness":3.0,"travel":2.0,
            "lifestyle":3.5,"gaming":2.0,"fashion":4.0,"finance":2.0,"education":2.0}
    def avg(f):
        if f < 10000: return 5000
        if f < 50000: return 15000
        if f < 100000: return 35000
        if f < 500000: return 85000
        return 200000
    blocked = round(freq.get(req.niche.lower(), 2.5) * 0.45 * req.exclusivity_months)
    lost = round(blocked * avg(req.follower_count))
    ratio = round(lost / max(req.contract_payment_inr, 1), 1)
    return CalculatorResponse(
        blocked_deals_estimate=blocked,
        lost_revenue_inr=lost,
        effective_hourly_rate=round(req.contract_payment_inr / max(req.hours_to_create or 10, 1)),
        opportunity_cost_ratio=ratio,
        verdict=f"You earn ₹{req.contract_payment_inr:,} but lose ~₹{lost:,} in blocked deals over {req.exclusivity_months} months.",
        recommendation="Negotiate exclusivity to 60 days." if ratio > 2 else "Fair deal. Push for 30-day exclusivity.",
        is_worth_it=ratio < 2.0
    )
