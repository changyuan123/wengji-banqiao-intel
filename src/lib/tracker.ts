export type ScanStatus = "idle" | "queued" | "scanning" | "ok" | "error";

export type CompetitorFinding = {
  scannedAt: string;
  summary: string;
  priceSignals: string[];
  ratingSignals: string[];
  promoSignals: string[];
  sources: { title: string; url: string }[];
  rawNotes: string;
};

export type TrackedCompetitor = {
  id: string;
  name: string;
  keyword: string;
  note: string;
  createdAt: string;
  lastScanAt: string | null;
  status: ScanStatus;
  finding: CompetitorFinding | null;
  errorMessage?: string;
};

export const MAX_TRACKED = 10;
export const STORAGE_KEY = "wengji.trackedCompetitors.v1";
export const AUTO_SCAN_INTERVAL_MS = 24 * 60 * 60 * 1000;

export const DEFAULT_SEED: Omit<TrackedCompetitor, "id" | "createdAt">[] = [
  {
    name: "鍋太爽板橋篤行店",
    keyword: "鍋太爽 板橋 篤行",
    note: "低價個人鍋，攔截單人客",
    lastScanAt: null,
    status: "idle",
    finding: null,
  },
  {
    name: "辣四方麻辣燙板橋篤行店",
    keyword: "辣四方 麻辣燙 板橋 篤行",
    note: "快速單人餐＋外送",
    lastScanAt: null,
    status: "idle",
    finding: null,
  },
  {
    name: "錢昇涮涮鍋",
    keyword: "錢昇涮涮鍋 篤行路",
    note: "極近距離，分食日常需求",
    lastScanAt: null,
    status: "idle",
    finding: null,
  },
];

export function createId() {
  return `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function loadTracked(): TrackedCompetitor[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = DEFAULT_SEED.map((item) => ({
        ...item,
        id: createId(),
        createdAt: new Date().toISOString(),
      }));
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw) as TrackedCompetitor[];
  } catch {
    return [];
  }
}

export function saveTracked(list: TrackedCompetitor[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_TRACKED)));
}

export function needsDailyScan(item: TrackedCompetitor, now = Date.now()) {
  if (!item.lastScanAt) return true;
  return now - new Date(item.lastScanAt).getTime() >= AUTO_SCAN_INTERVAL_MS;
}
