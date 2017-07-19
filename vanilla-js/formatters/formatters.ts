type MonthFormat = "2-digit" | "short" | "long";

const dateFormat = {
  year: "numeric",
  month: "2-digit",
  day: "numeric"
};

/**
 * Convert UTC DateTime to russian date string "<day> <month> <year>"
 */
export function formatDate(utc: Date, month: MonthFormat = "2-digit"): string {
  if (dateFormat.month !== month) {
    dateFormat.month = month;
  }
  return utc.toLocaleDateString("ru", dateFormat);
}

/**
 * Convert UTC DateTime to time string "<hour>:<minute>[:<second>]"
 */
export function formatTime(utc: Date, withSeconds = true): string {
  return utc.toTimeString().substr(0, withSeconds ? 8 : 5);
}

/**
 * Convert duration from milliseconds to string "[<hours>:]<minutes>:<seconds>"
 */
export function formatDuration(milliseconds: number): string {
  const isoString = new Date(milliseconds).toISOString();
  return milliseconds < 3600000 ? isoString.substr(14, 5) : isoString.substr(11, 8);
}

/**
 * Convert duration from milliseconds to string "[<years> ][<months> ][<days> ][<hours>:]<minutes>"
 */
export function formatIntervalDuration(fromUtc: Date, toUtc: Date) {
  if (fromUtc > toUtc) {
    throw new Error("fromUtc > toUtc");
  }
  let toYear = toUtc.getFullYear();
  let from = {
    year: fromUtc.getFullYear(),
    month: fromUtc.getMonth(),
    date: fromUtc.getDate(),
    hour: fromUtc.getHours(),
    minute: fromUtc.getMinutes()
  };

  let years = toYear - from.year;
  from.year = toYear;
  if (getDate(from) > toUtc) {
    from.year = toYear - 1;
    years--;
  }

  let months = 0;
  do {
    from.month++;
    months++;
  } while (getDate(from) <= toUtc);
  from.month--;
  months--;

  let total = toUtc.valueOf() - getDate(from).valueOf();
  total -= total % 60000;
  total /= 60000;

  let minutes = total % 60;
  total -= minutes;
  total /= 60;

  let hours = total % 24;
  total -= hours;
  total /= 24;

  let days = total;

  let arr: string[] = [];

  if (years) {
    arr.push(years + yearsSuffix(years));
  }
  if (months) {
    arr.push(months + " мес.");
  }
  if (days) {
    arr.push(days + " дн.");
  }
  if (hours) {
    arr.push(hours + " ч.");
  }
  if (minutes) {
    arr.push(minutes + " м.");
  }

  return arr.join(" ");
}

function getDate({ year, month, date, hour, minute }): Date {
  return new Date(year, month, date, hour, minute);
}

function yearsSuffix(years: number): string {
  years = years % 100;
  if (years >= 11 && years <= 19) {
    return " лет";
  }
  years = years % 10;
  if (years === 1) {
    return " год";
  }
  if (years >= 2 && years <= 4) {
    return " года";
  }
  return " лет";
}

const sizeSuffixes = ["Б", "KБ", "МБ", "ГБ", "ТБ", "ПБ", "ЭБ"];

/**
 * Convert number of bytes to string "<number> <Б|КБ|МБ|...>" with rounding to 3 digits
 * @example 7,89 КБ | 78,9 КБ | 789 КБ | 0,98 МБ
 */
export function formatFileSize(size: number): string {
  if (typeof size !== "number") {
    throw new Error("Argument: size is not a number");
  }

  if (size < 1000) {
    return size.toFixed() + " " + sizeSuffixes[0];
  }

  let index = 0;
  const lastIndex = sizeSuffixes.length - 1;
  do {
    size /= 1024;
    index++;
  } while (size >= 1000 && index < lastIndex);

  let sizeString: string;
  if (size >= 100) {
    sizeString = Math.round(size).toFixed();
  } else if (size >= 10) {
    sizeString = (Math.round(size * 10) * 0.1).toFixed(1);
  } else {
    sizeString = (Math.round(size * 100) * 0.01).toFixed(2);
  }

  return sizeString.replace(".", ",") + " " + sizeSuffixes[index];
}
