'use client'

import React, { createContext, useContext } from 'react'
import { useToast } from '../hooks/use-toast'
import { ToastComponent } from '../components/ui/toast'

interface ToastContextType {
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showInfo: (message: string) => void
  showWarning: (message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToastContext = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: React.ReactNode
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const { toast, showSuccess, showError, showInfo, showWarning, hideToast } = useToast()

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showInfo, showWarning }}>
      {children}
      <ToastComponent toast={toast} onClose={hideToast} />
    </ToastContext.Provider>
  )
}
