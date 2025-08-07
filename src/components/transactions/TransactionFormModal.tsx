import {
  Modal,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  InputAdornment,
  Divider,
  Autocomplete
} from '@mui/material';
import { AttachMoney, Close } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Transaction, CreateTransactionData, UpdateTransactionData } from '../../types/transaction';
import { Category } from '../../types/category';

const schema = yup.object({
  description: yup.string().required('Descrição é obrigatória'),
  amount: yup.number().min(0.01, 'Valor deve ser maior que zero').required('Valor é obrigatório'),
  date: yup.string().required('Data é obrigatória'),
  categoryId: yup.string().required('Categoria é obrigatória'),
  accountId: yup.string().when('creditCardId', {
    is: (value: string) => !value,
    then: (schema) => schema.required('Conta é obrigatória quando não há cartão selecionado'),
    otherwise: (schema) => schema.notRequired()
  }),
  isPaid: yup.boolean().default(false),
  installments: yup.number().min(1).max(999).nullable(),
  creditCardId: yup.string().nullable()
});

interface TransactionFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTransactionData | UpdateTransactionData) => Promise<void>;
  transaction?: Transaction;
  loading?: boolean;
  error?: string;
  type: 'INCOME' | 'EXPENSE';
  categories?: Category[];
  accounts?: Array<{ id: string; name: string }>;
  creditCards?: Array<{ id: string; name: string }>;
}

