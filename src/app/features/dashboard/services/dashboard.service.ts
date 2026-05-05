import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import type { DashboardData } from '../models/dashboard.models';
import { MOCK_DASHBOARD } from '../../../infrastructure/mock-data/dashboard.mock';
import { environment } from '../../../../environments/environment';
import { BaseApiService } from '../../../infrastructure/api/services/base-api.service';

@Injectable({ providedIn: 'root' })
export class DashboardService extends BaseApiService {
  getDashboardData(): Observable<DashboardData> {
    if (environment.features.mockData) {
      return of(MOCK_DASHBOARD).pipe(delay(300));
    }
    return this.get<DashboardData>('/dashboard/');
  }
}
