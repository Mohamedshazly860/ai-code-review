import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import {
  Terminal, ArrowLeft, Send, Loader2, CheckCircle,
  XCircle, AlertTriangle, Lightbulb, Code2, Clock,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { reviewsApi } from '../api/reviews'
import type { Review as ReviewType, Language, Issue } from '../types'

const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash' },
  { value: 'other', label: 'Other' },
]

const MONACO_MAP: Record<string, string> = {
  python: 'python', javascript: 'javascript', typescript: 'typescript',
  java: 'java', cpp: 'cpp', c: 'c', go: 'go', rust: 'rust',
  php: 'php', ruby: 'ruby', swift: 'swift', kotlin: 'kotlin',
  sql: 'sql', bash: 'shell', other: 'plaintext',
}

function SeverityBadge({ severity }: { severity: Issue['severity'] }) {
  if (severity === 'high') return (
    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#F44747]/15 border border-[#F44747]/30 text-[#F44747] whitespace-nowrap">
      HIGH
    </span>
  )
  if (severity === 'medium') return (
    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#D7BA7D]/15 border border-[#D7BA7D]/30 text-[#D7BA7D] whitespace-nowrap">
      MED
    </span>
  )
  return (
    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#569CD6]/15 border border-[#569CD6]/30 text-[#569CD6] whitespace-nowrap">
      LOW
    </span>
  )
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? '#6A9955' : score >= 50 ? '#D7BA7D' : '#F44747'
  const pct = score / 100
  const r = 36
  const circ = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="#3C3C3C" strokeWidth="6" />
        <circle
          cx="48" cy="48" r={r} fill="none"
          stroke={color} strokeWidth="6"
          strokeDasharray={`${circ * pct} ${circ * (1 - pct)}`}
          strokeLinecap="round"
          transform="rotate(-90 48 48)"
        />
        <text x="48" y="48" textAnchor="middle" dominantBaseline="middle"
          fill={color} fontSize="18" fontWeight="800" fontFamily="monospace">{score}</text>
        <text x="48" y="64" textAnchor="middle" dominantBaseline="middle"
          fill="#6A6A6A" fontSize="9" fontFamily="monospace">/100</text>
      </svg>
      <span className="text-xs text-[#6A6A6A] font-mono">Quality Score</span>
    </div>
  )
}

