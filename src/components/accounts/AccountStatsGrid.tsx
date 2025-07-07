import { Box, Skeleton } from '@mui/material';
import {
  AccountBalance,
  Savings,
  TrendingUp,
  Money,
  AccountBalanceWallet
} from '@mui/icons-material';
import StatCard from '../ui/stat-card';
import { AccountStats } from '../../services/account.service';
import { ACCOUNT_TYPE_COLORS } from '../../types/account';

interface AccountStatsGridProps {
  stats?: AccountStats;
  loading?: boolean;
}

const AccountStatsGrid = ({ stats, loading = false }: AccountStatsGridProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: '1fr', 
          sm: 'repeat(2, 1fr)', 
          md: 'repeat(4, 1fr)', 
          lg: 'repeat(5, 1fr)' 
        },
        gap: 3,
        mb: 4 
      }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            height={120}
            sx={{ borderRadius: 2 }}
          />
        ))}
      </Box>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: '1fr', 
          sm: 'repeat(2, 1fr)', 
          md: 'repeat(4, 1fr)', 
          lg: 'repeat(5, 1fr)' 
        },
        gap: 3,
        mb: 4 
      }}>
        <StatCard
          title="Saldo Total"
          value={formatCurrency(stats.totalBalance)}
          icon={<AccountBalanceWallet />}
          color="#1976d2"
          size="medium"
        />

        <StatCard
          title="Total de Contas"
          value={stats.totalAccounts.toString()}
          icon={<AccountBalance />}
          color="#424242"
          size="medium"
        />

        <StatCard
          title="Conta Corrente"
          value={formatCurrency(stats.balanceByType.checking)}
          change={`${stats.accountsByType.checking} conta${stats.accountsByType.checking !== 1 ? 's' : ''}`}
          icon={<AccountBalance />}
          color={ACCOUNT_TYPE_COLORS.checking}
          size="medium"
        />

        <StatCard
          title="Poupança"
          value={formatCurrency(stats.balanceByType.savings)}
          change={`${stats.accountsByType.savings} conta${stats.accountsByType.savings !== 1 ? 's' : ''}`}
          icon={<Savings />}
          color={ACCOUNT_TYPE_COLORS.savings}
          size="medium"
        />

        <StatCard
          title="Investimentos"
          value={formatCurrency(stats.balanceByType.investment)}
          change={`${stats.accountsByType.investment} conta${stats.accountsByType.investment !== 1 ? 's' : ''}`}
          icon={<TrendingUp />}
          color={ACCOUNT_TYPE_COLORS.investment}
          size="medium"
        />
      </Box>

      {stats.totalAccounts > 0 && (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)' 
          },
          gap: 3,
          mb: 4 
        }}>
          <StatCard
            title="Maior Saldo"
            value={formatCurrency(stats.highestBalance)}
            icon={<TrendingUp />}
            color="#4caf50"
            size="small"
          />
          
          <StatCard
            title="Saldo Médio"
            value={formatCurrency(stats.averageBalance)}
            icon={<Money />}
            color="#2196f3"
            size="small"
          />
        </Box>
      )}
    </>
  );
};

export default AccountStatsGrid;
