import { create } from 'zustand'
import { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  login: (user: User, token: string, refreshToken?: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  
  login: (user: User, token: string, refreshToken?: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token)
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken)
      }
    }
    set({
      user,
      token,
      refreshToken,
      isAuthenticated: true,
    })
  },
  
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
    }
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
    })
  },
  
  updateUser: (userData: Partial<User>) => {
    const currentUser = get().user
    if (currentUser) {
      set({
        user: { ...currentUser, ...userData },
      })
    }
  },
}))
