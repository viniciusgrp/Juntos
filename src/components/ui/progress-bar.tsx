import {
  Box,
  LinearProgress,
  Typography
} from '@mui/material'

interface ProgressBarProps {
  label: string
  value: number
  maxValue?: number
  displayValue?: string
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
  showPercentage?: boolean
  height?: number
}

const ProgressBar = ({ 
  label, 
  value, 
  maxValue = 100, 
  displayValue,
  color = 'primary',
  showPercentage = true,
  height = 6
}: ProgressBarProps) => {
  const percentage = (value / maxValue) * 100
  const displayText = displayValue || (showPercentage ? `${percentage.toFixed(1)}%` : value.toString())

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2">
          {label}
        </Typography>
        <Typography variant="body2" fontWeight="bold">
          {displayText}
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={percentage} 
        color={color}
        sx={{ height, borderRadius: height / 2 }}
      />
    </Box>
  )
}

export default ProgressBar
