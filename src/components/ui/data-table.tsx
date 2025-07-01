import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Typography,
  Avatar
} from '@mui/material'
import {
  Edit,
  Delete,
  Visibility
} from '@mui/icons-material'
import { ReactNode } from 'react'

interface Column {
  id: string
  label: string
  align?: 'left' | 'right' | 'center'
  minWidth?: number
  format?: (value: any, row?: any) => string | ReactNode
}

interface DataTableProps {
  columns: Column[]
  data: any[]
  onEdit?: (row: any) => void
  onDelete?: (row: any) => void
  onView?: (row: any) => void
  showActions?: boolean
  actionColumnLabel?: string
  renderCustomAction?: (row: any) => ReactNode
  elevation?: number
}

const DataTable = ({ 
  columns, 
  data, 
  onEdit, 
  onDelete, 
  onView,
  showActions = true,
  actionColumnLabel = "Ações",
  renderCustomAction,
  elevation = 2
}: DataTableProps) => {
  return (
    <Paper elevation={elevation}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell 
                  key={column.id} 
                  align={column.align} 
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
              {showActions && (
                <TableCell align="center">
                  {actionColumnLabel}
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={row.id || index} hover>
                {columns.map((column) => {
                  const value = row[column.id]
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {column.format ? column.format(value, row) : value}
                    </TableCell>
                  )
                })}
                {showActions && (
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                      {renderCustomAction ? (
                        renderCustomAction(row)
                      ) : (
                        <>
                          {onView && (
                            <IconButton size="small" color="info" onClick={() => onView(row)}>
                              <Visibility />
                            </IconButton>
                          )}
                          {onEdit && (
                            <IconButton size="small" color="primary" onClick={() => onEdit(row)}>
                              <Edit />
                            </IconButton>
                          )}
                          {onDelete && (
                            <IconButton size="small" color="error" onClick={() => onDelete(row)}>
                              <Delete />
                            </IconButton>
                          )}
                        </>
                      )}
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export const TableItemWithIcon = ({ 
  icon, 
  primary, 
  secondary,
  iconColor,
  iconBg 
}: {
  icon: ReactNode
  primary: string
  secondary?: string
  iconColor?: string
  iconBg?: string
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <Avatar sx={{ 
      bgcolor: iconBg || 'background.paper', 
      border: 1, 
      borderColor: 'divider', 
      width: 40, 
      height: 40,
      color: iconColor
    }}>
      {icon}
    </Avatar>
    <Box>
      <Typography variant="body1" fontWeight="medium">
        {primary}
      </Typography>
      {secondary && (
        <Typography variant="caption" color="text.secondary">
          {secondary}
        </Typography>
      )}
    </Box>
  </Box>
)

export default DataTable
