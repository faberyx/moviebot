export const getDate = (date: Date) => {
  const d = new Date(date);
  if (d) {
    return `${d.getFullYear()}`;
  }
  return 'n/a';
};
