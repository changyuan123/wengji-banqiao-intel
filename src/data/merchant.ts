export const merchant = {
  name: "翁記麻辣鍋",
  branch: "板橋店",
  fullName: "翁記麻辣鍋－板橋店",
  address: "220 新北市板橋區溪福里篤行路三段 28 號",
  area: "板橋溪福里／樹林交界商圈",
  priceBand: "人均約 $400–$500",
  signature: "溫潤可喝的台式麻辣紅湯、白蘿蔔清湯、鴨血豆腐",
  exitedDelivery: "2023-01-30",
  monthlyPrice: 99,
  annualRoiTarget: 5,
} as const;

export const competitors = [
  {
    name: "鍋太爽板橋篤行店",
    address: "篤行路二段 102 號",
    price: "$199–$279 個人鍋",
    threat: "低價攔截單人客與外送評分優勢",
    score: 4.89,
    moveThisMonth: "海鮮豆腐鍋維持 $199，週末外送滿額折扣仍在線",
  },
  {
    name: "辣四方麻辣燙板橋篤行店",
    address: "篤行路商圈",
    price: "$149–$169 快速單人餐",
    threat: "快速出餐＋外送適應力高",
    score: 4.6,
    moveThisMonth: "犇牛餐 $169 搭配外送滿 $200 折 $20",
  },
  {
    name: "錢昇涮涮鍋",
    address: "篤行路三段 16 號",
    price: "日式個人涮涮鍋",
    threat: "距離極近，分食日常用餐需求",
    score: 4.3,
    moveThisMonth: "平日午市無明顯促銷，晚間仍以固定客為主",
  },
] as const;

export const monthlyBrief = {
  period: "2026 年 8 月",
  updatedAt: "2026-08-04",
  riskLevel: "中高",
  headline: "夏季淡季＋低價個人鍋夾擊：本月優先補「自營外帶」與「高毛利加點」",
  summary:
    "氣溫偏高將壓低堂食翻桌；周邊個人鍋與麻辣燙持續用價格截走單人客。翁記應守住 $400–$500 聚餐定位，並用免抽成社區預購補齊退出 Uber Eats 後的非高峰缺口。",
  actions: [
    {
      title: "啟動雙人鴛鴦真空底料＋冷凍生鮮預購",
      why: "補外送退場營收，抽成 0%",
      impact: "預估月增淨利 $6,000–$12,000",
      effort: "本週可上線",
    },
    {
      title: "菜單引導加點大腸頭／芋頭丸／鴨肉丸",
      why: "拉高桌均毛利，不傷湯頭口碑",
      impact: "桌均毛利 +3～5 個百分點",
      effort: "改版面即可",
    },
    {
      title: "上架「輕麻辣＋綠豆湯」夏季組合",
      why: "對沖淡季體感、提高回訪",
      impact: "淡季周末翻桌率目標 +10%",
      effort: "兩週內可測",
    },
  ],
} as const;

export const kpis = [
  {
    id: "roi",
    label: "訂閱回本門檻",
    value: "約 1 組雙人套餐",
    detail: `月費 NT$${merchant.monthlyPrice}，多賣一組 $888 套餐即回本有餘`,
    weight: "35%",
  },
  {
    id: "prime",
    label: "Prime Cost 目標",
    value: "55%–58%",
    detail: "食材＋直接人事合計占營收，低於 60% 安全線",
    weight: "25%",
  },
  {
    id: "takeout",
    label: "自營外帶缺口補償",
    value: "≥70%",
    detail: "相對退出第三方外送後的非高峰營收缺口",
    weight: "20%",
  },
  {
    id: "geo",
    label: "1.5km 搜尋到店率",
    value: "+15%",
    detail: "優化「板橋麻辣鍋」「篤行路美食」等關鍵字",
    weight: "20%",
  },
] as const;

export const modules = [
  {
    id: "radar",
    title: "1.5 公里競品雷達",
    cadence: "每周更新",
    status: "監控中",
    blurb: "以篤行路三段 28 號為圓心，追蹤低價個人鍋與近距涮涮鍋的價格、活動與評分異動。",
    preview: "本周：辣四方外送折扣仍開；鍋太爽評分 4.89 維持高位。",
  },
  {
    id: "takeout",
    title: "自營社區外帶體系",
    cadence: "每周更新",
    status: "優先執行",
    blurb: "把 $888 雙人套餐轉成真空底料包＋冷凍組合，走 LINE 社區團購，0% 平台抽成。",
    preview: "建議主推梅花豬／雪花牛組合，加購大腸頭拉客單。",
  },
  {
    id: "cogs",
    title: "菜單工程 × COGS",
    cadence: "每月更新",
    status: "監控中",
    blurb: "拆解套餐成本結構，找出高毛利底料與高成本肉品的最佳搭配，降低備料耗損。",
    preview: "鴨血／豆腐／蔬菜湯底毛利高，應成為加點與套餐視覺焦點。",
  },
  {
    id: "season",
    title: "淡季翻桌與天氣連動",
    cadence: "每日簡報",
    status: "警報",
    blurb: "依氣溫與周末人流，給出夏季限定組合與熟客回流動作，平滑固定成本壓力。",
    preview: "本周高溫日偏多，建議強化午晚間外帶預購時段。",
  },
  {
    id: "geo",
    title: "在地搜尋 GEO／SEO",
    cadence: "每月更新",
    status: "監控中",
    blurb: "針對板橋麻辣鍋、篤行路美食、免服務費火鍋等詞，優化 Google 商家與到店路徑。",
    preview: "優先補齊商家照片、營業時間與「免服務費＋免費綠豆湯」賣點。",
  },
  {
    id: "mystery",
    title: "神秘客現場補強",
    cadence: "每月 1–2 次",
    status: "加值版",
    blurb: "人工踩點競品排隊、湯頭體感、服務節奏——AI 與公開網抓不到的情報。",
    preview: "訂閱加值後派單，回填至本儀表板並納入分潤。",
  },
] as const;

export const cogsBreakdown = [
  { item: "Choice 雪花牛（套餐內）", share: 28, note: "高成本，控份量與升級加價" },
  { item: "梅花豬／其他肉品", share: 18, note: "中成本，可作預設主肉" },
  { item: "麻辣／清湯底料", share: 12, note: "高感知、相對高毛利" },
  { item: "鴨血＋豆腐", share: 8, note: "口碑核心，毛利佳" },
  { item: "蔬菜盤／白蘿蔔", share: 10, note: "穩定毛利" },
  { item: "包材／其他", share: 6, note: "外帶需嚴控" },
  { item: "預估毛利空間", share: 18, note: "目標再經菜單工程上修" },
] as const;

export const geoKeywords = [
  { kw: "板橋麻辣鍋", volume: "高", difficulty: "中", action: "商家標題＋介紹首句放入" },
  { kw: "篤行路美食", volume: "中", difficulty: "低", action: "週文案與貼文地標標記" },
  { kw: "板橋免服務費火鍋", volume: "低", difficulty: "低", action: "賣點欄固定露出" },
  { kw: "板橋鴛鴦鍋", volume: "中", difficulty: "中", action: "套餐照片 ALT 與貼文" },
] as const;
