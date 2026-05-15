type Status = 'online' | 'warning' | 'offline' | 'operational' | 'degraded' | 'down'

const CONFIG: Record<Status, { dot: string; text: string; label: string }> = {
  online:       { dot: 'bg-emerald-500', text: 'text-emerald-700', label: 'En ligne'    },
  warning:      { dot: 'bg-amber-400',   text: 'text-amber-700',   label: 'Alerte'      },
  offline:      { dot: 'bg-red-500',     text: 'text-red-700',     label: 'Hors ligne'  },
  operational:  { dot: 'bg-emerald-500', text: 'text-emerald-700', label: 'Opérationnel'},
  degraded:     { dot: 'bg-amber-400',   text: 'text-amber-700',   label: 'Dégradé'     },
  down:         { dot: 'bg-red-500',     text: 'text-red-700',     label: 'Hors service'},
}

type Props = { status: Status; label?: string }

export default function StatusBadge({ status, label }: Props) {
  const { dot, text } = CONFIG[status]
  const display = label ?? CONFIG[status].label
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {display}
    </span>
  )
}
