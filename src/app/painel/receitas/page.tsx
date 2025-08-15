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
  Delete,
  TrendingUp
} from '@mui/icons-material';
import PageHeader from '../../../components/ui/page-header';
import {
  TransactionCard,
  TransactionFormModal,
  TransactionFilters,
  TransactionStatsGrid
} from '../../../components/transactions';
import {
  useIncomes,
  useAllTransactions,
  useTransactionStats,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
  useTogglePaidStatus,
  useDuplicateTransaction,
  useTransactionFilters
} from '../../../hooks/use-transactions';
import { useAllAccounts } from '../../../hooks/use-accounts';
import { useCategories } from '../../../hooks/use-categories';
import { useGoals } from '../../../hooks/use-goals';
import { Transaction, CreateTransactionData, UpdateTransactionData } from '../../../types/transaction';

export default function ReceitasPage() {
  const { filters, updateFilter, clearFilters } = useTransactionFilters('INCOME');
  const { 
    data, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useIncomes(filters);
  const { data: allTransactionsData } = useAllTransactions();
  const { data: statsData, isLoading: statsLoading } = useTransactionStats();
  const { data: accountsData } = useAllAccounts();
  const { categories } = useCategories({ type: 'INCOME' });
  const { data: goalsData } = useGoals();

  const createTransactionMutation = useCreateTransaction();
  const updateTransactionMutation = useUpdateTransaction();
  const deleteTransactionMutation = useDeleteTransaction();
  const togglePaidMutation = useTogglePaidStatus();
  const duplicateTransactionMutation = useDuplicateTransaction();

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

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

  const handleCreateTransaction = () => {
    setSelectedTransaction(null);
    setFormModalOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setFormModalOpen(true);
  };

  const handleFormSubmit = async (data: CreateTransactionData | UpdateTransactionData) => {
    try {
      if (selectedTransaction) {
        await updateTransactionMutation.mutateAsync({
          id: selectedTransaction.id,
          data: data as UpdateTransactionData
        });
        showSnackbar('Receita atualizada com sucesso!');
      } else {
        await createTransactionMutation.mutateAsync({
          ...data as CreateTransactionData,
          type: 'INCOME'
        });
        showSnackbar('Receita criada com sucesso!');
      }
      setFormModalOpen(false);
    } catch (error: any) {
      showSnackbar(error.response?.data?.error || 'Erro ao salvar receita', 'error');
    }
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteTransaction = async () => {
    if (!selectedTransaction) return;

    try {
      await deleteTransactionMutation.mutateAsync(selectedTransaction.id);
      showSnackbar('Receita excluída com sucesso!');
      setDeleteDialogOpen(false);
      setSelectedTransaction(null);
    } catch (error: any) {
      showSnackbar(error.response?.data?.error || 'Erro ao excluir receita', 'error');
    }
  };

  const handleTogglePaid = async (transaction: Transaction) => {
    try {
      await togglePaidMutation.mutateAsync(transaction.id);
      const action = transaction.isPaid ? 'pendente' : 'recebida';
      showSnackbar(`Receita marcada como ${action}!`);
    } catch (error: any) {
      showSnackbar(error.response?.data?.error || 'Erro ao atualizar status', 'error');
    }
  };

  const handleDuplicateTransaction = async (transaction: Transaction) => {
    try {
      await duplicateTransactionMutation.mutateAsync(transaction.id);
      showSnackbar('Receita duplicada com sucesso!');
    } catch (error: any) {
      showSnackbar(error.response?.data?.error || 'Erro ao duplicar receita', 'error');
    }
  };

  const transactions = data?.pages.flatMap(page => page.transactions) || [];
  const allTransactions = allTransactionsData?.transactions || [];
  const hasTransactions = transactions.length > 0;
  const hasAnyTransactions = allTransactions.filter(t => t.type === 'INCOME').length > 0;
  const accounts = accountsData?.accounts || [];

  const creditCards = [
    { id: '1', name: 'Cartão Principal' },
    { id: '2', name: 'Cartão Empresarial' }
  ];

  return (
    <Box>
      <PageHeader
        title="Receitas"
        description="Gerencie suas receitas e entradas financeiras"
      >
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateTransaction}
          color="success"
        >
          Nova Receita
        </Button>
      </PageHeader>

      <TransactionStatsGrid 
        stats={statsData} 
        loading={statsLoading}
        type="INCOME"
      />

      <TransactionFilters
        filters={filters}
        onFiltersChange={(newFilters) => {
          Object.entries(newFilters).forEach(([key, value]) => {
            updateFilter(key as any, value);
          });
        }}
        onClearFilters={clearFilters}
        categories={categories}
        accounts={accounts}
        creditCards={creditCards}
        hideTypeFilter={true}
      />

      {isLoading && (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Erro ao carregar receitas. Tente novamente.
        </Alert>
      )}

      {!isLoading && !error && (
        <>
          {hasTransactions ? (
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { 
                xs: '1fr', 
                sm: 'repeat(2, 1fr)', 
                md: 'repeat(3, 1fr)' 
              },
              gap: 3 
            }}>
              {transactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  onEdit={handleEditTransaction}
                  onDelete={handleDeleteTransaction}
                  onDuplicate={handleDuplicateTransaction}
                  onTogglePaid={handleTogglePaid}
                />
              ))}
            </Box>
          ) : hasAnyTransactions ? (
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
                Nenhuma receita encontrada com os filtros aplicados
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Tente ajustar os filtros ou limpar a busca para ver todas as receitas
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
                bgcolor: 'success.50',
                border: '2px dashed',
                borderColor: 'success.main'
              }}
            >
              <TrendingUp sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Nenhuma receita cadastrada
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Comece cadastrando suas receitas para ter controle total das suas entradas financeiras
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateTransaction}
                size="large"
                color="success"
              >
                Cadastrar Primeira Receita
              </Button>
            </Paper>
          )}
        </>
      )}

      {/* Load More Button - Show only if we have transactions and there are more pages */}
      {hasTransactions && hasNextPage && (
        <Box display="flex" justifyContent="center" mt={3} mb={3}>
          <Button
            variant="outlined"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            startIcon={isFetchingNextPage ? <CircularProgress size={16} /> : undefined}
          >
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais receitas'}
          </Button>
        </Box>
      )}

      <Fab
        color="success"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', sm: 'none' }
        }}
        onClick={handleCreateTransaction}
      >
        <Add />
      </Fab>

      <TransactionFormModal
        open={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        transaction={selectedTransaction || undefined}
        loading={createTransactionMutation.isPending || updateTransactionMutation.isPending}
        error={
          (createTransactionMutation.error as any)?.response?.data?.error || 
          (updateTransactionMutation.error as any)?.response?.data?.error ||
          createTransactionMutation.error?.message ||
          updateTransactionMutation.error?.message
        }
        type="INCOME"
        categories={categories}
        accounts={accounts}
        creditCards={creditCards}
        goals={goalsData || []}
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir a receita &quot;{selectedTransaction?.description}&quot;?
            Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={confirmDeleteTransaction}
            color="error"
            disabled={deleteTransactionMutation.isPending}
            startIcon={deleteTransactionMutation.isPending ? <CircularProgress size={16} /> : <Delete />}
          >
            {deleteTransactionMutation.isPending ? 'Excluindo...' : 'Excluir'}
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
