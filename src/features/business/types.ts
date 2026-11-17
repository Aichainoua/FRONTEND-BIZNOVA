import type { OperationType } from '../../navigation/routes';

export type Business = {
  name: string;
  sector: string;
  trackingStart: string;
  monthlyBudget: number;
  initialCash: number;
};

export type Operation = {
  id: string;
  type: OperationType;
  amount: number;
  date: string;
  category: string;
  description: string;
};

export type BusinessData = {
  business: Business | null;
  operations: Operation[];
};
