'use client'

export function PlasmaOrb() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
      {/* Outer rings */}
      <div
        className="orb-ring-2 absolute rounded-full"
        style={{
          width: 200,
          height: 200,
          background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
          border: '1px solid rgba(124,58,237,0.12)',
        }}
      />
      <div
        className="orb-ring absolute rounded-full"
        style={{
          width: 170,
          height: 170,
          background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)',
          border: '1px solid rgba(6,182,212,0.15)',
        }}
      />
      {/* Core orb */}
      <div
        className="orb-pulse relative rounded-full flex items-center justify-center"
        style={{
          width: 140,
          height: 140,
          background:
            'radial-gradient(circle at 35% 35%, rgba(6,182,212,0.9) 0%, rgba(124,58,237,0.85) 40%, rgba(139,92,246,0.6) 70%, rgba(8,8,15,0.3) 100%)',
          boxShadow:
            '0 0 60px rgba(124,58,237,0.5), 0 0 120px rgba(124,58,237,0.25), inset 0 0 40px rgba(6,182,212,0.3)',
        }}
      >
        {/* Inner glow */}
        <div
          className="absolute rounded-full"
          style={{
            width: 60,
            height: 60,
            background:
              'radial-gradient(circle, rgba(6,182,212,0.95) 0%, rgba(124,58,237,0.4) 60%, transparent 100%)',
            filter: 'blur(4px)',
          }}
        />
        {/* Specular highlight */}
        <div
          className="absolute rounded-full"
          style={{
            width: 30,
            height: 20,
            top: 22,
            left: 28,
            background: 'radial-gradient(ellipse, rgba(255,255,255,0.5) 0%, transparent 100%)',
            filter: 'blur(3px)',
          }}
        />
      </div>
    </div>
  )
}
