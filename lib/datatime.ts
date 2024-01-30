export const localeDate = (date?: string | number | Date, fullDate = false): string => {
  if (!date || (typeof date === "number" && date <= 0)) {
    return "";
  }
  try {
    const _date: Date = date instanceof Date ? date : new Date(date);
    return _date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: fullDate ? "long" : "numeric",
      day: "numeric"
    });
  } catch {
    return date.toLocaleString();
  }
};

export const localeTime = (
  date?: string | number | Date,
  hour12 = true,
  twoDigits = false,
  showSeconds = false
): string => {
  if (!date || (typeof date === "number" && date <= 0)) {
    return "";
  }
  try {
    const _date: Date = date instanceof Date ? date : new Date(date);
    return _date.toLocaleTimeString("vi-VN", {
      hour: twoDigits ? "2-digit" : "numeric",
      minute: twoDigits ? "2-digit" : "numeric",
      second: showSeconds ? (twoDigits ? "2-digit" : "numeric") : undefined,
      hour12: hour12
    });
  } catch {
    return date.toLocaleString();
  }
};

export const localeDateTime = (
  date?: string | number | Date,
  fullDateTime = false,
  hour12 = true,
  twoDigits = false,
  showSeconds = false
): string => {
  if (!date || (typeof date === "number" && date <= 0)) {
    return "";
  }

  try {
    const _date: Date = date instanceof Date ? date : new Date(date);
    return _date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: fullDateTime ? "long" : "numeric",
      day: "numeric",
      hour: twoDigits ? "2-digit" : "numeric",
      minute: twoDigits ? "2-digit" : "numeric",
      second: showSeconds ? (twoDigits ? "2-digit" : "numeric") : undefined,
      hour12: hour12
    });
  } catch {
    return date.toLocaleString();
  }
};
