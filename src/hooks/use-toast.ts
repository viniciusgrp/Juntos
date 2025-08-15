import { useState, useCallback } from 'react'

export interface ToastState {
  open: boolean
  message: string
  severity: 'success' | 'error' | 'warning' | 'info'
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: '',
    severity: 'info'
  })

  const showSuccess = useCallback((message: string) => {
    setToast({ open: true, message, severity: 'success' })
  }, [])

  const showError = useCallback((message: string) => {
    setToast({ open: true, message, severity: 'error' })
  }, [])

  const showInfo = useCallback((message: string) => {
    setToast({ open: true, message, severity: 'info' })
  }, [])

  const showWarning = useCallback((message: string) => {
    setToast({ open: true, message, severity: 'warning' })
  }, [])

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, open: false }))
  }, [])

  return {
    toast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    hideToast,
  }
}
