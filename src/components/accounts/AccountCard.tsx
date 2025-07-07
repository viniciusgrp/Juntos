import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  Visibility,
  AccountBalance,
  Savings,
  TrendingUp,
  Money
} from '@mui/icons-material';
import { useState } from 'react';
import { Account, ACCOUNT_TYPES, ACCOUNT_TYPE_COLORS } from '../../types/account';

interface AccountCardProps {
  account: Account;
  onEdit?: (account: Account) => void;
  onDelete?: (account: Account) => void;
  onView?: (account: Account) => void;
  showActions?: boolean;
}

const AccountCard = ({
  account,
  onEdit,
  onDelete,
  onView,
  showActions = true
}: AccountCardProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit?.(account);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete?.(account);
    handleMenuClose();
  };

  const handleView = () => {
    onView?.(account);
    handleMenuClose();
  };

  const getAccountIcon = (type: Account['type']) => {
    switch (type) {
      case 'checking':
        return <AccountBalance />;
      case 'savings':
        return <Savings />;
      case 'investment':
        return <TrendingUp />;
      case 'cash':
        return <Money />;
      default:
        return <AccountBalance />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar 
              sx={{ 
                bgcolor: ACCOUNT_TYPE_COLORS[account.type],
                width: 48,
                height: 48
              }}
            >
              {getAccountIcon(account.type)}
            </Avatar>
            <Box>
              <Typography variant="h6" component="h3" noWrap>
                {account.name}
              </Typography>
              <Chip 
                label={ACCOUNT_TYPES[account.type]}
                size="small"
                sx={{
                  bgcolor: ACCOUNT_TYPE_COLORS[account.type],
                  color: 'white',
                  fontSize: '0.75rem'
                }}
              />
            </Box>
          </Box>

          {showActions && (
            <>
              <IconButton
                onClick={handleMenuOpen}
                size="small"
                sx={{ color: 'text.secondary' }}
              >
                <MoreVert />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                {onView && (
                  <MenuItem onClick={handleView}>
                    <ListItemIcon>
                      <Visibility fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Visualizar</ListItemText>
                  </MenuItem>
                )}
                
                {onEdit && (
                  <MenuItem onClick={handleEdit}>
                    <ListItemIcon>
                      <Edit fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Editar</ListItemText>
                  </MenuItem>
                )}
                
                {onDelete && (
                  <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                    <ListItemIcon>
                      <Delete fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText>Excluir</ListItemText>
                  </MenuItem>
                )}
              </Menu>
            </>
          )}
        </Box>

        <Box mb={2}>
          <Typography variant="h4" component="div" color="primary" fontWeight="bold">
            {formatCurrency(account.balance)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AccountCard;
