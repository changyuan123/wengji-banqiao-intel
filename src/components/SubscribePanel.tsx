import Link from "next/link";
import { merchant } from "@/data/merchant";

export function SubscribePanel() {
  return (
    <section id="subscribe" className="subscribe-panel">
      <div className="subscribe-panel__glow" aria-hidden />
      <div className="subscribe-panel__content">
        <p className="eyebrow">專為 {merchant.fullName} 開的訂閱</p>
        <h2>每月 NT${merchant.monthlyPrice}，持續幫你盯商圈、補缺口、算毛利</h2>
        <p className="lede">
          不是一次買完就過期的 PDF。這是給篤行路三段 28
          號門市的營運情報網頁：競品、淡季、自營外帶與菜單工程，按月更新。
        </p>
        <ul className="price-points">
          <li>回本門檻約等於多賣 1 組雙人鴛鴦套餐</li>
          <li>基礎版：自動監控＋可執行月任務</li>
          <li>加值版：神秘客／人工踩點情報回填</li>
        </ul>
        <div className="cta-row">
          <button type="button" className="btn btn-primary" disabled title="金流串接後開放">
            立即訂閱（即將開放收款）
          </button>
          <Link className="btn btn-ghost" href="/dashboard/">
            先免費預覽本月儀表板
          </Link>
        </div>
        <p className="fineprint">
          收款上線前可先預覽完整版型。正式訂閱後將開通每月自動更新與人工補強佇列。
        </p>
      </div>
    </section>
  );
}
