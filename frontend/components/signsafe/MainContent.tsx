'use client'

import { useState } from 'react'
import { Upload, Plus } from 'lucide-react'
import { PlasmaOrb } from './PlasmaOrb'
import { ClauseCards } from './ClauseCards'

const statusMessages = [
  'Processing Document…',
  'Extracting Clauses…',
  'Analyzing Risk Factors…',
  'Cross-referencing Legal Standards…',
  'Generating Risk Report…',
]

export function MainContent() {
  const [progress] = useState(84)
  const [statusIdx] = useState(0)

  return (
    <main
      className="flex-1 flex flex-col min-h-screen overflow-y-auto"
      style={{ marginLeft: 240, marginRight: 300, background: '#08080F' }}
    >
      {/* Top bar */}
      <header
        className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 border-b"
        style={{ background: '#08080F', borderColor: '#1E1E35' }}
      >
        <h1 className="text-foreground font-semibold text-base">Dashboard</h1>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)' }}
          >
            <Upload size={15} />
            Upload New
          </button>
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)' }}
          >
            <Plus size={18} />
          </button>
        </div>
      </header>

      {/* Hero section */}
      <section className="flex flex-col items-center pt-10 pb-6 px-8 text-center">
        <h2
          className="font-serif italic text-foreground leading-none mb-3 text-balance"
          style={{ fontSize: 'clamp(52px, 6vw, 80px)', letterSpacing: '-0.02em' }}
        >
          Is it safe to sign?
        </h2>
        <p className="text-muted-foreground text-sm mb-8 max-w-md">
          Contract Analysis: Master Services Agreement v2.1 (Project Orion)
        </p>

        {/* Plasma Orb */}
        <div className="relative mb-6">
          <PlasmaOrb />
        </div>

        {/* Progress section */}
        <div className="w-full max-w-sm flex flex-col items-center gap-3">
          <div className="text-center">
            <p className="text-foreground text-xs font-semibold tracking-widest uppercase mb-1">
              AI Analysis in Progress
            </p>
            <p className="text-muted-foreground text-xs">
              Status: {statusMessages[statusIdx]} ({progress}%)
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full" style={{ background: '#1E1E35' }}>
            <div
              className="progress-shimmer h-full rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </section>

      {/* Clause Cards */}
      <section className="px-8 pb-12">
        <ClauseCards />
      </section>
    </main>
  )
}
