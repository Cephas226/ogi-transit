// ─── Enums / Union types ───────────────────────────────────────────────────

export type ConteneurStatut =
  | 'CREE'
  | 'EN_TRANSIT'
  | 'ARRIVE'
  | 'PRET_A_SORTIR'
  | 'SORTI';

export type ConteneurType =
  | 'FCL_20'
  | 'FCL_40'
  | 'FCL_40_HC'
  | 'LCL';

export type ConteneurOrigine = 'CHINE' | 'DUBAI';

export type ServiceType =
  | 'FCL_AWAYE'
  | 'FCL_HOME'
  | 'LCL_HOME';

export type TransitaireStatut = 'AFFECTE' | 'NON_AFFECTE' | 'EN_COURS';

// ─── Core domain models ───────────────────────────────────────────────────

export interface Transitaire {
  readonly id: string;
  readonly nom: string;
  readonly type: string;
  readonly rating?: number;
  readonly certifie?: boolean;
}

export interface ConteneurClient {
  readonly clientId: string;
  readonly clientNom: string;
  readonly markCode: string;
  readonly statut: 'SOLDE' | 'PARTIEL' | 'NON_PAYE';
  readonly resteUsd: number;
}

export interface Conteneur {
  readonly id: string;
  readonly reference: string;
  readonly bl: string;
  readonly label?: string;
  readonly type: ConteneurType;
  readonly serviceType: ServiceType;
  readonly origine: ConteneurOrigine;
  readonly statut: ConteneurStatut;
  readonly marque?: string;
  readonly portOrigine?: string;
  readonly fretUsd: number;
  readonly clients: ConteneurClient[];
  readonly transitaireId?: string;
  readonly transitaireNom?: string;
  readonly transitaireStatut: TransitaireStatut;
  readonly lotId?: string;
  readonly lotNom?: string;
  readonly dateArriveePrevu?: string;
  readonly dateArriveeReelle?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface Lot {
  readonly id: string;
  readonly nom: string;
  readonly nbConteneurs: number;
  readonly origine: ConteneurOrigine;
  readonly createdAt: string;
}

// ─── Workflow LCL ─────────────────────────────────────────────────────────

export type WorkflowStep =
  | 'IMPORT_PL'
  | 'VERIFICATION'
  | 'CALCUL'
  | 'PREVISUALISATION'
  | 'MODIFICATIONS'
  | 'VALIDATION'
  | 'GENERATION';

export type WorkflowStepStatus = 'pending' | 'active' | 'done';

export interface WorkflowStepDef {
  readonly key: WorkflowStep;
  readonly label: string;
  readonly status: WorkflowStepStatus;
}

export interface PackingListLine {
  readonly numero: number;
  readonly client: string;
  readonly mark: string;
  readonly cbm: number;
  readonly qty: number;
  readonly bgda: number;
  readonly fretUsd?: number;
  readonly transitGnf?: number;
  readonly statut?: 'PAYE' | 'PARTIEL' | 'NON_PAYE';
}

export interface PackingList {
  readonly filename: string;
  readonly sizeKo: number;
  readonly lignes: PackingListLine[];
  readonly fretTotalUsd: number;
  readonly coutTransitaireGnf: number;
  readonly prixVenteGnf: number;
  readonly margeBruteGnf: number;
  readonly margePct: number;
}

// ─── Affectation Transitaire ──────────────────────────────────────────────

export interface AffectationRequest {
  readonly conteneurId: string;
  readonly transitaireId: string;
  readonly coutTransitaireGnf: number;
  readonly prixVenteGnf: number;
  readonly statut: 'AFFECTE' | 'EN_COURS';
}

// ─── List / Filter ────────────────────────────────────────────────────────

export interface ConteneurFilters {
  readonly search: string;
  readonly statut: ConteneurStatut | '';
  readonly origine: ConteneurOrigine | '';
  readonly type: ConteneurType | '';
  readonly transitaireStatut: TransitaireStatut | '';
}

export interface ConteneurStats {
  readonly total: number;
  readonly arrives: number;
  readonly enCours: number;
  readonly sortis: number;
}

// ─── Label helpers (exported for use in components) ──────────────────────

export const STATUT_LABELS: Record<ConteneurStatut, string> = {
  CREE:          'Créé',
  EN_TRANSIT:    'En transit',
  ARRIVE:        'Arrivé',
  PRET_A_SORTIR: 'Prêt à sortir',
  SORTI:         'Sorti',
};

export const TYPE_LABELS: Record<ConteneurType, string> = {
  FCL_20:    "FCL 20'",
  FCL_40:    "FCL 40'",
  FCL_40_HC: "FCL 40' HC",
  LCL:       'LCL',
};

export const ORIGINE_LABELS: Record<ConteneurOrigine, string> = {
  CHINE: 'Chine',
  DUBAI: 'Dubaï',
};
