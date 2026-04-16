import client from './client'
import type { User, AuthResponse, LoginResponse } from '../types'

export const authApi = {
  register: (username: string, email: string, password: string) =>
    client.post<AuthResponse>('/auth/register/', { username, email, password }).then(r => r.data),

  login: (username: string, password: string) =>
    client.post<LoginResponse>('/auth/login/', { username, password }).then(r => r.data),

  profile: () =>
    client.get<User>('/auth/profile/').then(r => r.data),
}