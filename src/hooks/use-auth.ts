import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/axios'
import { useAuthStore } from '@/stores/auth-simple'
import { LoginData, RegisterData, AuthResponse, ApiResponse } from '@/types'

export function useLogin() {
  const { login } = useAuthStore()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data)
      if (response.data.success && response.data.data) {
        return response.data.data
      }
      throw new Error(response.data.error || 'Erro no login')
    },
    onSuccess: (data) => {
      login(data.user, data.token, data.refreshToken)
      queryClient.clear()
      router.push('/painel')
    },
    onError: (error: AxiosError<ApiResponse<any>>) => {
      console.error('Erro no login:', error.response?.data?.error || 'Credenciais inválidas')
    },
  })
}

export function useRegister() {
  const { login } = useAuthStore()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data)
      if (response.data.success && response.data.data) {
        return response.data.data
      }
      throw new Error(response.data.error || 'Erro no registro')
    },
    onSuccess: (data) => {
      // Fazer login automático após registro
      login(data.user, data.token, data.refreshToken)
      queryClient.clear()
      router.push('/painel')
    },
    onError: (error: AxiosError<ApiResponse<any>>) => {
      console.error('Erro ao registrar:', error.response?.data?.error || 'Erro no registro')
    },
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await api.post<ApiResponse<{ message: string }>>('/auth/forgot-password', {
        email
      })
      if (response.data.success && response.data.data) {
        return response.data.data
      }
      throw new Error(response.data.error || 'Erro ao enviar nova senha')
    },
    onError: (error: AxiosError<ApiResponse<any>>) => {
      console.error('Erro ao enviar nova senha:', error.response?.data?.error || 'Erro ao enviar nova senha')
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
