/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { cellHeight, cellWidth } from "./calendar.constants";

import TaskCard from "./TaskCardComponent";
import type { Holiday, Task } from "../../types/calendar.types";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "../dnd/Sortable";
import { Droppable } from "../dnd/Droppable";
import { getMonthName, isFirstOrLastDayOfMonth } from "../../utils/datetime";
import { getDayContainerDroppableId } from "./calendar.func";
import { useRef, useState } from "react";
import { css } from "@emotion/react";
import TaskInputCard, { type ChildFormHandle } from "./InputCard";
import { Check, Plus, X } from "lucide-react";

const DayCellContainer = styled.div`
  display: flex;
  flex-direction: column;

  height: ${cellHeight}px;
  width: ${cellWidth}px;

  border: 1px solid #ddd;
  box-sizing: border-box;
  background: #ebebeb;
  padding: 8px;
  overflow: hidden;
  cursor: default;
`;

const ColumnTitle = styled.div`
  color: #5e6c84;
  font-size: 14px;
  margin-top: 8px;
  margin-left: 4px;
  margin-bottom: 8px;
  text-align: start;
  display: flex;

  & > span:first-of-type {
    font-weight: 600;
    color: #172b4d;
    margin-right: 4px;
  }
`;

const TaskCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  flex: 1;
  min-height: 0;
`;

const DayCellButton = styled.button`
  width: 20px;
  height: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
`;

const HolidayContainer = styled.div`
  border: 1px solid black;
  text-align: start;
`;

export function DayCell({
  date,
  tasks,
  activeTaskId,
  addNewTaskToDay,
  currentMonthIndex,
  holidays,
}: {
  date: Date;
  tasks: Task[];
  addNewTaskToDay: (task: Task, date: Date) => void;
  activeTaskId?: string;
  currentMonthIndex: number;
  holidays: Holiday[];
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const formRef = useRef<ChildFormHandle>(null);

  const submitForm = () => {
    formRef.current?.save();
  };

  const getTitleString = () => {
    let title: string = String(date.getDate());

    if (isFirstOrLastDayOfMonth(date)) {
      title += ` ${getMonthName(date.getMonth(), undefined, true)}`;
    }

    return title;
  };

  const isDayActive = () => date.getMonth() === currentMonthIndex;

  const toggleIsFormOpen = () => setIsFormOpen((prev) => !prev);
  return (
    <DayCellContainer
      css={
        !isDayActive() &&
        css`
          opacity: 50%;
          pointer-events: none;
        `
      }
    >
      <ColumnTitle>
        <span>{getTitleString()} </span>
        {tasks.length > 0 && <span>{tasks.length} card</span>}
        <div
          css={css`
            display: flex;
            flex-direction: row;
            justify-content: end;
            flex-grow: 1;
          `}
        >
          <DayCellButton onClick={toggleIsFormOpen}>
            {isFormOpen ? <X></X> : <Plus></Plus>}
          </DayCellButton>

          {isFormOpen && (
            <DayCellButton onClick={submitForm}>
              <Check></Check>
            </DayCellButton>
          )}
        </div>
      </ColumnTitle>

      <Droppable id={getDayContainerDroppableId(date)} isActive={isDayActive()}>
        <TaskCardContainer>
          <SortableContext
            items={tasks}
            strategy={verticalListSortingStrategy}
            id={getDayContainerDroppableId(date)}
          >
            {holidays.map((holiday) => (
              <HolidayContainer key={holiday.countryCode + holiday.name}>
                {holiday.countryCode + " " + holiday.name}
              </HolidayContainer>
            ))}

            {isFormOpen && (
              <TaskInputCard
                createTask={addNewTaskToDay}
                date={date}
                closeInput={() => setIsFormOpen(false)}
                ref={formRef}
              ></TaskInputCard>
            )}

            {tasks.map((task) => (
              <SortableItem task={task} key={task.id}>
                <TaskCard
                  task={task}
                  isGhost={task.id === activeTaskId}
                  key={task.id}
                ></TaskCard>
              </SortableItem>
            ))}
          </SortableContext>
        </TaskCardContainer>
      </Droppable>
    </DayCellContainer>
  );
}
