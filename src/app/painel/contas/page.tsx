'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  CircularProgress,
  Paper
} from '@mui/material';
import {
  Add,
  SwapHoriz,
  Delete
} from '@mui/icons-material';
import PageHeader from '../../../components/ui/page-header';
import AccountCard from '../../../components/accounts/AccountCard';
import AccountFormModal from '../../../components/accounts/AccountFormModal';
import TransferModal from '../../../components/accounts/TransferModal';
import AccountFilters from '../../../components/accounts/AccountFilters';
import AccountStatsGrid from '../../../components/accounts/AccountStatsGrid';
import { 
  useAccounts,
  useAllAccounts, 
  useAccountStats,
  useCreateAccount, 
  useUpdateAccount, 
  useDeleteAccount,
  useTransferBetweenAccounts,
  useAccountFilters 
} from '../../../hooks/use-accounts';
import { Account, CreateAccountData, UpdateAccountData } from '../../../types/account';

export default function ContasPage() {
  const { filters, updateFilter, clearFilters } = useAccountFilters();
  const { data: accountsData, isLoading: accountsLoading, error: accountsError } = useAccounts(filters);
  const { data: allAccountsData } = useAllAccounts();
  const { data: statsData, isLoading: statsLoading } = useAccountStats();
  
  const createAccountMutation = useCreateAccount();
  const updateAccountMutation = useUpdateAccount();
  const deleteAccountMutation = useDeleteAccount();
  const transferMutation = useTransferBetweenAccounts();
  
  const [accountFormOpen, setAccountFormOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const closeSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleCreateAccount = () => {
    setSelectedAccount(null);
    setAccountFormOpen(true);
  };

  const handleEditAccount = (account: Account) => {
    setSelectedAccount(account);
    setAccountFormOpen(true);
  };

  const handleAccountFormSubmit = async (data: CreateAccountData | UpdateAccountData) => {
    try {
      if (selectedAccount) {
        await updateAccountMutation.mutateAsync({
          id: selectedAccount.id,
          data: data as UpdateAccountData
        });
        showSnackbar('Conta atualizada com sucesso!');
      } else {
        await createAccountMutation.mutateAsync(data as CreateAccountData);
        showSnackbar('Conta criada com sucesso!');
      }
      setAccountFormOpen(false);
    } catch (error: any) {
      showSnackbar(error.response?.data?.error || 'Erro ao salvar conta', 'error');
    }
  };

  const handleDeleteAccount = (account: Account) => {
    setSelectedAccount(account);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteAccount = async () => {
    if (!selectedAccount) return;

    try {
      await deleteAccountMutation.mutateAsync(selectedAccount.id);
      showSnackbar('Conta excluída com sucesso!');
      setDeleteDialogOpen(false);
      setSelectedAccount(null);
    } catch (error: any) {
      showSnackbar(error.response?.data?.error || 'Erro ao excluir conta', 'error');
    }
  };

  const handleTransfer = () => {
    setTransferModalOpen(true);
  };

  const handleTransferSubmit = async (data: any) => {
    try {
      await transferMutation.mutateAsync(data);
      showSnackbar('Transferência realizada com sucesso!');
      setTransferModalOpen(false);
    } catch (error: any) {
      showSnackbar(error.response?.data?.error || 'Erro ao realizar transferência', 'error');
    }
  };

  const accounts = accountsData?.accounts || [];
  const allAccounts = allAccountsData?.accounts || [];
  const hasAccounts = accounts.length > 0;
  const hasAnyAccounts = allAccounts.length > 0; // Para controlar exibição de filtros

  return (
    <Box>
      <PageHeader
        title="Contas"
        description="Gerencie suas contas bancárias e carteiras"
      >
        <Box display="flex" gap={2}>
          {hasAnyAccounts && (
            <Button
              variant="outlined"
              startIcon={<SwapHoriz />}
              onClick={handleTransfer}
              disabled={allAccounts.length < 2}
            >
              Transferir
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateAccount}
          >
            Nova Conta
          </Button>
        </Box>
      </PageHeader>

      <AccountStatsGrid 
        stats={statsData} 
        loading={statsLoading} 
      />

      {hasAnyAccounts && (
        <AccountFilters
          filters={filters}
          onFiltersChange={(newFilters) => {
            Object.entries(newFilters).forEach(([key, value]) => {
              updateFilter(key as any, value);
            });
          }}
          onClearFilters={clearFilters}
        />
      )}

      {accountsLoading && (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      )}

     {accountsError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Erro ao carregar contas. Tente novamente.
        </Alert>
      )}

      {!accountsLoading && !accountsError && (
        <>
          {hasAccounts ? (
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { 
                xs: '1fr', 
                sm: 'repeat(2, 1fr)', 
                md: 'repeat(3, 1fr)' 
              },
              gap: 3 
            }}>
              {accounts.map((account) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  onEdit={handleEditAccount}
                  onDelete={handleDeleteAccount}
                />
              ))}
            </Box>
          ) : hasAnyAccounts ? (
            <Paper 
              sx={{ 
                p: 6, 
                textAlign: 'center', 
                bgcolor: 'background.default',
                border: '2px dashed',
                borderColor: 'divider'
              }}
            >
              <Typography variant="h6" gutterBottom>
                Nenhuma conta encontrada com os filtros aplicados
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Tente ajustar os filtros ou limpar a busca para ver todas as contas
              </Typography>
              <Button
                variant="outlined"
                onClick={clearFilters}
                size="large"
              >
                Limpar Filtros
              </Button>
            </Paper>
          ) : (
            <Paper 
              sx={{ 
                p: 6, 
                textAlign: 'center', 
                bgcolor: 'background.default',
                border: '2px dashed',
                borderColor: 'divider'
              }}
            >
              <Typography variant="h6" gutterBottom>
                Nenhuma conta encontrada
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Crie sua primeira conta para começar a gerenciar suas finanças
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateAccount}
                size="large"
              >
                Criar Primeira Conta
              </Button>
            </Paper>
          )}
        </>
      )}

      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', sm: 'none' }
        }}
        onClick={handleCreateAccount}
      >
        <Add />
      </Fab>

      <AccountFormModal
        open={accountFormOpen}
        onClose={() => setAccountFormOpen(false)}
        onSubmit={handleAccountFormSubmit}
        account={selectedAccount || undefined}
        loading={createAccountMutation.isPending || updateAccountMutation.isPending}
        error={
          (createAccountMutation.error as any)?.response?.data?.error || 
          (updateAccountMutation.error as any)?.response?.data?.error ||
          createAccountMutation.error?.message ||
          updateAccountMutation.error?.message
        }
      />

      <TransferModal
        open={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        onSubmit={handleTransferSubmit}
        accounts={allAccounts}
        loading={transferMutation.isPending}
        error={
          (transferMutation.error as any)?.response?.data?.error ||
          transferMutation.error?.message
        }
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir a conta &quot;{selectedAccount?.name}&quot;?
            Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={confirmDeleteAccount}
            color="error"
            disabled={deleteAccountMutation.isPending}
            startIcon={deleteAccountMutation.isPending ? <CircularProgress size={16} /> : <Delete />}
          >
            {deleteAccountMutation.isPending ? 'Excluindo...' : 'Excluir'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}