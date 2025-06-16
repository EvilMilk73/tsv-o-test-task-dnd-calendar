import { useDroppable } from "@dnd-kit/core";
import { type ReactNode } from "react";

export function Droppable(props: {
  children: ReactNode;
  id: string;
  isActive?: boolean;
}) {
  const droppable = useDroppable({ id: props.id });
  const setNodeRef = props.isActive ? droppable.setNodeRef : undefined;

  return (
    <div
      ref={setNodeRef}
      style={{
        flex: 1,
        // backgroundColor: "lightgreen",
        minHeight: 0,
        pointerEvents: props.isActive ? "auto" : "none",
      }}
    >
      {props.children}
    </div>
  );
}
