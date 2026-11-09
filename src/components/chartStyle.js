// Shared colours and styles for all charts
export const COLORS = {
  amber: '#ffb547',
  cyan: '#38d0e8',
  green: '#3ddc97',
  red: '#ff6b6b',
  violet: '#9b8cff',
  grid: '#223256',
  text: '#8da0c4',
}

export const tooltipStyle = {
  contentStyle: { background: '#0f1b35', border: '1px solid #2a3d66', borderRadius: 10, color: '#e8eefc', fontSize: 13 },
  labelStyle: { color: '#8da0c4' },
  cursor: { fill: 'rgba(56,208,232,0.08)' },
}

export const axisProps = {
  stroke: COLORS.text,
  tick: { fill: COLORS.text, fontSize: 12 },
  tickLine: false,
  axisLine: false,
}
