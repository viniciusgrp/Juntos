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
  CreditCard as CreditCardIcon
} from '@mui/icons-material';
import PageHeader from '../../../components/ui/page-header';
import CreditCardCard from '../../../components/ui/credit-card-card';
import CreditCardFormModal from '../../../components/ui/credit-card-form-modal';
import { useCreditCards, useCreditCardStats } from '../../../hooks/use-credit-cards';
import { CreditCard, CreateCreditCardData, UpdateCreditCardData } from '../../../types/credit-card';

export default function CartoesPage() {
  const { creditCards, loading, error, createCreditCard, updateCreditCard, deleteCreditCard } = useCreditCards();
  
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedCreditCard, setSelectedCreditCard] = useState<CreditCard | undefined>();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [creditCardToDelete, setCreditCardToDelete] = useState<CreditCard | undefined>();
  const [formLoading, setFormLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleOpenCreateModal = () => {
    setSelectedCreditCard(undefined);
    setFormModalOpen(true);
  };

  const handleOpenEditModal = (creditCard: CreditCard) => {
    setSelectedCreditCard(creditCard);
    setFormModalOpen(true);
  };

  const handleCloseModal = () => {
    setFormModalOpen(false);
    setSelectedCreditCard(undefined);
  };

  const handleSubmit = async (data: CreateCreditCardData | UpdateCreditCardData) => {
    try {
      setFormLoading(true);
      
      if (selectedCreditCard) {
        await updateCreditCard(selectedCreditCard.id, data as UpdateCreditCardData);
        setSnackbar({
          open: true,
          message: 'Cartão atualizado com sucesso!',
          severity: 'success'
        });
      } else {
        await createCreditCard(data as CreateCreditCardData);
        setSnackbar({
          open: true,
          message: 'Cartão criado com sucesso!',
          severity: 'success'
        });
      }
      
      handleCloseModal();
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || 'Erro ao salvar cartão',
        severity: 'error'
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleOpenDeleteModal = (creditCard: CreditCard) => {
    setCreditCardToDelete(creditCard);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setCreditCardToDelete(undefined);
  };

  const handleDelete = async () => {
    if (!creditCardToDelete) return;

    try {
      await deleteCreditCard(creditCardToDelete.id);
      setSnackbar({
        open: true,
        message: 'Cartão excluído com sucesso!',
        severity: 'success'
      });
      handleCloseDeleteModal();
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || 'Erro ao excluir cartão',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Cartões de Crédito"
        description="Gerencie seus cartões de crédito e acompanhe os limites"
        buttonText="Novo Cartão"
        buttonIcon={<Add />}
        onButtonClick={handleOpenCreateModal}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {creditCards.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CreditCardIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Nenhum cartão cadastrado
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Adicione seu primeiro cartão de crédito para começar a controlar seus gastos.
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenCreateModal}
          >
            Adicionar Cartão
          </Button>
        </Paper>
      ) : (
        <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(350px, 1fr))" gap={3}>
          {creditCards.map((creditCard) => (
            <Box key={creditCard.id}>
              <CreditCardCardWithStats
                creditCard={creditCard}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
              />
            </Box>
          ))}
        </Box>
      )}

      {/* Floating Action Button para adicionar cartão */}
      <Fab
        color="primary"
        aria-label="adicionar cartão"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
        onClick={handleOpenCreateModal}
      >
        <Add />
      </Fab>

      {/* Modal de Formulário */}
      <CreditCardFormModal
        open={formModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        creditCard={selectedCreditCard}
        loading={formLoading}
      />

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={deleteModalOpen} onClose={handleCloseDeleteModal}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir o cartão &quot;{creditCardToDelete?.name}&quot;?
            Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

function CreditCardCardWithStats({ 
  creditCard, 
  onEdit, 
  onDelete 
}: { 
  creditCard: CreditCard;
  onEdit: (creditCard: CreditCard) => void;
  onDelete: (creditCard: CreditCard) => void;
}) {
  const { stats } = useCreditCardStats(creditCard.id);

  return (
    <CreditCardCard
      creditCard={creditCard}
      onEdit={onEdit}
      onDelete={onDelete}
      stats={stats}
    />
  );
}