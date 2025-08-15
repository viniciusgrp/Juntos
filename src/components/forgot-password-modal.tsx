'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Box
} from '@mui/material'
import { Email } from '@mui/icons-material'
import { useForgotPassword } from '@/hooks/use-auth'

interface ForgotPasswordModalProps {
  open: boolean
  onClose: () => void
}

interface ForgotPasswordFormData {
  email: string
}

const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email é obrigatório')
    .email('Email deve ser válido')
})

export default function ForgotPasswordModal({ open, onClose }: ForgotPasswordModalProps) {
  const [success, setSuccess] = useState(false)
  const forgotPasswordMutation = useForgotPassword()

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPasswordMutation.mutateAsync(data.email)
      setSuccess(true)
    } catch {
      // O erro será tratado pelo useForgotPassword
    }
  }

  const handleClose = () => {
    setSuccess(false)
    reset()
    forgotPasswordMutation.reset()
    onClose()
  }

  if (success) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <Email color="success" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h5" gutterBottom color="success.main">
            Nova senha enviada!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Verifique sua caixa de entrada. Uma nova senha de 8 números foi enviada para o seu e-mail.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lembre-se de alterar sua senha após fazer login.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            variant="contained" 
            onClick={handleClose}
            size="large"
          >
            Entendi
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h5" textAlign="center">
          Esqueceu sua senha?
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
          Digite seu e-mail para receber uma nova senha
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {forgotPasswordMutation.isError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {forgotPasswordMutation.error?.response?.data?.error || 
               'Erro ao enviar nova senha. Verifique o e-mail informado.'}
            </Alert>
          )}

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Seu e-mail"
                type="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                autoComplete="email"
                autoFocus
                sx={{ mb: 2 }}
              />
            )}
          />

          <Box sx={{ mt: 2, mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              • Uma nova senha de 8 números será gerada automaticamente
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Você receberá a nova senha no e-mail informado
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Altere sua senha após fazer login
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button 
            variant="outlined" 
            onClick={handleClose}
            disabled={forgotPasswordMutation.isPending}
            fullWidth
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={forgotPasswordMutation.isPending}
            startIcon={forgotPasswordMutation.isPending ? <CircularProgress size={16} /> : undefined}
            fullWidth
          >
            {forgotPasswordMutation.isPending ? 'Enviando...' : 'Enviar Nova Senha'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
