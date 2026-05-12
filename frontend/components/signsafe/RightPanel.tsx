'use client'

import { ChevronRight, FileText, Flag } from 'lucide-react'
import { RiskGauge } from './RiskGauge'
import { formatINR } from '@/lib/api'

interface RightPanelProps {
  verdict: string;
  overallScore: string;
  redCount: number;
  yellowCount: number;
  greenCount: number;
  estimatedLoss: number;
  riskScore: number;
}

export function RightPanel({
  verdict,
  overallScore,
  redCount,
  yellowCount,
  greenCount,
  estimatedLoss,
  riskScore
}: RightPanelProps) {
  const totalFlags = redCount + yellowCount;

  return (
    <aside
      className="fixed right-0 top-0 h-screen w-[300px] flex flex-col z-20 overflow-y-auto"
      style={{ background: '#0D0D1A', borderLeft: '1px solid #1E1E35' }}
    >
      {/* Header bar */}
      <div className="h-[57px] flex items-center px-5 border-b" style={{ borderColor: '#1E1E35' }}>
        <h2 className="text-foreground font-semibold text-sm">Risk Summary</h2>
      </div>

      {/* Gauge */}
      <div className="px-5 pt-6 pb-4 flex flex-col items-center">
        <RiskGauge score={riskScore} />
        <div className="mt-2 text-center">
          <p className="text-white/60 text-xs">
            Risk Score: <span className="text-white font-medium">{riskScore}% ({overallScore.toUpperCase()})</span>
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 border-t" style={{ borderColor: '#1E1E35' }} />

      {/* Document Details */}
      <div className="px-5 py-4">
        <h3 className="text-foreground text-sm font-semibold mb-2">Document Details</h3>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <FileText size={14} className="text-primary" />
          <span className="text-white/60">AI Analyzed</span>
          <span className="text-border">·</span>
          <Flag size={14} style={{ color: '#F59E0B' }} />
          <span className="text-white/60">{totalFlags} flags</span>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 border-t" style={{ borderColor: '#1E1E35' }} />

      {/* Expandable rows */}
      <div className="flex flex-col">
        {[
          { label: 'Verdict', value: verdict, isMain: true },
          { label: 'Estimated Loss', value: formatINR(estimatedLoss), isMain: true },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors text-left group cursor-default"
          >
            <div className="flex flex-col gap-1">
              <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold">{item.label}</span>
              <span className="text-white text-sm font-medium">{item.value}</span>
            </div>
            <ChevronRight size={16} className="text-white/20 group-hover:text-white/40 transition-colors" />
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="mx-5 border-t" style={{ borderColor: '#1E1E35' }} />

      {/* Analysis breakdown */}
      <div className="px-5 py-4 flex flex-col gap-3">
        <h3 className="text-foreground text-sm font-semibold mb-1">Clause Breakdown</h3>
        <div className="space-y-2">
          {[
            { label: 'High Risk', count: redCount, color: '#FF4560', bg: 'rgba(255, 69, 96, 0.15)' },
            { label: 'Moderate Risk', count: yellowCount, color: '#F5A623', bg: 'rgba(245, 166, 35, 0.15)' },
            { label: 'Clear', count: greenCount, color: '#00D084', bg: 'rgba(0, 208, 132, 0.15)' },
          ].map(({ label, count, color, bg }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-white/60 text-xs">{label}</span>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ background: bg, color }}
              >
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Upload CTA */}
      <div className="p-4 mt-auto">
        <button
          onClick={() => window.location.href = '/'}
          className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)' }}
        >
          Upload New Document
        </button>
      </div>
    </aside>
  )
}
