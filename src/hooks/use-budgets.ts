import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Budget, CreateBudgetData, UpdateBudgetData } from '@/types/budget'
import { useToast } from './use-toast'

const BUDGET_QUERY_KEY = 'budgets'

// Serviços da API
const budgetService = {
  getAll: async (): Promise<Budget[]> => {
    const response = await api.get('/budgets')
    return response.data.data
  },

  getById: async (id: string): Promise<Budget> => {
    const response = await api.get(`/budgets/${id}`)
    return response.data.data
  },

  getByMonthYear: async (month: number, year: number): Promise<Budget> => {
    const response = await api.get(`/budgets/month/${month}/year/${year}`)
    return response.data.data
  },

  create: async (data: CreateBudgetData): Promise<Budget> => {
    const response = await api.post('/budgets', data)
    return response.data.data
  },

  update: async (id: string, data: UpdateBudgetData): Promise<Budget> => {
    const response = await api.put(`/budgets/${id}`, data)
    return response.data.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/budgets/${id}`)
  },

  updateSpent: async (month: number, year: number): Promise<{ spent: number }> => {
    const response = await api.put(`/budgets/month/${month}/year/${year}/update-spent`)
    return response.data.data
  }
}

// Hook para listar todos os orçamentos
export const useBudgets = () => {
  return useQuery({
    queryKey: [BUDGET_QUERY_KEY],
    queryFn: budgetService.getAll,
  })
}

// Hook para buscar orçamento por ID
export const useBudget = (id: string) => {
  return useQuery({
    queryKey: [BUDGET_QUERY_KEY, id],
    queryFn: () => budgetService.getById(id),
    enabled: !!id,
  })
}

// Hook para buscar orçamento por mês/ano
export const useBudgetByMonthYear = (month: number, year: number, enabled = true) => {
  return useQuery({
    queryKey: [BUDGET_QUERY_KEY, 'month', month, 'year', year],
    queryFn: () => budgetService.getByMonthYear(month, year),
    enabled: enabled && !!month && !!year,
  })
}

// Hook para criar orçamento
export const useCreateBudget = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useToast()

  return useMutation({
    mutationFn: budgetService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BUDGET_QUERY_KEY] })
      showSuccess('Orçamento criado com sucesso!')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || 'Erro ao criar orçamento'
      showError(message)
    },
  })
}

// Hook para atualizar orçamento
export const useUpdateBudget = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBudgetData }) =>
      budgetService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [BUDGET_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [BUDGET_QUERY_KEY, data.id] })
      showSuccess('Orçamento atualizado com sucesso!')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || 'Erro ao atualizar orçamento'
      showError(message)
    },
  })
}

// Hook para deletar orçamento
export const useDeleteBudget = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useToast()

  return useMutation({
    mutationFn: budgetService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BUDGET_QUERY_KEY] })
      showSuccess('Orçamento excluído com sucesso!')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || 'Erro ao excluir orçamento'
      showError(message)
    },
  })
}

// Hook para atualizar gastos
export const useUpdateSpent = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useToast()

  return useMutation({
    mutationFn: ({ month, year }: { month: number; year: number }) =>
      budgetService.updateSpent(month, year),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BUDGET_QUERY_KEY] })
      showSuccess('Gastos atualizados com sucesso!')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || 'Erro ao atualizar gastos'
      showError(message)
    },
  })
}
