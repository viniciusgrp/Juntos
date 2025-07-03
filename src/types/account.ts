// Tipos para contas
export interface Account {
  id: string;
  name: string;
  type: 'CHECKING' | 'SAVINGS' | 'INVESTMENT' | 'CASH';
  balance: number;
  isActive: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountData {
  name: string;
  type: 'CHECKING' | 'SAVINGS' | 'INVESTMENT' | 'CASH';
  balance?: number;
}

export interface UpdateAccountData extends Partial<CreateAccountData> {
  isActive?: boolean;
}
