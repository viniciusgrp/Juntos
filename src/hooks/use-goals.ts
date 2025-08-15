import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Goal, CreateGoalData, UpdateGoalData } from '@/types/goal'
import { useToast } from './use-toast'

const GOAL_QUERY_KEY = 'goals'

// Serviços da API
const goalService = {
  getAll: async (): Promise<Goal[]> => {
    const response = await api.get('/goals')
    return response.data.data
  },

  getById: async (id: string): Promise<Goal> => {
    const response = await api.get(`/goals/${id}`)
    return response.data.data
  },

  create: async (data: CreateGoalData): Promise<Goal> => {
    const response = await api.post('/goals', data)
    return response.data.data
  },

  update: async (id: string, data: UpdateGoalData): Promise<Goal> => {
    const response = await api.put(`/goals/${id}`, data)
    return response.data.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/goals/${id}`)
  },

  addProgress: async (id: string, amount: number): Promise<Goal> => {
    const response = await api.post(`/goals/${id}/progress`, { amount })
    return response.data.data
  },

  getProgress: async (id: string): Promise<{
    id: string
    title: string
    targetAmount: number
    currentAmount: number
    percentage: number
    remaining: number
    isCompleted: boolean
    daysRemaining: number
  }> => {
    const response = await api.get(`/goals/${id}/progress`)
    return response.data.data
  }
}

// Hook para listar todas as metas
export const useGoals = () => {
  return useQuery({
    queryKey: [GOAL_QUERY_KEY],
    queryFn: goalService.getAll,
  })
}

// Hook para buscar meta por ID
export const useGoal = (id: string) => {
  return useQuery({
    queryKey: [GOAL_QUERY_KEY, id],
    queryFn: () => goalService.getById(id),
    enabled: !!id,
  })
}

// Hook para buscar progresso de uma meta
export const useGoalProgress = (id: string) => {
  return useQuery({
    queryKey: [GOAL_QUERY_KEY, id, 'progress'],
    queryFn: () => goalService.getProgress(id),
    enabled: !!id,
  })
}

// Hook para criar meta
export const useCreateGoal = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useToast()

  return useMutation({
    mutationFn: goalService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GOAL_QUERY_KEY] })
      showSuccess('Meta criada com sucesso!')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || 'Erro ao criar meta'
      showError(message)
    },
  })
}

// Hook para atualizar meta
export const useUpdateGoal = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGoalData }) =>
      goalService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [GOAL_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [GOAL_QUERY_KEY, data.id] })
      showSuccess('Meta atualizada com sucesso!')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || 'Erro ao atualizar meta'
      showError(message)
    },
  })
}

// Hook para deletar meta
export const useDeleteGoal = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useToast()

  return useMutation({
    mutationFn: goalService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GOAL_QUERY_KEY] })
      showSuccess('Meta excluída com sucesso!')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || 'Erro ao excluir meta'
      showError(message)
    },
  })
}

// Hook para adicionar progresso
export const useAddProgress = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useToast()

  return useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) =>
      goalService.addProgress(id, amount),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [GOAL_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [GOAL_QUERY_KEY, data.id] })
      queryClient.invalidateQueries({ queryKey: [GOAL_QUERY_KEY, data.id, 'progress'] })
      showSuccess('Progresso adicionado com sucesso!')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || 'Erro ao adicionar progresso'
      showError(message)
    },
  })
}
