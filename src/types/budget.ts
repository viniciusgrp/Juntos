// Tipos para orçamentos
export interface Budget {
  id: string;
  month: number;
  year: number;
  totalBudget: number;
  totalSpent: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  items?: BudgetItem[];
}

export interface BudgetItem {
  id: string;
  budgetId: string;
  categoryId: string;
  plannedAmount: number;
  spentAmount: number;
  category?: {
    id: string;
    name: string;
    color?: string;
    icon?: string;
  };
}

export interface CreateBudgetData {
  month: number;
  year: number;
  totalBudget: number;
  items: CreateBudgetItemData[];
}

export interface CreateBudgetItemData {
  categoryId: string;
  plannedAmount: number;
}

export interface UpdateBudgetData extends Partial<CreateBudgetData> {
  totalSpent?: number;
}
