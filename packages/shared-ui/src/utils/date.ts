const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Formats editorial dates deterministically in every server and browser
 * timezone. Date-only values represent a calendar date, not a local instant.
 */
export function formatEditorialDate(value: string): string {
  const date = new Date(dateOnlyPattern.test(value) ? `${value}T00:00:00.000Z` : value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}
