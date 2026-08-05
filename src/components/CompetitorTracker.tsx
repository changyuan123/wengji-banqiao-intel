"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { draftInvestigateCompetitor } from "@/lib/investigate";
import {
  MODULE_KEYS,
  buildSearchTips,
  findShopCandidates,
  moduleQuestion,
  moduleTitle,
  type ShopCandidate,
  type VerifyStatus,
} from "@/lib/shopIntel";
import {
  MAX_TRACKED,
  TrackedCompetitor,
  createId,
  loadTracked,
  saveTracked,
  updateClaimStatus,
} from "@/lib/tracker";

export function CompetitorTracker() {
  const [items, setItems] = useState<TrackedCompetitor[]>([]);
  const [query, setQuery] = useState("");
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();
  const [banner, setBanner] = useState("");
  const [correcting, setCorrecting] = useState<{ itemId: string; claimId: string } | null>(null);
  const [correctDraft, setCorrectDraft] = useState("");

  const candidates = useMemo(() => findShopCandidates(query), [query]);
  const tips = useMemo(() => buildSearchTips(query, candidates), [query, candidates]);

  useEffect(() => {
    // 僅讀本機草稿清單，不開自動外網重爬（文書機友善／雲端開發規則）
    setItems(loadTracked());
  }, []);

  function scanOne(list: TrackedCompetitor[], id: string) {
    const target = list.find((x) => x.id === id);
    if (!target) return list;
    const finding = draftInvestigateCompetitor({
      name: target.name,
      keyword: target.keyword,
      catalogId: target.catalogId,
    });
    const next = list.map((x) =>
      x.id === id
        ? {
            ...x,
            status: "ok" as const,
            lastScanAt: finding.scannedAt,
            finding,
            errorMessage: undefined,
          }
        : x,
    );
    saveTracked(next);
    return next;
  }

  function persist(next: TrackedCompetitor[]) {
    setItems(next);
    saveTracked(next);
  }

  function addShop(shop: ShopCandidate | { name: string; keyword: string; catalogId?: string }) {
    if (items.length >= MAX_TRACKED) {
      setBanner(`最多追蹤 ${MAX_TRACKED} 筆同性質競品。`);
      return;
    }
    const name = "id" in shop ? shop.name : shop.name;
    const keyword = "defaultKeyword" in shop ? shop.defaultKeyword : shop.keyword;
    const catalogId = "id" in shop ? shop.id : shop.catalogId;
    if (items.some((x) => x.name === name || (catalogId && x.catalogId === catalogId))) {
      setBanner(`「${name}」已在追蹤清單，直接往下核驗即可，不必重複新增。`);
      return;
    }
    const item: TrackedCompetitor = {
      id: createId(),
      name,
      keyword,
      note: note.trim() || ("threatHint" in shop ? shop.threatHint : ""),
      catalogId,
      createdAt: new Date().toISOString(),
      lastScanAt: null,
      status: "queued",
      finding: null,
    };
    const next = [item, ...items].slice(0, MAX_TRACKED);
    persist(next);
    setQuery("");
    setNote("");
    startTransition(() => {
      const scanned = scanOne(next, item.id);
      setItems(scanned);
      setBanner(`「${item.name}」已產出現況草稿（本機輕量）。請逐條核驗；公開網重爬改走雲端排程。`);
    });
  }

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) {
      setBanner("請先輸入店名。可試「鍋太爽」或同音「郭太爽」。");
      return;
    }
    if (candidates[0] && candidates[0].score >= 75) {
      addShop(candidates[0].shop);
      return;
    }
    if (candidates.length === 1) {
      addShop(candidates[0].shop);
      return;
    }
    if (candidates.length > 1) {
      setBanner("請從下方精準候選點選一家，避免掃到同名別店。");
      return;
    }
    // 店庫未命中：允許自訂店
    addShop({
      name: query.trim(),
      keyword: `${query.trim()} 板橋 菜單 價格`,
    });
  }

  function onRemove(id: string) {
    persist(items.filter((x) => x.id !== id));
  }

  function onScan(id: string) {
    startTransition(() => {
      const scanned = scanOne(items, id);
      setItems(scanned);
      setBanner("已刷新本機草稿。新情報同樣需要你核驗（不佔用本機外網重爬）。");
    });
  }

  function onScanAll() {
    startTransition(() => {
      let next = [...items];
      for (const item of items) {
        next = scanOne(next, item.id);
      }
      setItems(next);
      setBanner(`已全部刷新草稿（${items.length} 筆）。重爬請走雲端 CI，勿在本機連跑。`);
    });
  }

  function onVerify(itemId: string, claimId: string, status: VerifyStatus, ownerNote?: string) {
    const next = updateClaimStatus(items, itemId, claimId, status, ownerNote);
    persist(next);
    setCorrecting(null);
    setCorrectDraft("");
  }

  return (
    <section className="panel tracker-panel">
      <div className="panel__head">
        <div>
          <h3>精準找店 · 自動分析 · 店主核驗</h3>
          <p className="muted tracker-lead">
            搜店名即可釘選分店（同音也能對上）；本機只產輕量草稿供你核驗。公開網重爬改走雲端，不拖慢文書機。
          </p>
        </div>
        <span className="pill pill-warn">
          {items.length}/{MAX_TRACKED}
        </span>
      </div>

      <div className="intel-keys" aria-label="可直接套用的情報模組鑰">
        {MODULE_KEYS.map((m) => (
          <div key={m.key} className="intel-key">
            <code>{m.key}</code>
            <strong>{m.title}</strong>
            <span>{m.tip}</span>
          </div>
        ))}
      </div>

      <form className="tracker-search" onSubmit={onSearchSubmit}>
        <label className="tracker-search__field">
          搜尋店名（精準釘選，不必翻一長串）
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="例：鍋太爽　或同音　郭太爽"
            maxLength={60}
            autoComplete="off"
          />
        </label>
        <label className="tracker-search__note">
          備註（選填）
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="為什麼要盯它？"
            maxLength={100}
          />
        </label>
        <button className="btn btn-primary" type="submit" disabled={pending || items.length >= MAX_TRACKED}>
          {candidates[0]?.score >= 75 ? "釘選最準一家並分析" : "搜尋／新增並分析"}
        </button>
      </form>

      <div className="intel-tips">
        <p className="intel-tips__label">尖招（像對話一樣幫你對準目標）</p>
        <ul>
          {tips.map((tip) => (
            <li key={tip.id}>
              <span>{tip.text}</span>
              {tip.applyQuery ? (
                <button type="button" className="tip-apply" onClick={() => setQuery(tip.applyQuery!)}>
                  套用「{tip.applyQuery}」
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      </div>

      {candidates.length > 0 ? (
        <div className="intel-candidates">
          <p className="intel-tips__label">精準候選（最多 3 家，點一下就釘選）</p>
          <div className="intel-candidate-list">
            {candidates.map(({ shop, score }) => (
              <button
                key={shop.id}
                type="button"
                className="intel-candidate"
                disabled={pending || items.length >= MAX_TRACKED}
                onClick={() => addShop(shop)}
              >
                <span className="intel-candidate__score">{score}%</span>
                <span className="intel-candidate__body">
                  <strong>{shop.name}</strong>
                  <span>
                    {shop.address} · {shop.category}
                  </span>
                </span>
                <span className="intel-candidate__cta">釘選並分析</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="tracker-toolbar">
        <p className="tracker-toggle muted">
          每日重爬：雲端 GitHub Actions／Serverless（本機不開自動外網調查）
        </p>
        <button className="btn btn-ghost" type="button" onClick={onScanAll} disabled={pending || !items.length}>
          全部刷新草稿
        </button>
      </div>

      {banner ? <p className="tracker-banner">{banner}</p> : null}

      <div className="tracker-list">
        {items.map((item) => {
          const claims = item.finding?.claims ?? [];
          const pendingCount = claims.filter((c) => c.status === "unverified").length;
          return (
            <article key={item.id} className="tracker-card">
              <div className="tracker-card__top">
                <div>
                  <h4>{item.name}</h4>
                  <p className="muted">關鍵字：{item.keyword}</p>
                  {item.note ? <p className="muted">{item.note}</p> : null}
                </div>
                <div className="tracker-card__badges">
                  {claims.length > 0 ? (
                    <span className={`pill ${pendingCount ? "pill-warn" : ""}`}>
                      {pendingCount ? `待核驗 ${pendingCount}` : "已全部核驗"}
                    </span>
                  ) : null}
                  <span
                    className={`status status-${
                      item.status === "error" ? "alert" : item.status === "scanning" ? "hot" : "ok"
                    }`}
                  >
                    {statusLabel(item.status)}
                  </span>
                </div>
              </div>

              {item.finding ? (
                <div className="tracker-finding">
                  <p className="situation-line">{item.finding.situation}</p>
                  <p className="muted finding-summary">{item.finding.summary}</p>

                  <div className="claim-list">
                    {claims.map((claim) => (
                      <div key={claim.id} className={`claim claim--${claim.status}`}>
                        <div className="claim__meta">
                          <code>{claim.moduleKey}</code>
                          <span className="claim__mod">{moduleTitle(claim.moduleKey)}</span>
                          <span className={`claim__status claim__status--${claim.status}`}>
                            {verifyLabel(claim.status)}
                          </span>
                        </div>
                        <p className="claim__label">{claim.label}</p>
                        <p className="claim__value">
                          {claim.status === "corrected" && claim.ownerNote
                            ? claim.ownerNote
                            : claim.value}
                        </p>
                        <p className="muted claim__hint">
                          {claim.sourceHint} · {moduleQuestion(claim.moduleKey)}
                        </p>
                        {claim.status === "corrected" && claim.ownerNote ? (
                          <p className="muted">原稿：{claim.value}</p>
                        ) : null}

                        {claim.status === "unverified" ? (
                          <div className="claim__actions">
                            <button
                              type="button"
                              className="btn btn-sm"
                              onClick={() => onVerify(item.id, claim.id, "confirmed")}
                            >
                              屬實
                            </button>
                            <button
                              type="button"
                              className="btn btn-ghost"
                              onClick={() => {
                                setCorrecting({ itemId: item.id, claimId: claim.id });
                                setCorrectDraft(claim.value);
                              }}
                            >
                              有誤·改正
                            </button>
                            <button
                              type="button"
                              className="btn btn-ghost"
                              onClick={() => onVerify(item.id, claim.id, "dismissed")}
                            >
                              無法確認
                            </button>
                          </div>
                        ) : null}

                        {correcting?.itemId === item.id && correcting.claimId === claim.id ? (
                          <div className="claim__correct">
                            <input
                              value={correctDraft}
                              onChange={(e) => setCorrectDraft(e.target.value)}
                              placeholder="寫下你核對後的正確資訊"
                              maxLength={160}
                            />
                            <button
                              type="button"
                              className="btn btn-sm"
                              onClick={() =>
                                onVerify(item.id, claim.id, "corrected", correctDraft.trim() || claim.value)
                              }
                            >
                              儲存改正
                            </button>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>

                  <p className="muted">
                    上次調查：{formatTime(item.lastScanAt)}
                    {item.finding.rawNotes ? ` · ${item.finding.rawNotes}` : ""}
                  </p>
                </div>
              ) : (
                <p className="muted">尚未分析。釘選後會自動跑，或按下方按鈕。</p>
              )}

              <div className="tracker-actions">
                <button className="btn btn-sm" type="button" onClick={() => onScan(item.id)} disabled={pending}>
                  立刻重掃
                </button>
                <button className="btn btn-ghost" type="button" onClick={() => onRemove(item.id)} disabled={pending}>
                  移除
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function verifyLabel(status: VerifyStatus) {
  switch (status) {
    case "confirmed":
      return "已核驗·屬實";
    case "corrected":
      return "已核驗·已改正";
    case "dismissed":
      return "已標·無法確認";
    default:
      return "未核驗";
  }
}

function statusLabel(status: TrackedCompetitor["status"]) {
  switch (status) {
    case "scanning":
      return "分析中";
    case "queued":
      return "排隊中";
    case "ok":
      return "已產出草稿";
    case "error":
      return "失敗";
    default:
      return "待命";
  }
}

function formatTime(value: string | null) {
  if (!value) return "尚未";
  try {
    return new Date(value).toLocaleString("zh-TW");
  } catch {
    return value;
  }
}
