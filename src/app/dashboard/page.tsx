import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { CompetitorTracker } from "@/components/CompetitorTracker";
import { ModuleGrid, MonthlyAlert } from "@/components/DashboardPanels";
import { CogsPanel, GeoPanel, KpiStrip } from "@/components/InsightPanels";
import { merchant } from "@/data/merchant";

export default function DashboardPage() {
  return (
    <div className="page page-app">
      <div className="signboard" aria-hidden>
        <span>台式麻辣 · 湯頭可喝 · 免服務費 · 免費綠豆湯</span>
      </div>
      <SiteHeader variant="app" />

      <main className="dashboard">
        <section className="dash-hero">
          <div>
            <p className="eyebrow">訂閱制營運情報 · 競品追蹤核心</p>
            <h1>{merchant.fullName}</h1>
            <p className="dash-address" style={{ color: "rgba(255,250,243,0.78)" }}>
              {merchant.address}
            </p>
            <p className="dash-tags">
              <span>自行新增最多 10 筆競品</span>
              <span>關鍵字外接公開網調查</span>
              <span>超過 24 小時自動再查</span>
            </p>
          </div>
          <aside className="dash-hero__aside">
            <p className="aside-label">本月訂閱價</p>
            <p className="aside-price">
              NT${merchant.monthlyPrice}
              <span>/月</span>
            </p>
            <p>核心價值：你指定要盯的店／品，系統持續幫你查。</p>
          </aside>
        </section>

        <CompetitorTracker />
        <MonthlyAlert />
        <ModuleGrid />
        <CogsPanel />
        <GeoPanel />
        <KpiStrip />

        <section id="subscribe-bar" className="subscribe-bar">
          <div>
            <h2>正式訂閱後可接雲端排程爬蟲（真正每天自動跑）</h2>
            <p>
              目前已可在瀏覽器新增競品並外接公開網調查；若要「電腦關機也每天固定爬」，需外掛排程後端。
            </p>
          </div>
          <Link className="btn btn-primary" href="/#subscribe">
            回到訂閱說明 · NT${merchant.monthlyPrice}/月
          </Link>
        </section>
      </main>
    </div>
  );
}
