import { Gauge, TrendingDown, Wallet, Flame } from 'lucide-react'
import { BarChart, Bar, AreaChart, Area, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import StatCard from '../components/StatCard.jsx'
import { useDevices } from '../context/DeviceContext.jsx'
import { weeklyEnergy, hourlyPower, monthlyEnergy, energyByLed } from '../data/mockData.js'
import { COLORS, tooltipStyle, axisProps } from '../components/chartStyle.js'

const PIE = [COLORS.amber, COLORS.cyan, COLORS.green, COLORS.violet, COLORS.red, '#5b8def', '#f78fb3', '#7bd88f']

export default function Analytics() {
  const { settings } = useDevices()
  const weekTotal = weeklyEnergy.reduce((s, d) => s + d.kwh, 0)
  const peak = weeklyEnergy.reduce((a, b) => (b.kwh > a.kwh ? b : a))
  const last = monthlyEnergy[monthlyEnergy.length - 1]
  const saved = last.manual - last.auto

  return (
    <div className="stack">
      <section className="grid grid-4">
        <StatCard icon={Gauge} label="This week" value={weekTotal.toFixed(1)} unit="kWh" hint={`Average ${(weekTotal / 7).toFixed(1)} kWh a day`} tone="cyan" />
        <StatCard icon={Flame} label="Peak day" value={peak.day} hint={`${peak.kwh} kWh`} tone="amber" />
        <StatCard icon={TrendingDown} label="Saved by AUTO" value={saved} unit="kWh" hint={`${last.month}, against MANUAL use`} tone="green" />
        <StatCard icon={Wallet} label="Weekly cost" value={`₹${(weekTotal * settings.tariff).toFixed(0)}`} hint={`At ₹${settings.tariff} per kWh`} tone="violet" />
      </section>

      <section className="grid grid-2">
        <div className="card">
          <div className="card-head"><h3>Daily energy</h3></div>
          <div className="chart chart-sm">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyEnergy} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid stroke={COLORS.grid} vertical={false} />
                <XAxis dataKey="day" {...axisProps} />
                <YAxis {...axisProps} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="kwh" name="Energy (kWh)" fill={COLORS.amber} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h3>Power through the day</h3></div>
          <div className="chart chart-sm">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyPower} margin={{ left: -20, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="hp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.cyan} stopOpacity={0.45} />
                    <stop offset="100%" stopColor={COLORS.cyan} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={COLORS.grid} vertical={false} />
                <XAxis dataKey="hour" {...axisProps} interval={3} />
                <YAxis {...axisProps} />
                <Tooltip {...tooltipStyle} />
                <Area type="monotone" dataKey="watts" name="Power (W)" stroke={COLORS.cyan} strokeWidth={2} fill="url(#hp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid grid-2">
        <div className="card">
          <div className="card-head"><h3>AUTO against MANUAL, monthly</h3></div>
          <div className="chart chart-sm">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyEnergy} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid stroke={COLORS.grid} vertical={false} />
                <XAxis dataKey="month" {...axisProps} />
                <YAxis {...axisProps} />
                <Tooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ color: COLORS.text, fontSize: 12 }} />
                <Line type="monotone" dataKey="manual" name="MANUAL (kWh)" stroke={COLORS.red} strokeWidth={2} />
                <Line type="monotone" dataKey="auto" name="AUTO (kWh)" stroke={COLORS.green} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h3>Energy by lamp</h3></div>
          <div className="chart chart-sm">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={energyByLed} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="85%" paddingAngle={2} stroke="none">
                  {energyByLed.map((_, i) => <Cell key={i} fill={PIE[i % PIE.length]} />)}
                </Pie>
                <Tooltip {...tooltipStyle} formatter={(v) => `${v}%`} />
                <Legend wrapperStyle={{ color: COLORS.text, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  )
}
