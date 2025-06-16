//shared types will be better, but this good for now
export type Task = {
  id: string;
  title: string;
  labels: Label[];
};

export type Label = {
  color: string;
};
