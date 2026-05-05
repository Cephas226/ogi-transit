import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface PaginatedResponse<T> {
  readonly results: T[];
  readonly count: number;
  readonly next: string | null;
  readonly previous: string | null;
}

export interface QueryParams {
  page?: number;
  pageSize?: number;
  ordering?: string;
  search?: string;
  [key: string]: string | number | boolean | undefined;
}

@Injectable({ providedIn: 'root' })
export abstract class BaseApiService {
  protected readonly http = inject(HttpClient);
  protected readonly baseUrl = environment.apiUrl;

  protected buildParams(query: QueryParams): HttpParams {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return params;
  }

  protected get<T>(path: string, query?: QueryParams): Observable<T> {
    const params = query ? this.buildParams(query) : undefined;
    return this.http.get<T>(`${this.baseUrl}${path}`, { params });
  }

  protected post<T, B = unknown>(path: string, body: B): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${path}`, body);
  }

  protected put<T, B = unknown>(path: string, body: B): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${path}`, body);
  }

  protected patch<T, B = Partial<unknown>>(path: string, body: B): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${path}`, body);
  }

  protected delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${path}`);
  }
}
