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
  Alert
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect } from 'react';
import { Account, CreateAccountData, UpdateAccountData, ACCOUNT_TYPES } from '../../types/account';

interface AccountFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAccountData | UpdateAccountData) => void;
  account?: Account;
  loading?: boolean;
  error?: string;
}

const schema = yup.object({
  name: yup
    .string()
    .required('Nome da conta é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome não pode ter mais de 100 caracteres'),
  type: yup
    .string()
    .oneOf(['checking', 'savings', 'investment', 'cash'], 'Tipo de conta inválido')
    .required('Tipo da conta é obrigatório'),
  balance: yup
    .number()
    .transform((value, original) => (original === '' ? 0 : value))
    .min(0, 'Saldo não pode ser negativo')
    .default(0)
});

type FormData = yup.InferType<typeof schema>;

const AccountFormModal = ({
  open,
  onClose,
  onSubmit,
  account,
  loading = false,
  error
}: AccountFormModalProps) => {
  const isEditing = !!account;

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    
    const centavos = parseInt(numericValue || '0');
    
    const reais = centavos / 100;
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(reais);
  };

  const parseCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    return parseInt(numericValue || '0') / 100;
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: account?.name || '',
      type: account?.type || 'checking',
      balance: account?.balance || 0
    }
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data);
  };

  useEffect(() => {
    if (account) {
      reset({
        name: account.name,
        type: account.type,
        balance: account.balance
      });
    } else {
      reset({
        name: '',
        type: 'checking',
        balance: 0
      });
    }
  }, [account, reset]);

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
        {isEditing ? 'Editar Conta' : 'Nova Conta'}
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
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nome da Conta"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  placeholder="Ex: Conta Corrente Banco XYZ"
                />
              )}
            />

            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.type}>
                  <InputLabel>Tipo de Conta</InputLabel>
                  <Select
                    {...field}
                    label="Tipo de Conta"
                  >
                    {Object.entries(ACCOUNT_TYPES).map(([value, label]) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.type && (
                    <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                      {errors.type.message}
                    </Box>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="balance"
              control={control}
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <TextField
                  {...fieldProps}
                  label="Saldo Inicial"
                  fullWidth
                  error={!!errors.balance}
                  helperText={errors.balance?.message}
                  value={formatCurrency(String(value * 100))}
                  onChange={(e) => {
                    const numericValue = parseCurrency(e.target.value);
                    onChange(numericValue);
                  }}
                  placeholder="R$ 0,00"
                />
              )}
            />
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
            {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AccountFormModal;
