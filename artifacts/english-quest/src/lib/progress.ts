const KEY = "english-quest-unit-3-progress-v1";

type ProgressMap = Record<string, number>; // activity slug → stars (0-3)

function read(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ProgressMap;
  } catch {
    return {};
  }
}

function write(map: ProgressMap): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent("english-quest-progress"));
  } catch {
    // ignore
  }
}

export function getStars(activity: string): number {
  const map = read();
  return map[activity] ?? 0;
}

export function setStars(activity: string, stars: number): void {
  const map = read();
  const prev = map[activity] ?? 0;
  if (stars > prev) {
    map[activity] = stars;
    write(map);
  }
}

export function getAllProgress(): ProgressMap {
  return read();
}
