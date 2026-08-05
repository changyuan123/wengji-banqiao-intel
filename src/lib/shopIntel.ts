/**
 * 店主搜店情報核心：精準候選、模組鑰、尖招、核驗狀態。
 * 原則——網上抓到的一律「未核驗」，只有店主點過才算可信。
 */

export type VerifyStatus = "unverified" | "confirmed" | "corrected" | "dismissed";

export type IntelClaim = {
  id: string;
  moduleKey: string;
  label: string;
  value: string;
  sourceHint: string;
  status: VerifyStatus;
  ownerNote?: string;
};

export type ModuleKeyDef = {
  key: string;
  title: string;
  tip: string;
  question: string;
};

/** 可直接套用的情報模組鑰 */
export const MODULE_KEYS: ModuleKeyDef[] = [
  {
    key: "shop.pin",
    title: "店家釘選",
    tip: "先鎖定「店名＋路段／分店」，避免掃到同名連鎖的別家。",
    question: "這家是不是你要盯的那一間？路段對不對？",
  },
  {
    key: "price.radar",
    title: "價格雷達",
    tip: "只採「個人鍋／套餐／午市」等可比價位，別跟人均混在一起。",
    question: "畫面上的價位，跟你現場或菜單看到的一致嗎？",
  },
  {
    key: "rating.pulse",
    title: "評分脈搏",
    tip: "評分會漂；對照「最近評論語氣」比盯小數點更有用。",
    question: "這個分數／星等，跟你印象中差多少？",
  },
  {
    key: "promo.watch",
    title: "活動盯梢",
    tip: "外送滿額折、期間限定、雙人套餐最容易截客。",
    question: "這些優惠詞現在還有效嗎？還是過期文案？",
  },
  {
    key: "threat.brief",
    title: "威脅簡報",
    tip: "用一句話寫清：它搶的是你的誰（單人／聚餐／外帶）。",
    question: "這句威脅判斷，符合你門市真實感受嗎？",
  },
];

export type ShopCandidate = {
  id: string;
  name: string;
  alias: string[];
  address: string;
  district: string;
  category: string;
  defaultKeyword: string;
  threatHint: string;
  knownPrice?: string;
  knownScore?: string;
};

/** 板橋篤行商圈預置店庫（搜尋先對這裡精準命中，再外接公開網） */
export const SHOP_CATALOG: ShopCandidate[] = [
  {
    id: "guotai-shuang",
    name: "鍋太爽板橋篤行店",
    alias: ["鍋太爽", "郭太爽", "国泰双", "國泰雙", "guo tai shuang", "guotaishuang", "hotpot too cool"],
    address: "篤行路二段 102 號",
    district: "板橋篤行",
    category: "低價個人鍋",
    defaultKeyword: "鍋太爽 板橋 篤行 個人鍋 價格",
    threatHint: "低價攔截單人客與外送評分優勢",
    knownPrice: "$199–$279 個人鍋",
    knownScore: "4.89",
  },
  {
    id: "la-sifang",
    name: "辣四方麻辣燙板橋篤行店",
    alias: ["辣四方", "辣4方", "麻辣燙篤行"],
    address: "篤行路商圈",
    district: "板橋篤行",
    category: "快速單人麻辣燙",
    defaultKeyword: "辣四方 麻辣燙 板橋 篤行 價格",
    threatHint: "快速出餐＋外送適應力高",
    knownPrice: "$149–$169 快速單人餐",
    knownScore: "4.6",
  },
  {
    id: "qiansheng",
    name: "錢昇涮涮鍋",
    alias: ["錢昇", "钱升涮涮锅", "篤行涮涮鍋"],
    address: "篤行路三段 16 號",
    district: "板橋篤行",
    category: "日式個人涮涮鍋",
    defaultKeyword: "錢昇涮涮鍋 篤行路 菜單",
    threatHint: "距離極近，分食日常用餐需求",
    knownPrice: "日式個人涮涮鍋",
    knownScore: "4.3",
  },
  {
    id: "wengji-self",
    name: "翁記麻辣鍋－板橋店",
    alias: ["翁記", "翁记", "板橋翁記"],
    address: "篤行路三段 28 號",
    district: "板橋篤行",
    category: "台式鴛鴦麻辣鍋",
    defaultKeyword: "翁記麻辣鍋 板橋 篤行",
    threatHint: "本店（對照用，通常不需當競品追蹤）",
    knownPrice: "人均約 $400–$500",
  },
];

