export interface Site {
  id: string;
  name: string;
}

export interface Turbine {
  id: string;
  siteId: string;
  name: string;
}

export interface AlarmFilter {
  siteId: string;
  turbineId: string;
  startDateTime: string;
  endDateTime: string;
}

export interface RootCauseResult {
  id: string;
  startTime: string;
  endTime: string;
  rootCauseName: string;
  alarmCode: string;
  class: string;
  priority: "P1" | "P2";
}

export enum PriorityColor {
  P1 = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200",
  P2 = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200",
}
