const SPLITTER = ", ";

interface TagsResult {
  tags: string;
}

export const splitField = (field: string | null): string[] => {
  if (!field) return [];
  
  return field.split(SPLITTER);
};

export const joinField = (field: string[]): string => {
  if (field.length === 0) {
    return "";
  }
  return field.join(", ");
};

export const formatDays = (field: string): string => {
  if (field === "") {
    return "Unscheduled";
  }

  const days = splitField(field);
  switch (days.length) {
    case 1:
      return days[0];
    case 2:
      return `${days[0]} and ${days[1]}`;
    default:
      return days.slice(0, -1).join(", ") + ", and " + days.slice(-1);
  }
};

export const formatTags = (fields: TagsResult[]): string[] => {
  const allTags = fields.map((field) => splitField(field.tags));
  const uniqueTags = [...new Set(allTags.flat())];
  return uniqueTags;
};

export const formatTime = (totalSeconds: number): string => {
  const { minutes, seconds } = parseSeconds(totalSeconds);
  const finalTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  return finalTime;
};

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

export const parseDecimal = (value: string | number): number => {
  return Math.round(parseValue(value) * 100) / 100;
};

export const parseWhole = (value: string | number): number => {
  return Math.floor(parseValue(value));
};

export const parseValue = (value: string | number): number => {
  let num: number;

  if (typeof value === "string") {
    // Use Number to convert string to number
    num = Number(value);
    // Check if conversion was successful or if the string is invalid
    if (isNaN(num) || !/^-?\d*\.?\d*$/.test(value)) {
      return 0;
    }
  } else {
    num = value;
  }

  return num;
}