export default function Review() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = !id || id === 'new'
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [review, setReview] = useState<ReviewType | null>(null)
  const [loadingReview, setLoadingReview] = useState(!isNew)

  const [language, setLanguage] = useState<Language>('python')
  const [code, setCode] = useState('')
  const [question, setQuestion] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [pendingId, setPendingId] = useState<number | null>(null)

  // Load existing review
  useEffect(() => {
  // Guard: don't fetch if id is 'new' or not a valid number
  if (!id || id === 'new' || isNaN(Number(id))) return

  setLoadingReview(true)
  reviewsApi.detail(Number(id))
    .then(setReview)
    .catch(() => toast.error('Review not found'))
    .finally(() => setLoadingReview(false))
}, [id])

  // Poll pending/processing reviews
  useEffect(() => {
  const targetId = pendingId ?? (id && id !== 'new' && !isNaN(Number(id)) ? Number(id) : null)

  if (!targetId) return
  if (!pendingId && review?.status !== 'pending' && review?.status !== 'processing') return

  pollRef.current = setInterval(async () => {
    try {
      const status = await reviewsApi.status(targetId)
      if (status.status === 'completed' || status.status === 'failed') {
        clearInterval(pollRef.current!)
        const full = await reviewsApi.detail(targetId)
        setReview(full)
        setPendingId(null)
        if (status.status === 'completed') toast.success('Review completed!')
        else toast.error('Review failed. Please try again.')
      }
    } catch {
      clearInterval(pollRef.current!)
    }
  }, 3000)

  return () => { if (pollRef.current) clearInterval(pollRef.current) }
}, [pendingId, review?.status, id])
  const handleSubmit = async () => {
    if (!code.trim()) { toast.error('Code snippet cannot be empty'); return }
    if (code.trim().length < 10) { toast.error('Code is too short to review'); return }
    setSubmitting(true)
    try {
      const result = await reviewsApi.create({ language, code_snippet: code, question })
      setPendingId(result.id)
      setReview(result)
      setSubmitted(true)
      navigate(`/reviews/${result.id}`, { replace: true })
    } catch {
      toast.error('Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Loading ──
  if (loadingReview) return (
    <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center gap-3">
      <Loader2 size={20} className="animate-spin text-[#569CD6]" />
      <span className="text-sm text-[#6A6A6A] font-mono">Loading review...</span>
    </div>
  )

  const isPending = review?.status === 'pending' || review?.status === 'processing'
  const isCompleted = review?.status === 'completed'
  const isFailed = review?.status === 'failed'

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-[#D4D4D4] flex flex-col">

      {/* Navbar */}
      <nav className="bg-[#252526] border-b border-[#3C3C3C] px-12 h-14 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center gap-1.5 text-sm text-[#A6A6A6] hover:text-[#D4D4D4] transition-colors no-underline">
            <ArrowLeft size={15} /> Dashboard
          </Link>
          <div className="w-px h-4 bg-[#3C3C3C]" />
          <div className="flex items-center gap-2.5 font-mono font-bold text-lg">
            <Terminal size={18} className="text-[#569CD6]" />
            Dev<span className="text-[#569CD6]">Insight</span>
          </div>
        </div>
        {review && (
          <div className="flex items-center gap-2 text-xs font-mono text-[#6A6A6A]">
            Review <span className="text-[#569CD6]">#{review.id}</span>
          </div>
        )}
      </nav>

      {/* ── New Review Form ── */}
      {(isNew && !submitted) && (
        <div className="flex flex-1 overflow-hidden">

          {/* Left — Editor */}
          <div className="flex flex-col flex-1 border-r border-[#3C3C3C] max-w-[1700px]" >

            {/* Editor Toolbar */}
            <div className="flex items-center gap-3 px-6 py-3 bg-[#252526] border-b border-[#3C3C3C] " style={{ padding: '8px' }}>
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#F44747]" />
                <span className="w-3 h-3 rounded-full bg-[#D7BA7D]" />
                <span className="w-3 h-3 rounded-full bg-[#6A9955]" />
              </div>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value as Language)}
                className="bg-[#2D2D2D] border border-[#3C3C3C] rounded px-3 py-1 text-xs text-[#D4D4D4] font-mono outline-none focus:border-[#569CD6] cursor-pointer"
              >
                {LANGUAGES.map(l => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
              <span className="text-xs text-[#6A6A6A] font-mono ml-auto">
                {code.split('\n').length} lines · {code.length} chars
              </span>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1">
              <Editor
                height="100%"
                language={MONACO_MAP[language] ?? 'plaintext'}
                value={code}
                onChange={v => setCode(v ?? '')}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  fontFamily: "'Cascadia Code', 'Fira Code', monospace",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  lineNumbers: 'on',
                  renderLineHighlight: 'line',
                  padding: { top: 16, bottom: 16 },
                  wordWrap: 'on',
                  tabSize: 2,
                  smoothScrolling: true,
                }}
              />
            </div>
          </div>

          {/* Right — Context Panel */}
          <div className="shrink-0 flex flex-col bg-[#252526]">
            <div className="px-6 py-4 border-b border-[#3C3C3C]" style={{ padding: '8px' }}>
              <h2 className="text-md font-bold text-[#D4D4D4] mb-0.5">Submit for Review</h2>
              <p className="text-xs text-[#6A6A6A] font-mono">// paste your code and describe the context</p>
            </div>

            <div className="flex flex-col gap-5 px-6 py-6 flex-1" style={{ padding: '8px' }}>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#A6A6A6] uppercase tracking-wider">Language</label>
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value as Language)}
                  className="w-full bg-[#2D2D2D] border border-[#3C3C3C] rounded-md px-3 py-2.5 text-sm text-[#D4D4D4] font-mono outline-none focus:border-[#569CD6] transition-colors cursor-pointer h-8"
                >
                  {LANGUAGES.map(l => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-sm font-semibold text-[#A6A6A6] uppercase tracking-wider">
                  Question <span className="text-[#6A6A6A] normal-case tracking-normal">(optional)</span>
                </label>
                <textarea
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  placeholder="e.g. Is this function safe to use in production? Are there any edge cases I'm missing?"
                  rows={5}
                  className="w-full bg-[#2D2D2D] border border-[#3C3C3C] rounded-md px-3 py-2.5 text-sm text-[#D4D4D4] font-sans outline-none focus:border-[#569CD6] transition-colors resize-none placeholder:text-[#454545] leading-relaxed"
                  style={{ padding: '3px' }}
                />
                <p className="text-sm text-[#6A6A6A]">
                  Leave empty to use the default prompt: <span className="italic text-[#454545]">"Review this code"</span>
                </p>
              </div>

              {/* Checklist */}
              <div className="bg-[#2D2D2D] border border-[#3C3C3C] rounded-lg px-4 py-3 flex flex-col gap-2">
                <p className="text-md font-semibold text-[#6A6A6A] uppercase tracking-wider mb-1">What you'll get</p>
                {[
                  { color: 'text-[#F44747]', label: 'Issues by severity (high / medium / low)' },
                  { color: 'text-[#6A9955]', label: 'Actionable improvement suggestions' },
                  { color: 'text-[#569CD6]', label: 'Quality score from 0 to 100' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2">
                    <CheckCircle size={12} className={item.color} />
                    <span className="text-sm text-[#A6A6A6]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-5 border-t border-[#3C3C3C]" style={{ paddingBottom: '25px' }}>
              <button
                onClick={handleSubmit}
                disabled={submitting || !code.trim()}
                className="w-full py-3 rounded-lg bg-[#569CD6] text-[#1E1E1E] font-bold text-md flex items-center justify-center gap-2 hover:bg-[#4A90D9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-none"
              >
                {submitting ? (
                  <><Loader2 size={16} className="animate-spin" /> Submitting...</>
                ) : (
                  <><Send size={15} /> Submit for Review</>
                )}
              </button>
              <p className="text-center text-xs text-[#6A6A6A] mt-2">
                Processed asynchronously in the background
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Review Result ── */}
      {review && (
        <div className="flex flex-1 overflow-hidden " >

          {/* Left — Code */}
          <div className="flex flex-col flex-1 border-r border-[#3C3C3C]" >
            <div className="flex items-center gap-3 px-6 py-3 bg-[#252526] border-b border-[#3C3C3C]" style={{ padding: '8px' }}>
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#F44747]" />
                <span className="w-3 h-3 rounded-full bg-[#D7BA7D]" />
                <span className="w-3 h-3 rounded-full bg-[#6A9955]" />
              </div>
              <span className="text-xs font-mono text-[#D4D4D4] bg-[#1E1E1E] border border-[#3C3C3C] border-b-0 px-3 py-1 rounded-t">
                {review.language_display.toLowerCase()}.{review.language === 'python' ? 'py' : review.language === 'javascript' ? 'js' : review.language === 'typescript' ? 'ts' : review.language}
              </span>
            </div>
            <div className="flex-1">
              <Editor
                height="100%"
                language={MONACO_MAP[review.language] ?? 'plaintext'}
                value={review.code_snippet}
                theme="vs-dark"
                options={{
                  readOnly: true,
                  fontSize: 14,
                  fontFamily: "'Cascadia Code', 'Fira Code', monospace",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  lineNumbers: 'on',
                  padding: { top: 16, bottom: 16 },
                  wordWrap: 'on',
                }}
              />
            </div>
          </div>

          {/* Right — Results Panel */}
          <div className="w-[420px] shrink-0 flex flex-col bg-[#252526] overflow-y-auto" style={{paddingRight:'5px', paddingLeft:'5px'}}>

            {/* Pending / Processing */}
            {isPending && (
              <div className="flex flex-col items-center justify-center flex-1 gap-7 px-8 py-16">
                <div className="w-14 h-14 rounded-full border-2 border-[#569CD6] border-t-transparent animate-spin" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-[#D4D4D4] mb-1">
                    {review.status === 'processing' ? 'AI is analyzing your code...' : 'Queued for review...'}
                  </p>
                  <p className="text-xs text-[#6A6A6A]">This usually takes under 2 seconds</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#6A6A6A]">
                  <Clock size={11} /> Polling every 3 seconds
                </div>
              </div>
            )}

            {/* Failed */}
            {isFailed && (
              <div className="flex flex-col items-center justify-center flex-1 gap-4 px-8 py-16">
                <div className="w-12 h-12 rounded-full bg-[#F44747]/10 border border-[#F44747]/30 flex items-center justify-center">
                  <XCircle size={22} className="text-[#F44747]" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-[#D4D4D4] mb-1">Review Failed</p>
                  <p className="text-xs text-[#6A6A6A]">The AI service encountered an error. Please try again.</p>
                </div>
                <Link to="/reviews/new" className="text-xs text-[#569CD6] no-underline hover:text-[#4A90D9] transition-colors">
                  Submit a new review →
                </Link>
              </div>
            )}

            {/* Completed */}
            {isCompleted && (
              <>
                {/* Score + Summary */}
                <div className="px-6 py-6 border-b border-[#3C3C3C] flex items-start " style={{ padding: '8px' }}>
                  <div className="flex items-center gap-5">
                    {review.quality_score !== null && <ScoreRing score={review.quality_score} />}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle size={14} className="text-[#6A9955]" />
                        <span className="text-lg font-mono text-[#6A9955]">Review complete</span>
                      </div>
                      {review.summary && (
                        <p className="text-md text-[#A6A6A6] leading-relaxed">{review.summary}</p>
                      )}
                      {review.question && (
                        <div className="mt-3 px-3 py-2 rounded bg-[#2D2D2D] border border-[#3C3C3C]">
                          <p className="text-[10px] font-mono text-[#6A6A6A] mb-0.5">Your question</p>
                          <p className="text-xs text-[#A6A6A6] italic">{review.question}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Issues */}
                <div className="px-6 py-5 border-b border-[#3C3C3C]">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle size={14} className="text-[#F44747]" />
                    <h3 className="text-md font-bold text-[#D4D4D4]" style={{padding:'3px'}}>Issues</h3>
                    <span className="ml-auto text-md font-mono text-[#6A6A6A]">{review.issues.length} found</span>
                  </div>

                  {review.issues.length === 0 ? (
                    <div className="flex items-center gap-2 px-3 py-3 rounded-lg bg-[#6A9955]/10 border border-[#6A9955]/20">
                      <CheckCircle size={13} className="text-[#6A9955]" />
                      <span className="text-xs text-[#6A9955]">No issues found — great code!</span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3" style={{marginBottom:'7px'}}>
                      {review.issues.map((issue, i) => (
                        <div key={i} className="bg-[#2D2D2D] border border-[#3C3C3C] rounded-lg" style={{padding:'3px'}}>
                          <div className="flex items-start gap-2 mb-1.5 w-full" style={{padding:'3px'}}>
                            <SeverityBadge severity={issue.severity} />
                            {issue.line && (
                              <span className="text-sm font-mono text-[#6A6A6A] mt-0.5">line {issue.line}</span>
                            )}
                          </div>
                          <p className="text-md font-semibold text-[#D4D4D4] mb-1">{issue.title}</p>
                          <p className="text-sm text-[#A6A6A6] leading-relaxed">{issue.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Suggestions */}
                <div className="px-6 py-5">
                  <div className="flex items-center gap-2 mb-4" style={{padding:'2px'}}>
                    <Lightbulb size={14} className="text-[#D7BA7D]" />
                    <h3 className="text-md font-bold text-[#D4D4D4]">Suggestions</h3>
                    <span className="ml-auto text-sm font-mono text-[#6A6A6A]">{review.suggestions.length} total</span>
                  </div>

                  {review.suggestions.length === 0 ? (
                    <p className="text-md text-[#6A6A6A]">No additional suggestions.</p>
                  ) : (
                    <div className="flex flex-col gap-3" style={{marginBottom:'8px'}}>
                      {review.suggestions.map((s, i) => (
                        <div key={i} className="bg-[#2D2D2D] border border-[#3C3C3C] rounded-lg" style={{padding:'5px'}}>
                          <p className="text-md font-semibold text-[#D4D4D4] mb-1">{s.title}</p>
                          <p className="text-sm text-[#A6A6A6] leading-relaxed mb-2">{s.description}</p>
                          {s.example && (
                            <pre className="text-md font-mono text-[#CE9178] bg-[#1E1E1E] border border-[#3C3C3C] rounded px-3 py-2 overflow-x-auto whitespace-pre-wrap">
                              {s.example}
                            </pre>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 pt-5 border-t border-[#3C3C3C]" style={{paddingBottom:'18px'}}>
                    <Link
                      to="/reviews/new"
                      className="w-full py-2.5 rounded-lg bg-[#2D2D2D] border border-[#3C3C3C] text-[#D4D4D4] text-lg font-semibold no-underline flex items-center justify-center gap-2 hover:border-[#569CD6] hover:text-[#569CD6] transition-colors"
                    >
                      <Code2 size={14} /> Review another snippet
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}