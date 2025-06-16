export function getCurrentMonthIndex() {
  return new Date().getMonth();
}

export function getCurrentYear() {
  return new Date().getFullYear();
}

export function getMonthName(
  monthIndex: number,
  locale = "en-US",
  short?: boolean
) {
  const date = new Date(2000, monthIndex);
  return new Intl.DateTimeFormat(locale, {
    month: short ? "short" : "long",
  }).format(date);
}

export function getFirstDayOfMonthWeekIndex(monthIndex: number, year: number) {
  const date = new Date(year, monthIndex, 1);
  return date.getDay();
}

export function getLastDayOfPrevMonthIndex(monthIndex: number, year: number) {
  const date = new Date(year, monthIndex + 1, 0);
  return date.getDate();
}

export function getShortDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function isFirstOrLastDayOfMonth(date: Date) {
  const nextDay = new Date(date);
  nextDay.setDate(date.getDate() + 1);

  return date.getDate() === 1 || nextDay.getDate() === 1;
}
