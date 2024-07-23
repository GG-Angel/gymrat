const SPLITTER = ', ';

interface TagsResult {
  tags: string
};

export const splitField = (field: string): string[] => {
  return field.split(SPLITTER);
}

export const formatDays = (field: string): string => {
  const days = splitField(field);
  return days.slice(0, -1).join(", ") + ", and " + days.slice(-1);
}

export const formatTags = (fields: TagsResult[]): string[] => {
  const allTags = fields.map((field) => splitField(field.tags));
  const uniqueTags = [...new Set(allTags.flat())];
  return uniqueTags;
}