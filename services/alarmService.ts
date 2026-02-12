
import { of, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Site, Turbine, RootCauseResult, AlarmFilter } from '../types';

const MOCK_SITES: Site[] = [
  { id: 'S1', name: 'North Sea Wind Park' },
  { id: 'S2', name: 'Texas Ridge Energy' },
  { id: 'S3', name: 'Bavarian Highlands' },
];

const MOCK_TURBINES: Turbine[] = [
  { id: 'T1-1', siteId: 'S1', name: 'NS-WTG-001' },
  { id: 'T1-2', siteId: 'S1', name: 'NS-WTG-002' },
  { id: 'T1-3', siteId: 'S1', name: 'NS-WTG-003' },
  { id: 'T2-1', siteId: 'S2', name: 'TX-WTG-A1' },
  { id: 'T2-2', siteId: 'S2', name: 'TX-WTG-A2' },
  { id: 'T3-1', siteId: 'S3', name: 'BV-WTG-X01' },
];

const MOCK_RESULTS: RootCauseResult[] = Array.from({ length: 45 }).map((_, i) => ({
  id: `ALM-${i + 100}`,
  startTime: `2024-05-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} 08:30`,
  endTime: `2024-05-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} 09:15`,
  rootCauseName: i % 3 === 0 ? 'Gearbox Overheat' : i % 2 === 0 ? 'Grid Instability' : 'Yaw Controller Failure',
  alarmCode: `ERR-00${Math.floor(Math.random() * 90) + 10}`,
  class: i % 2 === 0 ? 'Mechanical' : 'Electrical',
  priority: i % 5 === 0 ? 'High' : i % 3 === 0 ? 'Medium' : 'Low',
}));

export class AlarmService {
  /**
   * Future API Endpoint: GET /api/alarmsense/sites
   */
  getSites(): Observable<Site[]> {
    return of(MOCK_SITES).pipe(delay(400));
  }

  /**
   * Future API Endpoint: GET /api/alarmsense/turbines?siteId={siteId}
   */
  getTurbinesBySite(siteId: string): Observable<Turbine[]> {
    const filtered = MOCK_TURBINES.filter(t => t.siteId === siteId);
    return of(filtered).pipe(delay(300));
  }

  /**
   * Future API Endpoint: POST /api/alarmsense/rootcause
   */
  findRootCause(filter: AlarmFilter): Observable<RootCauseResult[]> {
    // In a real API, the filter would be sent in the body
    return of(MOCK_RESULTS).pipe(delay(600));
  }
}

export const alarmService = new AlarmService();
