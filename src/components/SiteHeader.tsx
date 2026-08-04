import Link from "next/link";
import { merchant } from "@/data/merchant";

export function SiteHeader({ variant = "landing" }: { variant?: "landing" | "app" }) {
  return (
    <header className="site-header">
      <Link href="/" className="brand-lockup">
        <span className="brand-seal" aria-hidden>
          翁
        </span>
        <span className="brand-text">
          <strong>{merchant.name}</strong>
          <em>{merchant.branch} · 營運情報</em>
        </span>
      </Link>
      <nav className="site-nav">
        {variant === "landing" ? (
          <>
            <a href="#why">為什麼訂閱</a>
            <a href="#modules">每月監控</a>
            <Link href="/dashboard/">本月儀表板</Link>
            <a className="btn btn-sm" href="#subscribe">
              月費 NT${merchant.monthlyPrice}
            </a>
          </>
        ) : (
          <>
            <Link href="/">服務介紹</Link>
            <a className="btn btn-sm" href="#subscribe-bar">
              解鎖完整月報
            </a>
          </>
        )}
      </nav>
    </header>
  );
}
