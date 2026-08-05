import type { CompetitorFinding } from "@/lib/tracker";

type Probe = {
  title: string;
  url: string;
  text: string;
};

const PRICE_RE =
  /(?:NT\$|\$|＄|元)\s?\d{2,5}|\d{2,5}\s?(?:元|塊)|滿\s?\d+\s?(?:折|元)|折\s?\d+/gi;
const RATING_RE = /([0-5](?:\.\d)?)\s*(?:星|★)|評分\s*([0-5](?:\.\d)?)|([0-5](?:\.\d)?)\s*\/\s*5/gi;
const PROMO_RE = /折扣|優惠|外送|滿額|免運|期間限定|套餐|雙人|單人鍋|個人鍋/gi;

function unique(values: string[], limit = 6) {
  return [...new Set(values.map((v) => v.trim()).filter(Boolean))].slice(0, limit);
}

function extractSignals(text: string) {
  return {
    priceSignals: unique(text.match(PRICE_RE) ?? []),
    ratingSignals: unique(
      [...text.matchAll(RATING_RE)].map((m) => m[1] || m[2] || m[3]).filter(Boolean) as string[],
    ),
    promoSignals: unique(text.match(PROMO_RE) ?? []),
  };
}

async function fetchViaReader(targetUrl: string): Promise<string> {
  const endpoint = `https://r.jina.ai/${targetUrl}`;
  const res = await fetch(endpoint, {
    headers: { Accept: "text/plain" },
  });
  if (!res.ok) throw new Error(`讀取失敗 ${res.status}`);
  const text = await res.text();
  return text.slice(0, 12000);
}

function buildTargets(keyword: string, name: string): { title: string; url: string }[] {
  const q = encodeURIComponent(`${keyword} ${name} 板橋 火鍋`);
  const q2 = encodeURIComponent(`${name} 菜單 價格`);
  return [
    {
      title: "公開網頁檢索（DuckDuckGo）",
      url: `https://duckduckgo.com/html/?q=${q}`,
    },
    {
      title: "菜單／價格相關檢索",
      url: `https://duckduckgo.com/html/?q=${q2}`,
    },
  ];
}

function synthesizeSummary(
  name: string,
  keyword: string,
  signals: ReturnType<typeof extractSignals>,
  probesOk: number,
): string {
  const bits: string[] = [];
  bits.push(`針對「${name}／${keyword}」完成公開資訊探查（成功來源 ${probesOk}）。`);
  if (signals.priceSignals.length) {
    bits.push(`價格訊號：${signals.priceSignals.slice(0, 4).join("、")}。`);
  } else {
    bits.push("本次未穩定抓到明確價位，建議明日再掃或改更精準關鍵字（店名＋路段）。");
  }
  if (signals.ratingSignals.length) {
    bits.push(`評分訊號：${signals.ratingSignals.join("、")}。`);
  }
  if (signals.promoSignals.length) {
    bits.push(`活動／品類關鍵詞：${signals.promoSignals.slice(0, 5).join("、")}。`);
  }
  bits.push("此結果供翁記板橋店對照客單與外帶策略；正式訂閱後可接排程爬蟲每日自動更新。");
  return bits.join(" ");
}

/**
 * 公開網探查適配層：經由可讀取公開頁的 reader 抓取文字，再萃取價格／評分／促銷訊號。
 * 不破解登入牆；無法抓取的來源會略過並在摘要中標明。
 */
export async function investigateCompetitor(input: {
  name: string;
  keyword: string;
}): Promise<CompetitorFinding> {
  const targets = buildTargets(input.keyword, input.name);
  const probes: Probe[] = [];
  const errors: string[] = [];

  for (const target of targets) {
    try {
      const text = await fetchViaReader(target.url);
      probes.push({ ...target, text });
    } catch (err) {
      errors.push(`${target.title}: ${err instanceof Error ? err.message : "unknown"}`);
    }
  }

  const merged = probes.map((p) => p.text).join("\n");
  const signals = extractSignals(`${input.name}\n${input.keyword}\n${merged}`);

  // 若公開網讀取被瀏覽器 CORS／來源擋下，仍回傳可用的結構化占位，避免 UI 全滅
  if (probes.length === 0) {
    return {
      scannedAt: new Date().toISOString(),
      summary: `已建立「${input.name}」追蹤（關鍵字：${input.keyword}）。目前瀏覽器端公開網讀取受限制，摘要改為佇列狀態；接上雲端爬蟲排程後可每日自動回填價格／評分／活動。`,
      priceSignals: [],
      ratingSignals: [],
      promoSignals: unique(input.keyword.split(/\s+/).filter((w) => /鍋|辣|燙|涮|套餐|外送/.test(w))),
      sources: targets,
      rawNotes: errors.length ? `來源失敗：${errors.join("；")}` : "無來源",
    };
  }

  return {
    scannedAt: new Date().toISOString(),
    summary: synthesizeSummary(input.name, input.keyword, signals, probes.length),
    priceSignals: signals.priceSignals,
    ratingSignals: signals.ratingSignals,
    promoSignals: signals.promoSignals,
    sources: probes.map((p) => ({ title: p.title, url: p.url })),
    rawNotes: errors.length ? `部分來源失敗：${errors.join("；")}` : "來源讀取正常",
  };
}
