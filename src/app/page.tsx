import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SubscribePanel } from "@/components/SubscribePanel";
import { YuanyangMark } from "@/components/YuanyangMark";
import { merchant, modules } from "@/data/merchant";

export default function HomePage() {
  return (
    <div className="page">
      <div className="signboard" aria-hidden>
        <span>台式麻辣 · 湯頭可喝 · 免服務費 · 免費綠豆湯</span>
      </div>
      <SiteHeader />

      <main>
        <section className="hero hero--storefront">
          <div className="hero__store-bg" aria-hidden>
            <div className="hero__lantern hero__lantern--l" />
            <div className="hero__lantern hero__lantern--r" />
            <div className="hero__steam-field">
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="hero__content hero__content--stack">
            <div className="hero-copy">
              <p className="hero-kicker">篤行路三段 28 號專屬</p>
              <p className="hero-brand">{merchant.name}</p>
              <h1>
                {merchant.branch}
                <span>每月營運情報</span>
              </h1>
              <p className="hero-lede">
                給門市的訂閱制儀表板：盯住低價個人鍋夾擊、補上退出外送後的缺口，並用菜單工程把淡季毛利留住。
              </p>
              <div className="cta-row">
                <a className="btn btn-primary" href="#subscribe">
                  每月 NT${merchant.monthlyPrice} 訂閱
                </a>
                <Link className="btn btn-ghost btn-ghost-on-red" href="/dashboard/">
                  打開本月儀表板預覽
                </Link>
              </div>
              <p className="hero-address">{merchant.address}</p>
            </div>
            <div className="hero-pot-stage" aria-hidden>
              <YuanyangMark className="hero-pot-stage__mark" />
              <p className="hero-pot-stage__caption">鴛鴦鍋 · 紅白雙湯</p>
            </div>
          </div>
        </section>

        <section id="why" className="section why">
          <div className="section__intro">
            <p className="eyebrow">為什麼是訂閱，不是一次報告</p>
            <h2>商圈每周在變，一次 PDF 救不了整季淡旺</h2>
            <p>
              你們已經知道痛點：退出 Uber Eats、鍋太爽／辣四方價格戰、夏天翻桌下滑。真正值錢的是——這些訊號被持續監控，並變成門市本周就能做的動作。
            </p>
          </div>
          <div className="why-grid">
            <article>
              <h3>釘對店、你核驗</h3>
              <p>搜店名精準鎖定分店（不必翻一長串）；系統自動草擬現況，網上每一條都要你點過才算可信。</p>
            </article>
            <article>
              <h3>小錢可回本</h3>
              <p>月費約一盤小菜的錢；多賣一組雙人套餐就覆蓋訂閱成本。</p>
            </article>
            <article>
              <h3>越訂越準</h3>
              <p>自動監控打底，神秘客與人工之後補上 AI 抓不到的現場情報。</p>
            </article>
          </div>
        </section>

        <section id="modules" className="section modules-preview">
          <div className="section__intro">
            <p className="eyebrow">每月固定產出</p>
            <h2>六大監控模組，對準營收與成本</h2>
          </div>
          <div className="module-grid">
            {modules.map((m) => (
              <article key={m.id} className="module-card">
                <div className="module-card__top">
                  <h3>{m.title}</h3>
                  <span className="muted">{m.cadence}</span>
                </div>
                <p>{m.blurb}</p>
              </article>
            ))}
          </div>
          <div className="cta-row center">
            <Link className="btn btn-primary" href="/dashboard/">
              查看本月儀表板
            </Link>
          </div>
        </section>

        <SubscribePanel />
      </main>

      <footer className="site-footer">
        <p>
          {merchant.fullName} · {merchant.address}
        </p>
        <p className="muted">營運情報訂閱原型 · 雲端持續更新</p>
      </footer>
    </div>
  );
}
