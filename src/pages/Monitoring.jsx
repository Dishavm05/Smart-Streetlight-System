import { Zap, Activity, Sun, Thermometer } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import StatCard from '../components/StatCard.jsx'
import { useDevices, LED_WATTS } from '../context/DeviceContext.jsx'
import { COLORS, tooltipStyle, axisProps } from '../components/chartStyle.js'

export default function Monitoring() {
  const { leds, sensors, current, history } = useDevices()

  return (
    <div className="stack">
      <section className="grid grid-4">
        <StatCard icon={Zap} label="Supply voltage" value={sensors.voltage} unit="V" tone="amber" />
        <StatCard icon={Activity} label="Total current" value={current} unit="A" tone="cyan" />
        <StatCard icon={Sun} label="Light level" value={sensors.lux} unit="lux" tone="violet" />
        <StatCard icon={Thermometer} label="Temperature" value={sensors.temp} unit="°C" tone="red" />
      </section>

      <section className="card">
        <div className="card-head">
          <h3>Light level, live</h3>
          <span className="pill pill-cyan"><i className="dot" /> Live</span>
        </div>
        <div className="chart chart-sm">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history} margin={{ left: -20, right: 8, top: 8 }}>
              <CartesianGrid stroke={COLORS.grid} vertical={false} />
              <XAxis dataKey="time" {...axisProps} minTickGap={40} />
              <YAxis {...axisProps} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="lux" name="Light (lux)" stroke={COLORS.violet} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="card">
        <div className="card-head"><h3>Device status</h3></div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Device</th><th>Location</th><th>Connection</th><th>State</th><th>Brightness</th><th>Power</th></tr>
            </thead>
            <tbody>
              {leds.map((l) => (
                <tr key={l.id}>
                  <td><strong>{l.name}</strong></td>
                  <td>{l.location}</td>
                  <td><span className={`badge ${l.online ? 'badge-ok' : 'badge-bad'}`}>{l.online ? 'Online' : 'Offline'}</span></td>
                  <td>{!l.online ? '-' : l.on ? 'On' : 'Off'}</td>
                  <td>{l.online && l.on ? `${l.brightness}%` : '-'}</td>
                  <td>{l.online && l.on ? `${((LED_WATTS * l.brightness) / 100).toFixed(1)} W` : '0 W'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
