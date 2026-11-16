import type { Sector, SectorConfig, SectorHints } from './types';

// Configuration de secours (US-T2) : B1 l'expose via GET /config/sectors ;
// ces valeurs servent tant que l'API ne répond pas.
export const DEFAULT_SECTORS: SectorConfig[] = [
  {
    id: 'commerce',
    label: 'Commerce et distribution',
    hints: {
      investmentExamples: [
        { label: 'Stock de départ', amount: 1_500_000 },
        { label: 'Aménagement de la boutique', amount: 800_000 },
      ],
      revenueExample: 'Exemple : 60 000 FCFA de ventes par jour pendant 25 jours.',
      fixedChargesHint: 'À payer même sans vente : loyer, salaires, électricité.',
      variableChargesHint: 'Achat des marchandises vendues, emballages et livraison',
    },
  },
  {
    id: 'it_services',
    label: 'Services informatiques et numériques',
    hints: {
      investmentExamples: [
        { label: 'Ordinateurs et matériel', amount: 2_000_000 },
        { label: 'Installation et lancement', amount: 1_000_000 },
      ],
      revenueExample: 'Exemple : 3 sites web facturés 400 000 FCFA chacun.',
      fixedChargesHint: 'À payer même sans client : local, logiciels et connexion.',
      variableChargesHint: 'Sous-traitance et frais liés aux missions',
    },
  },
  {
    id: 'services',
    label: 'Services aux particuliers et aux entreprises',
    hints: {
      investmentExamples: [
        { label: 'Équipement et outils', amount: 1_200_000 },
        { label: 'Lancement et communication', amount: 500_000 },
      ],
      revenueExample: 'Exemple : 30 prestations facturées 25 000 FCFA chacune.',
      fixedChargesHint: 'À payer même sans client : local, assurance, abonnements.',
      variableChargesHint: 'Consommables, transport et frais liés à chaque prestation',
    },
  },
];

export const sectorLabel = (id: Sector | null, sectors: SectorConfig[] = DEFAULT_SECTORS): string =>
  sectors.find((s) => s.id === id)?.label ?? 'Secteur à choisir';

/** Textes d'aide génériques, utilisés si le secteur du projet n'est pas encore choisi. */
export const GENERIC_HINTS: SectorHints = {
  investmentExamples: [],
  revenueExample: 'Exemple : le chiffre d’affaires que vous espérez encaisser chaque mois.',
  fixedChargesHint: 'À payer même sans client : loyer, abonnements, salaires.',
  variableChargesHint: 'Frais qui augmentent avec votre activité',
};
