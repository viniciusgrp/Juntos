import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Chip,
  Box
} from '@mui/material'
import { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string
  change?: string
  icon: ReactNode
  color?: string
  size?: 'small' | 'medium' | 'large'
}

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  color = 'primary.main',
  size = 'medium'
}: StatCardProps) => {
  const getIconSize = () => {
    switch (size) {
      case 'small': return { fontSize: 24 }
      case 'large': return { fontSize: 40 }
      default: return { fontSize: 32 }
    }
  }

  const getAvatarSize = () => {
    switch (size) {
      case 'small': return { width: 40, height: 40 }
      case 'large': return { width: 60, height: 60 }
      default: return { width: 56, height: 56 }
    }
  }

  const getValueVariant = () => {
    switch (size) {
      case 'small': return 'h6'
      case 'large': return 'h4'
      default: return 'h5'
    }
  }

  return (
    <Card elevation={2}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant={getValueVariant() as any} component="div" fontWeight="bold">
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            {change && (
              <Chip 
                label={change}
                size="small"
                color={change.startsWith('+') ? 'success' : 'error'}
                variant="outlined"
              />
            )}
          </Box>
          <Avatar sx={{ bgcolor: color, ...getAvatarSize() }}>
            <Box sx={getIconSize()}>
              {icon}
            </Box>
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  )
}

export default StatCard
