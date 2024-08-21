const SPLITTER = ", ";

interface TagsResult {
  tags: string;
}

/**
 * Splits a comma separated string into an array, such as those in the local database.
 * @param field A comma separated string representing multiple items.
 * @returns An array containing each element in the string.
 */
export const splitField = (field: string | null): string[] => {
  if (!field || field === "") return [];
  
  return field.split(SPLITTER);
};

/**
 * Joins a string array into a comma separated string. 
 * Used especially when inserting arrays of strings into the database (tags, days, etc.).
 * @param field An array of strings.
 * @returns A comma separated string containing each string in the array.
 */
export const joinField = (field: string[]): string => {
  if (field.length === 0) {
    return "";
  }
  return field.join(", ");
};

/**
 * Formats an array of week days into a formatted string.
 * Example: ["Monday", "Thursday", "Friday"] => "Monday, Thursday, and Friday"
 * @param days An array of week days.
 * @returns A formatted string representing the given week days.
 */
export const formatDays = (days: string[]): string => {
  if (days.length === 0) {
    return "Unscheduled";
  }

  switch (days.length) {
    case 1:
      return days[0];
    case 2:
      return `${days[0]} and ${days[1]}`;
    default:
      return days.slice(0, -1).join(", ") + ", and " + days.slice(-1);
  }
};

// do we need this?
export const formatTags = (fields: TagsResult[]): string[] => {
  const allTags = fields.map((field) => splitField(field.tags));
  const uniqueTags = [...new Set(allTags.flat())];
  return uniqueTags;
};

/**
 * Formats a given number of seconds into an HH:MM:SS string.
 * @param totalSeconds The seconds we want to convert.
 * @returns A string representing the seconds in an HH:MM:SS format.
 */
export const formatTime = (totalSeconds: number): string => {
  const { minutes, seconds } = parseSeconds(totalSeconds);
  const finalTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  return finalTime;
};

/**
 * Parses seconds into minutes and seconds.
 * @param totalSeconds The seconds we want to parse.
 * @returns An object containing the minutes and seconds.
 */
export const parseSeconds = (
  totalSeconds: number
): { seconds: number; minutes: number } => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds - minutes * 60;
  return {
    minutes: minutes,
    seconds: seconds,
  };
};

/**
 * Parses a string/number into a decimal with two decimal places.
 * @param value The value to parse.
 * @returns A number with two decimal places.
 */
export const parseDecimal = (value: string | number): number => {
  return Math.round(toNumber(value) * 100) / 100;
};

/**
 * Parses a string/number into a whole number (floored).
 * @param value The value to parse.
 * @returns A whole number.
 */
export const parseWhole = (value: string | number): number => {
  return Math.floor(toNumber(value));
};

/**
 * Converts a string to a number, or simply returns the given number if it is already a number.
 * If the given value is not a number, return zero.
 * @param value The value to convert.
 * @returns The value as a number, or 0 if it is not a number.
 */
export const toNumber = (value: string | number): number => {
  if (typeof value === "number") {
    return value;
  }

  // Use Number to convert string to number
  const num = Number(value);

  // Check if conversion was successful or if the string is invalid
  if (isNaN(num) || !/^-?\d*\.?\d*$/.test(value)) {
    return 0;
  }

  return num;
}
