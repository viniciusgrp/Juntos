import {
  Paper,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  IconButton,
  Typography,
  Collapse,
  InputAdornment,
  Switch,
  FormControlLabel
} from '@mui/material';
import { ExpandMore, ExpandLess, FilterList, Clear, Search, AttachMoney } from '@mui/icons-material';
import { useState } from 'react';

interface TransactionFilters {
  type?: 'INCOME' | 'EXPENSE';
  categoryId?: string;
  accountId?: string;
  creditCardId?: string;
  description?: string;
  isPaid?: boolean;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

interface TransactionFiltersProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
  onClearFilters: () => void;
  categories?: Array<{ id: string; name: string; type: 'INCOME' | 'EXPENSE'; color?: string; description?: string; isActive?: boolean; userId: string; createdAt: string; updatedAt: string; }>;
  accounts?: Array<{ id: string; name: string }>;
  creditCards?: Array<{ id: string; name: string }>;
  hideTypeFilter?: boolean;
}

export default function TransactionFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  categories = [],
  accounts = [],
  creditCards = [],
  hideTypeFilter = false
}: TransactionFiltersProps) {
  const [expanded, setExpanded] = useState(false);

  const handleFilterChange = (key: keyof TransactionFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value === '' ? undefined : value
    });
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    const amount = Number(numbers) / 100;
    
    return amount || undefined;
  };

  const getFilteredCategories = () => {
    if (!filters.type) return categories;
    return categories.filter(cat => cat.type === filters.type);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== ''
  );

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" gap={1}>
          <FilterList color="primary" />
          <Typography variant="h6">
            Filtros
          </Typography>
          {hasActiveFilters && (
            <Typography variant="body2" color="primary">
              ({Object.values(filters).filter(v => v !== undefined && v !== '').length} aplicados)
            </Typography>
          )}
        </Box>
        
        <Box display="flex" gap={1}>
          {hasActiveFilters && (
            <Button
              size="small"
              startIcon={<Clear />}
              onClick={onClearFilters}
              color="secondary"
            >
              Limpar
            </Button>
          )}
          <IconButton
            onClick={() => setExpanded(!expanded)}
            size="small"
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Box 
          sx={{ 
            mt: 3,
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)'
            },
            gap: 2 
          }}
        >
          {!hideTypeFilter && (
            <FormControl size="small">
              <InputLabel>Tipo</InputLabel>
              <Select
                value={filters.type || ''}
                label="Tipo"
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="INCOME">Receitas</MenuItem>
                <MenuItem value="EXPENSE">Despesas</MenuItem>
              </Select>
            </FormControl>
          )}

          <FormControl size="small">
            <InputLabel>Categoria</InputLabel>
            <Select
              value={filters.categoryId || ''}
              label="Categoria"
              onChange={(e) => handleFilterChange('categoryId', e.target.value)}
            >
              <MenuItem value="">Todas</MenuItem>
              {getFilteredCategories().map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small">
            <InputLabel>Conta</InputLabel>
            <Select
              value={filters.accountId || ''}
              label="Conta"
              onChange={(e) => handleFilterChange('accountId', e.target.value)}
            >
              <MenuItem value="">Todas</MenuItem>
              {accounts.map((account) => (
                <MenuItem key={account.id} value={account.id}>
                  {account.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small">
            <InputLabel>Cartão</InputLabel>
            <Select
              value={filters.creditCardId || ''}
              label="Cartão"
              onChange={(e) => handleFilterChange('creditCardId', e.target.value)}
            >
              <MenuItem value="">Nenhum/Todos</MenuItem>
              {creditCards.map((card) => (
                <MenuItem key={card.id} value={card.id}>
                  {card.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            size="small"
            label="Buscar descrição"
            value={filters.description || ''}
            onChange={(e) => handleFilterChange('description', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
          />

          <TextField
            size="small"
            type="date"
            label="Data inicial"
            value={filters.startDate || ''}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            size="small"
            type="date"
            label="Data final"
            value={filters.endDate || ''}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            size="small"
            label="Valor mínimo"
            value={filters.minAmount ? `R$ ${filters.minAmount.toFixed(2).replace('.', ',')}` : ''}
            onChange={(e) => {
              const value = formatCurrency(e.target.value);
              handleFilterChange('minAmount', value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoney />
                </InputAdornment>
              )
            }}
            placeholder="R$ 0,00"
          />

          <TextField
            size="small"
            label="Valor máximo"
            value={filters.maxAmount ? `R$ ${filters.maxAmount.toFixed(2).replace('.', ',')}` : ''}
            onChange={(e) => {
              const value = formatCurrency(e.target.value);
              handleFilterChange('maxAmount', value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoney />
                </InputAdornment>
              )
            }}
            placeholder="R$ 0,00"
          />

          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={filters.isPaid === true}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleFilterChange('isPaid', true);
                    } else if (filters.isPaid === true) {
                      handleFilterChange('isPaid', false);
                    } else {
                      handleFilterChange('isPaid', undefined);
                    }
                  }}
                  color="success"
                />
              }
              label="Apenas pagas"
            />
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
}
