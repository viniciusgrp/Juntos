// Tipos para categorias
export interface Category {
  id: string;
  name: string;
  description?: string;
  type: 'INCOME' | 'EXPENSE';
  color?: string;
  icon?: string;
  isActive: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  type: 'INCOME' | 'EXPENSE';
  color?: string;
  icon?: string;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {
  isActive?: boolean;
}
