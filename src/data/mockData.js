// Sample data for charts and reports. In Step 4 this comes from Firebase.

export const weeklyEnergy = [
  { day: 'Mon', kwh: 4.2 }, { day: 'Tue', kwh: 4.6 }, { day: 'Wed', kwh: 3.9 },
  { day: 'Thu', kwh: 5.1 }, { day: 'Fri', kwh: 4.8 }, { day: 'Sat', kwh: 5.4 }, { day: 'Sun', kwh: 4.4 },
]

export const hourlyPower = Array.from({ length: 24 }, (_, h) => {
  const night = h >= 18 || h < 6
  return { hour: `${String(h).padStart(2, '0')}:00`, watts: night ? 60 + ((h * 17) % 35) : 0 }
})

export const monthlyEnergy = [
  { month: 'May', manual: 168, auto: 122 },
  { month: 'Jun', manual: 160, auto: 118 },
  { month: 'Jul', manual: 172, auto: 115 },
  { month: 'Aug', manual: 165, auto: 109 },
  { month: 'Sep', manual: 158, auto: 104 },
  { month: 'Oct', manual: 170, auto: 101 },
]

export const energyByLed = [
  { name: 'Main Gate', value: 18 }, { name: 'Library Road', value: 14 },
  { name: 'Central Park', value: 16 }, { name: 'Bus Stop', value: 12 },
  { name: 'Parking Lot A', value: 15 }, { name: 'Admin Block', value: 11 },
  { name: 'Hostel Lane', value: 6 }, { name: 'Sports Ground', value: 8 },
]

export const alerts = [
  { id: 1, level: 'danger', text: 'LED 7 (Hostel Lane) went offline', time: '12 min ago' },
  { id: 2, level: 'warn', text: 'Voltage dipped below 226 V', time: '1 hr ago' },
  { id: 3, level: 'ok', text: 'AUTO mode switched all lamps on', time: '2 hr ago' },
  { id: 4, level: 'ok', text: 'Daily report generated', time: 'Yesterday' },
]

const EVENTS = ['Turned ON', 'Turned OFF', 'Brightness changed']

export const reportRows = Array.from({ length: 60 }, (_, i) => {
  const d = new Date()
  d.setDate(d.getDate() - Math.floor(i / 2))
  d.setHours(i % 2 === 0 ? 18 : 5, (i * 7) % 60, 0, 0)
  const fault = i % 11 === 0
  return {
    id: i + 1,
    date: d.toISOString(),
    led: `LED ${((i * 3) % 8) + 1}`,
    event: fault ? 'Fault detected' : EVENTS[i % 3],
    mode: i % 4 === 0 ? 'MANUAL' : 'AUTO',
    energy: +(0.08 + ((i * 13) % 40) / 100).toFixed(2),
    status: fault ? 'Fault' : 'OK',
  }
})
