export interface CreditCard {
  id: string;
  name: string;
  limit: number;
  closeDate: number;
  dueDate: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCreditCardData {
  name: string;
  limit: number;
  closeDate: number;
  dueDate: number;
}

export type UpdateCreditCardData = Partial<CreateCreditCardData>;
