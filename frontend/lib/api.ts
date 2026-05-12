const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function analyzeContract(file: File, followerCount = 50000, niche = "lifestyle") {
  const form = new FormData();
  form.append("file", file);
  form.append("follower_count", String(followerCount));
  form.append("niche", niche);
  const res = await fetch(`${API}/analyze`, { method: "POST", body: form });
  if (!res.ok) throw new Error((await res.json()).detail || "Analysis failed");
  return res.json();
}

export async function getCounterOffer(clauseId: number, originalText: string, clauseType: string) {
  const res = await fetch(`${API}/counter-offer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clause_id: clauseId, original_text: originalText, clause_type: clauseType })
  });
  if (!res.ok) throw new Error("Counter-offer failed");
  return res.json();
}

export async function calculateDeal(params: {
  follower_count: number; niche: string;
  contract_payment_inr: number; exclusivity_months: number;
}) {
  const res = await fetch(`${API}/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params)
  });
  if (!res.ok) throw new Error("Calculation failed");
  return res.json();
}

export async function askFollowUp(question: string, summary: string, clauses: any[]) {
  const res = await fetch(`${API}/followup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, contract_summary: summary, clauses: clauses.slice(0, 5) })
  });
  if (!res.ok) throw new Error("Followup failed");
  return res.json();
}

export const formatINR = (n: number) => "₹" + n.toLocaleString("en-IN");