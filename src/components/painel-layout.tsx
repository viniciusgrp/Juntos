'use client'

import { useState } from 'react'
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  useTheme,
  useMediaQuery,
  Chip
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard,
  AccountBalance,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Category,
  Assessment,
  Settings,
  Person,
  Logout,
  ChevronLeft,
  AttachMoney,
  Savings
} from '@mui/icons-material'
import { useRouter, usePathname } from 'next/navigation'
import ThemeToggle from '@/components/theme-toggle'
import { useTransactionStats } from '@/hooks/use-transactions'

const drawerWidth = 280
const miniDrawerWidth = 64

interface PainelLayoutProps {
  children: React.ReactNode
}

export default function PainelLayout({ children }: PainelLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [miniVariant, setMiniVariant] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const router = useRouter()
  const pathname = usePathname()
  const { data: stats } = useTransactionStats()

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <Dashboard />,
      path: '/painel',
      color: 'primary'
    },
    {
      text: 'Receitas',
      icon: <TrendingUp />,
      path: '/painel/receitas',
      color: 'success',
      badge: stats?.currentMonthIncomeCount?.toString() || '0'
    },
    {
      text: 'Despesas',
      icon: <TrendingDown />,
      path: '/painel/despesas',
      color: 'error',
      badge: stats?.currentMonthExpenseCount?.toString() || '0'
    },
    {
      text: 'Contas Bancárias',
      icon: <AccountBalance />,
      path: '/painel/contas',
      color: 'info'
    },
    {
      text: 'Cartões de Crédito',
      icon: <CreditCard />,
      path: '/painel/cartoes',
      color: 'warning'
    },
    {
      text: 'Categorias',
      icon: <Category />,
      path: '/painel/categorias',
      color: 'secondary'
    },
    {
      text: 'Orçamento',
      icon: <Savings />,
      path: '/painel/orcamento',
      color: 'info'
    },
    {
      text: 'Relatórios',
      icon: <Assessment />,
      path: '/painel/relatorios',
      color: 'success'
    },
    {
      text: 'Metas Financeiras',
      icon: <AttachMoney />,
      path: '/painel/metas',
      color: 'primary'
    }
  ]

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen)
    } else {
      setMiniVariant(!miniVariant)
    }
  }

  const handleMenuClick = (path: string) => {
    router.push(path)
    if (isMobile) {
      setMobileOpen(false)
    }
  }

  const isActive = (path: string) => {
    if (path === '/painel') {
      return pathname === '/painel'
    }
    return pathname.startsWith(path)
  }

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        minHeight: 64
      }}>
        {(!miniVariant || isMobile) && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
              <AttachMoney sx={{ fontSize: 20 }} />
            </Avatar>
            <Typography variant="h6" noWrap fontWeight="bold" color="primary">
              Juntos
            </Typography>
          </Box>
        )}
        {!isMobile && (
          <IconButton onClick={handleDrawerToggle} size="small">
            <ChevronLeft />
          </IconButton>
        )}
      </Box>

      <Divider />

      <List sx={{ flex: 1, px: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleMenuClick(item.path)}
              selected={isActive(item.path)}
              sx={{
                borderRadius: 2,
                mx: 0.5,
                '&.Mui-selected': {
                  bgcolor: `${item.color}.light`,
                  color: `${item.color}.contrastText`,
                  '&:hover': {
                    bgcolor: `${item.color}.main`,
                  }
                },
                display: "flex",
                justifyContent: "center"
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: miniVariant && !isMobile ? 0 : 40,
                justifyContent: 'center',
                color: isActive(item.path) ? 'inherit' : `${item.color}.main`
              }}>
                {item.icon}
              </ListItemIcon>
              {(!miniVariant || isMobile) && (
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: isActive(item.path) ? 600 : 400
                  }}
                />
              )}
              {(!miniVariant || isMobile) && item.badge && (
                <Chip 
                  label={item.badge} 
                  size="small" 
                  color={item.color as 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                  variant="outlined"
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <List sx={{ px: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleMenuClick('/painel/configuracoes')}
            sx={{ borderRadius: 2, mx: 0.5 }}
          >
            <ListItemIcon sx={{ minWidth: miniVariant && !isMobile ? 0 : 40, justifyContent: 'center' }}>
              <Settings />
            </ListItemIcon>
            {(!miniVariant || isMobile) && <ListItemText primary="Configurações" />}
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleMenuClick('/painel/perfil')}
            sx={{ borderRadius: 2, mx: 0.5 }}
          >
            <ListItemIcon sx={{ minWidth: miniVariant && !isMobile ? 0 : 40, justifyContent: 'center' }}>
              <Person />
            </ListItemIcon>
            {(!miniVariant || isMobile) && <ListItemText primary="Perfil" />}
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton
            onClick={() => router.push('/')}
            sx={{ borderRadius: 2, mx: 0.5, color: 'error.main' }}
          >
            <ListItemIcon sx={{ 
              minWidth: miniVariant && !isMobile ? 0 : 40, 
              justifyContent: 'center',
              color: 'error.main'
            }}>
              <Logout />
            </ListItemIcon>
            {(!miniVariant || isMobile) && <ListItemText primary="Sair" />}
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: isMobile ? '100%' : `calc(100% - ${miniVariant ? miniDrawerWidth : drawerWidth}px)`,
          ml: isMobile ? 0 : `${miniVariant ? miniDrawerWidth : drawerWidth}px`,
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1,
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Gestão Financeira
          </Typography>

          <ThemeToggle />
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ 
          width: isMobile ? 0 : (miniVariant ? miniDrawerWidth : drawerWidth), 
          flexShrink: 0 
        }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                borderRight: 1,
                borderColor: 'divider'
              },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: miniVariant ? miniDrawerWidth : drawerWidth,
                borderRight: 1,
                borderColor: 'divider',
                transition: theme.transitions.create('width', {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          width: isMobile ? '100%' : `calc(100% - ${miniVariant ? miniDrawerWidth : drawerWidth}px)`,
          mt: 8
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
