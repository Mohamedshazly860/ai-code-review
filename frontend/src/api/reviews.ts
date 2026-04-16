import client from './client'
import type { Review, ReviewListItem, ReviewStatusResponse, CreateReviewPayload } from '../types'

export const reviewsApi = {
  list: () =>
    client.get<ReviewListItem[]>('/reviews/').then(r => r.data),

  detail: (id: number) =>
    client.get<Review>(`/reviews/${id}/`).then(r => r.data),

  status: (id: number) =>
    client.get<ReviewStatusResponse>(`/reviews/${id}/status/`).then(r => r.data),

  create: (payload: CreateReviewPayload) =>
    client.post<Review>('/reviews/', payload).then(r => r.data),
}