'use client'

import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  TrendingUp,
  Work,
  Business,
  Savings
} from '@mui/icons-material'

const ReceitasPage = () => {
  const receitas = [
    {
      id: 1,
      titulo: 'Salário - Empresa XYZ',
      valor: 5500.00,
      categoria: 'Trabalho',
      data: '2025-01-01',
      tipo: 'Mensal',
      conta: 'Conta Corrente'
    },
    {
      id: 2,
      titulo: 'Freelance - Design',
      valor: 1200.00,
      categoria: 'Freelance',
      data: '2025-01-15',
      tipo: 'Única',
      conta: 'Conta Corrente'
    },
    {
      id: 3,
      titulo: 'Dividendos - Ações',
      valor: 450.80,
      categoria: 'Investimentos',
      data: '2025-01-20',
      tipo: 'Trimestral',
      conta: 'Poupança'
    },
    {
      id: 4,
      titulo: 'Venda - Produto Digital',
      valor: 890.00,
      categoria: 'Negócio',
      data: '2025-01-25',
      tipo: 'Única',
      conta: 'Conta Corrente'
    }
  ]

  const totalReceitas = receitas.reduce((sum, receita) => sum + receita.valor, 0)

  const getCategoriaIcon = (categoria: string) => {
    switch (categoria) {
      case 'Trabalho':
        return <Work />
      case 'Freelance':
        return <Business />
      case 'Investimentos':
        return <Savings />
      case 'Negócio':
        return <TrendingUp />
      default:
        return <TrendingUp />
    }
  }

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'Trabalho':
        return 'primary'
      case 'Freelance':
        return 'secondary'
      case 'Investimentos':
        return 'success'
      case 'Negócio':
        return 'info'
      default:
        return 'default'
    }
  }

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4 
      }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Receitas
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gerencie suas fontes de renda
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          size="large"
          sx={{ px: 3 }}
        >
          Nova Receita
        </Button>
      </Box>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: 3,
        mb: 4 
      }}>
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'success.main' }}>
                <TrendingUp />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold" color="success.main">
                  R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total do Mês
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <Work />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  {receitas.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fontes de Renda
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'info.main' }}>
                <Savings />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  R$ {(totalReceitas / receitas.length).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Média por Receita
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Receita</TableCell>
                <TableCell>Categoria</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Conta</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {receitas.map((receita) => (
                <TableRow key={receita.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ 
                        bgcolor: `${getCategoriaColor(receita.categoria)}.light`,
                        color: `${getCategoriaColor(receita.categoria)}.main`,
                        width: 32,
                        height: 32
                      }}>
                        {getCategoriaIcon(receita.categoria)}
                      </Avatar>
                      <Typography variant="body1" fontWeight="medium">
                        {receita.titulo}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={receita.categoria}
                      color={getCategoriaColor(receita.categoria) as 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'default'}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" fontWeight="bold" color="success.main">
                      R$ {receita.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {new Date(receita.data).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={receita.tipo}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{receita.conta}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}

export default ReceitasPage
