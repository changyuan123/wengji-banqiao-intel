import { cogsBreakdown, geoKeywords, kpis, merchant } from "@/data/merchant";

export function KpiStrip() {
  return (
    <section className="panel">
      <div className="panel__head">
        <h3>店主採購／續訂決策指標</h3>
        <span className="pill">對齊財務回本</span>
      </div>
      <div className="kpi-grid">
        {kpis.map((k) => (
          <article key={k.id} className="kpi-card">
            <span className="kpi-weight">權重 {k.weight}</span>
            <h4>{k.label}</h4>
            <p className="kpi-value">{k.value}</p>
            <p>{k.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function CogsPanel() {
  return (
    <section className="panel">
      <div className="panel__head">
        <h3>$888 雙人鴛鴦套餐成本結構（示意）</h3>
        <span className="pill">菜單工程</span>
      </div>
      <div className="cogs-bars">
        {cogsBreakdown.map((row) => (
          <div key={row.item} className="cogs-row">
            <div className="cogs-row__label">
              <span>{row.item}</span>
              <strong>{row.share}%</strong>
            </div>
            <div className="cogs-track" aria-hidden>
              <i style={{ width: `${row.share * 3}%` }} />
            </div>
            <p className="muted">{row.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function GeoPanel() {
  return (
    <section className="panel">
      <div className="panel__head">
        <h3>在地搜尋關鍵字作戰</h3>
        <span className="pill">GEO / SEO</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>關鍵字</th>
              <th>搜尋量</th>
              <th>競爭</th>
              <th>本月動作</th>
            </tr>
          </thead>
          <tbody>
            {geoKeywords.map((g) => (
              <tr key={g.kw}>
                <td>{g.kw}</td>
                <td>{g.volume}</td>
                <td>{g.difficulty}</td>
                <td>{g.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="muted geo-note">
        圓心：{merchant.address}。目標：周邊 1.5 公里搜尋到店率 +15%。
      </p>
    </section>
  );
}
