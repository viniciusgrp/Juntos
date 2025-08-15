'use client'

import { Snackbar, Alert } from '@mui/material'
import { ToastState } from '../../hooks/use-toast'

interface ToastComponentProps {
  toast: ToastState
  onClose: () => void
}

const ToastComponent: React.FC<ToastComponentProps> = ({ toast, onClose }) => {
  return (
    <Snackbar
      open={toast.open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        onClose={onClose}
        severity={toast.severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {toast.message}
      </Alert>
    </Snackbar>
  )
}

export { ToastComponent }
export type { ToastComponentProps }
