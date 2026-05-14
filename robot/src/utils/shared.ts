import path from "node:path";

/** Regex that every segment of a recipe or plan ID must satisfy. */
export const ID_SEGMENT_PATTERN = /^[a-z0-9_-][a-z0-9_.-]*$/;

/**
 * Validates that `value` is a legal multi-segment ID (slash-separated, no traversal, no absolute
 * paths) and returns it unchanged.
 * @throws if any segment fails the pattern or the path is otherwise malformed.
 */
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
