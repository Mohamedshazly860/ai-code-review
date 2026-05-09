// frontend/src/pages/Dashboard.tsx
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Plus, Code2, Clock, CheckCircle,
  XCircle, Loader2, ChevronRight,
  User, Mail, Edit3, Camera,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { reviewsApi } from '../api/reviews'
import { authApi } from '../api/auth'
import type { ReviewListItem, User as UserType } from '../types'
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
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [reviewsError, setReviewsError] = useState('')

  // Profile state — loaded separately from auth context
  const [profile, setProfile] = useState<UserType | null>(null)

  // Load reviews
  useEffect(() => {
    reviewsApi.list()
      .then(setReviews)
      .catch(() => setReviewsError('Failed to load reviews.'))
      .finally(() => setReviewsLoading(false))
  }, [])

  // Load full profile (includes first_name, last_name, phone, bio, avatar)
  useEffect(() => {
    authApi.profile()
      .then(setProfile)
      .catch(() => {})
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

  const fullName = profile?.first_name || profile?.last_name
    ? `${profile?.first_name ?? ''} ${profile?.last_name ?? ''}`.trim()
    : null

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-[#D4D4D4]">
      <Navbar />

      <div className="max-w-[1400px] mx-auto px-12 py-10 flex flex-col gap-8">

        {/* ── Profile Section ── */}
        <div className="bg-[#252526] border border-[#3C3C3C] rounded-xl overflow-hidden">

          {/* Section Header */}
          <div className="flex items-center justify-between px-8 py-4 border-b border-[#3C3C3C] bg-[#2D2D2D]">
            <div className="flex items-center gap-2">
              <User size={14} className="text-[#569CD6]" />
              <span className="text-xs font-mono text-[#6A6A6A] uppercase tracking-wider">Profile</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/profile/edit')}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-[#2D2D2D] border border-[#3C3C3C] text-xs text-[#A6A6A6] font-semibold hover:border-[#569CD6] hover:text-[#569CD6] transition-colors cursor-pointer"
              >
                <Edit3 size={13} /> Update Info
              </button>
              <Link
                to="/reviews/new"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-[#569CD6] text-[#1E1E1E] text-xs font-bold no-underline hover:bg-[#4A90D9] transition-colors"
              >
                <Plus size={13} /> New Review
              </Link>
            </div>
          </div>

          {/* 2-Column Profile Body */}
          <div className="grid grid-cols-2 divide-x divide-[#3C3C3C]">

            {/* Left — Avatar + Name */}
            <div className="flex flex-col items-center justify-center gap-5 px-10 py-10">

              {/* Avatar */}
              <div
                className="relative group cursor-pointer"
                onClick={() => navigate('/profile/edit')}
              >
                <div className="w-28 h-28 rounded-full bg-[#2D2D2D] border-2 border-[#3C3C3C] overflow-hidden flex items-center justify-center">
                  {profile?.avatar ? (
                    <img
                      src={profile.avatar}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-extrabold font-mono text-[#569CD6]">
                      {initial}
                    </span>
                  )}
                </div>
                <div className="absolute inset-0 rounded-full bg-[#1E1E1E]/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={20} className="text-[#D4D4D4]" />
                </div>
              </div>

              {/* Name */}
              <div className="text-center">
                <p className="text-xl font-bold text-[#D4D4D4] mb-1">
                  {fullName ?? user?.username}
                </p>
                <p className="text-sm text-[#6A6A6A] font-mono">@{user?.username}</p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 pt-2 border-t border-[#3C3C3C] w-full justify-center">
                <div className="text-center">
                  <p className="text-lg font-bold font-mono text-[#D4D4D4]">{reviews.length}</p>
                  <p className="text-[11px] text-[#6A6A6A]">Reviews</p>
                </div>
                <div className="w-px h-8 bg-[#3C3C3C]" />
                <div className="text-center">
                  <p className="text-lg font-bold font-mono text-[#6A9955]">{completed}</p>
                  <p className="text-[11px] text-[#6A6A6A]">Completed</p>
                </div>
                <div className="w-px h-8 bg-[#3C3C3C]" />
                <div className="text-center">
                  <p className="text-lg font-bold font-mono text-[#D7BA7D]">
                    {avgScore !== null ? avgScore : '—'}
                  </p>
                  <p className="text-[11px] text-[#6A6A6A]">Avg Score</p>
                </div>
              </div>
            </div>

            {/* Right — Personal Info */}
            <div className="flex flex-col justify-center gap-5 px-10 py-10">
              <p className="text-xs font-mono text-[#6A6A6A] uppercase tracking-wider mb-1">
                Personal Information
              </p>

              <div className="flex flex-col gap-4">

                {/* Username */}
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] text-[#6A6A6A] font-mono uppercase tracking-wider">Username</span>
                  <div className="flex items-center gap-2 bg-[#2D2D2D] border border-[#3C3C3C] rounded-md px-4 py-2.5">
                    <User size={13} className="text-[#454545] shrink-0" />
                    <span className="text-sm text-[#D4D4D4] font-mono">{user?.username ?? '—'}</span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] text-[#6A6A6A] font-mono uppercase tracking-wider">Email</span>
                  <div className="flex items-center gap-2 bg-[#2D2D2D] border border-[#3C3C3C] rounded-md px-4 py-2.5">
                    <Mail size={13} className="text-[#454545] shrink-0" />
                    <span className="text-sm text-[#D4D4D4] font-mono">{user?.email ?? '—'}</span>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] text-[#6A6A6A] font-mono uppercase tracking-wider">Phone</span>
                  <div className="flex items-center gap-2 bg-[#2D2D2D] border border-[#3C3C3C] rounded-md px-4 py-2.5">
                    <span className="text-sm font-mono">
                      {profile?.phone_number
                        ? <span className="text-[#D4D4D4]">{profile.phone_number}</span>
                        : <span className="text-[#454545] italic">Not provided</span>
                      }
                    </span>
                  </div>
                </div>

                {/* Bio */}
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] text-[#6A6A6A] font-mono uppercase tracking-wider">Bio</span>
                  <div className="flex items-center gap-2 bg-[#2D2D2D] border border-[#3C3C3C] rounded-md px-4 py-2.5 min-h-[40px]">
                    <span className="text-sm font-mono">
                      {profile?.bio
                        ? <span className="text-[#D4D4D4]">{profile.bio}</span>
                        : <span className="text-[#454545] italic">Not provided</span>
                      }
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* ── Review History Section ── */}
        <div className="flex flex-col gap-4">

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#D4D4D4]">Review History</h2>
              <p className="text-xs text-[#6A6A6A] font-mono mt-0.5">// {reviews.length} total submissions</p>
            </div>
            <Link
              to="/reviews/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#569CD6] text-[#1E1E1E] font-bold text-xs no-underline hover:bg-[#4A90D9] transition-colors"
            >
              <Plus size={14} /> New Review
            </Link>
          </div>

          <div className="bg-[#252526] border border-[#3C3C3C] rounded-xl overflow-hidden">

            {/* Table Header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_60px] gap-4 px-6 py-3 border-b border-[#3C3C3C] bg-[#2D2D2D]">
              <span className="text-xs font-mono text-[#6A6A6A] uppercase tracking-wider">Language</span>
              <span className="text-xs font-mono text-[#6A6A6A] uppercase tracking-wider">Status</span>
              <span className="text-xs font-mono text-[#6A6A6A] uppercase tracking-wider">Score</span>
              <span className="text-xs font-mono text-[#6A6A6A] uppercase tracking-wider">Submitted</span>
              <span />
            </div>

            {reviewsLoading && (
              <div className="flex items-center justify-center py-20 gap-3">
                <Loader2 size={18} className="animate-spin text-[#569CD6]" />
                <span className="text-sm text-[#6A6A6A] font-mono">Loading reviews...</span>
              </div>
            )}

            {!reviewsLoading && reviewsError && (
              <div className="flex items-center justify-center py-20">
                <span className="text-sm text-[#F44747]">{reviewsError}</span>
              </div>
            )}

            {!reviewsLoading && !reviewsError && reviews.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#2D2D2D] border border-[#3C3C3C] flex items-center justify-center">
                  <Code2 size={22} className="text-[#454545]" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-[#A6A6A6] mb-1">No reviews yet</p>
                  <p className="text-xs text-[#6A6A6A]">Submit your first code snippet to get started</p>
                </div>
                <Link
                  to="/reviews/new"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#569CD6] text-[#1E1E1E] font-bold text-xs no-underline hover:bg-[#4A90D9] transition-colors"
                >
                  <Plus size={14} /> New Review
                </Link>
              </div>
            )}

            {!reviewsLoading && !reviewsError && reviews.map((review, i) => (
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