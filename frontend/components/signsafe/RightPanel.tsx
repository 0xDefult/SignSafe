'use client'

import { ChevronRight, FileText, Flag } from 'lucide-react'
import { RiskGauge } from './RiskGauge'

export function RightPanel() {
  return (
    <aside
      className="fixed right-0 top-0 h-screen w-[300px] flex flex-col z-20 overflow-y-auto"
      style={{ background: '#0D0D1A', borderLeft: '1px solid #1E1E35' }}
    >
      {/* Header bar (matches main top bar height) */}
      <div className="h-[57px] flex items-center px-5 border-b" style={{ borderColor: '#1E1E35' }}>
        <h2 className="text-foreground font-semibold text-sm">Risk Summary</h2>
      </div>

      {/* Gauge */}
      <div className="px-5 pt-6 pb-4 flex flex-col items-center">
        <RiskGauge score={72} />
      </div>

      {/* Divider */}
      <div className="mx-5 border-t" style={{ borderColor: '#1E1E35' }} />

      {/* Document Details */}
      <div className="px-5 py-4">
        <h3 className="text-foreground text-sm font-semibold mb-2">Document Details</h3>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <FileText size={14} className="text-primary" />
          <span>28 pages</span>
          <span className="text-border">·</span>
          <Flag size={14} style={{ color: '#F59E0B' }} />
          <span>4 flags</span>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 border-t" style={{ borderColor: '#1E1E35' }} />

      {/* Expandable rows */}
      {[
        { label: 'Key Actions', count: 3 },
        { label: 'Contract & Flags', count: 4 },
      ].map(({ label, count }) => (
        <button
          key={label}
          className="flex items-center justify-between px-5 py-4 hover:bg-secondary transition-colors text-left group"
        >
          <div>
            <span className="text-foreground text-sm font-medium">{label}</span>
            <span
              className="ml-2 text-xs px-1.5 py-0.5 rounded-full"
              style={{ background: 'rgba(124,58,237,0.2)', color: '#A78BFA' }}
            >
              {count}
            </span>
          </div>
          <ChevronRight size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
      ))}

      {/* Divider */}
      <div className="mx-5 border-t" style={{ borderColor: '#1E1E35' }} />

      {/* Analysis breakdown */}
      <div className="px-5 py-4 flex flex-col gap-3">
        <h3 className="text-foreground text-sm font-semibold">Clause Breakdown</h3>
        {[
          { label: 'Confidentiality', status: 'Review', color: '#A78BFA', bg: 'rgba(124,58,237,0.2)' },
          { label: 'Liability Cap', status: 'High Risk', color: '#F87171', bg: 'rgba(239,68,68,0.15)' },
          { label: 'Termination', status: 'Moderate', color: '#FCD34D', bg: 'rgba(245,158,11,0.15)' },
          { label: 'IP Ownership', status: 'Clear', color: '#34D399', bg: 'rgba(34,197,94,0.15)' },
        ].map(({ label, status, color, bg }) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs">{label}</span>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ background: bg, color }}
            >
              {status}
            </span>
          </div>
        ))}
      </div>

      {/* Upload CTA */}
      <div className="p-4 mt-auto">
        <button
          className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)' }}
        >
          Upload New Document
        </button>
      </div>
    </aside>
  )
}
