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
            <p className="eyebrow">訂閱制營運情報 · 精準找店核驗核心</p>
            <h1>{merchant.fullName}</h1>
            <p className="dash-address" style={{ color: "rgba(255,250,243,0.78)" }}>
              {merchant.address}
            </p>
            <p className="dash-tags">
              <span>店名精準釘選（同音也能對）</span>
              <span>自動產出現況情報</span>
              <span>網上資訊一律店主核驗</span>
            </p>
          </div>
          <aside className="dash-hero__aside">
            <p className="aside-label">本月訂閱價</p>
            <p className="aside-price">
              NT${merchant.monthlyPrice}
              <span>/月</span>
            </p>
            <p>核心價值：幫你釘對店、草擬現況；可信與否，由你逐條核驗。</p>
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
            <h2>重爬與建置一律上雲（本機文書機不扛）</h2>
            <p>
              儀表板只做精準釘選＋輕量草稿＋店主核驗。公開網重爬、Next 建置、部署皆走 GitHub Actions／Codespaces／Pages，不依賴你的電腦開機。
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
