import { createContext, useContext, useEffect, useState } from 'react'

const DeviceContext = createContext(null)

export const LED_WATTS = 12 // power of one LED lamp at 100% brightness
const LOCATIONS = ['Main Gate', 'Library Road', 'Central Park', 'Bus Stop', 'Parking Lot A', 'Admin Block', 'Hostel Lane', 'Sports Ground']

export const DEFAULT_SETTINGS = {
  luxThreshold: 300,
  defaultBrightness: 80,
  scheduleOn: '18:30',
  scheduleOff: '05:30',
  alertOffline: true,
  alertPower: true,
  alertEmail: false,
  tariff: 8, // cost per kWh in INR
}

const makeLeds = () =>
  LOCATIONS.map((location, i) => ({
    id: i + 1,
    name: `LED ${i + 1}`,
    location,
    on: i % 3 !== 2,
    brightness: 80,
    online: i !== 6,
  }))

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))
const timeLabel = (d = new Date()) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })

export function DeviceProvider({ children }) {
  const [mode, setMode] = useState('AUTO')
  const [leds, setLeds] = useState(makeLeds)
  const [sensors, setSensors] = useState({ lux: 240, voltage: 230, temp: 29 })
  const [history, setHistory] = useState([])
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('sl_settings')
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS
  })

  // Simulated sensor readings (Step 3 replaces this with live Firebase data)
  useEffect(() => {
    const timer = setInterval(() => {
      setSensors((s) => ({
        lux: Math.round(clamp(s.lux + (Math.random() - 0.5) * 120, 40, 900)),
        voltage: +clamp(s.voltage + (Math.random() - 0.5) * 2, 224, 236).toFixed(1),
        temp: +clamp(s.temp + (Math.random() - 0.5) * 0.8, 24, 40).toFixed(1),
      }))
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  // AUTO mode: lamps switch on when it gets dark
  useEffect(() => {
    if (mode !== 'AUTO') return
    const dark = sensors.lux < settings.luxThreshold
    setLeds((prev) =>
      prev.map((l) => (l.online ? { ...l, on: dark, brightness: dark ? settings.defaultBrightness : l.brightness } : l))
    )
  }, [mode, sensors.lux, settings.luxThreshold, settings.defaultBrightness])

  const totalPower = leds.reduce((sum, l) => sum + (l.on && l.online ? (LED_WATTS * l.brightness) / 100 : 0), 0)
  const activeCount = leds.filter((l) => l.on && l.online).length
  const onlineCount = leds.filter((l) => l.online).length
  const current = +(totalPower / sensors.voltage).toFixed(2)

  // Keep the last 20 readings for the live charts
  useEffect(() => {
    setHistory((h) => [...h.slice(-19), { time: timeLabel(), power: +totalPower.toFixed(1), lux: sensors.lux }])
  }, [sensors])

  const toggleLed = (id) => setLeds((p) => p.map((l) => (l.id === id && l.online ? { ...l, on: !l.on } : l)))
  const setBrightness = (id, value) => setLeds((p) => p.map((l) => (l.id === id ? { ...l, brightness: value } : l)))
  const setAll = (on) => setLeds((p) => p.map((l) => (l.online ? { ...l, on } : l)))
  const saveSettings = (next) => {
    setSettings(next)
    localStorage.setItem('sl_settings', JSON.stringify(next))
  }

  const value = {
    mode, setMode, leds, sensors, history, settings, saveSettings,
    totalPower, activeCount, onlineCount, current,
    toggleLed, setBrightness, setAll,
  }
  return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>
}

export const useDevices = () => useContext(DeviceContext)
