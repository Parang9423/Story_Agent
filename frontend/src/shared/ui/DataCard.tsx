type DataCardProps = {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export function DataCard({ title, subtitle, children }: DataCardProps) {
  return (
    <article className="data-card">
      <div className="data-card__header">
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="data-card__body">{children}</div>
    </article>
  )
}
