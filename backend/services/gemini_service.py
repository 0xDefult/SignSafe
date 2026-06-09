import json
import os
import re
import asyncio
import time
import logging
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

logger = logging.getLogger("signsafe.gemini")

def _load_prompt(filename):
    path = os.path.join(os.path.dirname(__file__), "..", "prompts", filename)
    with open(path) as f: return f.read()

def _log_failed_json(raw: str, stage: str):
    """Log the raw AI response when JSON parsing fails, for debugging."""
    truncated = raw[:2000] if len(raw) > 2000 else raw
    logger.error(f"JSON parse failed at stage '{stage}'. Raw response (first 2000 chars):\n{truncated}")
    if len(raw) > 2000:
        logger.error(f"... (truncated, total length: {len(raw)} chars)")

def _clean_json(raw):
    """
    Robustly cleans AI output to ensure it can be parsed as JSON.
    Uses multiple repair strategies to handle common LLM mistakes:
    - Markdown code blocks
    - Trailing commas
    - Unescaped newlines in strings
    - Missing commas between fields
    - json-repair library as final fallback
    """
    original_raw = raw  # Keep for logging

    # Phase 1: Remove markdown code blocks
    c = re.sub(r'```(?:json)?\s*\n?', '', raw)
    c = re.sub(r'\n?```', '', c)
    c = c.strip()

    # Phase 2: Isolate the JSON object (find the first '{' and the last '}')
    s, e = c.find('{'), c.rfind('}') + 1
    if s != -1 and e > s:
        c = c[s:e]
    else:
        raise ValueError(f"AI response contains no JSON object. Snippet: {c[:300]}...")

    errors = []

    # Phase 3: Try raw parse
    try:
        return json.loads(c)
    except json.JSONDecodeError as err:
        errors.append(f"raw: {err}")

    # Phase 4: Remove trailing commas
    try:
        fixed = re.sub(r',\s*([\]}])', r'\1', c)
        return json.loads(fixed)
    except json.JSONDecodeError as err:
        errors.append(f"trailing-commas: {err}")

    # Phase 5: Fix unescaped newlines inside string values
    try:
        fixed = _fix_newlines_in_strings(c)
        return json.loads(fixed)
    except json.JSONDecodeError as err:
        errors.append(f"newline-fix: {err}")

    # Phase 6: Fix missing commas between JSON fields (common AI mistake)
    try:
        fixed = _fix_missing_commas(c)
        return json.loads(fixed)
    except json.JSONDecodeError as err:
        errors.append(f"missing-commas: {err}")

    # Phase 7: Combine trailing commas + newline fix
    try:
        fixed = _fix_newlines_in_strings(c)
        fixed = re.sub(r',\s*([\]}])', r'\1', fixed)
        return json.loads(fixed)
    except json.JSONDecodeError as err:
        errors.append(f"combined-fix: {err}")

    # Phase 8: json-repair library (handles a wide range of JSON errors)
    try:
        from json_repair import repair_json
        fixed = repair_json(c)
        return json.loads(fixed)
    except Exception as err:
        errors.append(f"json-repair: {err}")

    # All strategies failed — log and raise
    _log_failed_json(original_raw, "all-strategies-exhausted")
    error_summary = "; ".join(errors)
    raise ValueError(
        f"AI returned invalid JSON after {len(errors)} repair attempts. "
        f"Errors: {error_summary}. "
        f"Snippet: {c[:300]}..."
    )

def _fix_newlines_in_strings(json_str: str) -> str:
    """
    Fix unescaped newlines inside JSON string values.
    Replaces literal newlines within quoted strings with \\n.
    """
    result = []
    in_string = False
    escape_next = False
    for ch in json_str:
        if escape_next:
            result.append(ch)
            escape_next = False
            continue
        if ch == '\\':
            result.append(ch)
            escape_next = True
            continue
        if ch == '"':
            in_string = not in_string
            result.append(ch)
            continue
        if in_string and ch == '\n':
            result.append('\\n')
            continue
        if in_string and ch == '\r':
            result.append('\\r')
            continue
        if in_string and ch == '\t':
            result.append('\\t')
            continue
        result.append(ch)
    return ''.join(result)

def _fix_missing_commas(json_str: str) -> str:
    """
    Fix common patterns of missing commas between JSON fields.
    E.g., `"key": "value"\n"key2"` → `"key": "value",\n"key2"`
    """
    # Missing comma: a value followed by newline+whitespace+quote (next field)
    # Pattern: " or ] or } or number/true/false/null, then newline, then "
    fixed = re.sub(r'(["\d}\]](?:\s*))(?=\n\s*")', r'\1,\n', json_str)
    # Missing comma: string value followed by "key" on same line
    fixed = re.sub(r'("\s*)(?="[^"]*"\s*:)', r'\1,', fixed)
    # Missing comma after closing bracket/brace before next field
    fixed = re.sub(r'([\]}])\s*\n\s*"', r'\1,\n"', fixed)
    return fixed

def _call_gemini(prompt, temperature=0.1):
    """
    Calls the Gemini API with a retry mechanism for 503 (Overloaded) errors.
    """
    max_retries = 3
    for attempt in range(max_retries):
        try:
            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=temperature,
                    max_output_tokens=8192,
                    response_mime_type="application/json",
                )
            )
            return response.text
        except Exception as e:
            err_str = str(e).upper()
            # Retry if we hit 503 (Unavailable/Overloaded)
            if ("503" in err_str or "UNAVAILABLE" in err_str) and attempt < max_retries - 1:
                # Exponential backoff: 1s, 2s, 4s
                time.sleep(2 ** attempt)
                continue
            raise e

def _sanitize_input(text: str) -> str:
    """
    Prevents basic prompt injection by removing common attack patterns.
    """
    if not text:
        return ""
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
    sanitized_text = _sanitize_input(contract_text)

    # Handle very long contracts
    MAX_CHARACTERS = 1000000
    if len(sanitized_text) > MAX_CHARACTERS:
        sanitized_text = sanitized_text[:MAX_CHARACTERS] + "\n\n[TRUNCATED]"

    prompt = template.format(contract_text=sanitized_text, follower_count=follower_count, niche=niche)

    # Use run_in_executor for the synchronous API call to avoid blocking the FastAPI event loop
    loop = asyncio.get_event_loop()
    try:
        raw_res = await loop.run_in_executor(None, _call_gemini, prompt, 0.05)
        return AnalysisResponse(**_clean_json(raw_res))
    except Exception as e:
        raise ValueError(f"Analysis failed: {e}")

async def generate_counter_offer(clause_type, original_text, context=""):
    template = _load_prompt("counter_prompt.txt")
    prompt = template.format(clause_type=clause_type, original_text=original_text, context=context)

    loop = asyncio.get_event_loop()
    try:
        raw_res = await loop.run_in_executor(None, _call_gemini, prompt, 0.3)
        return CounterOfferResponse(**_clean_json(raw_res))
    except Exception as e:
        raise ValueError(f"Counter-offer failed: {e}")

async def answer_followup(question, context):
    template = _load_prompt("followup_prompt.txt")
    prompt = template.format(context=context, question=question)

    loop = asyncio.get_event_loop()
    try:
        # Follow-up is not JSON, so we call it directly without _clean_json
        r = await loop.run_in_executor(None, lambda: client.models.generate_content(
            model=GEMINI_MODEL, contents=prompt,
            config=types.GenerateContentConfig(temperature=0.4, max_output_tokens=512)
        ))
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
