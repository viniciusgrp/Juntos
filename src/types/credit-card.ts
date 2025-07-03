// Tipos para cartões de crédito
export interface CreditCard {
  id: string;
  name: string;
  limit: number;
  closingDay: number;
  dueDay: number;
  isActive: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCreditCardData {
  name: string;
  limit: number;
  closingDay: number;
  dueDay: number;
}

export interface UpdateCreditCardData extends Partial<CreateCreditCardData> {
  isActive?: boolean;
}
