'use client'

import { useState } from 'react'
import { Shield, AlertTriangle, FileWarning, CheckCircle2 } from 'lucide-react'
import { getCounterOffer } from '@/lib/api'

interface Clause {
  id: number;
  type: string;
  risk: 'red' | 'yellow' | 'green';
  title: string;
  original_text: string;
  plain_english: string;
  why_bad?: string;
  market_standard?: string;
}

interface ClauseCardsProps {
  clauses: Clause[];
}

const RISK_MAP = {
  red: { label: 'High Risk', color: '#FF4560', bg: 'rgba(255, 69, 96, 0.15)', icon: AlertTriangle },
  yellow: { label: 'Moderate Risk', color: '#F5A623', bg: 'rgba(245, 166, 35, 0.15)', icon: FileWarning },
  green: { label: 'Clear', color: '#00D084', bg: 'rgba(0, 208, 132, 0.15)', icon: CheckCircle2 },
};

export function ClauseCards({ clauses }: ClauseCardsProps) {
  const [counterOffers, setCounterOffers] = useState<Record<number, any>>({});
  const [loadingOffers, setLoadingOffers] = useState<Record<number, boolean>>({});

  const fetchOffer = async (clause: Clause) => {
    if (counterOffers[clause.id]) return;

    setLoadingOffers(prev => ({ ...prev, [clause.id]: true }));
    try {
      const data = await getCounterOffer(clause.id, clause.original_text, clause.type);
      setCounterOffers(prev => ({ ...prev, [clause.id]: data }));
    } catch (err) {
      console.error('Failed to fetch counter offer:', err);
    } finally {
      setLoadingOffers(prev => ({ ...prev, [clause.id]: false }));
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      {clauses.map((clause, index) => {
        const risk = RISK_MAP[clause.risk as keyof typeof RISK_MAP] || RISK_MAP.green;
        const Icon = risk.icon;
        const hasOffer = !!counterOffers[clause.id];
        const isLoading = loadingOffers[clause.id];

        return (
          <div
            key={clause.id}
            className="bg-[#12121F] border border-[#1E1E35] rounded-2xl p-5 flex flex-col gap-4 hover:border-violet-500/30 transition-all duration-200 group animate-card"
            style={{ animationDelay: `${index * 120}ms` }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: risk.bg }}
                >
                  <Icon size={20} style={{ color: risk.color }} />
                </div>
                <h3 className="text-white font-semibold text-lg leading-tight">{clause.title}</h3>
              </div>
              <span
                className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                style={{ background: risk.bg, color: risk.color }}
              >
                {risk.label}
              </span>
            </div>

            <div className="space-y-3">
              <p className="text-white/80 text-sm leading-relaxed">
                {clause.plain_english}
              </p>

              {clause.risk !== 'green' && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white/60 italic">
                  " {clause.why_bad || 'Potential risk identified in this clause.'} "
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
              <div className="text-white/30 text-[10px] font-mono uppercase tracking-widest">
                ID: {clause.id}
              </div>

              {(clause.risk === 'red' || clause.risk === 'yellow') && (
                <button
                  onClick={() => fetchOffer(clause)}
                  disabled={isLoading}
                  className="text-violet-400 text-xs font-medium hover:text-violet-300 transition-colors flex items-center gap-1"
                >
                  {isLoading ? (
                    <div className="w-3 h-3 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin" />
                  ) : (
                    hasOffer ? "View Offer ✓" : "Get counter-offer →"
                  )}
                </button>
              )}
            </div>

            {hasOffer && (
              <div className="mt-4 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 animate-fade-in">
                <p className="text-white text-sm font-medium mb-2">Suggested Revision:</p>
                <p className="text-white/70 text-xs leading-relaxed mb-3 italic">
                  {counterOffers[clause.id].rewritten_clause}
                </p>
                <div className="text-[10px] text-violet-300/60 font-mono uppercase">
                  Negotiation Tip: {counterOffers[clause.id].negotiation_script.substring(0, 60)}...
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
