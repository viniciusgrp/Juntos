import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  InputAdornment,
  Typography
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect } from 'react';
import { Account } from '../../types/account';

interface TransferData {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description?: string;
}

interface TransferModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TransferData) => void;
  accounts: Account[];
  loading?: boolean;
  error?: string;
}

const schema = yup.object({
  fromAccountId: yup
    .string()
    .required('Conta de origem é obrigatória'),
  toAccountId: yup
    .string()
    .required('Conta de destino é obrigatória')
    .test('different-accounts', 'Conta de destino deve ser diferente da origem', function(value) {
      return value !== this.parent.fromAccountId;
    }),
  amount: yup
    .number()
    .required('Valor é obrigatório')
    .positive('Valor deve ser positivo')
    .test('sufficient-balance', 'Saldo insuficiente', function(value) {
      const { fromAccountId } = this.parent;
      const { accounts } = this.options.context || {};
      const account = accounts?.find((acc: Account) => acc.id === fromAccountId);
      return account ? value <= account.balance : true;
    }),
  description: yup
    .string()
    .optional()
    .max(255, 'Descrição não pode ter mais de 255 caracteres')
});

const TransferModal = ({
  open,
  onClose,
  onSubmit,
  accounts,
  loading = false,
  error
}: TransferModalProps) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    context: { accounts },
    defaultValues: {
      fromAccountId: '',
      toAccountId: '',
      amount: 0,
      description: ''
    }
  });

  const selectedFromAccount = watch('fromAccountId');
  const fromAccount = accounts.find(acc => acc.id === selectedFromAccount);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: any) => {
    onSubmit(data as TransferData);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  useEffect(() => {
    if (open) {
      reset({
        fromAccountId: '',
        toAccountId: '',
        amount: 0,
        description: ''
      });
    }
  }, [open, reset]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        Transferir entre Contas
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ 
            display: 'grid', 
            gap: 2,
            mt: 1 
          }}>
            <Controller
              name="fromAccountId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.fromAccountId}>
                  <InputLabel>Conta de Origem</InputLabel>
                  <Select
                    {...field}
                    label="Conta de Origem"
                  >
                    {accounts.map((account) => (
                      <MenuItem key={account.id} value={account.id}>
                        {account.name} - {formatCurrency(account.balance)}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.fromAccountId && (
                    <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                      {errors.fromAccountId.message}
                    </Box>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="toAccountId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.toAccountId}>
                  <InputLabel>Conta de Destino</InputLabel>
                  <Select
                    {...field}
                    label="Conta de Destino"
                  >
                    {accounts
                      .filter(account => account.id !== selectedFromAccount)
                      .map((account) => (
                        <MenuItem key={account.id} value={account.id}>
                          {account.name} - {formatCurrency(account.balance)}
                        </MenuItem>
                      ))}
                  </Select>
                  {errors.toAccountId && (
                    <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                      {errors.toAccountId.message}
                    </Box>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Valor"
                  type="number"
                  fullWidth
                  error={!!errors.amount}
                  helperText={errors.amount?.message}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                    inputProps: { 
                      min: 0.01, 
                      step: 0.01 
                    }
                  }}
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
                  rows={3}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  placeholder="Descrição da transferência..."
                />
              )}
            />

            {fromAccount && (
              <Box sx={{ 
                p: 2, 
                bgcolor: 'grey.50', 
                borderRadius: 1,
                mt: 1 
              }}>
                <Typography variant="body2" color="text.secondary">
                  Saldo disponível: {formatCurrency(fromAccount.balance)}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Transferindo...' : 'Transferir'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TransferModal;
