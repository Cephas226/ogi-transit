import type {
  Conteneur,
  Lot,
  Transitaire,
  PackingList,
} from '../../features/conteneurs/models/conteneur.models';

export const MOCK_TRANSITAIRES: Transitaire[] = [
  { id: 'tr-01', nom: 'Groupe Transit Conakry', type: 'TRANSITAIRE', rating: 4.8, certifie: true },
  { id: 'tr-02', nom: 'Alpha Transit Guinée',   type: 'TRANSITAIRE', rating: 4.2 },
  { id: 'tr-03', nom: 'Transitaire Dubaï SARL', type: 'TRANSITAIRE', rating: 4.5 },
  { id: 'tr-04', nom: 'Guinée Port Services',   type: 'TRANSITAIRE', rating: 4.0 },
];

export const MOCK_LOTS: Lot[] = [
  { id: 'LOT-042', nom: 'LOT-042', nbConteneurs: 12, origine: 'CHINE', createdAt: '2023-03-01T00:00:00Z' },
  { id: 'LOT-041', nom: 'LOT-041', nbConteneurs: 8,  origine: 'DUBAI', createdAt: '2023-09-01T00:00:00Z' },
  { id: 'LOT-040', nom: 'LOT-040', nbConteneurs: 22, origine: 'CHINE', createdAt: '2023-09-15T00:00:00Z' },
  { id: 'LOT-039', nom: 'LOT-039', nbConteneurs: 14, origine: 'DUBAI', createdAt: '2023-08-01T00:00:00Z' },
];

