import path from "node:path";

export const ID_SEGMENT_PATTERN = /^[a-z0-9_-][a-z0-9_.-]*$/;

export function ensureValidId(kind: string, value: string): string {
  if (value.startsWith("/") || value.endsWith("/") || value.includes("//")) {
    throw new Error(`Invalid ${kind}: "${value}"`);
  }
  if (path.isAbsolute(value)) {
    throw new Error(`Invalid ${kind}: "${value}"`);
  }
  const segments = value.split("/");
  for (const segment of segments) {
    if (
      segment.length === 0 ||
      segment === "." ||
      segment === ".." ||
      !ID_SEGMENT_PATTERN.test(segment)
    ) {
      throw new Error(`Invalid ${kind}: "${value}"`);
    }
  }
  return value;
}
