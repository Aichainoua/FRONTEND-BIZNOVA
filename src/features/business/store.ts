import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { create } from 'zustand';
import type { Business, BusinessData, Operation } from './types';
import type { OperationType } from '../../navigation/routes';

const STORAGE_KEY = 'biznova.business.v1';
type WebStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

function getWebStorage(): WebStorage {
  const storage = (globalThis as typeof globalThis & { localStorage?: WebStorage }).localStorage;
  if (!storage) throw new Error('Le stockage local du navigateur est indisponible.');
  return storage;
}

async function load(): Promise<string | null> {
  return Platform.OS === 'web'
    ? getWebStorage().getItem(STORAGE_KEY)
    : SecureStore.getItemAsync(STORAGE_KEY);
}

interface BusinessState extends BusinessData {
  hydrated: boolean;
  storageError: string | null;
  initialize: () => Promise<void>;
  configureBusiness: (business: Business) => Promise<void>;
  addOperation: (operation: Omit<Operation, 'id'>) => Promise<void>;
  updateMonthlyBudget: (monthlyBudget: number) => Promise<void>;
}

function isOperation(value: unknown): value is Operation {
  if (!value || typeof value !== 'object') return false;
  const operation = value as Partial<Operation>;
  return Boolean(
    typeof operation.id === 'string' &&
      (operation.type === 'income' || operation.type === 'expense') &&
      typeof operation.amount === 'number' &&
      Number.isFinite(operation.amount) &&
      typeof operation.date === 'string' &&
      typeof operation.category === 'string' &&
      typeof operation.description === 'string',
  );
}

function isBusinessData(value: unknown): value is BusinessData {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<BusinessData>;
  if (!Array.isArray(candidate.operations) || !candidate.operations.every(isOperation)) return false;
  if (candidate.business === null) return true;
  const business = candidate.business;
  return Boolean(
    business &&
      typeof business.name === 'string' &&
      typeof business.sector === 'string' &&
      typeof business.trackingStart === 'string' &&
      typeof business.monthlyBudget === 'number' &&
      Number.isFinite(business.monthlyBudget) &&
      business.monthlyBudget > 0 &&
      typeof business.initialCash === 'number' &&
      Number.isFinite(business.initialCash) &&
      business.initialCash >= 0,
  );
}

async function save(data: BusinessData) {
  const serialized = JSON.stringify(data);
  if (Platform.OS === 'web') {
    getWebStorage().setItem(STORAGE_KEY, serialized);
    return;
  }
  await SecureStore.setItemAsync(STORAGE_KEY, serialized);
}

export const useBusinessStore = create<BusinessState>((set, get) => ({
  business: null,
  operations: [],
  hydrated: false,
  storageError: null,

  async initialize() {
    try {
      const saved = await load();
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (!isBusinessData(parsed)) throw new Error('Les données entreprise enregistrées sont invalides.');
        set({ ...parsed, hydrated: true, storageError: null });
        return;
      }
      set({ hydrated: true, storageError: null });
    } catch (error) {
      set({
        hydrated: true,
        storageError:
          error instanceof Error
            ? `Impossible de lire les données locales : ${error.message}`
            : 'Impossible de lire les données locales.',
      });
    }
  },

  async configureBusiness(business) {
    const data: BusinessData = { business, operations: get().operations };
    await save(data);
    set({ ...data, storageError: null });
  },

  async addOperation(operation) {
    const current = get();
    const next: BusinessData = {
      business: current.business,
      operations: [{ ...operation, id: `${Date.now()}-${Math.random().toString(36).slice(2)}` }, ...current.operations],
    };
    await save(next);
    set({ ...next, storageError: null });
  },

  async updateMonthlyBudget(monthlyBudget) {
    const current = get();
    if (!current.business) throw new Error('Configurez votre entreprise avant de modifier le budget.');
    const data: BusinessData = {
      business: { ...current.business, monthlyBudget },
      operations: current.operations,
    };
    await save(data);
    set({ ...data, storageError: null });
  },
}));

export function isOperationType(value: string): value is OperationType {
  return value === 'income' || value === 'expense';
}
