import type { Category, OperationType, Sector, SectorId } from './types';

/**
 * Secteurs couverts par le MVP (cahier des charges § 2.3).
 */
export const SECTORS: readonly Sector[] = [
  { id: 'commerce', label: 'Commerce et distribution' },
  { id: 'it_services', label: 'Services informatiques et numériques' },
  { id: 'personal_services', label: 'Services aux particuliers et aux entreprises' },
];

const income = (id: string, label: string): Category => ({ id, label, type: 'income' });
const expense = (id: string, label: string): Category => ({ id, label, type: 'expense' });

/** Catalogue complet : un identifiant stable par catégorie. */
const CATALOG: Readonly<Record<string, Category>> = Object.fromEntries(
  [
    income('services', 'Prestations'),
    income('goods_sales', 'Ventes de marchandises'),
    income('product_sales', 'Ventes de produits'),
    income('other_income', 'Autres recettes'),
    expense('rent', 'Loyer'),
    expense('telecom', 'Télécommunications'),
    expense('software', 'Logiciels'),
    expense('equipment', 'Équipement'),
    expense('staff', 'Charges de personnel'),
    expense('transport', 'Transport'),
    expense('marketing', 'Marketing et communication'),
    expense('goods_purchases', 'Achats de marchandises'),
    expense('consumables', 'Consommables'),
    expense('other_expense', 'Autres dépenses'),
  ].map((category) => [category.id, category]),
);

/**
 * Catégories proposées par secteur (exigence T2 : les formulaires s'adaptent au secteur).
 * ⚠️ Liste de travail à faire valider par l'équipe métier.
 */
const CATEGORY_IDS_BY_SECTOR: Readonly<Record<SectorId, readonly string[]>> = {
  commerce: [
    'goods_sales',
    'other_income',
    'goods_purchases',
    'rent',
    'transport',
    'staff',
    'telecom',
    'equipment',
    'other_expense',
  ],
  it_services: [
    'services',
    'other_income',
    'rent',
    'telecom',
    'software',
    'equipment',
    'staff',
    'marketing',
    'other_expense',
  ],
  personal_services: [
    'services',
    'product_sales',
    'other_income',
    'consumables',
    'rent',
    'equipment',
    'transport',
    'staff',
    'other_expense',
  ],
};

export const categoriesFor = (sector: SectorId, type: OperationType): Category[] =>
  CATEGORY_IDS_BY_SECTOR[sector]
    .map((id) => CATALOG[id])
    .filter((category): category is Category => category !== undefined && category.type === type);

/** Libellé d'une catégorie ; renvoie l'identifiant brut si elle est inconnue. */
export const categoryLabel = (categoryId: string): string => CATALOG[categoryId]?.label ?? categoryId;

export const sectorLabel = (sector: SectorId): string =>
  SECTORS.find((item) => item.id === sector)?.label ?? sector;
