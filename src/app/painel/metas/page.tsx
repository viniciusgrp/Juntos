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
  CircularProgress,
  Alert,
  Fab
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp as TrendingUpIcon,
  Flag as FlagIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material'
import PageHeader from '@/components/ui/page-header'
import { useGoals, useCreateGoal, useUpdateGoal, useDeleteGoal, useAddProgress } from '@/hooks/use-goals'
import { Goal, CreateGoalData, UpdateGoalData } from '@/types/goal'
import { useForm, Controller } from 'react-hook-form'

export default function GoalsPage() {
  const [openDialog, setOpenDialog] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [progressDialogId, setProgressDialogId] = useState<string | null>(null)
  const [progressAmount, setProgressAmount] = useState('')

  const { data: goals, isLoading, error } = useGoals()
  const createGoal = useCreateGoal()
  const updateGoal = useUpdateGoal()
  const deleteGoal = useDeleteGoal()
  const addProgress = useAddProgress()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateGoalData | UpdateGoalData>({
    defaultValues: {
      title: '',
      description: '',
      targetAmount: 0,
      targetDate: ''
    }
  })

  const handleOpenDialog = (goal?: Goal) => {
    if (goal) {
      setEditingGoal(goal)
      reset({
        title: goal.title,
        description: goal.description || '',
        targetAmount: goal.targetAmount,
        targetDate: goal.targetDate.split('T')[0] // Converter para formato YYYY-MM-DD
      })
    } else {
      setEditingGoal(null)
      reset({
        title: '',
        description: '',
        targetAmount: 0,
        targetDate: ''
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingGoal(null)
    reset()
  }

  const onSubmit = async (data: CreateGoalData | UpdateGoalData) => {
    try {
      // Converter targetAmount para número
      const formattedData = {
        ...data,
        targetAmount: Number(data.targetAmount)
      }

      if (editingGoal) {
        await updateGoal.mutateAsync({
          id: editingGoal.id,
          data: formattedData as UpdateGoalData
        })
      } else {
        await createGoal.mutateAsync(formattedData as CreateGoalData)
      }
      handleCloseDialog()
    } catch {
      // Error é tratado pelos hooks
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteGoal.mutateAsync(id)
      setDeleteConfirmId(null)
    } catch {
      // Error é tratado pelo hook
    }
  }

  const handleAddProgress = async () => {
    if (!progressDialogId || !progressAmount) return

    try {
      await addProgress.mutateAsync({
        id: progressDialogId,
        amount: Number(progressAmount)
      })
      setProgressDialogId(null)
      setProgressAmount('')
    } catch {
      // Error é tratado pelo hook
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'success'
    if (percentage >= 75) return 'info'
    if (percentage >= 50) return 'warning'
    return 'error'
  }

  const getDaysRemaining = (targetDate: string) => {
    const today = new Date()
    const target = new Date(targetDate)
    const diffTime = target.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getDateStatus = (targetDate: string) => {
    const days = getDaysRemaining(targetDate)
    if (days < 0) return { text: 'Vencida', color: 'error' }
    if (days === 0) return { text: 'Hoje', color: 'warning' }
    if (days <= 30) return { text: `${days} dias`, color: 'warning' }
    return { text: `${days} dias`, color: 'success' }
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
          Erro ao carregar metas. Tente novamente.
        </Alert>
      </Box>
    )
  }

  return (
    <Box>
      <PageHeader
        title="Metas Financeiras"
        description="Defina e acompanhe suas metas de economia"
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nova Meta
        </Button>
      </PageHeader>

      <Box p={3}>
        {goals && goals.length === 0 ? (
          <Box textAlign="center" py={8}>
            <FlagIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nenhuma meta encontrada
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Crie sua primeira meta financeira para começar a poupar com objetivo
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Criar Primeira Meta
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 3 }}>
            {goals?.map((goal) => {
              const percentage = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0
              const remaining = goal.targetAmount - goal.currentAmount
              const isCompleted = goal.currentAmount >= goal.targetAmount
              const dateStatus = getDateStatus(goal.targetDate)

              return (
                <Card key={goal.id} sx={{ height: 'fit-content' }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box flex={1}>
                        <Typography variant="h6" gutterBottom>
                          {goal.title}
                        </Typography>
                        {goal.description && (
                          <Typography variant="body2" color="text.secondary" mb={1}>
                            {goal.description}
                          </Typography>
                        )}
                        <Box display="flex" gap={1} flexWrap="wrap">
                          <Chip
                            icon={<CalendarIcon />}
                            label={formatDate(goal.targetDate)}
                            size="small"
                            color={dateStatus.color as any}
                            variant="outlined"
                          />
                          <Chip
                            icon={<TimeIcon />}
                            label={dateStatus.text}
                            size="small"
                            color={dateStatus.color as any}
                            variant="outlined"
                          />
                          {isCompleted && (
                            <Chip
                              icon={<CheckIcon />}
                              label="Concluída"
                              size="small"
                              color="success"
                            />
                          )}
                        </Box>
                      </Box>
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(goal)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteConfirmId(goal.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>

                    <Box mb={2}>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2" color="text.secondary">
                          Meta
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {formatCurrency(goal.targetAmount)}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2" color="text.secondary">
                          Alcançado
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" color="success.main">
                          {formatCurrency(goal.currentAmount)}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography
                          variant="body2"
                          color={isCompleted ? 'success.main' : 'text.secondary'}
                        >
                          {isCompleted ? 'Meta Atingida!' : 'Falta'}
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          color={isCompleted ? 'success.main' : 'warning.main'}
                        >
                          {isCompleted ? '🎉' : formatCurrency(remaining)}
                        </Typography>
                      </Box>

                      <LinearProgress
                        variant="determinate"
                        value={Math.min(percentage, 100)}
                        color={getProgressColor(percentage)}
                        sx={{ height: 8, borderRadius: 1, mb: 1 }}
                      />
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" color="text.secondary">
                          {percentage.toFixed(1)}% concluído
                        </Typography>
                        <Button
                          size="small"
                          startIcon={<TrendingUpIcon />}
                          onClick={() => setProgressDialogId(goal.id)}
                          disabled={isCompleted}
                        >
                          Adicionar
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )
            })}
          </Box>
        )}

        {/* FAB para mobile */}
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            display: { xs: 'flex', sm: 'none' }
          }}
          onClick={() => handleOpenDialog()}
        >
          <AddIcon />
        </Fab>

        {/* Dialog para criar/editar meta */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle>
              {editingGoal ? 'Editar Meta' : 'Nova Meta'}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: 'Título é obrigatório' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Título da Meta"
                      fullWidth
                      error={!!errors.title}
                      helperText={errors.title?.message}
                    />
                  )}
                />
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Descrição (opcional)"
                      fullWidth
                      multiline
                      rows={2}
                    />
                  )}
                />
                <Controller
                  name="targetAmount"
                  control={control}
                  rules={{
                    required: 'Valor da meta é obrigatório',
                    min: { value: 0.01, message: 'Valor deve ser maior que zero' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Valor da Meta"
                      type="number"
                      fullWidth
                      inputProps={{ step: '0.01', min: '0' }}
                      error={!!errors.targetAmount}
                      helperText={errors.targetAmount?.message}
                    />
                  )}
                />
                <Controller
                  name="targetDate"
                  control={control}
                  rules={{ required: 'Data alvo é obrigatória' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Data Alvo"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ min: new Date().toISOString().split('T')[0] }}
                      error={!!errors.targetDate}
                      helperText={errors.targetDate?.message}
                    />
                  )}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancelar</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={createGoal.isPending || updateGoal.isPending}
              >
                {editingGoal ? 'Atualizar' : 'Criar'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Dialog para adicionar progresso */}
        <Dialog
          open={!!progressDialogId}
          onClose={() => {
            setProgressDialogId(null)
            setProgressAmount('')
          }}
        >
          <DialogTitle>Adicionar Progresso</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Valor a adicionar"
              type="number"
              fullWidth
              variant="outlined"
              value={progressAmount}
              onChange={(e) => setProgressAmount(e.target.value)}
              inputProps={{ step: '0.01', min: '0' }}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setProgressDialogId(null)
              setProgressAmount('')
            }}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleAddProgress}
              disabled={addProgress.isPending || !progressAmount}
            >
              Adicionar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog de confirmação de exclusão */}
        <Dialog
          open={!!deleteConfirmId}
          onClose={() => setDeleteConfirmId(null)}
        >
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogContent>
            <Typography>
              Tem certeza que deseja excluir esta meta? Esta ação não pode ser desfeita.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmId(null)}>Cancelar</Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              disabled={deleteGoal.isPending}
            >
              Excluir
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}
