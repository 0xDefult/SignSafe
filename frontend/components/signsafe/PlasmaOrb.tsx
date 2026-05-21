"use client";
import { useEffect, useState } from "react";

const MESSAGES = [
  "Reading your contract...",
  "Identifying risk clauses...",
  "Checking market standards...",
  "Calculating your exposure...",
  "Almost there...",
];

export default function PlasmaOrb({ filename = "Contract", progress = 0 }: { filename?: string; progress?: number }) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setMsgIndex(i => (i + 1) % MESSAGES.length);
        setVisible(true);
      }, 400);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-6 py-16">
      {/* Orb */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Rings */}
        <div className="absolute w-48 h-48 rounded-full border border-violet-500/20"
             style={{ animation: 'ringExpand 3s ease-out infinite' }} />
        <div className="absolute w-40 h-40 rounded-full border border-cyan-400/15"
             style={{ animation: 'ringExpand 3s ease-out infinite', animationDelay: '1s' }} />
        {/* Core orb */}
        <div className="w-32 h-32 rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #a78bfa 0%, #7c3aed 35%, #4f46e5 65%, #06b6d4 100%)',
            boxShadow: '0 0 40px #7c3aed60, 0 0 80px #7c3aed30, 0 0 120px #7c3aed15, inset 0 0 30px #ffffff15',
            animation: 'orbPulse 3s ease-in-out infinite, orbRotate 8s linear infinite',
          }}
        />
      </div>

      {/* Status text */}
      <div className="text-center space-y-2">
        <p className="text-xs font-semibold tracking-[0.15em] text-white uppercase">
          AI Analysis In Progress
        </p>
        <p
          className="text-sm text-[#6B6B8A] transition-opacity duration-400"
          style={{ opacity: visible ? 1 : 0 }}
        >
          {MESSAGES[msgIndex]}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-48 h-0.5 bg-[#1E1E35] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
          }}
        />
      </div>

      {/* Filename */}
      <p className="text-xs text-[#2E2E50] font-mono">{filename}</p>
    </div>
  );
}