export type SearchTip = {
  id: string;
  text: string;
  applyQuery?: string;
};

function normalize(q: string) {
  return q
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[－—–-]/g, "")
    .replace(/店$/g, "");
}

function scoreCandidate(query: string, shop: ShopCandidate): number {
  const nq = normalize(query);
  if (!nq) return 0;
  const names = [shop.name, ...shop.alias, shop.address, shop.district, shop.category].map(normalize);
  let best = 0;
  for (const n of names) {
    if (!n) continue;
    if (n === nq) best = Math.max(best, 100);
    else if (n.includes(nq) || nq.includes(n)) best = Math.max(best, 82);
    else {
      // 簡易同音／錯字：共用字元比例
      const shared = [...nq].filter((ch) => n.includes(ch)).length;
      const ratio = shared / Math.max(nq.length, 1);
      if (ratio >= 0.6) best = Math.max(best, Math.round(55 + ratio * 30));
    }
  }
  return best;
}

/** 精準候選：預設只回前 3 名高分，避免店主在一長串店裡跳來跳去 */
export function findShopCandidates(query: string, limit = 3): { shop: ShopCandidate; score: number }[] {
  const scored = SHOP_CATALOG.map((shop) => ({ shop, score: scoreCandidate(query, shop) }))
    .filter((x) => x.score >= 50)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

/** GPT 式尖招：依輸入即時給「怎麼找得更準」的提示 */
export function buildSearchTips(query: string, candidates: { shop: ShopCandidate; score: number }[]): SearchTip[] {
  const tips: SearchTip[] = [];
  const q = query.trim();

  if (!q) {
    return [
      { id: "t0", text: "直接打店名即可，例如「鍋太爽」——系統會對上篤行分店，不必自己翻一長串。", applyQuery: "鍋太爽" },
      { id: "t1", text: "不確定寫法？同音也可試「郭太爽」；會自動對到「鍋太爽板橋篤行店」。", applyQuery: "郭太爽" },
      { id: "t2", text: "若同名很多，再補路段：「篤行」或「三段」，一次釘死分店。" },
    ];
  }

  if (candidates.length === 0) {
    tips.push({
      id: "miss",
      text: `「${q}」在預置店庫沒打中。可改打完整店名，或加「板橋／篤行」；也可當自訂店直接調查。`,
    });
    tips.push({
      id: "miss2",
      text: "尖招：公開網上同名連鎖很多——關鍵是「店名＋路段」，不是掃全部搜尋結果。",
    });
    return tips;
  }

  const top = candidates[0];
  if (top.score >= 80) {
    tips.push({
      id: "hit",
      text: `高機率就是「${top.shop.name}」（${top.shop.address}）。選它即可，不用再跳其他店。`,
      applyQuery: top.shop.name,
    });
  } else {
    tips.push({
      id: "near",
      text: `最接近的是「${top.shop.name}」。若不是，點下方其他候選，或把路段寫進搜尋框。`,
      applyQuery: top.shop.name,
    });
  }

  tips.push({
    id: "verify",
    text: "記住：網上抓到的價格／評分／優惠，一律要你核驗後才算數——系統不會替你背書。",
  });

  if (!/篤行|板橋|三段|二段/.test(q) && candidates.length > 1) {
    tips.push({
      id: "geo",
      text: "同區還有其他類似店。加上「篤行」可把候選壓到 1～2 家。",
      applyQuery: `${q} 篤行`,
    });
  }

  return tips.slice(0, 4);
}

export function createClaimId() {
  return `cl_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

/** 依探查結果＋店庫知識，產生「待店主核驗」的情報條目 */
export function buildClaimsForShop(input: {
  shopName: string;
  keyword: string;
  catalog?: ShopCandidate;
  priceSignals: string[];
  ratingSignals: string[];
  promoSignals: string[];
  summary: string;
}): IntelClaim[] {
  const claims: IntelClaim[] = [];
  const cat = input.catalog;

  claims.push({
    id: createClaimId(),
    moduleKey: "shop.pin",
    label: "鎖定分店",
    value: cat
      ? `${cat.name} · ${cat.address} · ${cat.category}`
      : `${input.shopName}（自訂店／公開網對照中）`,
    sourceHint: cat ? "預置商圈店庫" : "店主輸入",
    status: "unverified",
  });

  const prices = [...input.priceSignals];
  if (cat?.knownPrice && !prices.includes(cat.knownPrice)) {
    prices.unshift(cat.knownPrice);
  }
  if (prices.length) {
    claims.push({
      id: createClaimId(),
      moduleKey: "price.radar",
      label: "價格訊號",
      value: prices.slice(0, 5).join("、"),
      sourceHint: "公開網萃取／店庫備註 · 需現場或菜單核對",
      status: "unverified",
    });
  } else {
    claims.push({
      id: createClaimId(),
      moduleKey: "price.radar",
      label: "價格訊號",
      value: "本次未穩定抓到價位——建議改關鍵字「店名＋個人鍋／套餐」或明日再掃",
      sourceHint: "公開網（空）",
      status: "unverified",
    });
  }

  const ratings = [...input.ratingSignals];
  if (cat?.knownScore && !ratings.includes(cat.knownScore)) {
    ratings.unshift(cat.knownScore);
  }
  claims.push({
    id: createClaimId(),
    moduleKey: "rating.pulse",
    label: "評分訊號",
    value: ratings.length ? ratings.slice(0, 4).join("、") : "未抓到穩定評分",
    sourceHint: "公開網／店庫 · 請對照近期真實評論",
    status: "unverified",
  });

  claims.push({
    id: createClaimId(),
    moduleKey: "promo.watch",
    label: "活動／品類詞",
    value: input.promoSignals.length
      ? input.promoSignals.slice(0, 6).join("、")
      : "未抓到明顯優惠詞",
    sourceHint: "公開網關鍵詞 · 可能是過期文案",
    status: "unverified",
  });

  claims.push({
    id: createClaimId(),
    moduleKey: "threat.brief",
    label: "現況威脅判斷",
    value: cat?.threatHint ?? `針對「${input.shopName}／${input.keyword}」的競品壓力仍需你現場補一句。`,
    sourceHint: "系統草擬 · 必須店主確認才採納",
    status: "unverified",
  });

  return claims;
}

export function situationLine(claims: IntelClaim[], shopName: string): string {
  const verified = claims.filter((c) => c.status === "confirmed" || c.status === "corrected");
  const pending = claims.filter((c) => c.status === "unverified").length;
  if (!claims.length) {
    return `「${shopName}」尚無情報。搜尋並調查後，每條都要你核驗。`;
  }
  if (pending === 0) {
    return `「${shopName}」本輪 ${verified.length} 條情報皆已由你核驗，可作為本周對策依據。`;
  }
  return `「${shopName}」已自動產出 ${claims.length} 條現況情報，其中 ${pending} 條仍待你核驗——未核驗不算數。`;
}

export function moduleTitle(key: string) {
  return MODULE_KEYS.find((m) => m.key === key)?.title ?? key;
}

export function moduleQuestion(key: string) {
  return MODULE_KEYS.find((m) => m.key === key)?.question ?? "這條資訊正確嗎？";
}
