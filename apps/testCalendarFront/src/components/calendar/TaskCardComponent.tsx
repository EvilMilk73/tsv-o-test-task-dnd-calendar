/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import type { LabelColor, Task } from "../../types/calendar.types";
import { css } from "@emotion/react";
import { labelColorMap } from "./calendar.constants";

const Card = styled.div`
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #172b4d;
  text-align: start;
`;

const Labels = styled.div`
  display: flex;
  gap: 4px;
`;

const Label = styled.div<{ variant: LabelColor }>`
  height: 8px;
  border-radius: 4px;
  width: 40px;
  background-color: ${({ variant }) => labelColorMap[variant]};
`;

function TaskCard({ task, isGhost }: { task: Task; isGhost?: boolean }) {
  return (
    <Card
      css={
        isGhost &&
        css`
          opacity: 50%;
        `
      }
    >
      <Labels>
        {task.labels.map((label) => (
          <Label variant={label.color} key={label.color}></Label>
        ))}
      </Labels>
      <CardTitle>{task.title}</CardTitle>
    </Card>
  );
}

export default TaskCard;
