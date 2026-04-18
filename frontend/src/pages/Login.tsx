import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Terminal, LogIn, Code2, Zap, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/ui/Navbar'
// import Button from '../components/ui/Button'
// import Input from '../components/ui/Input'

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
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } }
      toast.error(error.response?.data?.detail ?? 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
    <div className="min-h-screen bg-[#1E1E1E] grid grid-cols-2">
        

      {/* ── Left Panel ── */}
      <div className="flex flex-col justify-between px-16 py-14 bg-[#252526] border-r border-[#3C3C3C] items-center justify-center ">
        <div>
         <div className="flex items-center gap-3">
          <Terminal size={28} className="text-[#569CD6]" />
          <span className="font-mono font-bold text-2xl text-[#D4D4D4]">
            Dev<span className="text-[#569CD6]">Insight</span>
          </span>
        </div>
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-[#D4D4D4] mb-6">
            Code review,<br />
            <span className="text-[#569CD6]">supercharged </span>
            by AI
          </h1>

          <p className="text-base text-[#A6A6A6] leading-relaxed max-w-sm mb-12">
            Submit your code and get instant structured feedback —
            issues, suggestions, and a quality score in seconds.
          </p>

          {/* Feature Bullets */}
          <div className="flex flex-col gap-4">
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
      <div className="flex flex-col items-center justify-center px-16 py-14 bg-[#1E1E1E]">

        <div className="w-full max-w-md gap-3 flex flex-col">

          {/* Header */}
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-[#D4D4D4] mb-1">Welcome back</h2>
            <p className="text-md text-[#6A6A6A] font-mono">// sign in to your account</p>
          </div>

          {/* Card */}
          <div className="bg-[#252526] border border-[#3C3C3C] rounded-xl flex flex-col justify-center" style={{padding:'5px', height:'300px'}}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-12">

              <div className="flex flex-col gap-1.5">
                <label className="text-md text-[#A6A6A6] font-medium">Username</label>
                <input
                  type="text"
                  placeholder="your_username"
                  value={form.username}
                  autoComplete="username"
                  onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                  className="w-full bg-[#2D2D2D] border border-[#3C3C3C] rounded-md px-4 py-3 text-[#D4D4D4] text-md font-sans outline-none focus:border-[#569CD6] transition-colors placeholder:text-[#6A6A6A] h-10"
                  style={{padding:'5px'}}
                />
                {errors.username && (
                  <span className="text-xs text-[#F44747]">{errors.username}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-md text-[#A6A6A6] font-medium">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  autoComplete="current-password"
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="w-full bg-[#2D2D2D] border border-[#3C3C3C] rounded-md px-4 py-3 text-[#D4D4D4] text-sm font-sans outline-none focus:border-[#569CD6] transition-colors placeholder:text-[#6A6A6A] h-11"
                  style={{padding:'5px'}}
                />
                {errors.password && (
                  <span className="text-xs text-[#F44747]">{errors.password}</span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-lg bg-[#569CD6] text-[#1E1E1E] font-bold text-md flex items-center justify-center gap-2 hover:bg-[#4A90D9] transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer border-none h-10"
              >
                {loading ? (
                  <span className="w-4 h-4 rounded-full border-2 border-[#1E1E1E] border-t-transparent animate-spin " />
                ) : (
                  <LogIn size={16} />
                )}
                Sign In
              </button>
            </form>
          </div>

          {/* Footer link */}
          <p className="text-center mt-6 text-md text-[#6A6A6A]">
            No account?{' '}
            <Link to="/register" className="text-[#569CD6] no-underline hover:text-[#4A90D9] transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
    </>
  )
}