import type { Holiday, Task } from "../../types/calendar.types";
import { getShortDateString } from "../../utils/datetime";
import { dayContainerPrefix } from "./calendar.constants";

export function getDayContainerDroppableId(date: Date) {
  return `${dayContainerPrefix}_${getShortDateString(date)}`;
}

export function getTaskStoreKeyByDayDroppableId(id: string) {
  return id.split("_")[1];
}

//this funcs need to be expanded in case of need view larger than a month
export async function fetchVisibleTasks(year: number, monthIndex: number) {
  const currentMonthTasks = await fetchTasks(year, monthIndex + 1);

  const prevDate = getPrevYearMonth(year, monthIndex + 1);
  const nextDate = getNextYearMonth(year, monthIndex + 1);

  const prevMonthTasks = await fetchTasks(prevDate.year, prevDate.month);
  const nextMonthTasks = await fetchTasks(nextDate.year, nextDate.month);

  return {
    ...currentMonthTasks,
    ...prevMonthTasks,
    ...nextMonthTasks,
  };
}

export async function fetchVisibleHolidays(year: number, monthIndex: number) {
  const currentMonthHolidays = await fetchHolidays(year, monthIndex + 1);

  const prevDate = getPrevYearMonth(year, monthIndex + 1);
  const nextDate = getNextYearMonth(year, monthIndex + 1);

  const prevMonthHolidays = await fetchHolidays(prevDate.year, prevDate.month);
  const nextMonthHolidays = await fetchHolidays(nextDate.year, nextDate.month);

  return {
    ...currentMonthHolidays,
    ...prevMonthHolidays,
    ...nextMonthHolidays,
  };
}

export async function postTasks(
  tasks: Record<string, Task[]>,
  year: number,
  monthIndex: number
) {
  await fetch(`/api/tasks/${year}/${monthIndex + 1}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tasks),
  });
}

async function fetchHolidays(year: number, month: number) {
  const currentMonthResponse = (
    await fetch(`/api/holidays/${year}/${month}`)
  ).json();

  return (await currentMonthResponse).selectedHolidays as Record<
    string,
    Holiday[]
  >;
}

async function fetchTasks(year: number, month: number) {
  const currentMonthResponse = await fetch(`/api/tasks/${year}/${month}`);

  if (currentMonthResponse.ok) {
    const currentMonthResult = await currentMonthResponse.json();

    if (!currentMonthResult.tasks) return {};

    return currentMonthResult.tasks as Record<string, Task[]>;
  } else {
    return {};
  }
}

function getPrevYearMonth(year: number, monthIndex: number) {
  if (monthIndex === 0) {
    return { year: year - 1, month: 11 };
  } else {
    return { year, month: monthIndex - 1 };
  }
}

function getNextYearMonth(year: number, monthIndex: number) {
  if (monthIndex === 11) {
    return { year: year + 1, month: 0 };
  } else {
    return { year, month: monthIndex + 1 };
  }
}
