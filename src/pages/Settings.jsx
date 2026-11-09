import { useState } from 'react'
import { Save, RotateCcw } from 'lucide-react'
import Toggle from '../components/Toggle.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useDevices, DEFAULT_SETTINGS } from '../context/DeviceContext.jsx'

export default function Settings() {
  const { user } = useAuth()
  const { settings, saveSettings } = useDevices()
  const [form, setForm] = useState(settings)
  const [saved, setSaved] = useState(false)

  const set = (key, value) => { setForm({ ...form, [key]: value }); setSaved(false) }
  const save = () => { saveSettings(form); setSaved(true) }
  const reset = () => { setForm(DEFAULT_SETTINGS); saveSettings(DEFAULT_SETTINGS); setSaved(true) }

  return (
    <div className="stack">
      <section className="grid grid-2">
        <div className="card form-card">
          <h3>AUTO mode</h3>
          <label className="slider">
            <span>Switch on when light is below <b>{form.luxThreshold} lux</b></span>
            <input type="range" min="50" max="600" step="10" value={form.luxThreshold} onChange={(e) => set('luxThreshold', +e.target.value)} />
          </label>
          <label className="slider">
            <span>Default brightness <b>{form.defaultBrightness}%</b></span>
            <input type="range" min="10" max="100" step="5" value={form.defaultBrightness} onChange={(e) => set('defaultBrightness', +e.target.value)} />
          </label>
          <div className="row">
            <label className="field"><span>Schedule on</span><input type="time" value={form.scheduleOn} onChange={(e) => set('scheduleOn', e.target.value)} /></label>
            <label className="field"><span>Schedule off</span><input type="time" value={form.scheduleOff} onChange={(e) => set('scheduleOff', e.target.value)} /></label>
          </div>
          <label className="field">
            <span>Electricity price (₹ per kWh)</span>
            <input type="number" min="0" step="0.5" value={form.tariff} onChange={(e) => set('tariff', +e.target.value)} />
          </label>
        </div>

        <div className="card form-card">
          <h3>Alerts</h3>
          {[
            ['alertOffline', 'Lamp goes offline', 'Tell me when a lamp stops responding.'],
            ['alertPower', 'Power problems', 'Tell me when voltage drops or spikes.'],
            ['alertEmail', 'Send alerts by email', `Alerts go to ${user?.email}.`],
          ].map(([key, title, desc]) => (
            <div className="setting-row" key={key}>
              <div><strong>{title}</strong><p className="muted">{desc}</p></div>
              <Toggle checked={form[key]} onChange={(v) => set(key, v)} label={title} />
            </div>
          ))}

          <h3 className="sub">Account</h3>
          <div className="setting-row"><div><strong>Signed in as</strong><p className="muted">{user?.email}</p></div></div>
        </div>
      </section>

      <div className="actions">
        {saved && <span className="saved" role="status">Settings saved</span>}
        <button className="btn btn-ghost" onClick={reset}><RotateCcw size={16} /> Restore defaults</button>
        <button className="btn btn-primary" onClick={save}><Save size={16} /> Save changes</button>
      </div>
    </div>
  )
}
