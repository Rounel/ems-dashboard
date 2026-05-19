type Props = {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export default function SectionHeader({ title, subtitle, action }: Props) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-base font-semibold text-black">{title}</h1>
        {subtitle && <p className="mt-0.5 text-base text-black">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
