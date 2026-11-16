export type Sector = 'commerce' | 'it_services' | 'services';
export type Horizon = 12 | 24 | 36;
export type ProjectStatus = 'draft' | 'assumptions_saved';

export interface SectorHints {
  investmentExamples: { label: string; amount: number }[];
  revenueExample: string;
  fixedChargesHint: string;
  variableChargesHint: string;
}

export interface SectorConfig {
  id: Sector;
  label: string;
  hints: SectorHints;
}

export interface ProjectSummary {
  id: string;
  name: string;
  sector: Sector | null;
  horizonMonths: Horizon;
  status: ProjectStatus;
  /** Étape à rouvrir : 1 = projet, 2 = hypothèses, 3 = résultats. */
  resumeStep: 1 | 2 | 3;
  updatedAt: string;
}

export interface Assumptions {
  initialInvestment: number;
  monthlyRevenue: number;
  fixedCharges: number;
  variableChargesPct: number;
  ownContribution: number;
  loanAmount: number;
  discountRatePct: number | null;
}

export interface Project extends ProjectSummary {
  startDate: string; // YYYY-MM-DD
  endDate: string;
  assumptions: Partial<Assumptions> | null;
  draftSavedAt: string | null;
}

export interface ProjectPayload {
  name: string;
  sector: Sector | null;
  horizonMonths: Horizon;
}

export interface SaveAssumptionsPayload {
  assumptions: Partial<Assumptions>;
  /** true = brouillon (champs partiels acceptés) ; false = version complète validée. */
  draft: boolean;
}

export interface ForecastResults {
  horizonMonths: number;
  revenueTotal: number;
  chargesTotal: number;
  netResult: number;
  monthlyNetResult: number;
  marginPct: number;
  roiPct: number | null;
  breakEvenMonthlyRevenue: number | null;
  /** Premier mois où les flux cumulés (investissement inclus) sont >= 0. */
  paybackMonth: number | null;
  paybackDetail: { previousMonth: number; previousCumulative: number; month: number; cumulative: number } | null;
  treasury: {
    startBalance: number;
    endBalance: number;
    monthlyNet: number;
    series: { month: number; balance: number }[];
  };
  npv: number | null;
  discountRatePct: number | null;
}

export interface ReportRisk {
  id: string;
  title: string;
  message: string;
}

export interface ForecastReport {
  generatedAt: string;
  version: number;
  project: Pick<Project, 'id' | 'name' | 'sector' | 'horizonMonths' | 'startDate' | 'endDate'>;
  assumptions: Assumptions;
  results: ForecastResults;
  risks: ReportRisk[];
}

export type RecentWorkItem =
  | { kind: 'forecast'; id: string; name: string; horizonMonths: number; updatedAt: string; status: ProjectStatus; resumeStep: 1 | 2 | 3 }
  | { kind: 'tracking'; id: string; name: string; periodLabel: string; operationsCount: number };
