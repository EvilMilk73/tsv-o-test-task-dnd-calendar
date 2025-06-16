import {
  getDocId,
  getDocIdByEntryKey,
  getEntryKeyByDate,
} from "../utils/db.utils";
import { db } from "../firebase";

type CountryCodeObj = {
  countryCode: string;
  name: string;
};

type HolidayObj = {
  countryCode: string;
  date: string;
  name: string;
  global: boolean;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function populateHolidayForYear(year: number) {
  // const countryCodesResponse = await fetch(
  //   "https://date.nager.at/api/v3/AvailableCountries"
  // );

  // if (!countryCodesResponse.ok) {
  //   throw new Error(`Response status: ${countryCodesResponse.status}`);
  // }

  // const countryCodes = (
  //   (await countryCodesResponse.json()) as CountryCodeObj[]
  // ).map((countyCodeObject) => countyCodeObject.countryCode);

  // fetch all world holidays is too much, i have code for fetching all the holidays, but this seems good for now.
  const countryCodes = ["UA", "US", "DE", "PL"];
  const dateToHolidays: Record<string, HolidayObj[]> = {};

  for (const code of countryCodes) {
    const yearHolidaysResponse = await fetch(
      `https://date.nager.at/api/v3/PublicHolidays/${year}/${code}`
    );

    // await sleep(15); // maybe use sleep for less pressure on api
    if (!yearHolidaysResponse.ok) {
      throw new Error(`Response status: ${yearHolidaysResponse.status}`);
    }

    const yearHolidays = (await yearHolidaysResponse.json()) as HolidayObj[];

    for (const holiday of yearHolidays) {
      const date = new Date(holiday.date);

      if (!dateToHolidays[getEntryKeyByDate(date)]) {
        dateToHolidays[getEntryKeyByDate(date)] = [holiday];
      } else {
        dateToHolidays[getEntryKeyByDate(date)].push(holiday);
      }
    }
  }

  const groupedHolidays = groupByYearMonthAndFilterByGlobal(dateToHolidays);

  await Promise.all(
    Object.entries(groupedHolidays).map(([key, value]) => {
      const docRef = db.collection("holidays").doc(key);

      return docRef.set({ holidays: value });
    })
  );

  // return groupedHolidays;
}

function groupByYearMonthAndFilterByGlobal(data: Record<string, HolidayObj[]>) {
  const result: Record<string, Record<string, HolidayObj[]>> = {};

  for (const fullDate in data) {
    const yearMonth = getDocIdByEntryKey(fullDate);

    if (!result[yearMonth]) {
      result[yearMonth] = {};
    }

    result[yearMonth][fullDate] = data[fullDate].filter(
      (holiday) => holiday.global
    );
  }

  return result;
}
