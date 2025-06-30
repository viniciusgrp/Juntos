import { create } from 'zustand'

interface GlobalState {
  isLoading: boolean
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  notifications: Notification[]
  setIsLoading: (loading: boolean) => void
  setTheme: (theme: 'light' | 'dark') => void
  toggleSidebar: () => void
  toggleTheme: () => void
  initializeTheme: () => void
}

export const useGlobalStore = create<GlobalState>((set, get) => ({
  isLoading: false,
  theme: 'light',
  sidebarOpen: false,
  notifications: [],
  
  setIsLoading: (loading: boolean) => {
    set({ isLoading: loading })
  },
  
  setTheme: (theme: 'light' | 'dark') => {
    set({ theme })
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme)
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(theme)
      localStorage.setItem('theme', theme)
    }
  },
  
  toggleTheme: () => {
    const currentTheme = get().theme
    const newTheme = currentTheme === 'light' ? 'dark' : 'light'
    get().setTheme(newTheme)
  },
  
  initializeTheme: () => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const theme = savedTheme || (prefersDark ? 'dark' : 'light')
      get().setTheme(theme)
    }
  },
  
  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }))
  },
}))
