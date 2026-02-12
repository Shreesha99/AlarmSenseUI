import { of, Observable } from "rxjs";
import { delay } from "rxjs/operators";
import { Site, Turbine, RootCauseResult, AlarmFilter } from "../types";

const MOCK_SITES: Site[] = [
  { id: "S1", name: "North Sea Wind Park" },
  { id: "S2", name: "Texas Ridge Energy" },
  { id: "S3", name: "Bavarian Highlands" },
];

const MOCK_TURBINES: Turbine[] = [
  { id: "T1-1", siteId: "S1", name: "NS-WTG-001" },
  { id: "T1-2", siteId: "S1", name: "NS-WTG-002" },
  { id: "T1-3", siteId: "S1", name: "NS-WTG-003" },
  { id: "T2-1", siteId: "S2", name: "TX-WTG-A1" },
  { id: "T2-2", siteId: "S2", name: "TX-WTG-A2" },
  { id: "T3-1", siteId: "S3", name: "BV-WTG-X01" },
];

// Generate dynamic dates near today so filtering works
const generateMockResults = (): RootCauseResult[] => {
  const baseDate = new Date();

  return Array.from({ length: 45 }).map((_, i) => {
    const randomOffsetDays = Math.floor(Math.random() * 10) - 5;

    const start = new Date(baseDate);
    start.setDate(start.getDate() + randomOffsetDays);
    start.setHours(8, 30, 0, 0);

    const end = new Date(start);
    end.setMinutes(start.getMinutes() + 45);

    return {
      id: `ALM-${i + 100}`,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      rootCauseName:
        i % 3 === 0
          ? "Gearbox Overheat"
          : i % 2 === 0
          ? "Grid Instability"
          : "Yaw Controller Failure",
      alarmCode: `ERR-00${Math.floor(Math.random() * 90) + 10}`,
      class: i % 2 === 0 ? "Mechanical" : "Electrical",
      priority: i % 5 === 0 ? "High" : i % 3 === 0 ? "Medium" : "Low",
    };
  });
};

const MOCK_RESULTS: RootCauseResult[] = generateMockResults();

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
    const filtered = MOCK_TURBINES.filter((t) => t.siteId === siteId);
    return of(filtered).pipe(delay(300));
  }

  /**
   * Future API Endpoint: POST /api/alarmsense/rootcause
   */
  findRootCause(filter: AlarmFilter): Observable<RootCauseResult[]> {
    const start = filter.startDateTime ? new Date(filter.startDateTime) : null;

    const end = filter.endDateTime ? new Date(filter.endDateTime) : null;

    const filtered = MOCK_RESULTS.filter((item) => {
      const itemDate = new Date(item.startTime);

      if (start && itemDate < start) return false;
      if (end && itemDate > end) return false;

      return true;
    });

    return of(filtered).pipe(delay(600));
  }
}

export const alarmService = new AlarmService();
