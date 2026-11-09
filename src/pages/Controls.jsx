import { Lightbulb, Power, Info } from 'lucide-react'
import Toggle from '../components/Toggle.jsx'
import { useDevices, LED_WATTS } from '../context/DeviceContext.jsx'

export default function Controls() {
  const { mode, setMode, leds, toggleLed, setBrightness, setAll } = useDevices()
  const locked = mode === 'AUTO'

  return (
    <div className="stack">
      <section className="card mode-card">
        <div>
          <h3>Control mode</h3>
          <p className="muted">AUTO follows the light sensor. MANUAL lets you control each lamp.</p>
        </div>
        <div className="segmented" role="group" aria-label="Control mode">
          {['AUTO', 'MANUAL'].map((m) => (
            <button key={m} className={mode === m ? 'active' : ''} onClick={() => setMode(m)}>{m}</button>
          ))}
        </div>
        <div className="bulk">
          <button className="btn btn-ghost" disabled={locked} onClick={() => setAll(true)}><Power size={16} /> All on</button>
          <button className="btn btn-ghost" disabled={locked} onClick={() => setAll(false)}><Power size={16} /> All off</button>
        </div>
      </section>

      {locked && (
        <div className="notice">
          <Info size={18} /> Switch to MANUAL mode to change lamps yourself.
        </div>
      )}

      <section className="grid grid-led">
        {leds.map((l) => (
          <div key={l.id} className={`card led ${l.on && l.online ? 'lit' : ''} ${!l.online ? 'offline' : ''}`}>
            <div className="led-top">
              <div className="bulb"><Lightbulb size={26} /></div>
              <Toggle checked={l.on && l.online} disabled={locked || !l.online} onChange={() => toggleLed(l.id)} label={`Switch ${l.name}`} />
            </div>
            <h3>{l.name}</h3>
            <p className="muted">{l.location}</p>

            {l.online ? (
              <>
                <label className="slider">
                  <span>Brightness <b>{l.brightness}%</b></span>
                  <input type="range" min="10" max="100" step="5" value={l.brightness} disabled={locked || !l.on} onChange={(e) => setBrightness(l.id, +e.target.value)} />
                </label>
                <small className="muted">{l.on ? `${((LED_WATTS * l.brightness) / 100).toFixed(1)} W` : 'Off'}</small>
              </>
            ) : (
              <span className="badge badge-bad">Offline - cannot be controlled</span>
            )}
          </div>
        ))}
      </section>
    </div>
  )
}
