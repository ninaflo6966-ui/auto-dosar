export function deepClone<T>(value: T): T {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value)) as T;
}

export function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value as Record<string, unknown>)) deepFreeze(child);
  }
  return value;
}

export function getPath(root: unknown, path: string): unknown {
  return normalize(path).reduce<unknown>((current, segment) => {
    if (current === null || current === undefined || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[segment];
  }, root);
}

export function setPath(root: Record<string, unknown>, path: string, value: unknown): void {
  const parts = normalize(path);
  if (!parts.length) throw new Error("Calea Twin nu poate fi goală.");
  let cursor: Record<string, unknown> = root;
  for (const segment of parts.slice(0, -1)) {
    const next = cursor[segment];
    if (!next || typeof next !== "object" || Array.isArray(next)) cursor[segment] = {};
    cursor = cursor[segment] as Record<string, unknown>;
  }
  cursor[parts.at(-1)!] = value;
}

export function removePath(root: Record<string, unknown>, path: string): void {
  const parts = normalize(path);
  if (!parts.length) throw new Error("Calea Twin nu poate fi goală.");
  let cursor: Record<string, unknown> = root;
  for (const segment of parts.slice(0, -1)) {
    const next = cursor[segment];
    if (!next || typeof next !== "object" || Array.isArray(next)) return;
    cursor = next as Record<string, unknown>;
  }
  delete cursor[parts.at(-1)!];
}

function normalize(path: string): string[] {
  return path.replace(/^\//, "").split(/[/.]/).filter(Boolean);
}

export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const entries = Object.entries(value as Record<string, unknown>)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`);
  return `{${entries.join(",")}}`;
}

export function checksum(value: unknown): string {
  const input = stableStringify(value);
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}
