import type { labelColorMap } from "../components/calendar/calendar.constants";

export type Task = {
  id: string;
  title: string;
  labels: Label[];
};

export type LabelColor = keyof typeof labelColorMap;

export type Label = {
  color: LabelColor;
};

export type DragEventData = {
  task: Task;
};

export type Holiday = {
  countryCode: string;
  date: string;
  name: string;
  global: boolean;
};
