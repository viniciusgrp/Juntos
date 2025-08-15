import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import transactionService, { TransactionFilters } from '../services/transaction.service';
import { CreateTransactionData, UpdateTransactionData } from '../types/transaction';
import { getDefaultDateFilters } from '../utils/date';
import { useToastContext } from '../contexts/toast.context';

export const useAllTransactions = () => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const result = await transactionService.getTransactions();
      return result;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useTransactions = (filters?: TransactionFilters) => {
  const { data: allTransactionsData, ...queryResult } = useAllTransactions();
  
  const filteredTransactions = useMemo(() => {
    if (!allTransactionsData?.transactions) {
      return allTransactionsData;
    }

    if (!filters) {
      return allTransactionsData;
    }

    const filtered = allTransactionsData.transactions.filter(transaction => {
      if (filters.type && transaction.type !== filters.type) {
        return false;
      }

      if (filters.categoryId && transaction.categoryId !== filters.categoryId) {
        return false;
      }

      if (filters.accountId && transaction.accountId !== filters.accountId) {
        return false;
      }

      if (filters.creditCardId && transaction.creditCardId !== filters.creditCardId) {
        return false;
      }

      if (filters.description && !transaction.description.toLowerCase().includes(filters.description.toLowerCase())) {
        return false;
      }

      if (filters.isPaid !== undefined && transaction.isPaid !== filters.isPaid) {
        return false;
      }

      if (filters.startDate && new Date(transaction.date) < new Date(filters.startDate)) {
        return false;
      }

      if (filters.endDate && new Date(transaction.date) > new Date(filters.endDate)) {
        return false;
      }

      if (filters.minAmount !== undefined && transaction.amount < filters.minAmount) {
        return false;
      }

      if (filters.maxAmount !== undefined && transaction.amount > filters.maxAmount) {
        return false;
      }

      return true;
    });

    const totalAmount = filtered.reduce((sum, t) => sum + t.amount, 0);
    const totalPaid = filtered.filter(t => t.isPaid).reduce((sum, t) => sum + t.amount, 0);
    const totalPending = filtered.filter(t => !t.isPaid).reduce((sum, t) => sum + t.amount, 0);

    const result = {
      ...allTransactionsData,
      transactions: filtered,
      total: filtered.length,
      totalAmount,
      totalPaid,
      totalPending
    };
    
    return result;
  }, [allTransactionsData, filters]);

  return {
    ...queryResult,
    data: filteredTransactions
  };
};

export const useInfiniteTransactions = (filters?: TransactionFilters) => {
  return useInfiniteQuery({
    queryKey: ['transactions-infinite', filters],
    queryFn: ({ pageParam = 1 }) => {
      console.log('Fetching page:', pageParam, 'with filters:', filters);
      return transactionService.getTransactions({
        ...filters,
        page: pageParam,
        limit: 10
      }).then(result => {
        console.log('Page result:', result);
        return result;
      });
    },
    getNextPageParam: (lastPage) => {
      console.log('getNextPageParam - lastPage:', lastPage);
      if (!lastPage || !lastPage.pagination) {
        console.log('No pagination data found');
        return undefined;
      }
      console.log('Has next page:', lastPage.pagination.hasNextPage, 'Current page:', lastPage.pagination.page);
      return lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useIncomes = (filters?: Omit<TransactionFilters, 'type'>) => {
  return useInfiniteTransactions({ ...filters, type: 'INCOME' });
};

export const useExpenses = (filters?: Omit<TransactionFilters, 'type'>) => {
  return useInfiniteTransactions({ ...filters, type: 'EXPENSE' });
};

export const useTransaction = (id: string) => {
  return useQuery({
    queryKey: ['transaction', id],
    queryFn: () => transactionService.getTransactionById(id),
    enabled: !!id,
  });
};

export const useTransactionStats = () => {
  return useQuery({
    queryKey: ['transaction-stats'],
    queryFn: () => transactionService.getTransactionStats(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => transactionService.getDashboardStats(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useToastContext();
  
  return useMutation({
    mutationFn: (data: CreateTransactionData) => transactionService.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions-infinite'] });
      queryClient.invalidateQueries({ queryKey: ['transaction-stats'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['account-stats'] });
      showSuccess('Transação criada com sucesso!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Erro ao criar transação';
      showError(errorMessage);
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useToastContext();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTransactionData }) => 
      transactionService.updateTransaction(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions-infinite'] });
      queryClient.invalidateQueries({ queryKey: ['transaction', id] });
      queryClient.invalidateQueries({ queryKey: ['transaction-stats'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['account-stats'] });
      showSuccess('Transação atualizada com sucesso!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Erro ao atualizar transação';
      showError(errorMessage);
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useToastContext();
  
  return useMutation({
    mutationFn: (id: string) => transactionService.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions-infinite'] });
      queryClient.invalidateQueries({ queryKey: ['transaction-stats'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['account-stats'] });
      showSuccess('Transação deletada com sucesso!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Erro ao deletar transação';
      showError(errorMessage);
    },
  });
};

export const useTogglePaidStatus = () => {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useToastContext();
  
  return useMutation({
    mutationFn: (id: string) => transactionService.togglePaidStatus(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions-infinite'] });
      queryClient.invalidateQueries({ queryKey: ['transaction', id] });
      queryClient.invalidateQueries({ queryKey: ['transaction-stats'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['account-stats'] });
      showSuccess('Status da transação atualizado com sucesso!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Erro ao atualizar status da transação';
      showError(errorMessage);
    },
  });
};

export const useDuplicateTransaction = () => {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useToastContext();
  
  return useMutation({
    mutationFn: (id: string) => transactionService.duplicateTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions-infinite'] });
      queryClient.invalidateQueries({ queryKey: ['transaction-stats'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['account-stats'] });
      showSuccess('Transação duplicada com sucesso!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Erro ao duplicar transação';
      showError(errorMessage);
    },
  });
};

export const useTransactionFilters = (initialType?: 'INCOME' | 'EXPENSE') => {
  const getDefaultFilters = () => {
    const defaultDates = getDefaultDateFilters();
    
    const baseFilters: TransactionFilters = {
      startDate: defaultDates.startDate,
      endDate: defaultDates.endDate,
      // Deixar contas, categorias e cartões como undefined para mostrar todos
    };
    
    if (initialType) {
      baseFilters.type = initialType;
    }
    
    return baseFilters;
  };

  const [filters, setFilters] = useState<TransactionFilters>(getDefaultFilters());
  
  const updateFilter = (key: keyof TransactionFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const clearFilters = () => {
    setFilters(getDefaultFilters());
  };
  
  return {
    filters,
    updateFilter,
    clearFilters,
    setFilters
  };
};
