// Tipos para orçamentos
export interface Budget {
  id: string
  name: string
  amount: number
  spent: number
  month: number
  year: number
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CreateBudgetData {
  name: string
  amount: number
  month: number
  year: number
}

export interface UpdateBudgetData {
  name?: string
  amount?: number
  spent?: number
}
