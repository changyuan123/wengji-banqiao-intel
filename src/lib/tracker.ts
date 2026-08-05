import type { IntelClaim } from "@/lib/shopIntel";

export type ScanStatus = "idle" | "queued" | "scanning" | "ok" | "error";

export type CompetitorFinding = {
  scannedAt: string;
  summary: string;
  priceSignals: string[];
  ratingSignals: string[];
  promoSignals: string[];
  sources: { title: string; url: string }[];
  rawNotes: string;
  /** 自動分析產出的情報條——預設皆未核驗 */
  claims: IntelClaim[];
  situation: string;
};

export type TrackedCompetitor = {
  id: string;
  name: string;
  keyword: string;
  note: string;
  catalogId?: string;
  createdAt: string;
  lastScanAt: string | null;
  status: ScanStatus;
  finding: CompetitorFinding | null;
  errorMessage?: string;
};

export const MAX_TRACKED = 10;
export const STORAGE_KEY = "wengji.trackedCompetitors.v2";
export const AUTO_SCAN_INTERVAL_MS = 24 * 60 * 60 * 1000;

export const DEFAULT_SEED: Omit<TrackedCompetitor, "id" | "createdAt">[] = [
  {
    name: "鍋太爽板橋篤行店",
    keyword: "鍋太爽 板橋 篤行 個人鍋 價格",
    note: "低價個人鍋，攔截單人客",
    catalogId: "guotai-shuang",
    lastScanAt: null,
    status: "idle",
    finding: null,
  },
  {
    name: "辣四方麻辣燙板橋篤行店",
    keyword: "辣四方 麻辣燙 板橋 篤行 價格",
    note: "快速單人餐＋外送",
    catalogId: "la-sifang",
    lastScanAt: null,
    status: "idle",
    finding: null,
  },
  {
    name: "錢昇涮涮鍋",
    keyword: "錢昇涮涮鍋 篤行路 菜單",
    note: "極近距離，分食日常需求",
    catalogId: "qiansheng",
    lastScanAt: null,
    status: "idle",
    finding: null,
  },
];

export function createId() {
  return `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function migrateClaims(item: TrackedCompetitor): TrackedCompetitor {
  if (!item.finding) return item;
  if (item.finding.claims && item.finding.situation) return item;
  return {
    ...item,
    finding: {
      ...item.finding,
      claims: item.finding.claims ?? [],
      situation:
        item.finding.situation ??
        `「${item.name}」舊資料需重新調查，以產生待核驗情報條。`,
    },
  };
}

export function loadTracked(): TrackedCompetitor[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // 嘗試從 v1 遷移後仍以種子為準
      const seeded = DEFAULT_SEED.map((item) => ({
        ...item,
        id: createId(),
        createdAt: new Date().toISOString(),
      }));
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw) as TrackedCompetitor[];
    return parsed.map(migrateClaims);
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

export function updateClaimStatus(
  list: TrackedCompetitor[],
  itemId: string,
  claimId: string,
  status: IntelClaim["status"],
  ownerNote?: string,
): TrackedCompetitor[] {
  return list.map((item) => {
    if (item.id !== itemId || !item.finding) return item;
    const claims = item.finding.claims.map((c) =>
      c.id === claimId
        ? { ...c, status, ownerNote: ownerNote !== undefined ? ownerNote : c.ownerNote }
        : c,
    );
    const pending = claims.filter((c) => c.status === "unverified").length;
    const verified = claims.filter((c) => c.status === "confirmed" || c.status === "corrected").length;
    return {
      ...item,
      finding: {
        ...item.finding,
        claims,
        situation:
          pending === 0
            ? `「${item.name}」本輪 ${verified} 條情報皆已由你核驗，可作為本周對策依據。`
            : `「${item.name}」已自動產出 ${claims.length} 條現況情報，其中 ${pending} 條仍待你核驗——未核驗不算數。`,
      },
    };
  });
}
