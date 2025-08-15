import api from '../lib/api';
import { Transaction, CreateTransactionData, UpdateTransactionData } from '../types/transaction';

export interface TransactionStats {
  totalIncomes: number;
  totalExpenses: number;
  totalPaid: number;
  totalPending: number;
  currentMonthIncomes: number;
  currentMonthExpenses: number;
  currentMonthIncomeCount: number;
  currentMonthExpenseCount: number;
  balance: number;
  topCategories: Array<{
    categoryId: string;
    categoryName: string;
    total: number;
    color?: string;
  }>;
}

export interface DashboardStats {
  totalBalance: number;
  currentMonthIncomes: number;
  currentMonthExpenses: number;
  creditCardExpenses: number;
  incomeChange: number;
  expenseChange: number;
  creditCardChange: number;
  recentTransactions: Array<{
    id: string;
    description: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    date: string;
    category: string;
    account?: string;
    creditCard?: string;
    isPaid: boolean;
  }>;
  categoryDistribution: Array<{
    name: string;
    amount: number;
    percentage: number;
  }>;
  accounts: Array<{
    id: string;
    name: string;
    type: string;
    balance: number;
  }>;
  creditCards: Array<{
    id: string;
    name: string;
    limit: number;
    currentExpenses: number;
  }>;
}

export interface TransactionFilters {
  type?: 'INCOME' | 'EXPENSE';
  categoryId?: string;
  accountId?: string;
  creditCardId?: string;
  description?: string;
  isPaid?: boolean;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  limit?: number;
}

interface TransactionResponse {
  transactions: Transaction[];
  total: number;
  totalAmount: number;
  totalPaid: number;
  totalPending: number;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

class TransactionService {
  async getTransactions(filters?: TransactionFilters): Promise<TransactionResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await api.get(`/transactions?${params.toString()}`);
    return response.data.data;
  }

  async getTransactionById(id: string): Promise<Transaction> {
    const response = await api.get(`/transactions/${id}`);
    return response.data.data;
  }

  async createTransaction(data: CreateTransactionData): Promise<Transaction> {
    const response = await api.post('/transactions', data);
    return response.data.data;
  }

  async updateTransaction(id: string, data: UpdateTransactionData): Promise<Transaction> {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data.data;
  }

  async deleteTransaction(id: string): Promise<void> {
    await api.delete(`/transactions/${id}`);
  }

  async togglePaidStatus(id: string): Promise<Transaction> {
    const response = await api.patch(`/transactions/${id}/toggle-paid`);
    return response.data.data;
  }

  async getTransactionStats(): Promise<TransactionStats> {
    const response = await api.get('/transactions/stats');
    return response.data.data;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get('/transactions/dashboard');
    return response.data.data;
  }

  async duplicateTransaction(id: string): Promise<Transaction> {
    const response = await api.post(`/transactions/${id}/duplicate`);
    return response.data.data;
  }
}

const transactionService = new TransactionService();
export default transactionService;
