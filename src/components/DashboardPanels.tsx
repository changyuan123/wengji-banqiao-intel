import { competitors, modules, monthlyBrief } from "@/data/merchant";

export function MonthlyAlert() {
  return (
    <section className="monthly-alert">
      <div className="monthly-alert__meta">
        <span>{monthlyBrief.period}</span>
        <span className="pill pill-warn">風險 {monthlyBrief.riskLevel}</span>
        <span>更新 {monthlyBrief.updatedAt}</span>
      </div>
      <h2>{monthlyBrief.headline}</h2>
      <p>{monthlyBrief.summary}</p>
      <ol className="action-list">
        {monthlyBrief.actions.map((action, i) => (
          <li key={action.title}>
            <span className="action-index">{i + 1}</span>
            <div>
              <strong>{action.title}</strong>
              <p>{action.why}</p>
              <div className="action-meta">
                <span>{action.impact}</span>
                <span>{action.effort}</span>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function CompetitorRadar() {
  return (
    <section className="panel">
      <div className="panel__head">
        <h3>競品雷達（1.5 km）</h3>
        <span className="pill">每周更新</span>
      </div>
      <div className="competitor-grid">
        {competitors.map((c) => (
          <article key={c.name} className="competitor-card">
            <h4>{c.name}</h4>
            <p className="muted">{c.address}</p>
            <p className="price">{c.price}</p>
            <p>{c.threat}</p>
            <p className="move">
              <strong>本月動態：</strong>
              {c.moveThisMonth}
            </p>
            <span className="score">公開評分 {c.score}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ModuleGrid() {
  return (
    <section className="panel">
      <div className="panel__head">
        <h3>本月監控模組</h3>
        <span className="pill">訂閱後持續刷新</span>
      </div>
      <div className="module-grid">
        {modules.map((m) => (
          <article key={m.id} className="module-card">
            <div className="module-card__top">
              <h4>{m.title}</h4>
              <span className={`status status-${m.status === "警報" ? "alert" : m.status === "優先執行" ? "hot" : "ok"}`}>
                {m.status}
              </span>
            </div>
            <p className="muted">{m.cadence}</p>
            <p>{m.blurb}</p>
            <p className="preview">{m.preview}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
