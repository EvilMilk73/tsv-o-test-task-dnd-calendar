import styled from "@emotion/styled";

import { forwardRef, useImperativeHandle, useState } from "react";
import type {
  Label as LabelType,
  LabelColor,
  Task,
} from "../../types/calendar.types";
import { labelColorMap } from "./calendar.constants";

const Card = styled.div`
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  font-size: 14px;
  font-weight: 500;
  color: #172b4d;
  border: none;
  outline: none;
  background: transparent;
  padding: 4px 0;

  &::placeholder {
    color: #a5adba;
  }
`;

const Labels = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 6px;
`;

type LabelOpacity = "normal" | "ghost";

const Label = styled.div<{ variant: LabelColor; opacity?: LabelOpacity }>`
  height: 8px;
  border-radius: 4px;
  width: 40px;
  cursor: pointer;
  background-color: ${({ variant }) => labelColorMap[variant]};

  opacity: ${({ opacity = "normal" }) =>
    opacity === "ghost" ? `50%` : "100%"};
`;

export type ChildFormHandle = {
  save: () => void;
};

type TaskInputCardProps = {
  initialValue?: string;
  createTask: (task: Task, date: Date) => void;
  date: Date;
  closeInput: () => void;
};
const TaskInputCard = forwardRef<ChildFormHandle, TaskInputCardProps>(
  ({ initialValue = "", createTask, date, closeInput }, ref) => {
    const [title, setTitle] = useState(initialValue);

    const [labels, setLabels] = useState<LabelColor[]>([]);

    useImperativeHandle(ref, () => ({
      save() {
        onSave();
      },
    }));

    const onSave = () => {
      if (title !== "")
        createTask(
          {
            id: crypto.randomUUID(),
            title: title,
            labels: labels.map(
              (labelColor) => ({ color: labelColor } satisfies LabelType)
            ),
          },
          date
        );
      closeInput();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onSave();
      } else if (e.key === "Escape") {
        closeInput();
      }
    };

    const toggleLabel = (label: LabelColor) => {
      setLabels((prev) => {
        if (prev.includes(label)) {
          return prev.filter((l) => l !== label);
        } else {
          return [...prev, label];
        }
      });
    };

    return (
      <Card>
        <Labels>
          {(Object.keys(labelColorMap) as LabelColor[]).map((labelColor) => (
            <Label
              variant={labelColor}
              opacity={labels.includes(labelColor) ? "normal" : "ghost"}
              onClick={() => toggleLabel(labelColor)}
              key={labelColor}
            ></Label>
          ))}
        </Labels>
        <Input
          autoFocus
          value={title}
          placeholder="New task title"
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </Card>
    );
  }
);

export default TaskInputCard;
