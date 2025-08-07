'use client';

import {
  Modal,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import { Add, Edit, Delete, Close, Palette } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { Category } from '../../types/category';
import { useCategories } from '../../hooks/use-categories';

const schema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  description: yup.string(),
  type: yup.string().oneOf(['INCOME', 'EXPENSE']).required('Tipo é obrigatório'),
  color: yup.string(),
  icon: yup.string()
});

interface CategoryFormModalProps {
  open: boolean;
  onClose: () => void;
  category?: Category;
}

function CategoryFormModal({ open, onClose, category }: CategoryFormModalProps) {
  const { createCategory, updateCategory } = useCategories();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!category;

  const colors = [
    '#F44336', '#E91E63', '#9C27B0', '#673AB7',
    '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
    '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
    '#FFEB3B', '#FFC107', '#FF9800', '#FF5722',
    '#795548', '#9E9E9E', '#607D8B'
  ];

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
      type: category?.type || 'EXPENSE',
      color: category?.color || '#2196F3',
      icon: category?.icon || ''
    }
  });

  const handleFormSubmit = async (data: any) => {
    try {
      setLoading(true);
      setError(null);

      if (isEditing) {
        await updateCategory(category.id, data);
      } else {
        await createCategory(data);
      }

      reset();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Paper
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '95%', sm: 500 },
          maxHeight: '90vh',
          overflow: 'auto',
          p: 3
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5">
            {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Box display="flex" flexDirection="column" gap={3}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nome"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  placeholder="Ex: Alimentação, Salário"
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Descrição (Opcional)"
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Descreva esta categoria"
                />
              )}
            />

            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.type}>
                  <InputLabel>Tipo</InputLabel>
                  <Select {...field} label="Tipo">
                    <MenuItem value="INCOME">Receita</MenuItem>
                    <MenuItem value="EXPENSE">Despesa</MenuItem>
                  </Select>
                  {errors.type && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, mx: 1.75 }}>
                      {errors.type.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Cor
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {colors.map((color) => (
                      <Box
                        key={color}
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: color,
                          borderRadius: '50%',
                          cursor: 'pointer',
                          border: field.value === color ? '3px solid #000' : '1px solid #ddd',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onClick={() => field.onChange(color)}
                      >
                        {field.value === color && <Palette sx={{ color: 'white', fontSize: 16 }} />}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            />

            <Controller
              name="icon"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Ícone (Opcional)"
                  fullWidth
                  placeholder="Ex: restaurant, car, home"
                  helperText="Nome do ícone do Material-UI"
                />
              )}
            />

            <Box display="flex" gap={2} justifyContent="flex-end" mt={2}>
              <Button
                variant="outlined"
                onClick={handleClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16} /> : undefined}
              >
                {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Modal>
  );
}

export default function CategoriesManagement() {
  const { categories, loading, error, deleteCategory, createDefaultCategories } = useCategories();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleteLoading(id);
      await deleteCategory(id);
    } catch (err: any) {
      console.error('Erro ao deletar categoria:', err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleCreateDefault = async () => {
    try {
      await createDefaultCategories();
    } catch (err: any) {
      console.error('Erro ao criar categorias padrão:', err);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingCategory(undefined);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Categorias</Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            onClick={handleCreateDefault}
            startIcon={<Add />}
          >
            Criar Padrão
          </Button>
          <Button
            variant="contained"
            onClick={() => setModalOpen(true)}
            startIcon={<Add />}
          >
            Nova Categoria
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box 
        display="grid" 
        gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))" 
        gap={2}
      >
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    backgroundColor: category.color || '#2196F3',
                    borderRadius: '50%'
                  }}
                />
                <Typography variant="h6">{category.name}</Typography>
                <Chip
                  label={category.type === 'INCOME' ? 'Receita' : 'Despesa'}
                  size="small"
                  color={category.type === 'INCOME' ? 'success' : 'error'}
                />
              </Box>
              {category.description && (
                <Typography variant="body2" color="text.secondary">
                  {category.description}
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button
                size="small"
                startIcon={<Edit />}
                onClick={() => handleEdit(category)}
              >
                Editar
              </Button>
              <Button
                size="small"
                color="error"
                startIcon={deleteLoading === category.id ? <CircularProgress size={16} /> : <Delete />}
                onClick={() => handleDelete(category.id)}
                disabled={deleteLoading === category.id}
              >
                Excluir
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      {categories.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary" mb={2}>
            Nenhuma categoria encontrada
          </Typography>
          <Button
            variant="contained"
            onClick={handleCreateDefault}
            startIcon={<Add />}
          >
            Criar Categorias Padrão
          </Button>
        </Box>
      )}

      <CategoryFormModal
        open={modalOpen}
        onClose={handleCloseModal}
        category={editingCategory}
      />
    </Box>
  );
}
