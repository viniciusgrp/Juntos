'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  TextField,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  FormControlLabel,
  Checkbox,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Link
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useRegister } from '@/hooks/use-auth'

interface RegisterFormProps {
  onToggleMode: () => void
}

interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  agreeTerms: boolean
}

const registerSchema = yup.object().shape({
  name: yup
    .string()
    .required('Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: yup
    .string()
    .required('Email é obrigatório')
    .email('Email deve ser válido'),
  password: yup
    .string()
    .required('Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: yup
    .string()
    .required('Confirmação de senha é obrigatória')
    .oneOf([yup.ref('password')], 'As senhas não coincidem'),
  agreeTerms: yup
    .boolean()
    .required('Você deve concordar com os termos de uso')
    .oneOf([true], 'Você deve concordar com os termos de uso')
})

export default function RegisterForm({ onToggleMode }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const registerMutation = useRegister()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false
    }
  })

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate({
      name: data.name,
      email: data.email,
      password: data.password
    })
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto' }}>
      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              Criar conta
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Preencha os dados para criar sua conta
            </Typography>
          </Box>

          {registerMutation.isError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              Erro ao criar conta. Verifique os dados e tente novamente.
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ space: 2 }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Nome completo"
                  placeholder="Seu nome completo"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  margin="normal"
                  variant="outlined"
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Email"
                  type="email"
                  placeholder="seu@email.com"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  margin="normal"
                  variant="outlined"
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Senha"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Sua senha"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Confirmar senha"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirme sua senha"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />

            <Box sx={{ mt: 2, mb: 3 }}>
              <Controller
                name="agreeTerms"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox 
                        {...field} 
                        color="primary"
                        sx={{ alignSelf: 'flex-start', mt: -0.5 }}
                      />
                    }
                    label={
                      <Typography variant="body2">
                        Eu concordo com os{' '}
                        <Link component="button" type="button" underline="hover">
                          termos de uso
                        </Link>
                        {' '}e{' '}
                        <Link component="button" type="button" underline="hover">
                          política de privacidade
                        </Link>
                      </Typography>
                    }
                    sx={{ alignItems: 'flex-start' }}
                  />
                )}
              />
              {errors.agreeTerms && (
                <Typography variant="caption" color="error" sx={{ ml: 4, display: 'block' }}>
                  {errors.agreeTerms.message}
                </Typography>
              )}
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isSubmitting || registerMutation.isPending}
              sx={{ mt: 2, py: 1.5 }}
            >
              {registerMutation.isPending ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Criando conta...
                </>
              ) : (
                'Criar conta'
              )}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Já possui uma conta?{' '}
              <Button
                variant="text"
                onClick={onToggleMode}
                sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
              >
                Fazer login
              </Button>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
