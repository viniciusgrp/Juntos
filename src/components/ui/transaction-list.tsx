import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip
} from '@mui/material'
import { ReactNode } from 'react'

interface Transaction {
  id: string | number
  title: string
  description?: string
  value: string
  time: string
  type: 'receita' | 'despesa' | 'transfer' | string
  category?: string
  icon?: ReactNode
}

interface TransactionListProps {
  title: string
  transactions: Transaction[]
  getIcon?: (transaction: Transaction) => ReactNode
  getColor?: (type: string) => string
  elevation?: number
  maxHeight?: number | string
}

const TransactionList = ({ 
  title, 
  transactions, 
  getIcon,
  getColor,
  elevation = 2,
  maxHeight
}: TransactionListProps) => {
  const defaultGetIcon = (transaction: Transaction) => {
    return transaction.icon || <></>
  }

  const defaultGetColor = (type: string) => {
    switch (type) {
      case 'receita':
        return 'success'
      case 'despesa':
        return 'error'
      case 'transfer':
        return 'info'
      default:
        return 'default'
    }
  }

  const iconFunction = getIcon || defaultGetIcon
  const colorFunction = getColor || defaultGetColor

  return (
    <Paper elevation={elevation} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        {title}
      </Typography>
      <Box sx={{ maxHeight, overflow: 'auto' }}>
        <List>
          {transactions.map((transaction, index) => (
            <ListItem 
              key={transaction.id || index} 
              divider={index < transactions.length - 1}
              sx={{ px: 0 }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider' }}>
                  {iconFunction(transaction)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body1" fontWeight="medium">
                      {transaction.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      fontWeight="bold"
                      color={transaction.type === 'receita' ? 'success.main' : 'error.main'}
                    >
                      {transaction.value}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      {transaction.description && (
                        <Typography variant="body2" color="text.secondary">
                          {transaction.description}
                        </Typography>
                      )}
                      {transaction.category && (
                        <Chip 
                          label={transaction.category}
                          size="small"
                          color={colorFunction(transaction.type) as any}
                          variant="outlined"
                        />
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {transaction.time}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Paper>
  )
}

export default TransactionList
