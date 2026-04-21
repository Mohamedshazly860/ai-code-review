import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Plus, Code2, Clock, CheckCircle,
  XCircle, Loader2, ChevronRight,
  User, Mail, Edit3, Camera,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { reviewsApi } from '../api/reviews'
import type { ReviewListItem } from '../types'
import Navbar from '../components/ui/Navbar'

const LANGUAGE_LABELS: Record<string, string> = {
  python: 'Python', javascript: 'JavaScript', typescript: 'TypeScript',
  java: 'Java', cpp: 'C++', c: 'C', go: 'Go', rust: 'Rust',
  php: 'PHP', ruby: 'Ruby', swift: 'Swift', kotlin: 'Kotlin',
  sql: 'SQL', bash: 'Bash', other: 'Other',
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'completed') return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#6A9955]/10 border border-[#6A9955]/30 text-[#6A9955]">
      <CheckCircle size={11} /> Completed
    </span>
  )
  if (status === 'failed') return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#F44747]/10 border border-[#F44747]/30 text-[#F44747]">
      <XCircle size={11} /> Failed
    </span>
  )
  if (status === 'processing') return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#569CD6]/10 border border-[#569CD6]/30 text-[#569CD6]">
      <Loader2 size={11} className="animate-spin" /> Processing
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#D7BA7D]/10 border border-[#D7BA7D]/30 text-[#D7BA7D]">
      <Clock size={11} /> Pending
    </span>
  )
}

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return <span className="text-xs text-[#6A6A6A] font-mono">—</span>
  const color = score >= 80 ? 'text-[#6A9955]' : score >= 50 ? 'text-[#D7BA7D]' : 'text-[#F44747]'
  return (
    <span className={`text-sm font-bold font-mono ${color}`}>
      {score}<span className="text-[#6A6A6A] text-xs font-normal">/100</span>
    </span>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [reviews, setReviews] = useState<ReviewListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    reviewsApi.list()
      .then(setReviews)
      .catch(() => setError('Failed to load reviews.'))
      .finally(() => setLoading(false))
  }, [])

  const completed = reviews.filter(r => r.status === 'completed').length
  const avgScore = reviews.filter(r => r.quality_score !== null).length > 0
    ? Math.round(
        reviews
          .filter(r => r.quality_score !== null)
          .reduce((a, r) => a + (r.quality_score ?? 0), 0) /
        reviews.filter(r => r.quality_score !== null).length
      )
    : null

  const initial = user?.username?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-[#D4D4D4] flex flex-col gap-10">

      {/* ── Navbar ── */}
      <Navbar />

      <div className=" mx-auto px-12 py-10 flex flex-col gap-10 w-full max-w-[1920px]" style={{ paddingLeft:'14px', paddingRight:'14px' }}>

        {/* ── Profile Section ── */}
        <div className="bg-[#252526] border border-[#3C3C3C] rounded-xl overflow-hidden ">

          {/* Section Header with action buttons */}
          <div className="flex items-center justify-between px-8 py-4 border-b border-[#3C3C3C] bg-[#2D2D2D]" style={{padding:'10px'}}>
            <div className="flex items-center gap-2">
              <User size={14} className="text-[#569CD6]" />
              <span className="text-sm font-mono text-[#6A6A6A] uppercase tracking-wider">Profile</span>
            </div>
            <div className="flex items-center ">
              {/* Update Info Button — form will be added later */}
              <button className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-[#2D2D2D] border border-[#3C3C3C] text-sm text-[#A6A6A6] font-semibold hover:border-[#569CD6] hover:text-[#569CD6] transition-colors cursor-pointer h-8 w-35 justify-center">
                <Edit3 size={13} /> Update Info
              </button>
            </div>
          </div>

          {/* 2-Column Profile Body */}
          <div className="grid grid-cols-2 divide-x divide-[#3C3C3C]">

            {/* Left — Avatar + Name */}
            <div className="flex flex-col items-center justify-center gap-6 " >

              {/* Avatar */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-[#2D2D2D] border-2 border-[#3C3C3C] flex items-center justify-center">
                  <span className="text-4xl font-extrabold font-mono text-[#569CD6]">
                    {initial}
                  </span>
                </div>
                {/* Upload overlay — wired up when form is ready */}
                <div className="absolute inset-0 rounded-full bg-[#1E1E1E]/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera size={20} className="text-[#D4D4D4]" />
                </div>
              </div>

              {/* Name + Username */}
              <div className="text-center gap-1 flex flex-col">
                <p className="text-2xl font-bold text-[#D4D4D4]">
                  {user?.username}
                </p>
                <p className="text-md text-[#6A6A6A] font-mono">@{user?.username}</p>
              </div>

              {/* Stats row under avatar */}
              <div className="flex gap-7 pt-2 border-t border-[#3C3C3C] w-full justify-center items-end h-16" style={{marginTop:'25px', paddingTop:'70px'}}>
                <div className="text-center">
                  <p className="text-2xl font-bold font-mono text-[#D4D4D4]">{reviews.length}</p>
                  <p className="text-md text-[#6A6A6A]">Reviews</p>
                </div>
                <div className="w-px h-8 bg-[#3C3C3C]" />
                <div className="text-center">
                  <p className="text-2xl font-bold font-mono text-[#6A9955]">{completed}</p>
                  <p className="text-md text-[#6A6A6A]">Completed</p>
                </div>
                <div className="w-px h-8 bg-[#3C3C3C]" />
                <div className="text-center">
                  <p className="text-lg font-bold font-mono text-[#D7BA7D]">
                    {avgScore !== null ? avgScore : '—'}
                  </p>
                  <p className="text-md text-[#6A6A6A]">Avg Score</p>
                </div>
              </div>
            </div>

            {/* Right — Personal Info */}
            <div className="flex flex-col justify-center gap-5 px-10 py-10" style={{padding:'7px'}}>
              <p className="text-md font-mono text-[#6A6A6A] uppercase tracking-wider mb-1">
                Personal Information
              </p>

              {/* Info rows */}
              <div className="flex flex-col gap-4">

                <div className="flex flex-col gap-1">
                  <span className="text-sm text-[#6A6A6A] font-mono uppercase tracking-wider">Username</span>
                  <div className="flex items-center gap-2 bg-[#2D2D2D] border border-[#3C3C3C] rounded-md px-4 py-2.5 h-10">
                    <User size={13} className="text-[#454545] shrink-0" />
                    <span className="text-md text-[#D4D4D4] font-mono">{user?.username ?? '—'}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-sm text-[#6A6A6A] font-mono uppercase tracking-wider">Email</span>
                  <div className="flex items-center gap-2 bg-[#2D2D2D] border border-[#3C3C3C] rounded-md px-4 py-2.5 h-10">
                    <Mail size={13} className="text-[#454545] shrink-0" />
                    <span className="text-md text-[#D4D4D4] font-mono">{user?.email ?? '—'}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-sm text-[#6A6A6A] font-mono uppercase tracking-wider">Member Since</span>
                  <div className="flex items-center gap-2 bg-[#2D2D2D] border border-[#3C3C3C] rounded-md px-4 py-2.5 h-10">
                    <Clock size={13} className="text-[#454545] shrink-0" />
                    <span className="text-md text-[#D4D4D4] font-mono">
                      {user?.created_at
                        ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                        : '—'}
                    </span>
                  </div>
                </div>

                {/* Placeholder fields — filled when Update Info form is ready */}
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-[#6A6A6A] font-mono uppercase tracking-wider">Phone</span>
                  <div className="flex items-center gap-2 bg-[#2D2D2D] border border-[#3C3C3C] rounded-md px-4 py-2.5 h-10">
                    <span className="text-md text-[#454545] font-mono italic">Not provided</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-sm text-[#6A6A6A] font-mono uppercase tracking-wider">Bio</span>
                  <div className="flex items-center gap-2 bg-[#2D2D2D] border border-[#3C3C3C] rounded-md px-4 py-2.5 h-10">
                    <span className="text-md text-[#454545] font-mono italic">Not provided</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* ── Review History Section ── */}
        <div className="flex flex-col gap-4">

          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#D4D4D4]">Review History</h2>
              <p className="text-md text-[#6A6A6A] font-mono mt-0.5">// {reviews.length} total submissions</p>
            </div>
            <Link
              to="/reviews/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#569CD6] text-[#1E1E1E] font-bold text-md no-underline hover:bg-[#4A90D9] transition-colors w-40 justify-center"
            >
              <Plus size={14} /> New Review
            </Link>
          </div>

          {/* Table */}
          <div className="bg-[#252526] border border-[#3C3C3C] rounded-xl overflow-hidden w-full">

            {/* Table Header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_60px] gap-4 px-6 py-3 border-b border-[#3C3C3C] bg-[#2D2D2D]" style={{padding:'7px'}}>
              <span className="text-md font-mono text-[#6A6A6A] uppercase tracking-wider">Language</span>
              <span className="text-md font-mono text-[#6A6A6A] uppercase tracking-wider">Status</span>
              <span className="text-md font-mono text-[#6A6A6A] uppercase tracking-wider">Score</span>
              <span className="text-md font-mono text-[#6A6A6A] uppercase tracking-wider">Submitted</span>
              <span />
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center py-20 gap-3">
                <Loader2 size={18} className="animate-spin text-[#569CD6]" />
                <span className="text-sm text-[#6A6A6A] font-mono">Loading reviews...</span>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="flex items-center justify-center py-20">
                <span className="text-sm text-[#F44747]">{error}</span>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && reviews.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 gap-4 " style={{paddingTop:'10px', paddingBottom:'10px'}}>
                <div className="w-12 h-12 rounded-xl bg-[#2D2D2D] border border-[#3C3C3C] flex items-center justify-center">
                  <Code2 size={22} className="text-[#454545]" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-[#A6A6A6] mb-1">No reviews yet</p>
                  <p className="text-lg text-[#6A6A6A]">Submit your first code snippet to get started</p>
                </div>
                <Link
                  to="/reviews/new"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#569CD6] text-[#1E1E1E] font-bold text-sm no-underline hover:bg-[#4A90D9] transition-colors w-40 justify-center"
                >
                  <Plus size={14} /> New Review
                </Link>
              </div>
            )}

            {/* Rows */}
            {!loading && !error && reviews.map((review, i) => (
              <div
                key={review.id}
                onClick={() => navigate(`/reviews/${review.id}`)}
                className={`grid grid-cols-[2fr_1fr_1fr_1fr_60px] gap-4 px-6 py-4 items-center hover:bg-[#2D2D2D] transition-colors cursor-pointer ${i !== reviews.length - 1 ? 'border-b border-[#3C3C3C]' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#2D2D2D] border border-[#3C3C3C] flex items-center justify-center shrink-0">
                    <Code2 size={14} className="text-[#569CD6]" />
                  </div>
                  <div>
                    <span className="px-2 py-0.5 rounded text-xs font-mono bg-[#2D2D2D] border border-[#3C3C3C] text-[#A6A6A6]">
                      {LANGUAGE_LABELS[review.language] ?? review.language}
                    </span>
                    <p className="text-[11px] text-[#6A6A6A] font-mono mt-0.5">#{review.id}</p>
                  </div>
                </div>

                <StatusBadge status={review.status} />
                <ScoreBadge score={review.quality_score} />

                <span className="text-xs text-[#6A6A6A] font-mono">
                  {new Date(review.created_at).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                  })}
                </span>

                <div className="flex justify-end">
                  <ChevronRight size={16} className="text-[#454545]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}