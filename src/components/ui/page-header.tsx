import {
  Box,
  Typography,
  Button
} from '@mui/material'
import { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  buttonText?: string
  buttonIcon?: ReactNode
  onButtonClick?: () => void
  buttonColor?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
  children?: ReactNode
}

const PageHeader = ({ 
  title, 
  description, 
  buttonText, 
  buttonIcon, 
  onButtonClick,
  buttonColor = 'primary',
  children 
}: PageHeaderProps) => {
  return (
    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          {title}
        </Typography>
        {description && (
          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>
        )}
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        {children}
        {buttonText && (
          <Button
            variant="contained"
            color={buttonColor}
            startIcon={buttonIcon}
            size="large"
            onClick={onButtonClick}
          >
            {buttonText}
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default PageHeader
