export function getDocId(year: number | string, month: number | string) {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function getDocIdByEntryKey(key: string) {
  return getDocId(key.split("-")[0], key.split("-")[1]);
}

export function getEntryKeyByDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
