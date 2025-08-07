import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  ContentCopy,
  Check,
  Schedule,
  AccountBalance,
  CreditCard,
  Category,
  TrendingUp,
  TrendingDown
} from '@mui/icons-material';
import { useState } from 'react';
import { Transaction } from '../../types/transaction';

interface TransactionCardProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  onDuplicate: (transaction: Transaction) => void;
  onTogglePaid: (transaction: Transaction) => void;
}

export default function TransactionCard({
  transaction,
  onEdit,
  onDelete,
  onDuplicate,
  onTogglePaid
}: TransactionCardProps) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getTypeIcon = () => {
    return transaction.type === 'INCOME' ? (
      <TrendingUp color="success" />
    ) : (
      <TrendingDown color="error" />
    );
  };

  const getTypeColor = () => {
    return transaction.type === 'INCOME' ? 'success' : 'error';
  };

  const getPaymentMethodInfo = () => {
    if (transaction.creditCard) {
      return {
        icon: <CreditCard />,
        text: transaction.creditCard.name,
        tooltip: 'Cartão de Crédito'
      };
    }
    
    if (transaction.account) {
      return {
        icon: <AccountBalance />,
        text: transaction.account.name,
        tooltip: 'Conta'
      };
    }

    return null;
  };

  const paymentMethod = getPaymentMethodInfo();

  return (
    <Card 
      sx={{ 
        position: 'relative',
        opacity: transaction.isPaid ? 1 : 0.8,
        borderLeft: `4px solid`,
        borderLeftColor: transaction.isPaid ? 'success.main' : 'warning.main'
      }}
    >
      <CardContent sx={{ pb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar
              sx={{ 
                width: 32, 
                height: 32, 
                bgcolor: `${getTypeColor()}.main` 
              }}
            >
              {getTypeIcon()}
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {transaction.type === 'INCOME' ? 'Receita' : 'Despesa'}
              </Typography>
              <Typography variant="h6" color={`${getTypeColor()}.main`}>
                {formatCurrency(transaction.amount)}
              </Typography>
            </Box>
          </Box>

          <IconButton 
            size="small" 
            onClick={handleMenuOpen}
            sx={{ ml: 1 }}
          >
            <MoreVert />
          </IconButton>
        </Box>

        <Typography variant="h6" gutterBottom>
          {transaction.description}
        </Typography>

        <Box display="flex" flexDirection="column" gap={1} mb={2}>
          {/* Data */}
          <Box display="flex" alignItems="center" gap={1}>
            <Schedule fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {formatDate(transaction.date)}
            </Typography>
          </Box>

          {transaction.category && (
            <Box display="flex" alignItems="center" gap={1}>
              <Category fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {transaction.category.name}
              </Typography>
            </Box>
          )}

          {paymentMethod && (
            <Box display="flex" alignItems="center" gap={1}>
              <Tooltip title={paymentMethod.tooltip}>
                <Box sx={{ color: 'action.active', display: 'flex', fontSize: '1.25rem' }}>
                  {paymentMethod.icon}
                </Box>
              </Tooltip>
              <Typography variant="body2" color="text.secondary">
                {paymentMethod.text}
              </Typography>
            </Box>
          )}
        </Box>

        <Box display="flex" gap={1} flexWrap="wrap">
          <Chip
            size="small"
            icon={transaction.isPaid ? <Check /> : <Schedule />}
            label={transaction.isPaid ? 'Paga' : 'Pendente'}
            color={transaction.isPaid ? 'success' : 'warning'}
            variant={transaction.isPaid ? 'filled' : 'outlined'}
          />

          {transaction.installments && transaction.installments > 1 && (
            <Chip
              size="small"
              label={`${transaction.currentInstallment || 1}/${transaction.installments}`}
              variant="outlined"
            />
          )}
        </Box>
      </CardContent>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem 
          onClick={() => {
            onTogglePaid(transaction);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            {transaction.isPaid ? <Schedule /> : <Check />}
          </ListItemIcon>
          <ListItemText>
            {transaction.isPaid ? 'Marcar como pendente' : 'Marcar como paga'}
          </ListItemText>
        </MenuItem>
        
        <MenuItem 
          onClick={() => {
            onEdit(transaction);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>

        <MenuItem 
          onClick={() => {
            onDuplicate(transaction);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <ContentCopy />
          </ListItemIcon>
          <ListItemText>Duplicar</ListItemText>
        </MenuItem>

        <MenuItem 
          onClick={() => {
            onDelete(transaction);
            handleMenuClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon sx={{ color: 'error.main' }}>
            <Delete />
          </ListItemIcon>
          <ListItemText>Excluir</ListItemText>
        </MenuItem>
      </Menu>
    </Card>
  );
}
