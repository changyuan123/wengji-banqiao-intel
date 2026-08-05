"use client";

import { useEffect, useState, useTransition } from "react";
import { investigateCompetitor } from "@/lib/investigate";
import {
  MAX_TRACKED,
  TrackedCompetitor,
  createId,
  loadTracked,
  needsDailyScan,
  saveTracked,
} from "@/lib/tracker";

export function CompetitorTracker() {
  const [items, setItems] = useState<TrackedCompetitor[]>([]);
  const [name, setName] = useState("");
  const [keyword, setKeyword] = useState("");
  const [note, setNote] = useState("");
  const [autoDaily, setAutoDaily] = useState(true);
  const [ready, setReady] = useState(false);
  const [pending, startTransition] = useTransition();
  const [banner, setBanner] = useState("");

  useEffect(() => {
    const list = loadTracked();
    setItems(list);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || !autoDaily) return;

    let cancelled = false;

    (async () => {
      const list = loadTracked();
      const due = list.filter((item) => needsDailyScan(item));
      if (!due.length || cancelled) return;

      setBanner(`偵測到 ${due.length} 筆超過 24 小時未更新，開始自動調查…`);
      let next = [...list];
      setItems(next);

      for (const dueItem of due) {
        if (cancelled) return;
        next = await scanOne(next, dueItem.id);
        if (cancelled) return;
        setItems(next);
      }

      if (!cancelled) {
        setBanner(`自動調查完成（${due.length} 筆）。之後每次開啟儀表板會檢查是否需日更。`);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, autoDaily]);

  async function scanOne(list: TrackedCompetitor[], id: string) {
    const target = list.find((x) => x.id === id);
    if (!target) return list;
    let next = list.map((x) =>
      x.id === id ? { ...x, status: "scanning" as const, errorMessage: undefined } : x,
    );
    setItems(next);
    try {
      const finding = await investigateCompetitor({
        name: target.name,
        keyword: target.keyword,
      });
      next = next.map((x) =>
        x.id === id
          ? {
              ...x,
              status: "ok" as const,
              lastScanAt: finding.scannedAt,
              finding,
            }
          : x,
      );
    } catch (err) {
      next = next.map((x) =>
        x.id === id
          ? {
              ...x,
              status: "error" as const,
              errorMessage: err instanceof Error ? err.message : "調查失敗",
            }
          : x,
      );
    }
    saveTracked(next);
    return next;
  }

  function persist(next: TrackedCompetitor[]) {
    setItems(next);
    saveTracked(next);
  }

  function onAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !keyword.trim()) {
      setBanner("請填店名／品名與調查關鍵字。");
      return;
    }
    if (items.length >= MAX_TRACKED) {
      setBanner(`最多追蹤 ${MAX_TRACKED} 筆同性質競品。`);
      return;
    }
    const item: TrackedCompetitor = {
      id: createId(),
      name: name.trim(),
      keyword: keyword.trim(),
      note: note.trim(),
      createdAt: new Date().toISOString(),
      lastScanAt: null,
      status: "queued",
      finding: null,
    };
    const next = [item, ...items].slice(0, MAX_TRACKED);
    persist(next);
    setName("");
    setKeyword("");
    setNote("");
    setBanner(`已加入「${item.name}」，可立刻調查或等每日自動更新。`);
    startTransition(async () => {
      const scanned = await scanOne(next, item.id);
      setItems(scanned);
    });
  }

  function onRemove(id: string) {
    persist(items.filter((x) => x.id !== id));
  }

  function onScan(id: string) {
    startTransition(async () => {
      const scanned = await scanOne(items, id);
      setItems(scanned);
      setBanner("單筆調查完成。");
    });
  }

  function onScanAll() {
    startTransition(async () => {
      let next = [...items];
      for (const item of items) {
        next = await scanOne(next, item.id);
      }
      setItems(next);
      setBanner(`已全部重掃（${items.length} 筆）。`);
    });
  }

  return (
    <section className="panel tracker-panel">
      <div className="panel__head">
        <div>
          <h3>競品／同性質商品追蹤（核心）</h3>
          <p className="muted tracker-lead">
            店主自行新增最多 {MAX_TRACKED} 筆會影響生意的店或品項，輸入關鍵字後外接公開網探查；開啟每日檢查後，超過 24
            小時會自動再查。
          </p>
        </div>
        <span className="pill pill-warn">
          {items.length}/{MAX_TRACKED}
        </span>
      </div>

      <form className="tracker-form" onSubmit={onAdd}>
        <label>
          店名／品名
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例：鍋太爽板橋篤行店"
            maxLength={60}
          />
        </label>
        <label>
          調查關鍵字
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="例：鍋太爽 篤行 個人鍋 199"
            maxLength={80}
          />
        </label>
        <label className="tracker-form__note">
          備註（選填）
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="為什麼要盯它？"
            maxLength={100}
          />
        </label>
        <button className="btn btn-primary" type="submit" disabled={pending || items.length >= MAX_TRACKED}>
          新增並調查
        </button>
      </form>

      <div className="tracker-toolbar">
        <label className="tracker-toggle">
          <input
            type="checkbox"
            checked={autoDaily}
            onChange={(e) => setAutoDaily(e.target.checked)}
          />
          每日自動調查（開啟儀表板時檢查是否超過 24 小時）
        </label>
        <button className="btn btn-ghost" type="button" onClick={onScanAll} disabled={pending || !items.length}>
          全部重掃
        </button>
      </div>

      {banner ? <p className="tracker-banner">{banner}</p> : null}
      {pending ? <p className="tracker-banner">調查進行中（外接公開網讀取）…</p> : null}

      <div className="tracker-list">
        {items.map((item) => (
          <article key={item.id} className="tracker-card">
            <div className="tracker-card__top">
              <div>
                <h4>{item.name}</h4>
                <p className="muted">關鍵字：{item.keyword}</p>
                {item.note ? <p className="muted">{item.note}</p> : null}
              </div>
              <span
                className={`status status-${
                  item.status === "error" ? "alert" : item.status === "scanning" ? "hot" : "ok"
                }`}
              >
                {statusLabel(item.status)}
              </span>
            </div>

            {item.finding ? (
              <div className="tracker-finding">
                <p>{item.finding.summary}</p>
                <div className="tracker-signals">
                  <Signal label="價格" values={item.finding.priceSignals} />
                  <Signal label="評分" values={item.finding.ratingSignals} />
                  <Signal label="活動詞" values={item.finding.promoSignals} />
                </div>
                <p className="muted">
                  上次調查：{formatTime(item.lastScanAt)}
                  {item.finding.rawNotes ? ` · ${item.finding.rawNotes}` : ""}
                </p>
              </div>
            ) : (
              <p className="muted">尚未調查。新增後會自動跑，或按下方按鈕。</p>
            )}

            <div className="tracker-actions">
              <button className="btn btn-sm" type="button" onClick={() => onScan(item.id)} disabled={pending}>
                立刻調查
              </button>
              <button className="btn btn-ghost" type="button" onClick={() => onRemove(item.id)} disabled={pending}>
                移除
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Signal({ label, values }: { label: string; values: string[] }) {
  return (
    <div>
      <strong>{label}</strong>
      <p>{values.length ? values.join("、") : "—"}</p>
    </div>
  );
}

function statusLabel(status: TrackedCompetitor["status"]) {
  switch (status) {
    case "scanning":
      return "調查中";
    case "queued":
      return "排隊中";
    case "ok":
      return "已更新";
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
