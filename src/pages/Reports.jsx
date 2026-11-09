import { useMemo, useState } from 'react'
import { Download, ChevronLeft, ChevronRight } from 'lucide-react'
import { reportRows } from '../data/mockData.js'

const PAGE_SIZE = 10
const fmt = (iso) => new Date(iso).toLocaleString([], { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })

export default function Reports() {
  const [days, setDays] = useState(7)
  const [led, setLed] = useState('all')
  const [event, setEvent] = useState('all')
  const [page, setPage] = useState(1)

  const rows = useMemo(() => {
    const cutoff = Date.now() - days * 86400000
    return reportRows.filter(
      (r) => new Date(r.date).getTime() >= cutoff && (led === 'all' || r.led === led) && (event === 'all' || r.event === event)
    )
  }, [days, led, event])

  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const current = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const totalKwh = rows.reduce((s, r) => s + r.energy, 0)
  const change = (setter) => (e) => { setter(e.target.value); setPage(1) }

  const exportCsv = () => {
    const header = 'Date,LED,Event,Mode,Energy (kWh),Status'
    const lines = rows.map((r) => [new Date(r.date).toLocaleString(), r.led, r.event, r.mode, r.energy, r.status].join(','))
    const blob = new Blob([[header, ...lines].join('\n')], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'streetlight-report.csv'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <div className="stack">
      <section className="card filters">
        <label className="field">
          <span>Period</span>
          <select value={days} onChange={(e) => { setDays(+e.target.value); setPage(1) }}>
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
          </select>
        </label>
        <label className="field">
          <span>Lamp</span>
          <select value={led} onChange={change(setLed)}>
            <option value="all">All lamps</option>
            {Array.from({ length: 8 }, (_, i) => <option key={i}>{`LED ${i + 1}`}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Event</span>
          <select value={event} onChange={change(setEvent)}>
            <option value="all">All events</option>
            <option>Turned ON</option>
            <option>Turned OFF</option>
            <option>Brightness changed</option>
            <option>Fault detected</option>
          </select>
        </label>
        <button className="btn btn-primary" onClick={exportCsv} disabled={!rows.length}><Download size={16} /> Export CSV</button>
      </section>

      <section className="card">
        <div className="card-head">
          <h3>{rows.length} records</h3>
          <span className="pill pill-muted">{totalKwh.toFixed(2)} kWh in total</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Date</th><th>Lamp</th><th>Event</th><th>Mode</th><th>Energy</th><th>Status</th></tr>
            </thead>
            <tbody>
              {current.map((r) => (
                <tr key={r.id}>
                  <td>{fmt(r.date)}</td>
                  <td><strong>{r.led}</strong></td>
                  <td>{r.event}</td>
                  <td>{r.mode}</td>
                  <td>{r.energy} kWh</td>
                  <td><span className={`badge ${r.status === 'OK' ? 'badge-ok' : 'badge-bad'}`}>{r.status}</span></td>
                </tr>
              ))}
              {!current.length && (
                <tr><td colSpan="6" className="empty">No records match these filters. Try a longer period or choose All lamps.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="pager">
          <button className="icon-btn" disabled={page === 1} onClick={() => setPage(page - 1)} aria-label="Previous page"><ChevronLeft size={18} /></button>
          <span>Page {page} of {pages}</span>
          <button className="icon-btn" disabled={page === pages} onClick={() => setPage(page + 1)} aria-label="Next page"><ChevronRight size={18} /></button>
        </div>
      </section>
    </div>
  )
}