export default function TransactionFormModal({
  open,
  onClose,
  onSubmit,
  transaction,
  loading = false,
  error,
  type,
  categories = [],
  accounts = [],
  creditCards = []
}: TransactionFormModalProps) {
  const isEditing = !!transaction;

  const formatCurrency = (value: number | string) => {
    let amount = 0;
    if (typeof value === 'string') {
      const clean = value.replace(/[^\d,]/g, '').replace(',', '.');
      amount = Number(clean);
    } else {
      amount = value;
    }
    if (isNaN(amount)) amount = 0;
    return amount.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const parseCurrency = (value: string | number) => {
    if (typeof value === 'number') return value;
    if (!value) return 0;
    return Number(value.replace(/\./g, '').replace(',', '.')) || 0;
  };

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      description: transaction?.description || '',
      amount: transaction?.amount || 0,
      date: transaction?.date ? transaction.date.split('T')[0] : new Date().toISOString().split('T')[0],
      categoryId: transaction?.categoryId || '',
      accountId: transaction?.accountId || '',
      creditCardId: transaction?.creditCardId || '',
      isPaid: transaction?.isPaid || false,
      installments: transaction?.installments || null
    }
  });

  const watchCreditCard = watch('creditCardId');

  const handleFormSubmit = async (data: any) => {
    const formData = {
      ...data,
      type,
      amount: typeof data.amount === 'string' ? parseCurrency(data.amount) : data.amount,
      installments: data.installments || undefined,
      creditCardId: data.creditCardId || undefined,
      accountId: watchCreditCard ? undefined : data.accountId
    };

    await onSubmit(formData);
  };
  const getFilteredCategories = () => {
    return categories.filter(cat => cat.type === type);
  };

  const getTitle = () => {
    const typeLabel = type === 'INCOME' ? 'Receita' : 'Despesa';
    return isEditing ? `Editar ${typeLabel}` : `Nova ${typeLabel}`;
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Paper
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '95%', sm: 500 },
          maxHeight: '90vh',
          overflow: 'auto',
          p: 3
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5">
            {getTitle()}
          </Typography>
          <Button
            onClick={onClose}
            color="inherit"
            size="small"
            sx={{ minWidth: 'auto', p: 0.5 }}
          >
            <Close />
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Box display="flex" flexDirection="column" gap={3}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Descrição"
                  fullWidth
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  placeholder={`Ex: ${type === 'INCOME' ? 'Salário, Freelance' : 'Supermercado, Combustível'}`}
                />
              )}
            />

            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Valor"
                  fullWidth
                  error={!!errors.amount}
                  helperText={errors.amount?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney />
                      </InputAdornment>
                    )
                  }}
                  value={formatCurrency(field.value)}
                  onChange={(e) => {
                    const numericValue = parseCurrency(e.target.value);
                    field.onChange(numericValue);
                  }}
                  placeholder="0,00"
                />
              )}
            />

            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="date"
                  label="Data"
                  fullWidth
                  error={!!errors.date}
                  helperText={errors.date?.message}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />

            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => {
                const selectedCategory = getFilteredCategories().find(cat => cat.id === field.value) || null;
                
                return (
                  <Autocomplete
                    value={selectedCategory}
                    onChange={(_, newValue) => {
                      field.onChange(newValue?.id || '');
                    }}
                    options={getFilteredCategories()}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderOption={(props, option) => (
                      <Box component="li" {...props} display="flex" alignItems="center" gap={1}>
                        {option.color && (
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              backgroundColor: option.color,
                              borderRadius: '50%'
                            }}
                          />
                        )}
                        <Box>
                          <Typography>{option.name}</Typography>
                          {option.description && (
                            <Typography variant="caption" color="text.secondary">
                              {option.description}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Categoria"
                        error={!!errors.categoryId}
                        helperText={errors.categoryId?.message || `${getFilteredCategories().length} categoria(s) disponível(is)`}
                        placeholder="Busque ou selecione uma categoria"
                      />
                    )}
                    noOptionsText={
                      <Box textAlign="center" py={1}>
                        <Typography variant="body2" color="text.secondary">
                          Nenhuma categoria encontrada
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Vá em Categorias para criar novas categorias
                        </Typography>
                      </Box>
                    }
                    fullWidth
                  />
                );
              }}
            />

            {/* Só exibe método de pagamento e parcelas se for despesa */}
            {type === 'EXPENSE' && (
              <>
                <Divider />
                <Typography variant="subtitle1" color="primary">
                  Método de Pagamento
                </Typography>
                <Controller
                  name="creditCardId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Cartão de Crédito (Opcional)</InputLabel>
                      <Select
                        {...field}
                        label="Cartão de Crédito (Opcional)"
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          if (e.target.value) {
                            setValue('accountId', '');
                          }
                        }}
                      >
                        <MenuItem value="">Nenhum</MenuItem>
                        {creditCards.map((card) => (
                          <MenuItem key={card.id} value={card.id}>
                            {card.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />

                {!watchCreditCard && (
                  <Controller
                    name="accountId"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.accountId}>
                        <InputLabel>Conta</InputLabel>
                        <Select {...field} label="Conta">
                          {accounts.map((account) => (
                            <MenuItem key={account.id} value={account.id}>
                              {account.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.accountId && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5, mx: 1.75 }}>
                            {errors.accountId.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                )}

                <Divider />
                <Typography variant="subtitle1" color="primary">
                  Opções Avançadas
                </Typography>
                <Controller
                  name="installments"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Número de Parcelas (Opcional)"
                      fullWidth
                      inputProps={{ min: 1, max: 999 }}
                      helperText="Deixe vazio para transação única"
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                    />
                  )}
                />
              </>
            )}

            {/* Para receitas, sempre exibe o campo de conta */}
            {type === 'INCOME' && (
              <Controller
                name="accountId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.accountId}>
                    <InputLabel>Conta</InputLabel>
                    <Select {...field} label="Conta">
                      {accounts.map((account) => (
                        <MenuItem key={account.id} value={account.id}>
                          {account.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.accountId && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, mx: 1.75 }}>
                        {errors.accountId.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            )}

            <Controller
              name="isPaid"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={field.onChange}
                      color={type === 'INCOME' ? 'success' : 'primary'}
                    />
                  }
                  label={type === 'INCOME' ? 'Receita já recebida' : 'Despesa já paga'}
                />
              )}
            />

            <Box display="flex" gap={2} justifyContent="flex-end" mt={2}>
              <Button
                variant="outlined"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16} /> : undefined}
              >
                {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Modal>
  );
}
