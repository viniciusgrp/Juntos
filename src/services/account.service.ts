import api from '../lib/api';
import { Account, CreateAccountData, UpdateAccountData } from '../types/account';

export interface AccountFilters {
  type?: 'checking' | 'savings' | 'investment' | 'cash';
  minBalance?: number;
  maxBalance?: number;
  name?: string;
}

export interface AccountsResponse {
  accounts: Account[];
  totalBalance: number;
  accountsByType: {
    checking: number;
    savings: number;
    investment: number;
    cash: number;
  };
}

export interface AccountStats {
  totalAccounts: number;
  totalBalance: number;
  accountsByType: {
    checking: number;
    savings: number;
    investment: number;
    cash: number;
  };
  balanceByType: {
    checking: number;
    savings: number;
    investment: number;
    cash: number;
  };
  highestBalance: number;
  averageBalance: number;
}

export interface TransferData {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description?: string;
}

export interface TransferResponse {
  fromAccount: Account;
  toAccount: Account;
  transferAmount: number;
  description: string;
}

const accountService = {
  // Listar contas
  async getAccounts(filters?: AccountFilters): Promise<AccountsResponse> {
    const params = new URLSearchParams();
    
    if (filters?.type) params.append('type', filters.type);
    if (filters?.minBalance !== undefined) params.append('minBalance', filters.minBalance.toString());
    if (filters?.maxBalance !== undefined) params.append('maxBalance', filters.maxBalance.toString());
    
    const queryString = params.toString();
    const url = queryString ? `/accounts?${queryString}` : '/accounts';
    
    const response = await api.get(url);
    return response.data.data;
  },

  // Obter conta por ID
  async getAccountById(id: string): Promise<Account> {
    const response = await api.get(`/accounts/${id}`);
    return response.data.data;
  },

  // Criar conta
  async createAccount(data: CreateAccountData): Promise<Account> {
    const response = await api.post('/accounts', data);
    return response.data.data;
  },

  // Atualizar conta
  async updateAccount(id: string, data: UpdateAccountData): Promise<Account> {
    const response = await api.put(`/accounts/${id}`, data);
    return response.data.data;
  },

  // Deletar conta
  async deleteAccount(id: string): Promise<void> {
    await api.delete(`/accounts/${id}`);
  },

  // Transferir entre contas
  async transferBetweenAccounts(data: TransferData): Promise<TransferResponse> {
    const response = await api.post('/accounts/transfer', data);
    return response.data.data;
  },

  // Obter estatísticas
  async getAccountStats(): Promise<AccountStats> {
    const response = await api.get('/accounts/stats');
    return response.data.data;
  }
};

export default accountService;
