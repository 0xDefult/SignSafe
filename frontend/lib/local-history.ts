/**
 * Session-storage-backed analysis history.
 *
 * Every analysis is appended to a local array so that Contracts and Analytics
 * pages can display recent uploads even when Supabase is unavailable or the
 * user is a guest.
 */

const STORAGE_KEY = "signsafe_history";
const MAX_ENTRIES = 20;

export interface LocalHistoryEntry {
  id: string;          // crypto.randomUUID()
  filename: string;
  verdict: string;
  overall_score: string;
  estimated_loss_inr: number;
  analysis_data: any;  // full AnalysisResponse
  created_at: string;  // ISO timestamp
}

export function getLocalHistory(): LocalHistoryEntry[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LocalHistoryEntry[];
  } catch {
    return [];
  }
}

export function addLocalHistory(result: any, filename: string): LocalHistoryEntry {
  const history = getLocalHistory();

  const entry: LocalHistoryEntry = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    filename,
    verdict: result.verdict,
    overall_score: result.overall_score,
    estimated_loss_inr: result.estimated_loss_inr,
    analysis_data: result,
    created_at: new Date().toISOString(),
  };

  // Prepend so newest is first; cap at MAX_ENTRIES
  history.unshift(entry);
  if (history.length > MAX_ENTRIES) history.length = MAX_ENTRIES;

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // sessionStorage full — clear and retry once
    sessionStorage.removeItem(STORAGE_KEY);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 5)));
    } catch { /* give up */ }
  }

  return entry;
}

export function clearLocalHistory(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}
