import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { BaseApiService } from '../../../infrastructure/api/services/base-api.service';
import type {
  Conteneur,
  ConteneurFilters,
  AffectationRequest,
  Lot,
  Transitaire,
  PackingList,
} from '../models/conteneur.models';
import {
  MOCK_CONTENEURS,
  MOCK_LOTS,
  MOCK_TRANSITAIRES,
  MOCK_PACKING_LIST,
} from '../../../infrastructure/mock-data/conteneurs.mock';
import { environment } from '../../../../environments/environment';

export interface ConteneurListResponse {
  readonly items: Conteneur[];
  readonly total: number;
}

@Injectable({ providedIn: 'root' })
export class ConteneursService extends BaseApiService {

  getAll(filters?: Partial<ConteneurFilters>): Observable<ConteneurListResponse> {
    if (environment.features.mockData) {
      return of({ items: MOCK_CONTENEURS, total: MOCK_CONTENEURS.length }).pipe(delay(400));
    }
    return this.get<ConteneurListResponse>('/conteneurs/', filters);
  }

  getById(id: string): Observable<Conteneur> {
    if (environment.features.mockData) {
      const item = MOCK_CONTENEURS.find((c) => c.id === id);
      if (!item) throw new Error(`Conteneur ${id} not found`);
      return of(item).pipe(delay(200));
    }
    return this.get<Conteneur>(`/conteneurs/${id}/`);
  }

  create(payload: Partial<Conteneur>): Observable<Conteneur> {
    if (environment.features.mockData) {
      const newItem: Conteneur = {
        ...payload,
        id: `c-${Date.now()}`,
        transitaireStatut: 'NON_AFFECTE',
        fretUsd: 0,
        clients: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Conteneur;
      return of(newItem).pipe(delay(600));
    }
    return this.post<Conteneur>('/conteneurs/', payload);
  }

  update(id: string, payload: Partial<Conteneur>): Observable<Conteneur> {
    if (environment.features.mockData) {
      const existing = MOCK_CONTENEURS.find((c) => c.id === id)!;
      return of({ ...existing, ...payload, updatedAt: new Date().toISOString() }).pipe(delay(400));
    }
    return this.patch<Conteneur>(`/conteneurs/${id}/`, payload);
  }

  affecterTransitaire(req: AffectationRequest): Observable<Conteneur> {
    if (environment.features.mockData) {
      const existing = MOCK_CONTENEURS.find((c) => c.id === req.conteneurId)!;
      const transitaire = MOCK_TRANSITAIRES.find((t) => t.id === req.transitaireId)!;
      return of({
        ...existing,
        transitaireId: req.transitaireId,
        transitaireNom: transitaire.nom,
        transitaireStatut: req.statut,
        updatedAt: new Date().toISOString(),
      }).pipe(delay(500));
    }
    return this.post<Conteneur>(`/conteneurs/${req.conteneurId}/affecter-transitaire/`, req);
  }

  getLots(): Observable<Lot[]> {
    if (environment.features.mockData) {
      return of(MOCK_LOTS).pipe(delay(200));
    }
    return this.get<Lot[]>('/lots/');
  }

  getTransitaires(): Observable<Transitaire[]> {
    if (environment.features.mockData) {
      return of(MOCK_TRANSITAIRES).pipe(delay(200));
    }
    return this.get<Transitaire[]>('/transitaires/');
  }

  importPackingList(_conteneurId: string, _file: File): Observable<PackingList> {
    if (environment.features.mockData) {
      return of(MOCK_PACKING_LIST).pipe(delay(800));
    }
    return this.post<PackingList>(`/conteneurs/${_conteneurId}/import-packing-list/`, { file: _file });
  }
}
