const SPLITTER = ", ";

interface TagsResult {
  tags: string;
}

export const splitField = (field: string): string[] => {
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

export const formatRest = (totalSeconds: number): string => {
  function padLeft(num: number, pad: string, length: number): string {
    return (new Array(length + 1).join(pad) + num).slice(-length);
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds - minutes * 60;
  const finalTime = padLeft(minutes, "0", 2) + ":" + padLeft(seconds, "0", 2);

  return finalTime;
};

export const parseDecimal = (value: string | number): number => {
  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) {
    throw new Error("The given value is not a number.");
  }

  return Math.round(num * 100) / 100;
};

export const parseWhole = (value: string | number): number => {
  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) {
    throw new Error("The given value is not a number");
  }

  return Math.floor(num);
};
