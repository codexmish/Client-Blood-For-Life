// -----first letters of a name (Rahim Uddin -> RU)
export const initialsOf = (name: string) =>
  name
    .trim()
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

// -----date as "Jun 2026", empty date shows "Never"
export const monthYear = (date: string | null) =>
  date
    ? new Date(date).toLocaleDateString("en-GB", {
        month: "short",
        year: "numeric",
      })
    : "Never";

// -----date a donor can give again (null = can give now)
export const nextDonationDate = (lastDonationDate: string | null) => {
  if (!lastDonationDate) return null;
  const next = new Date(lastDonationDate);
  next.setMonth(next.getMonth() + 4);
  return next > new Date() ? next : null;
};
