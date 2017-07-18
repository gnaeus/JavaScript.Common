const iso8601DateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

/**
 * Resursively replace all strings like "yyyy-MM-ddThh:mm:ss.xxxZ" to Date objects
 */
export function parseJsonDates(data) {
  if (data instanceof Array) {
    for (let i = 0; i < data.length; ++i) {
      data[i] = parseJsonDates(data[i]);
    }
  } else if (typeof data === "object") {
    for (let key in data) {
      data[key] = parseJsonDates(data[key]);
    }
  } else if (typeof data === "string" && iso8601DateRegex.test(data)) {
    return new Date(data);
  }
  return data;
}
