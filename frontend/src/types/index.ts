export interface User {
  id: number
  username: string
  email: string
  created_at: string
}

export interface Tokens {
  access: string
  refresh: string
}

export interface AuthResponse {
  user: User
  tokens: Tokens
}

export interface LoginResponse {
  access: string
  refresh: string
}

export interface Issue {
  severity: 'high' | 'medium' | 'low'
  line: number | null
  title: string
  description: string
}

export interface Suggestion {
  title: string
  description: string
  example?: string
}

export type ReviewStatus = 'pending' | 'processing' | 'completed' | 'failed'

export type Language =
  | 'python' | 'javascript' | 'typescript' | 'java'
  | 'cpp' | 'c' | 'go' | 'rust' | 'php'
  | 'ruby' | 'swift' | 'kotlin' | 'sql' | 'bash' | 'other'

export interface Review {
  id: number
  username: string
  language: Language
  language_display: string
  code_snippet: string
  question: string
  status: ReviewStatus
  status_display: string
  issues: Issue[]
  suggestions: Suggestion[]
  quality_score: number | null
  summary: string
  created_at: string
  updated_at: string
}

export interface ReviewListItem {
  id: number
  language: Language
  language_display: string
  status: ReviewStatus
  status_display: string
  quality_score: number | null
  created_at: string
}

export interface ReviewStatusResponse {
  id: number
  status: ReviewStatus
  status_display: string
  quality_score: number | null
  completed_at?: string
}

export interface CreateReviewPayload {
  language: Language
  code_snippet: string
  question?: string
}