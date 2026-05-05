import type { User } from '../../core/auth/models/auth.models';

export const MOCK_USERS: User[] = [
  {
    id: 'usr-001',
    email: 'admin@ogi.com',
    firstName: 'Alpha',
    lastName: 'O Diallo',
    role: 'GERANT',
    initials: 'AD',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 'usr-002',
    email: 'finance@ogi.com',
    firstName: 'Kadiatou',
    lastName: 'Sylla',
    role: 'FINANCE',
    initials: 'KS',
    isActive: true,
    createdAt: '2023-01-15T00:00:00Z',
  },
  {
    id: 'usr-003',
    email: 'logistique@ogi.com',
    firstName: 'Ibrahima',
    lastName: 'Kouyaté',
    role: 'LOGISTIQUE',
    initials: 'IK',
    isActive: true,
    createdAt: '2023-02-01T00:00:00Z',
  },
  {
    id: 'usr-004',
    email: 'pdg@ogi.com',
    firstName: 'Mamadou',
    lastName: 'Bah',
    role: 'PDG',
    initials: 'MB',
    isActive: true,
    createdAt: '2022-12-01T00:00:00Z',
  },
];

export const MOCK_CREDENTIALS: Record<string, string> = {
  'admin@ogi.com': 'password',
  'finance@ogi.com': 'password',
  'logistique@ogi.com': 'password',
  'pdg@ogi.com': 'password',
};
