import { create } from 'zustand'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  
  login: (user: User, token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token)
    }
    set({
      user,
      token,
      isAuthenticated: true,
    })
  },
  
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
    }
    set({
      user: null,
      token: null,
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