export const MOCK_CONTENEURS: Conteneur[] = [
  {
    id: 'c-001', reference: 'SV-4429-X', bl: 'COS6199201',
    type: 'FCL_40', serviceType: 'FCL_HOME', origine: 'CHINE', statut: 'ARRIVE',
    marque: 'COSCO', portOrigine: 'Shanghai',
    fretUsd: 4200,
    clients: [
      { clientId: 'cli-01', clientNom: 'Home Design SARL', markCode: 'HDS-01', statut: 'SOLDE', resteUsd: 0 },
      { clientId: 'cli-05', clientNom: 'Textile Guinée',   markCode: 'TGU-02', statut: 'SOLDE', resteUsd: 0 },
    ],
    transitaireId: 'tr-01', transitaireNom: 'Groupe Transit Conakry', transitaireStatut: 'AFFECTE',
    lotId: 'LOT-042', lotNom: 'LOT-042',
    dateArriveePrevu: '2024-03-10', dateArriveeReelle: '2024-03-12',
    createdAt: '2024-02-01T00:00:00Z', updatedAt: '2024-03-12T09:00:00Z',
  },
  {
    id: 'c-002', reference: 'SV-9912-A', bl: 'MSK002931',
    type: 'LCL', serviceType: 'LCL_HOME', origine: 'DUBAI', statut: 'PRET_A_SORTIR',
    fretUsd: 2850,
    clients: [
      { clientId: 'cli-02', clientNom: 'Kaba & Fils', markCode: 'KF-01', statut: 'PARTIEL', resteUsd: 850 },
    ],
    transitaireId: undefined, transitaireNom: undefined, transitaireStatut: 'NON_AFFECTE',
    lotId: 'LOT-041', lotNom: 'LOT-041',
    dateArriveePrevu: '2024-03-15',
    createdAt: '2024-02-10T00:00:00Z', updatedAt: '2024-03-14T11:00:00Z',
  },
  {
    id: 'c-003', reference: 'SV-3301-K', bl: 'PIL440029',
    type: 'FCL_20', serviceType: 'FCL_HOME', origine: 'CHINE', statut: 'CREE',
    fretUsd: 1900,
    clients: [
      { clientId: 'cli-03', clientNom: 'Alpha Diallo', markCode: 'AD-01', statut: 'NON_PAYE', resteUsd: 1900 },
    ],
    transitaireId: undefined, transitaireNom: undefined, transitaireStatut: 'NON_AFFECTE',
    lotId: 'LOT-042', lotNom: 'LOT-042',
    dateArriveePrevu: '2024-04-01',
    createdAt: '2024-02-15T00:00:00Z', updatedAt: '2024-02-15T10:00:00Z',
  },
  {
    id: 'c-004', reference: 'SV-1024-X', bl: 'ONEY772210',
    type: 'FCL_40', serviceType: 'FCL_AWAYE', origine: 'CHINE', statut: 'SORTI',
    fretUsd: 3150,
    clients: [
      { clientId: 'cli-04', clientNom: 'Saliou & Co', markCode: 'SC-01', statut: 'SOLDE', resteUsd: 0 },
    ],
    transitaireId: 'tr-02', transitaireNom: 'Alpha Transit Guinée', transitaireStatut: 'AFFECTE',
    lotId: 'LOT-040', lotNom: 'LOT-040',
    dateArriveePrevu: '2024-02-20', dateArriveeReelle: '2024-02-22',
    createdAt: '2024-01-10T00:00:00Z', updatedAt: '2024-03-01T14:00:00Z',
  },
  {
    id: 'c-005', reference: 'SV-5512-B', bl: 'CMAU882910',
    type: 'LCL', serviceType: 'LCL_HOME', origine: 'DUBAI', statut: 'PRET_A_SORTIR',
    fretUsd: 2400,
    clients: [
      { clientId: 'cli-06', clientNom: 'Barry Import', markCode: 'BI-01', statut: 'PARTIEL', resteUsd: 1200 },
    ],
    transitaireId: undefined, transitaireNom: undefined, transitaireStatut: 'NON_AFFECTE',
    dateArriveePrevu: '2024-03-18',
    createdAt: '2024-02-20T00:00:00Z', updatedAt: '2024-03-17T08:00:00Z',
  },
  {
    id: 'c-006', reference: 'SV-8821-C', bl: 'MSC001192',
    type: 'FCL_20', serviceType: 'FCL_HOME', origine: 'CHINE', statut: 'ARRIVE',
    marque: 'MSC',
    fretUsd: 1800,
    clients: [
      { clientId: 'cli-07', clientNom: 'Textile Guinee', markCode: 'TG-01', statut: 'PARTIEL', resteUsd: 600 },
    ],
    transitaireId: 'tr-01', transitaireNom: 'Groupe Transit Conakry', transitaireStatut: 'AFFECTE',
    lotId: 'LOT-042', lotNom: 'LOT-042',
    dateArriveePrevu: '2024-03-08', dateArriveeReelle: '2024-03-09',
    createdAt: '2024-02-05T00:00:00Z', updatedAt: '2024-03-09T12:00:00Z',
  },
  {
    id: 'c-007', reference: 'SV-2104-Y', bl: 'ZIM882231',
    type: 'FCL_40', serviceType: 'FCL_AWAYE', origine: 'CHINE', statut: 'SORTI',
    fretUsd: 3800,
    clients: [
      { clientId: 'cli-08', clientNom: 'Boutique Moderne', markCode: 'BM-01', statut: 'SOLDE', resteUsd: 0 },
    ],
    transitaireId: 'tr-03', transitaireNom: 'Transitaire Dubaï SARL', transitaireStatut: 'AFFECTE',
    lotId: 'LOT-041', lotNom: 'LOT-041',
    dateArriveePrevu: '2024-01-15', dateArriveeReelle: '2024-01-17',
    createdAt: '2023-12-20T00:00:00Z', updatedAt: '2024-02-01T10:00:00Z',
  },
  {
    id: 'c-008', reference: 'SV-4409-Z', bl: 'CMA772110',
    type: 'LCL', serviceType: 'LCL_HOME', origine: 'DUBAI', statut: 'CREE',
    fretUsd: 1200,
    clients: [
      { clientId: 'cli-09', clientNom: 'Confection Luxe', markCode: 'CL-01', statut: 'NON_PAYE', resteUsd: 1200 },
    ],
    transitaireId: undefined, transitaireNom: undefined, transitaireStatut: 'NON_AFFECTE',
    dateArriveePrevu: '2024-04-10',
    createdAt: '2024-03-01T00:00:00Z', updatedAt: '2024-03-01T09:00:00Z',
  },
  {
    id: 'c-009', reference: 'SV-7712-D', bl: 'HLC661002',
    type: 'FCL_40', serviceType: 'FCL_HOME', origine: 'CHINE', statut: 'PRET_A_SORTIR',
    fretUsd: 2900,
    clients: [
      { clientId: 'cli-10', clientNom: 'Auto Parts 224', markCode: 'AP-01', statut: 'NON_PAYE', resteUsd: 2900 },
    ],
    transitaireId: undefined, transitaireNom: undefined, transitaireStatut: 'NON_AFFECTE',
    lotId: 'LOT-040', lotNom: 'LOT-040',
    dateArriveePrevu: '2024-03-20', dateArriveeReelle: '2024-03-21',
    createdAt: '2024-02-25T00:00:00Z', updatedAt: '2024-03-21T15:00:00Z',
  },
  {
    id: 'c-010', reference: 'SV-9911-E', bl: 'MSK990021',
    type: 'LCL', serviceType: 'LCL_HOME', origine: 'DUBAI', statut: 'SORTI',
    fretUsd: 1600,
    clients: [
      { clientId: 'cli-11', clientNom: 'Global Trade', markCode: 'GT-01', statut: 'SOLDE', resteUsd: 0 },
    ],
    transitaireId: 'tr-03', transitaireNom: 'Transitaire Dubaï SARL', transitaireStatut: 'AFFECTE',
    lotId: 'LOT-039', lotNom: 'LOT-039',
    dateArriveePrevu: '2024-02-10', dateArriveeReelle: '2024-02-11',
    createdAt: '2024-01-20T00:00:00Z', updatedAt: '2024-03-05T11:00:00Z',
  },
];

export const MOCK_PACKING_LIST: PackingList = {
  filename: 'PL_MSCU5498201-2_MARS2025.xlsx',
  sizeKo: 147,
  fretTotalUsd: 38900,
  coutTransitaireGnf: 38000000,
  prixVenteGnf: 52000000,
  margeBruteGnf: 14000000,
  margePct: 27,
  lignes: [
    { numero: 1, client: 'Ibrahima Diallo',   mark: 'ID-CO-24', cbm: 1.2, qty: 12, bgda: 180000 },
    { numero: 2, client: 'Fatoumata Camara',  mark: 'FC-CO-99', cbm: 2.5, qty: 24, bgda: 250000 },
    { numero: 3, client: 'Moussa Keita',      mark: 'MK-CO-12', cbm: 0.8, qty:  5, bgda:  95000 },
    { numero: 4, client: 'Sékou Touré',       mark: 'ST-CO-43', cbm: 4.1, qty: 48, bgda: 410000 },
  ],
};
