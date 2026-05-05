export interface CaisseBalance {
  readonly id: string;
  readonly label: string;
  readonly currency: 'USD' | 'GNF';
  readonly region: 'CHINE' | 'DUBAI';
  readonly available: number;
  readonly trend?: number;
}

export interface CargoBalance {
  readonly id: string;
  readonly region: 'CHINE' | 'DUBAI';
  readonly label: string;
  readonly encaisse: number;
  readonly envoye: number;
  readonly enTransit: number;
  readonly disponible: number;
  readonly totalFacture: number;
  readonly creances: number;
}

export interface DashboardKpis {
  readonly conteneursActifs: number;
  readonly pretASortir: number;
  readonly cargoArrive: number;
  readonly crees: number;
  readonly creancesOuvertes: number;
  readonly creancesClients: number;
  readonly creancesGnf: number;
  readonly margeGnf: number;
  readonly margePct: number;
  readonly transitairesNonSoldes: number;
  readonly transitaireDus: number;
}

export interface RecentConteneur {
  readonly id: string;
  readonly reference: string;
  readonly bl: string;
  readonly type: string;
  readonly origine: string;
  readonly statut: ConteneurStatut;
  readonly clients: string[];
  readonly fretUsd: number;
  readonly solde: boolean;
  readonly reste?: number;
}

export type ConteneurStatut =
  | 'CREE'
  | 'EN_TRANSIT'
  | 'ARRIVE'
  | 'PRET_A_SORTIR'
  | 'SORTI';

export interface DashboardData {
  readonly caisses: CaisseBalance[];
  readonly cargoBalances: CargoBalance[];
  readonly kpis: DashboardKpis;
  readonly recentConteneurs: RecentConteneur[];
  readonly lastUpdated: string;
}
