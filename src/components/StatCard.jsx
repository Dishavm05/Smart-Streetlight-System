export default function StatCard({ icon: Icon, label, value, unit, hint, tone = 'amber' }) {
  return (
    <div className="card stat">
      <div className={`stat-icon tone-${tone}`}><Icon size={20} /></div>
      <div>
        <span className="stat-label">{label}</span>
        <div className="stat-value">
          {value}
          {unit && <small>{unit}</small>}
        </div>
        {hint && <span className="stat-hint">{hint}</span>}
      </div>
    </div>
  )
}
