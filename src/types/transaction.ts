// Tipos para transações
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  date: string;
  isPaid: boolean;
  installments?: number;
  currentInstallment?: number;
  userId: string;
  categoryId: string;
  accountId: string;
  creditCardId?: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    color?: string;
    icon?: string;
  };
  account?: {
    id: string;
    name: string;
    type: string;
  };
  creditCard?: {
    id: string;
    name: string;
  };
}

export interface CreateTransactionData {
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  date: string;
  isPaid?: boolean;
  installments?: number;
  categoryId: string;
  accountId: string;
  creditCardId?: string;
}

export interface UpdateTransactionData extends Partial<CreateTransactionData> {
  currentInstallment?: number;
}
