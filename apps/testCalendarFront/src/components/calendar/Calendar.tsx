import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DayCell } from "./DayCell";
import {
  cellHeight,
  cellWidth,
  dayContainerPrefix,
  daysOfWeek,
  defaultGap,
} from "./calendar.constants";
import {
  getCurrentMonthIndex,
  getCurrentYear,
  getFirstDayOfMonthWeekIndex,
  getLastDayOfPrevMonthIndex,
  getShortDateString,
} from "../../utils/datetime";
import { ControlsHeaderRow } from "./ControlsCalendarHeader";
import { flushSync } from "react-dom";
import type { Holiday, Task } from "../../types/calendar.types";

import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import TaskCard from "./TaskCardComponent";
import {
  fetchVisibleHolidays,
  fetchVisibleTasks,
  getTaskStoreKeyByDayDroppableId,
  postTasks,
} from "./calendar.func";

const CalendarWrapper = styled.div`
  width: 100%;
  max-width: ${cellWidth * 7 + defaultGap * 6}px;
  margin: 0 auto;
  overflow: hidden;
`;

const WeekDayHeaderRow = styled.div`
  display: flex;
`;

const Weekday = styled.div`
  flex: 1;
  text-align: center;
  font-weight: bold;
  padding: 10px 0;
  color: var(--text-gray);
`;

const CalendarViewport = styled.div`
  position: relative;
  height: calc(${cellHeight * 5}px + 4 * 10px);
  overflow: hidden;
`;

const AnimatedMonth = styled(motion.div)`
  position: absolute;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: ${defaultGap}px;
  padding: 5px 0;
`;

const generateDays = (monthIndex: number, year: number) => {
  const daysFromPrevMonthToAdd = getFirstDayOfMonthWeekIndex(monthIndex, year); // return week index where Sun-0 and Sat-6

  const dayArray: Date[] = [];

  for (let i = daysFromPrevMonthToAdd - 1; i >= 0; i--) {
    dayArray.push(new Date(year, monthIndex, 0 - i));
  }

  const totalDaysInCurrentMonth = getLastDayOfPrevMonthIndex(monthIndex, year);

  for (let i = 1; i <= totalDaysInCurrentMonth; i++) {
    dayArray.push(new Date(year, monthIndex, i));
  }

  const totalDaysLeft = 35 - (totalDaysInCurrentMonth + daysFromPrevMonthToAdd);

  for (let i = 1; i <= totalDaysLeft; i++) {
    dayArray.push(new Date(year, monthIndex + 1, i));
  }

  return dayArray;
};

