import { Lightbulb, Zap, Gauge, Sun, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import StatCard from '../components/StatCard.jsx'
import { useDevices } from '../context/DeviceContext.jsx'
import { weeklyEnergy, alerts } from '../data/mockData.js'
import { COLORS, tooltipStyle, axisProps } from '../components/chartStyle.js'

const alertIcon = { danger: AlertCircle, warn: AlertTriangle, ok: CheckCircle2 }

export default function Dashboard() {
  const { leds, history, activeCount, onlineCount, totalPower, sensors, mode } = useDevices()
  const todayKwh = weeklyEnergy[weeklyEnergy.length - 1].kwh

  return (
    <div className="stack">
      <section className="grid grid-4">
        <StatCard icon={Lightbulb} label="Lamps lit" value={activeCount} unit="/ 8" hint={`${onlineCount} online`} tone="amber" />
        <StatCard icon={Zap} label="Power now" value={totalPower.toFixed(0)} unit="W" hint="All lamps combined" tone="cyan" />
        <StatCard icon={Gauge} label="Energy today" value={todayKwh} unit="kWh" hint="Compared with 5.2 kWh yesterday" tone="green" />
        <StatCard icon={Sun} label="Ambient light" value={sensors.lux} unit="lux" hint={sensors.lux < 300 ? 'Dark enough for lamps' : 'Daylight'} tone="violet" />
      </section>

      <section className="grid grid-main">
        <div className="card">
          <div className="card-head">
            <h3>Power draw, live</h3>
            <span className="pill pill-cyan"><i className="dot" /> Updating every 3 s</span>
          </div>
          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ left: -20, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="pw" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.amber} stopOpacity={0.45} />
                    <stop offset="100%" stopColor={COLORS.amber} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={COLORS.grid} vertical={false} />
                <XAxis dataKey="time" {...axisProps} minTickGap={40} />
                <YAxis {...axisProps} unit=" W" />
                <Tooltip {...tooltipStyle} />
                <Area type="monotone" dataKey="power" name="Power (W)" stroke={COLORS.amber} strokeWidth={2} fill="url(#pw)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h3>Streetlights</h3>
            <span className={`pill ${mode === 'AUTO' ? 'pill-cyan' : 'pill-amber'}`}>{mode}</span>
          </div>
          <div className="mini-grid">
            {leds.map((l) => (
              <div key={l.id} className={`mini ${!l.online ? 'off-line' : l.on ? 'lit' : ''}`}>
                <Lightbulb size={18} />
                <strong>{l.name}</strong>
                <small>{!l.online ? 'Offline' : l.on ? `${l.brightness}%` : 'Off'}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-2">
        <div className="card">
          <div className="card-head"><h3>Energy this week</h3></div>
          <div className="chart chart-sm">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyEnergy} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid stroke={COLORS.grid} vertical={false} />
                <XAxis dataKey="day" {...axisProps} />
                <YAxis {...axisProps} unit=" kWh" />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="kwh" name="Energy (kWh)" fill={COLORS.cyan} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h3>Recent alerts</h3></div>
          <ul className="alerts">
            {alerts.map((a) => {
              const Icon = alertIcon[a.level]
              return (
                <li key={a.id} className={`alert-${a.level}`}>
                  <Icon size={18} />
                  <span>{a.text}</span>
                  <small>{a.time}</small>
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </div>
  )
}
