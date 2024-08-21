import { DayOfWeek, MonthOfYear } from "./types";

const DAYS: DayOfWeek[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTHS: MonthOfYear[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Gets the name of the current week day.
 * @returns The current week day.
 */
export function getCurrentDay(): DayOfWeek {
  const now = new Date();
  return DAYS[now.getDay()];
}

/**
 * Gets the name of the current month.
 * @returns The current month.
 */
export function getCurrentMonth(): MonthOfYear {
  const now = new Date();
  return MONTHS[now.getMonth()];
}