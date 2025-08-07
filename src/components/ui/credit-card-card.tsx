'use client';

import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  MoreVert,
  CreditCard as CreditCardIcon,
  Edit,
  Delete,
  TrendingUp
} from '@mui/icons-material';
import { useState } from 'react';
import { CreditCard } from '../../types/credit-card';

interface CreditCardCardProps {
  creditCard: CreditCard;
  onEdit?: (creditCard: CreditCard) => void;
  onDelete?: (creditCard: CreditCard) => void;
  onViewStats?: (creditCard: CreditCard) => void;
  stats?: {
    totalSpent: number;
    availableLimit: number;
    limitUsagePercentage: number;
    transactionsCount: number;
  };
}

export default function CreditCardCard({ 
  creditCard, 
  onEdit, 
  onDelete, 
  onViewStats,
  stats 
}: CreditCardCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit?.(creditCard);
    handleClose();
  };

  const handleDelete = () => {
    onDelete?.(creditCard);
    handleClose();
  };

  const handleViewStats = () => {
    onViewStats?.(creditCard);
    handleClose();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const usagePercentage = stats?.limitUsagePercentage || 0;
  const getUsageColor = (percentage: number) => {
    if (percentage <= 50) return 'success';
    if (percentage <= 80) return 'warning';
    return 'error';
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <CreditCardIcon color="primary" />
            <Typography variant="h6" component="h3" noWrap>
              {creditCard.name}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={handleClick}
            aria-label="mais opções"
          >
            <MoreVert />
          </IconButton>
        </Box>

        <Box mb={2}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Limite Total
          </Typography>
          <Typography variant="h5" fontWeight="bold">
            {formatCurrency(creditCard.limit)}
          </Typography>
        </Box>

        {stats && (
          <>
            <Box mb={2}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" color="text.secondary">
                  Usado este mês
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {usagePercentage.toFixed(1)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min(usagePercentage, 100)}
                color={getUsageColor(usagePercentage)}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="body2" color="text.secondary">
                  {formatCurrency(stats.totalSpent)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Disponível: {formatCurrency(stats.availableLimit)}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Transações este mês
              </Typography>
              <Chip
                label={stats.transactionsCount}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Box>
          </>
        )}

        <Box mt={2}>
          <Box display="flex" gap={2} mb={1}>
            <Typography variant="body2" color="text.secondary">
              Fechamento: {creditCard.closeDate}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Vencimento: {creditCard.dueDate}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {onViewStats && (
          <MenuItem onClick={handleViewStats}>
            <TrendingUp sx={{ mr: 1 }} fontSize="small" />
            Estatísticas
          </MenuItem>
        )}
        {onEdit && (
          <MenuItem onClick={handleEdit}>
            <Edit sx={{ mr: 1 }} fontSize="small" />
            Editar
          </MenuItem>
        )}
        {onDelete && (
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <Delete sx={{ mr: 1 }} fontSize="small" />
            Excluir
          </MenuItem>
        )}
      </Menu>
    </Card>
  );
}
