// Tipos para contas
export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'investment' | 'cash';
  balance: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountData {
  name: string;
  type: 'checking' | 'savings' | 'investment' | 'cash';
  balance?: number;
}

export interface UpdateAccountData {
  name?: string;
  type?: 'checking' | 'savings' | 'investment' | 'cash';
  balance?: number;
}

// Labels para tradução dos tipos
export const ACCOUNT_TYPES = {
  checking: 'Conta Corrente',
  savings: 'Poupança',
  investment: 'Investimento',
  cash: 'Dinheiro'
} as const;

// Cores para cada tipo de conta
export const ACCOUNT_TYPE_COLORS = {
  checking: '#1976d2',
  savings: '#388e3c',
  investment: '#f57c00',
  cash: '#7b1fa2'
} as const;
