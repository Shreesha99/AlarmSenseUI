
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
  priority: 'High' | 'Medium' | 'Low';
}

export enum PriorityColor {
  High = 'text-red-600 font-bold',
  Medium = 'text-orange-500 font-bold',
  Low = 'text-green-600 font-bold'
}
