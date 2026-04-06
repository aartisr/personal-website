type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  return value as UnknownRecord;
}

export function summaryText(item: unknown, ...keys: string[]): string | undefined {
  const record = asRecord(item);
  if (!record) return undefined;

  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
    if (typeof value === "number") {
      return String(value);
    }
  }

  return undefined;
}

export function summaryStringValue(item: unknown): string | undefined {
  if (typeof item === "string" && item.trim()) {
    return item;
  }

  return summaryText(item, "value");
}
