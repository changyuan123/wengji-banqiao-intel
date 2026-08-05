import type { CompetitorFinding } from "@/lib/tracker";
import {
  SHOP_CATALOG,
  buildClaimsForShop,
  situationLine,
  type ShopCandidate,
} from "@/lib/shopIntel";

function unique(values: string[], limit = 6) {
  return [...new Set(values.map((v) => v.trim()).filter(Boolean))].slice(0, limit);
}

function resolveCatalog(name: string, catalogId?: string): ShopCandidate | undefined {
  if (catalogId) return SHOP_CATALOG.find((s) => s.id === catalogId);
  return SHOP_CATALOG.find((s) => s.name === name || s.alias.some((a) => name.includes(a)));
}

/**
 * 本機／瀏覽器端只做輕量草稿：用店庫＋關鍵字產「待核驗」情報，不外接公開網讀取。
 * 重爬交由雲端排程（GitHub Actions／Serverless），避免文書機 CPU／網路被拖垮。
 */
export function draftInvestigateCompetitor(input: {
  name: string;
  keyword: string;
  catalogId?: string;
}): CompetitorFinding {
  const catalog = resolveCatalog(input.name, input.catalogId);
  const priceSignals = catalog?.knownPrice ? [catalog.knownPrice] : [];
  const ratingSignals = catalog?.knownScore ? [catalog.knownScore] : [];
  const promoSignals = unique(
    input.keyword.split(/\s+/).filter((w) => /鍋|辣|燙|涮|套餐|外送|個人/.test(w)),
  );

  const claims = buildClaimsForShop({
    shopName: input.name,
    keyword: input.keyword,
    catalog,
    priceSignals,
    ratingSignals,
    promoSignals,
    summary: "",
  });

  const summary = [
    `已釘選「${input.name}／${input.keyword}」，並以店庫＋關鍵字產出 ${claims.length} 條現況草稿。`,
    "本機不外接公開網重爬（依雲端開發規則，重活交 GitHub Actions／Serverless）。",
    "全部標記為「未核驗」——需店主逐條確認後才採納。",
  ].join(" ");

  return {
    scannedAt: new Date().toISOString(),
    summary,
    priceSignals,
    ratingSignals,
    promoSignals,
    sources: [
      {
        title: "雲端排程佇列（待接 GitHub Actions／Serverless）",
        url: "https://github.com/changyuan123/wengji-banqiao-intel",
      },
    ],
    rawNotes: "瀏覽器端僅草稿；公開網重爬改走雲端，不佔用本機資源。",
    claims,
    situation: situationLine(claims, input.name),
  };
}

/** 相容舊呼叫；實際改走輕量草稿，不再在瀏覽器抓網 */
export async function investigateCompetitor(input: {
  name: string;
  keyword: string;
  catalogId?: string;
}): Promise<CompetitorFinding> {
  return draftInvestigateCompetitor(input);
}
