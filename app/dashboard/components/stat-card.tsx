type Accent = 'blue' | 'emerald' | 'amber' | 'red' | 'slate'

const ACCENT_CLASSES: Record<Accent, string> = {
  blue:    'text-blue-600',
  emerald: 'text-emerald-600',
  amber:   'text-amber-600',
  red:     'text-red-600',
  slate:   'text-black',
}

type Props = {
  label: string
  value: string
  sub?: string
  accent?: Accent
}

export default function StatCard({ label, value, sub, accent = 'slate' }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="text-base font-medium uppercase tracking-wider text-black">{label}</p>
      <p className={`mt-2 text-base font-bold ${ACCENT_CLASSES[accent]}`}>{value}</p>
      {sub && <p className="mt-1 text-base text-black">{sub}</p>}
    </div>
  )
}
