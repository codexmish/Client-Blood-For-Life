// -----blood group label for showing (A_POSITIVE -> A+)
export const bloodGroupLabel: Record<string, string> = {
  A_POSITIVE: "A+",
  A_NEGATIVE: "A−",
  B_POSITIVE: "B+",
  B_NEGATIVE: "B−",
  AB_POSITIVE: "AB+",
  AB_NEGATIVE: "AB−",
  O_POSITIVE: "O+",
  O_NEGATIVE: "O−",
};

// -----urgency badge colors
export const urgencyStyle: Record<string, string> = {
  EMERGENCY: "bg-[#B4232A] text-white",
  URGENT: "bg-[#FFF1D6] text-[#7A4B00]",
  NORMAL: "bg-[#EEF0F3] text-[#3B404B]",
};

// -----request status badge colors
export const statusStyle: Record<string, string> = {
  OPEN: "bg-[#E6F2EC] text-[#1D5E40]",
  FULFILLED: "bg-[#E8EEFB] text-[#23448F]",
  CANCELLED: "bg-[#EEF0F3] text-[#3B404B]",
};

// -----needed date as Today / Tomorrow / 20 Oct
// ----markPassed true = past date gets "(passed)" after it
export const neededDay = (date: string, markPassed = false) => {
  const needDate = new Date(date);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (needDate.toDateString() === today.toDateString()) return "Today";
  if (needDate.toDateString() === tomorrow.toDateString()) return "Tomorrow";

  const label = needDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
  return markPassed && needDate < today ? `${label} (passed)` : label;
};

// -----patient name as Rahim U.
export const shortName = (name: string) => {
  const [first, ...rest] = name.trim().split(" ");
  const last = rest.at(-1);
  return last ? `${first} ${last[0]}.` : first;
};
