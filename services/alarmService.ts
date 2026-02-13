import { of, Observable, from } from "rxjs";
import { delay, map, catchError } from "rxjs/operators";
import { Site, Turbine, RootCauseResult, AlarmFilter } from "../types";
import axios from "axios";

const API_BASE = "https://localhost:7155/api/alarmsense";

/* ---------------- MOCK DATA ---------------- */

const MOCK_SITES: Site[] = [
  { id: "S1", name: "North Sea Wind Park" },
  { id: "S2", name: "Texas Ridge Energy" },
  { id: "S3", name: "Bavarian Highlands" },
];

const MOCK_TURBINES: Turbine[] = [
  { id: "T1-1", siteId: "S1", name: "NS-WTG-001" },
  { id: "T1-2", siteId: "S1", name: "NS-WTG-002" },
  { id: "T1-3", siteId: "S1", name: "NS-WTG-003" },
];

const MOCK_RESULTS: RootCauseResult[] = Array.from({ length: 20 }).map(
  (_, i) => ({
    id: `MOCK-${i}`,
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    rootCauseName: "Mock Root Cause",
    alarmCode: `AL${1000 + i}`,
    class: "A",
    priority: "P1",
  })
);

/* ---------------- API RESPONSE TYPE ---------------- */

interface ApiRootCauseResponse {
  id?: string;
  Id?: string;
  startTime?: string;
  StartTime?: string;
  endTime?: string;
  EndTime?: string;
  rootCauseName?: string;
  RootCauseName?: string;
  alarmCode?: string;
  AlarmCode?: string;
  class?: string;
  Class?: string;
  priority?: string;
  Priority?: string;
}

/* ---------------- SERVICE ---------------- */

export class AlarmService {
  getSites(): Observable<Site[]> {
    return from(axios.get<Site[]>(`${API_BASE}/sites`)).pipe(
      map((res) =>
        res.data.map((s) => ({
          id: (s as any).id ?? (s as any).Id,
          name: (s as any).name ?? (s as any).Name,
        }))
      ),
      catchError(() => of(MOCK_SITES).pipe(delay(300)))
    );
  }

  getTurbinesBySite(siteId: string): Observable<Turbine[]> {
    return from(
      axios.get<Turbine[]>(`${API_BASE}/turbines`, {
        params: { siteId },
      })
    ).pipe(
      map((res) =>
        res.data.map((t) => ({
          id: (t as any).id ?? (t as any).Id,
          name: (t as any).name ?? (t as any).Name,
          siteId: (t as any).siteId ?? (t as any).SiteId,
        }))
      ),
      catchError(() =>
        of(MOCK_TURBINES.filter((t) => t.siteId === siteId)).pipe(delay(300))
      )
    );
  }

  findRootCause(filter: AlarmFilter): Observable<RootCauseResult[]> {
    return from(
      axios.post<ApiRootCauseResponse[]>(`${API_BASE}/rootcause`, filter)
    ).pipe(
      map((res) =>
        res.data.map(
          (r, index): RootCauseResult => ({
            id:
              r.id ?? r.Id ?? (r.alarmCode ?? r.AlarmCode ?? "UNKNOWN") + index,

            startTime: r.startTime ?? r.StartTime ?? "",
            endTime: r.endTime ?? r.EndTime ?? "",
            rootCauseName: r.rootCauseName ?? r.RootCauseName ?? "",
            alarmCode: r.alarmCode ?? r.AlarmCode ?? "",
            class: r.class ?? r.Class ?? "",

            priority: (r.priority ?? r.Priority) === "P1" ? "P1" : "P2",
          })
        )
      ),
      catchError(() => of(MOCK_RESULTS).pipe(delay(500)))
    );
  }
}

export const alarmService = new AlarmService();
