'use client'

import { IconButton, Tooltip, useTheme as useMuiTheme } from '@mui/material'
import { Brightness4, Brightness7 } from '@mui/icons-material'
import { useTheme } from '@/hooks/use-theme'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const muiTheme = useMuiTheme()

  return (
    <Tooltip title={`Mudar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}>
      <IconButton
        onClick={toggleTheme}
        sx={{
          bgcolor: muiTheme.palette.background.paper,
          border: `1px solid ${muiTheme.palette.divider}`,
          boxShadow: muiTheme.shadows[2],
          '&:hover': {
            bgcolor: muiTheme.palette.action.hover,
            boxShadow: muiTheme.shadows[4],
          },
          transition: 'all 0.2s ease-in-out',
        }}
      >
        {theme === 'light' ? (
          <Brightness4 sx={{ color: muiTheme.palette.text.primary }} />
        ) : (
          <Brightness7 sx={{ color: muiTheme.palette.text.primary }} />
        )}
      </IconButton>
    </Tooltip>
  )
}
