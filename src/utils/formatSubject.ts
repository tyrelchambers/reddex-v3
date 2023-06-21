const MAX_SUBJECT_LENGTH = 100;

export const formatSubject = (title: string) =>
  title.length > MAX_SUBJECT_LENGTH
    ? title.slice(0, MAX_SUBJECT_LENGTH - 3) + "..."
    : title;
