import type { DashboardData } from '../../features/dashboard/models/dashboard.models';

export const MOCK_DASHBOARD: DashboardData = {
  caisses: [
    { id: 'usd-cn',  label: 'CAISSE USD CHINE',  currency: 'USD', region: 'CHINE', available: 84320 },
    { id: 'gnf-cn',  label: 'CAISSE GNF CHINE',  currency: 'GNF', region: 'CHINE', available: 286000000 },
    { id: 'usd-dxb', label: 'CAISSE USD DUBAI',  currency: 'USD', region: 'DUBAI', available: 31080, trend: 8 },
    { id: 'gnf-dxb', label: 'CAISSE GNF DUBAI',  currency: 'GNF', region: 'DUBAI', available: 194000000 },
  ],
  cargoBalances: [
    {
      id: 'BLC-CN-2024', region: 'CHINE', label: 'Balance Cargo Chine',
      encaisse: 284000, envoye: 196000, enTransit: 48000, disponible: 84320,
      totalFacture: 312000, creances: 28000,
    },
    {
      id: 'BLC-DXB-2024', region: 'DUBAI', label: 'Balance Cargo Dubai',
      encaisse: 89200, envoye: 52000, enTransit: 6120, disponible: 31080,
      totalFacture: 94400, creances: 5200,
    },
  ],
  kpis: {
    conteneursActifs: 23, pretASortir: 4, cargoArrive: 12, crees: 7,
    creancesOuvertes: 18, creancesClients: 94500, creancesGnf: 195000000,
    margeGnf: 48000000, margePct: 31, transitairesNonSoldes: 5, transitaireDus: 38500000,
  },
  recentConteneurs: [
    { id: 'c1', reference: "SV-4429-X", bl: 'COS6199201', type: "FCL 40'", origine: 'Chine', statut: 'ARRIVE',        clients: ['Home Design SARL', '+3 autres'], fretUsd: 4200, solde: true },
    { id: 'c2', reference: "SV-9912-A", bl: 'MSK002931', type: 'LCL',     origine: 'Dubai', statut: 'SORTI',         clients: ['Kaba & Fils'],   fretUsd: 2850, solde: false, reste: 850 },
    { id: 'c3', reference: "SV-3301-K", bl: 'PIL440029', type: "FCL 20'", origine: 'Chine', statut: 'CREE',          clients: ['Alpha Diallo'],  fretUsd: 1900, solde: false, reste: 1900 },
    { id: 'c4', reference: "SV-1024-X", bl: 'ONEY772210',type: "FCL 40'", origine: 'Chine', statut: 'SORTI',         clients: ['Saliou & Co'],   fretUsd: 3150, solde: true },
    { id: 'c5', reference: "SV-5512-B", bl: 'CMAU882910',type: 'LCL',     origine: 'Dubai', statut: 'PRET_A_SORTIR', clients: ['Barry Import'],  fretUsd: 2400, solde: false, reste: 1200 },
  ],
  lastUpdated: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
};
