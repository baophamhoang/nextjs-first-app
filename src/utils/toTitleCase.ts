export const toTitleCase = (t: string) => {
  return t.replace(/\w\S*/g, t.charAt(0).toUpperCase() + t.substring(1).toLowerCase());
}