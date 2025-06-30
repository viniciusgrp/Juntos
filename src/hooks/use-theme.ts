'use client'

import { useEffect } from 'react'
import { useGlobalStore } from '@/stores/global'

export function useTheme() {
  const { theme, setTheme, toggleTheme, initializeTheme } = useGlobalStore()

  useEffect(() => {
    initializeTheme()
  }, [initializeTheme])

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  }
}
