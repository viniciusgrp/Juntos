'use client'

import { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalanceWallet as WalletIcon
} from '@mui/icons-material'
import PageHeader from '@/components/ui/page-header'
import { useBudgets, useCreateBudget, useUpdateBudget, useDeleteBudget } from '@/hooks/use-budgets'
import { Budget, CreateBudgetData, UpdateBudgetData } from '@/types/budget'
import { useForm, Controller } from 'react-hook-form'

const MONTHS = [
  { value: 1, label: 'Janeiro' },
  { value: 2, label: 'Fevereiro' },
  { value: 3, label: 'Março' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Maio' },
  { value: 6, label: 'Junho' },
  { value: 7, label: 'Julho' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Setembro' },
  { value: 10, label: 'Outubro' },
  { value: 11, label: 'Novembro' },
  { value: 12, label: 'Dezembro' }
]

const YEARS = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 2 + i)

export default function BudgetsPage() {
  const [openDialog, setOpenDialog] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const { data: budgets, isLoading, error } = useBudgets()
  const createBudget = useCreateBudget()
  const updateBudget = useUpdateBudget()
  const deleteBudget = useDeleteBudget()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateBudgetData | UpdateBudgetData>({
    defaultValues: {
      name: '',
      amount: 0,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    }
  })

  const handleOpenDialog = (budget?: Budget) => {
    if (budget) {
      setEditingBudget(budget)
      reset({
        name: budget.name,
        amount: budget.amount,
        month: budget.month,
        year: budget.year
      })
    } else {
      setEditingBudget(null)
      reset({
        name: '',
        amount: 0,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingBudget(null)
    reset()
  }

  const onSubmit = async (data: CreateBudgetData | UpdateBudgetData) => {
    try {
      // Converter amount para número
      const formattedData = {
        ...data,
        amount: Number(data.amount)
      }

      if (editingBudget) {
        await updateBudget.mutateAsync({
          id: editingBudget.id,
          data: formattedData as UpdateBudgetData
        })
      } else {
        await createBudget.mutateAsync(formattedData as CreateBudgetData)
      }
      handleCloseDialog()
    } catch {
      // Error é tratado pelos hooks
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteBudget.mutateAsync(id)
      setDeleteConfirmId(null)
    } catch {
      // Error é tratado pelo hook
    }
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'error'
    if (percentage >= 80) return 'warning'
    if (percentage >= 60) return 'info'
    return 'success'
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getMonthName = (month: number) => {
    return MONTHS.find(m => m.value === month)?.label || ''
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">
          Erro ao carregar orçamentos. Tente novamente.
        </Alert>
      </Box>
    )
  }

  return (
    <Box>
      <PageHeader
        title="Orçamentos"
        description="Gerencie seus orçamentos mensais"
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Novo Orçamento
        </Button>
      </PageHeader>

      <Box p={3}>
        {budgets && budgets.length === 0 ? (
          <Box textAlign="center" py={8}>
            <WalletIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nenhum orçamento encontrado
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Crie seu primeiro orçamento para controlar seus gastos mensais
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Criar Primeiro Orçamento
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 3 }}>
            {budgets?.map((budget) => {
              const percentage = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0
              const remaining = budget.amount - budget.spent

              return (
                <Card key={budget.id}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {budget.name}
                        </Typography>
                        <Chip
                          label={`${getMonthName(budget.month)} ${budget.year}`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(budget)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteConfirmId(budget.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>

                    <Box mb={2}>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2" color="text.secondary">
                          Orçado
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {formatCurrency(budget.amount)}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2" color="text.secondary">
                          Gasto
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {formatCurrency(budget.spent)}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography
                          variant="body2"
                          color={remaining >= 0 ? 'success.main' : 'error.main'}
                        >
                          {remaining >= 0 ? 'Restante' : 'Excedente'}
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          color={remaining >= 0 ? 'success.main' : 'error.main'}
                        >
                          {formatCurrency(Math.abs(remaining))}
                        </Typography>
                      </Box>

                      <LinearProgress
                        variant="determinate"
                        value={Math.min(percentage, 100)}
                        color={getProgressColor(percentage)}
                        sx={{ height: 8, borderRadius: 1 }}
                      />
                      <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                        <Typography variant="body2" color="text.secondary">
                          {percentage.toFixed(1)}% utilizado
                        </Typography>
                        {percentage >= 100 ? (
                          <TrendingUpIcon color="error" fontSize="small" />
                        ) : (
                          <TrendingDownIcon color="success" fontSize="small" />
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )
            })}
          </Box>
        )}

        {/* Dialog para criar/editar orçamento */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle>
              {editingBudget ? 'Editar Orçamento' : 'Novo Orçamento'}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: 'Nome é obrigatório' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nome do Orçamento"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />
                <Controller
                  name="amount"
                  control={control}
                  rules={{
                    required: 'Valor é obrigatório',
                    min: { value: 0.01, message: 'Valor deve ser maior que zero' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Valor do Orçamento"
                      type="number"
                      fullWidth
                      inputProps={{ step: '0.01', min: '0' }}
                      error={!!errors.amount}
                      helperText={errors.amount?.message}
                    />
                  )}
                />
                {!editingBudget && (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl fullWidth>
                      <InputLabel>Mês</InputLabel>
                      <Controller
                        name="month"
                        control={control}
                        rules={{ required: 'Mês é obrigatório' }}
                        render={({ field }) => (
                          <Select {...field} label="Mês">
                            {MONTHS.map((month) => (
                              <MenuItem key={month.value} value={month.value}>
                                {month.label}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel>Ano</InputLabel>
                      <Controller
                        name="year"
                        control={control}
                        rules={{ required: 'Ano é obrigatório' }}
                        render={({ field }) => (
                          <Select {...field} label="Ano">
                            {YEARS.map((year) => (
                              <MenuItem key={year} value={year}>
                                {year}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                    </FormControl>
                  </Box>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancelar</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={createBudget.isPending || updateBudget.isPending}
              >
                {editingBudget ? 'Atualizar' : 'Criar'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Dialog de confirmação de exclusão */}
        <Dialog
          open={!!deleteConfirmId}
          onClose={() => setDeleteConfirmId(null)}
        >
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogContent>
            <Typography>
              Tem certeza que deseja excluir este orçamento? Esta ação não pode ser desfeita.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmId(null)}>Cancelar</Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              disabled={deleteBudget.isPending}
            >
              Excluir
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}
