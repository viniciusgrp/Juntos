import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { api } from '@/lib/axios'
import { User } from '@/types'

interface CreateUserData {
  name: string
  email: string
  password: string
}

interface UpdateUserData {
  name?: string
  email?: string
  avatar?: string
}

export const queryKeys = {
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
  userProfile: ['user', 'profile'] as const,
}

export function useUserProfile() {
  return useQuery({
    queryKey: queryKeys.userProfile,
    queryFn: async () => {
      const response = await api.get<User>('/profile')
      return response.data
    },
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userData: CreateUserData) => {
      const response = await api.post<User>('/users', userData)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users })
      queryClient.setQueryData(queryKeys.user(data.id), data)
    
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error('Erro ao criar usuário:', error)
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserData }) => {
      const response = await api.put<User>(`/users/${id}`, data)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.user(data.id), data)
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error('Erro ao atualizar usuário:', error)
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/users/${id}`)
    },
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.user(id) })
    },
    onError: (error: AxiosError<{ message?: string }>) => {
     console.error('Erro ao deletar usuário:', error)
    },
  })
}
