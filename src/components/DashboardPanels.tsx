import { modules, monthlyBrief } from "@/data/merchant";

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
