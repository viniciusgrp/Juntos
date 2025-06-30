import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { api } from '@/lib/axios'
import { useAuthStore } from '@/stores/auth-simple'

interface LoginData {
  email: string
  password: string
}

interface RegisterData {
  name: string
  email: string
  password: string
}

interface AuthResponse {
  user: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  token: string
}

export function useLogin() {
  const { login } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await api.post<AuthResponse>('/auth/login', data)
      return response.data
    },
    onSuccess: (data) => {
      login(data.user, data.token)
      queryClient.clear()
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error('Erro no login:', error.response?.data?.message || 'Credenciais inválidas')
    },
  })
}

export function useRegister() {

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await api.post<AuthResponse>('/auth/register', data)
      return response.data
    },
    onSuccess: () => {
        //TODO Fazer login automático após registro
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error('Erro ao registrar:', error)
    },
  })
}

export function useLogout() {
  const { logout } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout')
    },
    onSuccess: () => {
      logout()
      queryClient.clear()
    },
    onError: () => {
      logout()
      queryClient.clear()
    },
  })
}

export function useVerifyToken() {
  const { logout } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await api.get('/auth/verify')
      return response.data
    },
    onError: () => {
      logout()
      queryClient.clear()
    },
  })
}
