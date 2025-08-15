'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService, CategoryFilters } from '../services/category.service';
import { useToastContext } from '../contexts/toast.context';

export const useCategories = (filters?: CategoryFilters) => {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useToastContext();

  const {
    data: categoriesData,
    isLoading: loading,
    error: queryError
  } = useQuery({
    queryKey: ['categories', filters],
    queryFn: () => categoryService.getCategories(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const categories = categoriesData?.categories || [];
  const error = queryError?.message || null;

  const createCategoryMutation = useMutation({
    mutationFn: (data: any) => categoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showSuccess('Categoria criada com sucesso!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Erro ao criar categoria';
      showError(errorMessage);
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      categoryService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showSuccess('Categoria atualizada com sucesso!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Erro ao atualizar categoria';
      showError(errorMessage);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showSuccess('Categoria deletada com sucesso!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Erro ao deletar categoria';
      showError(errorMessage);
    },
  });

  const createDefaultCategoriesMutation = useMutation({
    mutationFn: () => categoryService.createDefaultCategories(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showSuccess('Categorias padrão criadas com sucesso!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Erro ao criar categorias padrão';
      showError(errorMessage);
    },
  });

  const createCategory = async (data: any) => {
    return createCategoryMutation.mutateAsync(data);
  };

  const updateCategory = async (id: string, data: any) => {
    return updateCategoryMutation.mutateAsync({ id, data });
  };

  const deleteCategory = async (id: string) => {
    return deleteCategoryMutation.mutateAsync(id);
  };

  const createDefaultCategories = async () => {
    return createDefaultCategoriesMutation.mutateAsync();
  };

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    createDefaultCategories,
    setError: () => {} // Placeholder para compatibilidade
  };
};
