'use client'

import { Shield, AlertTriangle, FileWarning, CheckCircle2 } from 'lucide-react'

const clauses = [
  {
    title: 'Confidentiality Clause',
    description:
      'NDA term and scope to start above one low confidentiality and confidentiality clause.',
    badge: 'Review Necessary',
    badgeColor: '#A78BFA',
    badgeBg: 'rgba(124,58,237,0.2)',
    icon: Shield,
    iconColor: '#A78BFA',
    floatClass: 'float-card-1',
    date: '14 Aug, 2023',
  },
  {
    title: 'Liability Cap',
    description:
      '$10k limit and risks of $10k, limit to strowsure about how exporting risks to menu of $10k.',
    badge: 'High Risk',
    badgeColor: '#F87171',
    badgeBg: 'rgba(239,68,68,0.15)',
    icon: AlertTriangle,
    iconColor: '#F87171',
    floatClass: 'float-card-2',
    date: '28 Aug, 2023',
  },
  {
    title: 'Termination Rights',
    description:
      '30-day notice to termination to confirm an origination of 30-day notice.',
    badge: 'Moderate Risk',
    badgeColor: '#FCD34D',
    badgeBg: 'rgba(245,158,11,0.15)',
    icon: FileWarning,
    iconColor: '#FCD34D',
    floatClass: 'float-card-3',
    date: '28 Aug, 2023',
  },
  {
    title: 'IP Ownership',
    description:
      'Defines that ownership that deliverables owns to define the ownership of the IP data.',
    badge: 'Clear',
    badgeColor: '#34D399',
    badgeBg: 'rgba(34,197,94,0.15)',
    icon: CheckCircle2,
    iconColor: '#34D399',
    floatClass: 'float-card-4',
    date: '28 Aug, 2023',
  },
]

export function ClauseCards() {
  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-2xl mx-auto">
      {clauses.map((clause) => {
        const Icon = clause.icon
        return (
          <div
            key={clause.title}
            className={`glass-card rounded-2xl p-4 flex flex-col gap-3 cursor-pointer hover:border-primary/30 transition-all duration-300 ${clause.floatClass}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: clause.badgeBg }}
                >
                  <Icon size={16} style={{ color: clause.iconColor }} />
                </div>
                <h3 className="text-foreground text-sm font-semibold leading-tight">{clause.title}</h3>
              </div>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">
              {clause.description}
            </p>
            <div className="flex items-center justify-between mt-auto pt-1">
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: clause.badgeBg, color: clause.badgeColor }}
              >
                {clause.badge}
              </span>
              <span className="text-muted-foreground text-[10px]">{clause.date}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
