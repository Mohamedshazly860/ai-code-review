import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Terminal, LogIn } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { AxiosError } from 'axios'

interface FormState {
  username: string
  password: string
}

interface FormErrors {
  username?: string
  password?: string
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>({ username: '', password: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)

  const validate = (): FormErrors => {
    const e: FormErrors = {}
    if (!form.username.trim()) e.username = 'Username is required'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await login(form.username, form.password)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      const axiosErr = err as AxiosError<{ detail?: string }>
      toast.error(axiosErr.response?.data?.detail ?? 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#1E1E1E',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Terminal size={24} color="#569CD6" />
            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1.25rem' }}>
              ai<span style={{ color: '#569CD6' }}>.</span>review
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#6A6A6A', fontFamily: 'monospace' }}>
            // sign in to your account
          </p>
        </div>

        <div style={{ background: '#252526', border: '1px solid #3C3C3C', borderRadius: '10px', padding: '2rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input label="Username" type="text" placeholder="your_username"
              value={form.username} error={errors.username} autoComplete="username"
              onChange={e => setForm(p => ({ ...p, username: e.target.value }))} />
            <Input label="Password" type="password" placeholder="••••••••"
              value={form.password} error={errors.password} autoComplete="current-password"
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
            <Button type="submit" loading={loading} style={{ width: '100%', marginTop: '4px' }}>
              <LogIn size={16} /> Sign In
            </Button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: '#6A6A6A' }}>
          No account?{' '}
          <Link to="/register" style={{ color: '#569CD6', textDecoration: 'none' }}>Create one</Link>
        </p>
      </div>
    </div>
  )
}