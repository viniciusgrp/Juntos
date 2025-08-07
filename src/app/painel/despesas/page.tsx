'use client';

import { useState, useMemo } from 'react';
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
  TrendingDown
} from '@mui/icons-material';
import PageHeader from '../../../components/ui/page-header';
import {
  TransactionCard,
  TransactionFormModal,
  TransactionFilters,
  TransactionStatsGrid
} from '../../../components/transactions';
import {
  useExpenses,
  useAllTransactions,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
  useTogglePaidStatus,
  useDuplicateTransaction,
  useTransactionFilters
} from '../../../hooks/use-transactions';
import { useAllAccounts } from '../../../hooks/use-accounts';
import { useCategories } from '../../../hooks/use-categories';
import { useCreditCards } from '../../../hooks/use-credit-cards';
import { Transaction, CreateTransactionData, UpdateTransactionData } from '../../../types/transaction';
import { CreateCreditCardData } from '../../../types/credit-card';
import CreditCardFormModal from '../../../components/ui/credit-card-form-modal';

export default function DespesasPage() {
  const { filters, updateFilter, clearFilters } = useTransactionFilters('EXPENSE');
  
  const { 
    data, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useExpenses(filters);
  
  const { data: allTransactionsData } = useAllTransactions();
  
  const expenseStats = useMemo(() => {
    if (!data?.pages) {
      return {
        totalExpenses: 0,
        totalPaid: 0,
        totalPending: 0,
        currentMonthExpenses: 0,
        totalIncomes: 0,
        currentMonthIncomes: 0,
        balance: 0,
        topCategories: []
      };
    }
    
    const allExpenses = data.pages.flatMap(page => page.transactions) || [];
    
    const totalExpenses = allExpenses.reduce((sum, t) => sum + t.amount, 0);
    const totalPaid = allExpenses.filter(t => t.isPaid).reduce((sum, t) => sum + t.amount, 0);
    const totalPending = allExpenses.filter(t => !t.isPaid).reduce((sum, t) => sum + t.amount, 0);
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const currentMonthExpenses = allExpenses
      .filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= startOfMonth && transactionDate <= endOfMonth;
      })
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalExpenses,
      totalPaid,
      totalPending,
      currentMonthExpenses,
      totalIncomes: 0,
      currentMonthIncomes: 0,
      balance: 0,
      topCategories: []
    };
  }, [data]);
  const { data: accountsData } = useAllAccounts();
  const { categories } = useCategories({ type: 'EXPENSE' });
  const { creditCards, createCreditCard } = useCreditCards();

  const createTransactionMutation = useCreateTransaction();
  const updateTransactionMutation = useUpdateTransaction();
  const deleteTransactionMutation = useDeleteTransaction();
  const togglePaidMutation = useTogglePaidStatus();
  const duplicateTransactionMutation = useDuplicateTransaction();

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [creditCardModalOpen, setCreditCardModalOpen] = useState(false);
  const [creditCardFormLoading, setCreditCardFormLoading] = useState(false);

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
        showSnackbar('Despesa atualizada com sucesso!');
      } else {
        await createTransactionMutation.mutateAsync({
          ...data as CreateTransactionData,
          type: 'EXPENSE'
        });
        showSnackbar('Despesa criada com sucesso!');
      }
      setFormModalOpen(false);
    } catch (error: any) {
      showSnackbar(error.response?.data?.error || 'Erro ao salvar despesa', 'error');
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
      showSnackbar('Despesa excluída com sucesso!');
      setDeleteDialogOpen(false);
      setSelectedTransaction(null);
    } catch (error: any) {
      showSnackbar(error.response?.data?.error || 'Erro ao excluir despesa', 'error');
    }
  };

  const handleTogglePaid = async (transaction: Transaction) => {
    try {
      await togglePaidMutation.mutateAsync(transaction.id);
      const action = transaction.isPaid ? 'pendente' : 'efetivada';
      showSnackbar(`Despesa marcada como ${action}!`);
    } catch (error: any) {
      showSnackbar(error.response?.data?.error || 'Erro ao atualizar status', 'error');
    }
  };

  const handleDuplicateTransaction = async (transaction: Transaction) => {
    try {
      await duplicateTransactionMutation.mutateAsync(transaction.id);
      showSnackbar('Despesa duplicada com sucesso!');
    } catch (error: any) {
      showSnackbar(error.response?.data?.error || 'Erro ao duplicar despesa', 'error');
    }
  };

  const handleCreateCreditCard = async (data: CreateCreditCardData | Partial<CreateCreditCardData>) => {
    try {
      setCreditCardFormLoading(true);
      await createCreditCard(data as CreateCreditCardData);
      setCreditCardModalOpen(false);
      showSnackbar('Cartão de crédito criado com sucesso!');
    } catch (error: any) {
      showSnackbar(error.message || 'Erro ao criar cartão', 'error');
    } finally {
      setCreditCardFormLoading(false);
    }
  };

  const transactions = data?.pages.flatMap(page => page.transactions) || [];
  const allTransactions = allTransactionsData?.transactions || [];
  const hasTransactions = transactions.length > 0;
  const hasAnyTransactions = allTransactions.filter(t => t.type === 'EXPENSE').length > 0;
  const accounts = accountsData?.accounts || [];

  return (
    <Box>
      <PageHeader
        title="Despesas"
        description="Controle seus gastos e despesas mensais"
      >
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateTransaction}
          color="error"
        >
          Nova Despesa
        </Button>
      </PageHeader>

      <TransactionStatsGrid 
        stats={expenseStats} 
        loading={isLoading}
        type="EXPENSE"
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
          Erro ao carregar despesas. Tente novamente.
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
                Nenhuma despesa encontrada com os filtros aplicados
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Tente ajustar os filtros ou limpar a busca para ver todas as despesas
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
                bgcolor: 'error.50',
                border: '2px dashed',
                borderColor: 'error.main'
              }}
            >
              <TrendingDown sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Nenhuma despesa cadastrada
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Comece cadastrando suas despesas para ter controle total dos seus gastos
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateTransaction}
                size="large"
                color="error"
              >
                Cadastrar Primeira Despesa
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
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais despesas'}
          </Button>
        </Box>
      )}

      <Fab
        color="error"
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
        type="EXPENSE"
        categories={categories}
        accounts={accounts}
        creditCards={creditCards}
        onCreateCreditCard={() => setCreditCardModalOpen(true)}
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir a despesa &quot;{selectedTransaction?.description}&quot;?
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

      <CreditCardFormModal
        open={creditCardModalOpen}
        onClose={() => setCreditCardModalOpen(false)}
        onSubmit={handleCreateCreditCard}
        loading={creditCardFormLoading}
      />

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