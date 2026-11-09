import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Mail, Lock, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { user, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/" replace />

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await login(email.trim(), password)
    setLoading(false)
    if (!res.ok) setError(res.message)
  }

  return (
    <div className="login">
      <div className="login-art">
        <div className="lamp-post" aria-hidden="true">
          <span className="lamp-head" />
          <span className="lamp-pole" />
        </div>
        <h2>Every lamp on the campus, in one place.</h2>
        <p>Monitor eight streetlights, switch between AUTO and MANUAL, and track the energy you save.</p>
      </div>

      <form className="login-card" onSubmit={submit}>
        <h1>Sign in</h1>
        <p className="muted">Use your administrator account.</p>

        <label className="field">
          <span>Email</span>
          <div className="input-wrap">
            <Mail size={18} />
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@streetlight.com" autoComplete="username" />
          </div>
        </label>

        <label className="field">
          <span>Password</span>
          <div className="input-wrap">
            <Lock size={18} />
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" />
          </div>
        </label>

        {error && <div className="form-error" role="alert">{error}</div>}

        <button className="btn btn-primary" disabled={loading}>
          <Zap size={16} /> {loading ? 'Signing in...' : 'Sign in'}
        </button>

        <p className="demo-hint">Demo account: admin@streetlight.com / admin123</p>
      </form>
    </div>
  )
}