export default function FlexCalendar() {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(
    getCurrentMonthIndex()
  );

  const [currentYear, setCurrentYear] = useState(getCurrentYear());
  const [direction, setDirection] = useState(1);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const [lastDragOverId, setLastDragOverId] = useState<string | null>(null);

  const [tasks, setTasks] = useState<Record<string, Task[]>>({});

  const [searchQuery, setSearchQuery] = useState("");

  const [currentMonthHoliday, setCurrentMonthHoliday] = useState<Record<
    string,
    Holiday[]
  > | null>();

  useEffect(() => {
    fetchVisibleHolidays(currentYear, currentMonthIndex).then((res) => {
      setCurrentMonthHoliday(res);
    });

    fetchVisibleTasks(currentYear, currentMonthIndex).then((res) => {
      setTasks(res);
    });
  }, [currentMonthIndex, currentYear]);

  const stepNextMonth = () => {
    flushSync(() => {
      // this needed for animation to work properly -_-
      setDirection(1);
    });

    setCurrentMonthIndex((prevMonth) => {
      if (prevMonth === 11) {
        return 0;
      }
      return prevMonth + 1;
    });

    if (currentMonthIndex >= 11) {
      setCurrentYear((prevYear) => {
        return prevYear + 1;
      });
    }
  };

  const stepPrevMonth = () => {
    flushSync(() => {
      setDirection(-1);
    });
    setCurrentMonthIndex((prevMonth) => {
      if (prevMonth === 0) {
        return 11;
      }
      return prevMonth - 1;
    });

    if (currentMonthIndex <= 0) {
      setCurrentYear((prevYear) => prevYear - 1);
    }
  };

  const days = generateDays(currentMonthIndex, currentYear);

  const handleNext = () => {
    stepNextMonth();
  };

  const handlePrev = () => {
    stepPrevMonth();
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (
      active.data.current === undefined ||
      active.data.current.task === undefined
    ) {
      return;
    }

    const task = active.data.current.task as Task;

    setLastDragOverId(active.data.current.sortable.containerId);
    setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, collisions } = event;
    setActiveTask(null);
    setLastDragOverId(null);

    if (
      active.data.current === undefined ||
      active.data.current.task === undefined ||
      !over ||
      !collisions
    ) {
      return;
    }

    // const task = active.data.current.task as Task;

    const closestContainer = collisions.find((c) =>
      c.id.toString().includes(dayContainerPrefix)
    );

    if (!closestContainer) return;

    const currentContainerId = getTaskStoreKeyByDayDroppableId(
      String(closestContainer.id)
    );

    const arr = [...tasks[currentContainerId]];

    const oldIndex = arr.findIndex((task) => task.id === active.id);
    const newIndex = arr.findIndex((task) => task.id === over.id);

    const isReorder =
      oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex;

    if (isReorder) {
      setTasks((prev) => ({
        ...prev,
        [currentContainerId]: arrayMove<Task>(arr, oldIndex, newIndex),
      }));
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, collisions } = event;
    if (!active?.data?.current?.task || !collisions || collisions.length === 0)
      return;

    const task = active.data.current.task as Task;

    const newContainerCollision = collisions.find((c) =>
      c.id.toString().includes(dayContainerPrefix)
    );

    if (!newContainerCollision) return;

    const targetContainerId = String(newContainerCollision.id);
    const targetKey = getTaskStoreKeyByDayDroppableId(targetContainerId);

    if (lastDragOverId === targetContainerId) return;

    const targetTasks = tasks[targetKey] ?? [];
    if (targetTasks.some((t) => t.id === task.id)) {
      setLastDragOverId(targetContainerId);
      return;
    }

    const newTasks: Record<string, Task[]> = {};
    let taskMoved = false;

    for (const [key, taskList] of Object.entries(tasks)) {
      if (taskList.some((t) => t.id === task.id)) {
        newTasks[key] = taskList.filter((t) => t.id !== task.id);
        taskMoved = true;
      } else {
        newTasks[key] = taskList;
      }
    }

    if (!taskMoved) return;

    newTasks[targetKey] = [...(newTasks[targetKey] ?? []), task];

    setTasks(newTasks);
    setLastDragOverId(targetContainerId);
  };

  const addNewTaskToDay = (task: Task, date: Date) => {
    setTasks((prev) => ({
      ...prev,
      [getShortDateString(date)]: prev[getShortDateString(date)]
        ? [task, ...prev[getShortDateString(date)]]
        : [task],
    }));
  };

  useEffect(() => {
    //do not change anything is dragging rn
    if (!activeTask) postTasks(tasks, currentYear, currentMonthIndex);
  }, [tasks, currentYear, currentMonthIndex, activeTask]);

  const getFilteredTasks = (date: Date) => {
    const tasksByDay = tasks[getShortDateString(date)];

    if (!tasksByDay) return [];

    if (searchQuery === "") {
      return tasksByDay;
    } else {
      return tasksByDay.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <CalendarWrapper>
          <ControlsHeaderRow
            handleNext={handleNext}
            handlePrev={handlePrev}
            currentMonthIndex={currentMonthIndex}
            currentYear={currentYear}
            setSearchQuery={setSearchQuery}
          ></ControlsHeaderRow>
          <WeekDayHeaderRow>
            {daysOfWeek.map((day) => (
              <Weekday key={day}>{day}</Weekday>
            ))}
          </WeekDayHeaderRow>

          <CalendarViewport>
            <AnimatePresence initial={false} custom={direction}>
              <AnimatedMonth
                key={`${currentYear}-${currentMonthIndex}`}
                custom={direction}
                initial={{ y: direction > 0 ? "100%" : "-100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: direction > 0 ? "-100%" : "100%", opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {days.map((day) => (
                  <DayCell
                    addNewTaskToDay={addNewTaskToDay}
                    key={getShortDateString(day)}
                    date={day}
                    tasks={getFilteredTasks(day)}
                    holidays={
                      currentMonthHoliday
                        ? currentMonthHoliday[getShortDateString(day)] ?? []
                        : []
                    }
                    activeTaskId={activeTask?.id}
                    currentMonthIndex={currentMonthIndex}
                  ></DayCell>
                ))}
              </AnimatedMonth>
            </AnimatePresence>
          </CalendarViewport>
        </CalendarWrapper>

        {activeTask && (
          <DragOverlay>
            <TaskCard task={activeTask}></TaskCard>
          </DragOverlay>
        )}
      </DndContext>
    </>
  );
}
