'use client';

import { useState, useEffect } from 'react';
import { creditCardService } from '../services/credit-card.service';
import { CreditCard, CreateCreditCardData, UpdateCreditCardData } from '../types/credit-card';

export const useCreditCards = () => {
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCreditCards = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await creditCardService.getCreditCards();
      setCreditCards(response.creditCards);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao carregar cartões de crédito';
      setError(errorMessage);
      console.error('Erro ao carregar cartões:', err);
    } finally {
      setLoading(false);
    }
  };

  const createCreditCard = async (data: CreateCreditCardData) => {
    try {
      setError(null);
      const newCreditCard = await creditCardService.createCreditCard(data);
      setCreditCards(prev => [...prev, newCreditCard]);
      console.log('Cartão de crédito criado com sucesso!');
      return newCreditCard;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao criar cartão de crédito';
      setError(errorMessage);
      console.error('Erro ao criar cartão:', err);
      throw new Error(errorMessage);
    }
  };

  const updateCreditCard = async (id: string, data: UpdateCreditCardData) => {
    try {
      setError(null);
      const updatedCreditCard = await creditCardService.updateCreditCard(id, data);
      setCreditCards(prev => 
        prev.map(card => card.id === id ? updatedCreditCard : card)
      );
      console.log('Cartão de crédito atualizado com sucesso!');
      return updatedCreditCard;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao atualizar cartão de crédito';
      setError(errorMessage);
      console.error('Erro ao atualizar cartão:', err);
      throw new Error(errorMessage);
    }
  };

  const deleteCreditCard = async (id: string) => {
    try {
      setError(null);
      await creditCardService.deleteCreditCard(id);
      setCreditCards(prev => prev.filter(card => card.id !== id));
      console.log('Cartão de crédito excluído com sucesso!');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao excluir cartão de crédito';
      setError(errorMessage);
      console.error('Erro ao excluir cartão:', err);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    loadCreditCards();
  }, []);

  return {
    creditCards,
    loading,
    error,
    createCreditCard,
    updateCreditCard,
    deleteCreditCard,
    refetch: loadCreditCards,
  };
};

export const useCreditCard = (id: string) => {
  const [creditCard, setCreditCard] = useState<CreditCard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const card = await creditCardService.getCreditCardById(id);
      setCreditCard(card);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao carregar cartão de crédito';
      setError(errorMessage);
      console.error('Erro ao carregar cartão:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    
    const loadCreditCard = async () => {
      try {
        setLoading(true);
        setError(null);
        const card = await creditCardService.getCreditCardById(id);
        setCreditCard(card);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Erro ao carregar cartão de crédito';
        setError(errorMessage);
        console.error('Erro ao carregar cartão:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCreditCard();
  }, [id]);

  return {
    creditCard,
    loading,
    error,
    refetch,
  };
};

export const useCreditCardStats = (id: string) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const cardStats = await creditCardService.getCreditCardStats(id);
      setStats(cardStats);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao carregar estatísticas do cartão';
      setError(errorMessage);
      console.error('Erro ao carregar estatísticas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    
    const loadStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const cardStats = await creditCardService.getCreditCardStats(id);
        setStats(cardStats);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Erro ao carregar estatísticas do cartão';
        setError(errorMessage);
        console.error('Erro ao carregar estatísticas:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [id]);

  return {
    stats,
    loading,
    error,
    refetch,
  };
};
