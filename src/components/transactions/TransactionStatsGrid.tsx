import { Box, CircularProgress } from '@mui/material';
import StatCard from '../ui/stat-card';
import { 
  TrendingUp, 
  TrendingDown, 
  AccountBalance, 
  Schedule,
  MonetizationOn,
  Assessment
} from '@mui/icons-material';

interface TransactionStats {
  totalIncomes: number;
  totalExpenses: number;
  totalPaid: number;
  totalPending: number;
  currentMonthIncomes: number;
  currentMonthExpenses: number;
  balance: number;
  topCategories: Array<{
    categoryId: string;
    categoryName: string;
    total: number;
    color?: string;
  }>;
}

interface TransactionStatsGridProps {
  stats?: TransactionStats;
  loading?: boolean;
  type?: 'INCOME' | 'EXPENSE' | 'ALL';
}

export default function TransactionStatsGrid({ 
  stats, 
  loading = false, 
  type = 'ALL' 
}: TransactionStatsGridProps) {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!stats) {
    return null;
  }

  const formatCurrency = (amount: number | undefined | null) => {
    const validAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(validAmount);
  };

  const getStatsForType = () => {
    switch (type) {
      case 'INCOME':
        return [
          {
            title: 'Total de Receitas',
            value: formatCurrency(stats.totalIncomes),
            icon: <TrendingUp />,
            color: 'success' as const,
            description: 'Todas as receitas cadastradas'
          },
          {
            title: 'Receitas Efetivadas',
            value: formatCurrency(stats.totalPaid),
            icon: <MonetizationOn />,
            color: 'success' as const,
            description: 'Receitas já recebidas'
          },
          {
            title: 'Receitas Pendentes',
            value: formatCurrency(stats.totalPending),
            icon: <Schedule />,
            color: 'warning' as const,
            description: 'Receitas a receber'
          },
          {
            title: 'Receitas do Mês',
            value: formatCurrency(stats.currentMonthIncomes),
            icon: <Assessment />,
            color: 'info' as const,
            description: 'Receitas do mês atual'
          }
        ];

      case 'EXPENSE':
        return [
          {
            title: 'Total de Despesas',
            value: formatCurrency(stats.totalExpenses),
            icon: <TrendingDown />,
            color: 'error' as const,
            description: 'Todas as despesas cadastradas'
          },
          {
            title: 'Despesas Efetivadas',
            value: formatCurrency(stats.totalPaid),
            icon: <MonetizationOn />,
            color: 'error' as const,
            description: 'Despesas já pagas'
          },
          {
            title: 'Despesas Pendentes',
            value: formatCurrency(stats.totalPending),
            icon: <Schedule />,
            color: 'warning' as const,
            description: 'Despesas a pagar'
          },
          {
            title: 'Despesas do Mês',
            value: formatCurrency(stats.currentMonthExpenses),
            icon: <Assessment />,
            color: 'info' as const,
            description: 'Despesas do mês atual'
          }
        ];

      default:
        return [
          {
            title: 'Saldo Atual',
            value: formatCurrency(stats.balance),
            icon: <AccountBalance />,
            color: stats.balance >= 0 ? 'success' as const : 'error' as const,
            description: 'Receitas - Despesas'
          },
          {
            title: 'Total Receitas',
            value: formatCurrency(stats.totalIncomes),
            icon: <TrendingUp />,
            color: 'success' as const,
            description: 'Todas as receitas'
          },
          {
            title: 'Total Despesas',
            value: formatCurrency(stats.totalExpenses),
            icon: <TrendingDown />,
            color: 'error' as const,
            description: 'Todas as despesas'
          },
          {
            title: 'Pendências',
            value: formatCurrency(stats.totalPending),
            icon: <Schedule />,
            color: 'warning' as const,
            description: 'Transações pendentes'
          }
        ];
    }
  };

  const statsToShow = getStatsForType();

  return (
    <Box sx={{ mb: 3 }}>
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(4, 1fr)' 
          },
          gap: 3 
        }}
      >
        {statsToShow.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </Box>
    </Box>
  );
}
