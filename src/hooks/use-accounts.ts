import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import accountService, { 
  AccountFilters,  
  TransferData,
} from '../services/account.service';
import { CreateAccountData, UpdateAccountData } from '../types/account';
import { useToastContext } from '../contexts/toast.context';

export const useAllAccounts = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountService.getAccounts(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useAccounts = (filters?: AccountFilters) => {
  const { data: allAccountsData, ...queryResult } = useAllAccounts();
  
  const filteredAccounts = useMemo(() => {
    if (!allAccountsData?.accounts || !filters) {
      return allAccountsData;
    }

    const filtered = allAccountsData.accounts.filter(account => {
      if (filters.type && account.type !== filters.type) {
        return false;
      }

      if (filters.name && !account.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }

      if (filters.minBalance !== undefined && account.balance < filters.minBalance) {
        return false;
      }

      if (filters.maxBalance !== undefined && account.balance > filters.maxBalance) {
        return false;
      }

      return true;
    });

    return {
      ...allAccountsData,
      accounts: filtered,
      total: filtered.length
    };
  }, [allAccountsData, filters]);

  return {
    ...queryResult,
    data: filteredAccounts
  };
};

export const useAccount = (id: string) => {
  return useQuery({
    queryKey: ['account', id],
    queryFn: () => accountService.getAccountById(id),
    enabled: !!id,
  });
};

export const useAccountStats = () => {
  return useQuery({
    queryKey: ['account-stats'],
    queryFn: () => accountService.getAccountStats(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useToastContext();
  
  return useMutation({
    mutationFn: (data: CreateAccountData) => accountService.createAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['account-stats'] });
      showSuccess('Conta criada com sucesso!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Erro ao criar conta';
      showError(errorMessage);
    },
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useToastContext();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAccountData }) => 
      accountService.updateAccount(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['account', id] });
      queryClient.invalidateQueries({ queryKey: ['account-stats'] });
      // Invalidar queries de transações pois pode ter sido criada uma transação de ajuste
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transaction-stats'] });
      showSuccess('Conta atualizada com sucesso!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Erro ao atualizar conta';
      showError(errorMessage);
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useToastContext();
  
  return useMutation({
    mutationFn: (id: string) => accountService.deleteAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['account-stats'] });
      showSuccess('Conta deletada com sucesso!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Erro ao deletar conta';
      showError(errorMessage);
    },
  });
};

export const useTransferBetweenAccounts = () => {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useToastContext();
  
  return useMutation({
    mutationFn: (data: TransferData) => accountService.transferBetweenAccounts(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['account-stats'] });
      showSuccess('Transferência realizada com sucesso!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Erro ao realizar transferência';
      showError(errorMessage);
    },
  });
};

export const useAccountFilters = () => {
  const [filters, setFilters] = useState<AccountFilters>({});
  
  const updateFilter = (key: keyof AccountFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const clearFilters = () => {
    setFilters({});
  };
  
  return {
    filters,
    updateFilter,
    clearFilters,
    setFilters
  };
};
