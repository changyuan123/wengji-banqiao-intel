import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { CompetitorRadar, ModuleGrid, MonthlyAlert } from "@/components/DashboardPanels";
import { CogsPanel, GeoPanel, KpiStrip } from "@/components/InsightPanels";
import { merchant } from "@/data/merchant";
import { asset } from "@/lib/asset";

export default function DashboardPage() {
  return (
    <div className="page page-app">
      <div className="signboard" aria-hidden>
        <span>台式麻辣 · 湯頭可喝 · 免服務費 · 免費綠豆湯</span>
      </div>
      <SiteHeader variant="app" />

      <main className="dashboard">
        <section
          className="dash-hero"
          style={{ backgroundImage: `url(${asset("/hero-hotpot.jpg")})` }}
        >
          <div>
            <p className="eyebrow">訂閱制營運情報 · 預覽</p>
            <h1>{merchant.fullName}</h1>
            <p className="dash-address" style={{ color: "rgba(255,250,243,0.78)" }}>
              {merchant.address}
            </p>
            <p className="dash-tags">
              <span>{merchant.area}</span>
              <span>{merchant.priceBand}</span>
              <span>外送平台已於 {merchant.exitedDelivery} 退出</span>
            </p>
          </div>
          <aside className="dash-hero__aside">
            <p className="aside-label">本月訂閱價</p>
            <p className="aside-price">
              NT${merchant.monthlyPrice}
              <span>/月</span>
            </p>
            <p>目標：讓每一次更新都對得到淨利或成本下降。</p>
          </aside>
        </section>

        <MonthlyAlert />
        <CompetitorRadar />
        <ModuleGrid />
        <CogsPanel />
        <GeoPanel />
        <KpiStrip />

        <section id="subscribe-bar" className="subscribe-bar">
          <div>
            <h2>正式訂閱後，此頁改為每月自動刷新</h2>
            <p>
              基礎監控自動跑；神秘客與人工情報採集完成後回填，並從訂閱費中分潤給資料貢獻者。
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
