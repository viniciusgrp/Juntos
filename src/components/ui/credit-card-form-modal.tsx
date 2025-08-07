'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  InputAdornment,
  MenuItem
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { CreditCard, CreateCreditCardData, UpdateCreditCardData } from '../../types/credit-card';

interface CreditCardFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCreditCardData | UpdateCreditCardData) => void;
  creditCard?: CreditCard;
  loading?: boolean;
}

type FormData = {
  name: string;
  limit: number;
  closeDate: number;
  dueDate: number;
};

export default function CreditCardFormModal({
  open,
  onClose,
  onSubmit,
  creditCard,
  loading = false
}: CreditCardFormModalProps) {
  const isEditing = !!creditCard;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      name: creditCard?.name || '',
      limit: creditCard?.limit || 0,
      closeDate: creditCard?.closeDate || 1,
      dueDate: creditCard?.dueDate || 1
    }
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: FormData) => {
    const formattedData = {
      ...data,
      limit: Number(data.limit),
      closeDate: Number(data.closeDate),
      dueDate: Number(data.dueDate)
    };
    onSubmit(formattedData);
  };

  React.useEffect(() => {
    if (creditCard) {
      reset({
        name: creditCard.name,
        limit: creditCard.limit,
        closeDate: creditCard.closeDate,
        dueDate: creditCard.dueDate
      });
    } else {
      reset({
        name: '',
        limit: 0,
        closeDate: 1,
        dueDate: 1
      });
    }
  }, [creditCard, reset]);

  const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditing ? 'Editar Cartão de Crédito' : 'Novo Cartão de Crédito'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3}>
            <Controller
              name="name"
              control={control}
              rules={{ 
                required: 'Nome é obrigatório',
                minLength: { value: 2, message: 'Nome deve ter pelo menos 2 caracteres' }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nome do Cartão"
                  placeholder="Ex: Cartão Nubank, Visa Platinum..."
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="limit"
              control={control}
              rules={{ 
                required: 'Limite é obrigatório',
                min: { value: 1, message: 'Limite deve ser maior que zero' }
              }}
              render={({ field: { onChange, value, ...field } }) => (
                <TextField
                  {...field}
                  value={value}
                  onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                  label="Limite"
                  type="number"
                  error={!!errors.limit}
                  helperText={errors.limit?.message}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                    inputProps: { min: 0, step: 0.01 }
                  }}
                  fullWidth
                />
              )}
            />

            <Box display="flex" gap={2}>
              <Controller
                name="closeDate"
                control={control}
                rules={{ 
                  required: 'Dia de fechamento é obrigatório',
                  min: { value: 1, message: 'Dia deve estar entre 1 e 31' },
                  max: { value: 31, message: 'Dia deve estar entre 1 e 31' }
                }}
                render={({ field: { onChange, value, ...field } }) => (
                  <TextField
                    {...field}
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value) || 1)}
                    select
                    label="Dia de Fechamento"
                    error={!!errors.closeDate}
                    helperText={errors.closeDate?.message}
                    fullWidth
                  >
                    {dayOptions.map((day) => (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Controller
                name="dueDate"
                control={control}
                rules={{ 
                  required: 'Dia de vencimento é obrigatório',
                  min: { value: 1, message: 'Dia deve estar entre 1 e 31' },
                  max: { value: 31, message: 'Dia deve estar entre 1 e 31' }
                }}
                render={({ field: { onChange, value, ...field } }) => (
                  <TextField
                    {...field}
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value) || 1)}
                    select
                    label="Dia de Vencimento"
                    error={!!errors.dueDate}
                    helperText={errors.dueDate?.message}
                    fullWidth
                  >
                    {dayOptions.map((day) => (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Box>

            <Box mt={1}>
              <Typography variant="body2" color="text.secondary">
                * O dia de fechamento é quando a fatura fecha e o dia de vencimento é quando você deve pagar.
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
