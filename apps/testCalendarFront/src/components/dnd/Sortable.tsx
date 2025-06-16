import { useSortable } from "@dnd-kit/sortable";
import { type ReactNode } from "react";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../../types/calendar.types";

export function SortableItem(props: { children: ReactNode; task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.task.id, data: { task: props.task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {props.children}
    </div>
  );
}
