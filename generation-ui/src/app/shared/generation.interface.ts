export interface GenerationData {
  day: string;
  projects: ProjectData[];
}

export interface ProjectData {
  id: string;
  name: string;
}

export interface ScheduleData {
  date?: Date
  schedules: Schedule[];
}

export interface Date {
  fullDate: string;
  weekDay: string;
  month: string;
  day: string;
  year: string;
};

export interface Schedule {
  id: string;
  timeline: number[];
  total: number;
}
