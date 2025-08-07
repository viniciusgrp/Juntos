import api from '../lib/api';
import { CreditCard, CreateCreditCardData, UpdateCreditCardData } from '../types/credit-card';

export interface CreditCardStats {
  creditCard: CreditCard;
  totalSpent: number;
  availableLimit: number;
  limitUsagePercentage: number;
  transactionsCount: number;
}

interface CreditCardsResponse {
  creditCards: CreditCard[];
  total: number;
}

export const creditCardService = {
  async getCreditCards(): Promise<CreditCardsResponse> {
    const response = await api.get('/credit-cards');
    return response.data.data;
  },

  async getCreditCardById(id: string): Promise<CreditCard> {
    const response = await api.get(`/credit-cards/${id}`);
    return response.data.data;
  },

  async createCreditCard(data: CreateCreditCardData): Promise<CreditCard> {
    const response = await api.post('/credit-cards', data);
    return response.data.data;
  },

  async updateCreditCard(id: string, data: UpdateCreditCardData): Promise<CreditCard> {
    const response = await api.put(`/credit-cards/${id}`, data);
    return response.data.data;
  },

  async deleteCreditCard(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/credit-cards/${id}`);
    return response.data.data;
  },

  async getCreditCardStats(id: string): Promise<CreditCardStats> {
    const response = await api.get(`/credit-cards/${id}/stats`);
    return response.data.data;
  }
};
