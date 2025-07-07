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
  InputAdornment
} from '@mui/material';
import { ExpandMore, ExpandLess, FilterList, Clear } from '@mui/icons-material';
import { useState } from 'react';

interface AccountFilters {
  type?: 'checking' | 'savings' | 'investment' | 'cash';
  minBalance?: number;
  maxBalance?: number;
  name?: string;
}

interface AccountFiltersProps {
  filters: AccountFilters;
  onFiltersChange: (filters: AccountFilters) => void;
  onClearFilters: () => void;
}

const ACCOUNT_TYPES = {
  checking: 'Conta Corrente',
  savings: 'Poupança',
  investment: 'Investimento'
} as const;

const AccountFiltersComponent = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters 
}: AccountFiltersProps) => {
  const [expanded, setExpanded] = useState(false);

  const handleFilterChange = (key: keyof AccountFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== null
  );

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterList />
          <Typography variant="h6">
            Filtros
          </Typography>
          {hasActiveFilters && (
            <Button
              size="small"
              onClick={onClearFilters}
              startIcon={<Clear />}
              color="secondary"
            >
              Limpar
            </Button>
          )}
        </Box>
        
        <Box>
          <IconButton
            onClick={() => setExpanded(!expanded)}
            aria-label="expandir filtros"
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)' 
          },
          gap: 2,
          mt: 2 
        }}>
          <FormControl fullWidth>
            <InputLabel>Tipo de Conta</InputLabel>
            <Select
              value={filters.type || ''}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              label="Tipo de Conta"
            >
              <MenuItem value="">
                <em>Todos os tipos</em>
              </MenuItem>
              {Object.entries(ACCOUNT_TYPES).map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Nome da Conta"
            value={filters.name || ''}
            onChange={(e) => handleFilterChange('name', e.target.value)}
            placeholder="Buscar por nome..."
          />

          <TextField
            fullWidth
            label="Saldo Mínimo"
            type="number"
            value={filters.minBalance || ''}
            onChange={(e) => handleFilterChange('minBalance', e.target.value ? parseFloat(e.target.value) : undefined)}
            InputProps={{
              startAdornment: <InputAdornment position="start">R$</InputAdornment>,
              inputProps: { 
                min: 0, 
                step: 0.01 
              }
            }}
          />

          <TextField
            fullWidth
            label="Saldo Máximo"
            type="number"
            value={filters.maxBalance || ''}
            onChange={(e) => handleFilterChange('maxBalance', e.target.value ? parseFloat(e.target.value) : undefined)}
            InputProps={{
              startAdornment: <InputAdornment position="start">R$</InputAdornment>,
              inputProps: { 
                min: 0, 
                step: 0.01 
              }
            }}
          />
        </Box>
      </Collapse>
    </Paper>
  );
};

export default AccountFiltersComponent;
