export type UserRole =
  | 'ADMIN'
  | 'PDG'
  | 'GERANT'
  | 'FINANCE'
  | 'LOGISTIQUE'
  | 'OPERATEUR';

export interface User {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly role: UserRole;
  readonly initials: string;
  readonly isActive: boolean;
  readonly createdAt: string;
}

export interface AuthCredentials {
  readonly email: string;
  readonly password: string;
}

export interface AuthTokens {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresIn: number;
}

export interface AuthState {
  readonly user: User | null;
  readonly tokens: AuthTokens | null;
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
  readonly error: string | null;
}

export interface LoginResponse {
  readonly user: User;
  readonly tokens: AuthTokens;
}

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  ADMIN: 6,
  PDG: 5,
  GERANT: 4,
  FINANCE: 3,
  LOGISTIQUE: 2,
  OPERATEUR: 1,
};

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Administrateur',
  PDG: 'PDG',
  GERANT: 'Gérant',
  FINANCE: 'Collaborateur Financier',
  LOGISTIQUE: 'Responsable Logistique',
  OPERATEUR: 'Opérateur',
};
