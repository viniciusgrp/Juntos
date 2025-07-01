import { Box } from '@mui/material'
import StatCard from './stat-card'
import { ReactNode } from 'react'

interface StatData {
  title: string
  value: string
  change?: string
  icon: ReactNode
  color?: string
}

interface StatsGridProps {
  stats: StatData[]
  columns?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: number
  size?: 'small' | 'medium' | 'large'
}

const StatsGrid = ({ 
  stats, 
  columns = { xs: 1, sm: 2, md: 4 },
  gap = 3,
  size = 'medium'
}: StatsGridProps) => {
  const getGridColumns = () => {
    const cols = []
    if (columns.xs) cols.push(`repeat(${columns.xs}, 1fr)`)
    if (columns.sm) cols.push(`repeat(${columns.sm}, 1fr)`)
    if (columns.md) cols.push(`repeat(${columns.md}, 1fr)`)
    if (columns.lg) cols.push(`repeat(${columns.lg}, 1fr)`)
    if (columns.xl) cols.push(`repeat(${columns.xl}, 1fr)`)
    
    return {
      xs: columns.xs ? `repeat(${columns.xs}, 1fr)` : '1fr',
      sm: columns.sm ? `repeat(${columns.sm}, 1fr)` : undefined,
      md: columns.md ? `repeat(${columns.md}, 1fr)` : undefined,
      lg: columns.lg ? `repeat(${columns.lg}, 1fr)` : undefined,
      xl: columns.xl ? `repeat(${columns.xl}, 1fr)` : undefined,
    }
  }

  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: getGridColumns(),
      gap,
      mb: 4 
    }}>
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
          color={stat.color}
          size={size}
        />
      ))}
    </Box>
  )
}

export default StatsGrid
