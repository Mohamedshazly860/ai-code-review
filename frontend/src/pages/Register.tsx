// frontend/src/pages/Register.tsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Terminal, UserPlus, Code2, Zap, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { AxiosError } from 'axios'
import Navbar from '../components/ui/Navbar'

interface FormState {
  username: string
  email: string
  password: string
  confirm: string
}

interface FormErrors {
  username?: string
  email?: string
  password?: string
  confirm?: string
}

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>({ username: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)

  const validate = (): FormErrors => {
    const e: FormErrors = {}
    if (!form.username.trim()) e.username = 'Username is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'Minimum 8 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await register(form.username, form.email, form.password)
      toast.success('Account created!')
      navigate('/dashboard')
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<Record<string, string | string[]>>
      const data = axiosErr.response?.data
      if (data) {
        const fieldErrors: FormErrors = {}
        Object.entries(data).forEach(([key, val]) => {
          (fieldErrors as Record<string, string>)[key] = Array.isArray(val) ? val[0] : val
        })
        setErrors(fieldErrors)
      } else {
        toast.error('Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>    
    <Navbar />
    <div className="min-h-screen bg-[#1E1E1E] grid grid-cols-2">

      {/* ── Left Panel ── */}
      <div className="flex flex-col justify-center items-center px-16 py-14 bg-[#252526] border-r border-[#3C3C3C]">


        {/* Center Content */}
        <div>
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Terminal size={28} className="text-[#569CD6]" />
          <span className="font-mono font-bold text-2xl text-[#D4D4D4]">
            Dev<span className="text-[#569CD6]">Insight</span>
          </span>
        </div>

          <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-[#D4D4D4] mb-6">
            Start shipping<br />
            <span className="text-[#569CD6]">cleaner </span>
            code today
          </h1>

          <p className="text-base text-[#A6A6A6] leading-relaxed max-w-sm mb-12">
            Join DevInsight and get AI-powered code reviews in seconds.
            Catch bugs, improve quality, and level up your craft.
          </p>

          {/* Feature Bullets */}
          <div className="flex flex-col gap-4" style={{marginTop:'20px'}}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#569CD6]/10 flex items-center justify-center shrink-0">
                <Zap size={15} className="text-[#569CD6]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#D4D4D4]">Instant feedback</p>
                <p className="text-xs text-[#6A6A6A]">Results in under 2 seconds</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#F44747]/10 flex items-center justify-center shrink-0">
                <Shield size={15} className="text-[#F44747]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#D4D4D4]">Security analysis</p>
                <p className="text-xs text-[#6A6A6A]">Catches vulnerabilities early</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#6A9955]/10 flex items-center justify-center shrink-0">
                <Code2 size={15} className="text-[#6A9955]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#D4D4D4]">15+ languages</p>
                <p className="text-xs text-[#6A6A6A]">Python, Go, Rust, Java and more</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex flex-col items-center justify-center px-16 py-14 bg-[#1E1E1E] ">

        <div className="w-full max-w-md gap-3 flex flex-col">

          {/* Header */}
          <div className="mb-8 gap-1.5 flex flex-col">
            <h2 className="text-2xl font-bold text-[#D4D4D4] mb-1">Create your account</h2>
            <p className="text-sm text-[#6A6A6A] font-mono">// free forever · no credit card needed</p>
          </div>

          {/* Card */}
          <div className="bg-[#252526] border border-[#3C3C3C] rounded-xl p-8" style={{padding:'8px'}}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              {/* Username */}
              <div className="flex flex-col gap-1.5">
                <label className="text-md text-[#A6A6A6] font-medium">Username</label>
                <input
                  type="text"
                  placeholder="cool_dev_42"
                  value={form.username}
                  autoComplete="username"
                  onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                  className="w-full bg-[#2D2D2D] border border-[#3C3C3C] rounded-md px-4 py-3 text-[#D4D4D4] text-md outline-none focus:border-[#569CD6] transition-colors placeholder:text-[#6A6A6A]"
                  style={{padding:'5px'}}
                />
                {errors.username && (
                  <span className="text-xs text-[#F44747]">{errors.username}</span>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-md text-[#A6A6A6] font-medium">Email</label>
                <input
                  type="email"
                  placeholder="dev@example.com"
                  value={form.email}
                  autoComplete="email"
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full bg-[#2D2D2D] border border-[#3C3C3C] rounded-md px-4 py-3 text-[#D4D4D4] text-md outline-none focus:border-[#569CD6] transition-colors placeholder:text-[#6A6A6A]"
                  style={{padding:'5px'}}
                
                />
                {errors.email && (
                  <span className="text-xs text-[#F44747]">{errors.email}</span>
                )}
              </div>

              {/* Password + Confirm side by side */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-md text-[#A6A6A6] font-medium">Password</label>
                  <input
                    type="password"
                    placeholder="min. 8 chars"
                    value={form.password}
                    autoComplete="new-password"
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    className="w-full bg-[#2D2D2D] border border-[#3C3C3C] rounded-md px-4 py-3 text-[#D4D4D4] text-md outline-none focus:border-[#569CD6] transition-colors placeholder:text-[#6A6A6A]"
                    style={{padding:'5px'}}
                  
                  />
                  {errors.password && (
                    <span className="text-xs text-[#F44747]">{errors.password}</span>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-md text-[#A6A6A6] font-medium">Confirm</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={form.confirm}
                    autoComplete="new-password"
                    onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
                    className="w-full bg-[#2D2D2D] border border-[#3C3C3C] rounded-md px-4 py-3 text-[#D4D4D4] text-md outline-none focus:border-[#569CD6] transition-colors placeholder:text-[#6A6A6A]"
                    style={{padding:'5px'}}
                  />
                  {errors.confirm && (
                    <span className="text-xs text-[#F44747]">{errors.confirm}</span>
                  )}
                </div>
              </div>

              {/* Terms note */}
              <p className="text-xs text-[#6A6A6A] leading-relaxed">
                By creating an account you agree to our{' '}
                <span className="text-[#569CD6] cursor-pointer hover:text-[#4A90D9] transition-colors">Terms of Service</span>
                {' '}and{' '}
                <span className="text-[#569CD6] cursor-pointer hover:text-[#4A90D9] transition-colors">Privacy Policy</span>.
              </p>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-1 py-3 rounded-lg bg-[#569CD6] text-[#1E1E1E] font-bold text-md flex items-center justify-center gap-2 hover:bg-[#4A90D9] transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer border-none h-10"
              >
                {loading ? (
                  <span className="w-4 h-4 rounded-full border-2 border-[#1E1E1E] border-t-transparent animate-spin" />
                ) : (
                  <UserPlus size={16} />
                )}
                Create Account
              </button>
            </form>
          </div>

          {/* Footer link */}
          <p className="text-center mt-6 text-sm text-[#6A6A6A]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#569CD6] no-underline hover:text-[#4A90D9] transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
    </>

  )
}