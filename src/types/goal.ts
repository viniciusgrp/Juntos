// Tipos para metas
export interface Goal {
  id: string
  title: string
  description?: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CreateGoalData {
  title: string
  description?: string
  targetAmount: number
  targetDate: string
}

export interface UpdateGoalData extends Partial<CreateGoalData> {
  currentAmount?: number
}
