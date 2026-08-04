import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SubscribePanel } from "@/components/SubscribePanel";
import { YuanyangMark } from "@/components/YuanyangMark";
import { merchant, modules } from "@/data/merchant";
import { asset } from "@/lib/asset";

export default function HomePage() {
  return (
    <div className="page">
      <div className="signboard" aria-hidden>
        <span>台式麻辣 · 湯頭可喝 · 免服務費 · 免費綠豆湯</span>
      </div>
      <SiteHeader />

      <main>
        <section className="hero">
          <div
            className="hero__photo"
            style={{ backgroundImage: `url(${asset("/hero-hotpot.jpg")})` }}
          />
          <div className="hero__veil" />
          <div className="hero__content">
            <div className="hero-sign">
              <YuanyangMark className="hero-sign__pot" />
              <div>
                <p className="hero-brand">{merchant.name}</p>
                <h1>
                  {merchant.branch}
                  <span>每月營運情報</span>
                </h1>
              </div>
            </div>
            <p className="hero-lede">
              給篤行路三段 28 號店主的訂閱制儀表板：盯住低價個人鍋夾擊、補上退出外送後的缺口，並用菜單工程把淡季毛利留住。
            </p>
            <div className="cta-row">
              <a className="btn btn-primary" href="#subscribe">
                每月 NT${merchant.monthlyPrice} 訂閱
              </a>
              <Link className="btn btn-ghost" href="/dashboard/">
                打開本月儀表板預覽
              </Link>
            </div>
            <p className="hero-address">{merchant.address}</p>
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
              <h3>專店專頁</h3>
              <p>不是通用產業文。抬頭就是 {merchant.fullName}，地址、價帶、競品都對準這一間。</p>
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
