export function YuanyangMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      role="img"
      aria-label="鴛鴦鍋"
    >
      <defs>
        <linearGradient id="chiliGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c81d12" />
          <stop offset="100%" stopColor="#8a1008" />
        </linearGradient>
        <linearGradient id="clearGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f7f1e6" />
          <stop offset="100%" stopColor="#e2d3b8" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="92" fill="#1c1210" />
      <path d="M100 18 A82 82 0 0 0 100 182 Z" fill="url(#chiliGrad)" />
      <path d="M100 18 A82 82 0 0 1 100 182 Z" fill="url(#clearGrad)" />
      <path
        d="M100 18 C118 55 118 145 100 182 C82 145 82 55 100 18 Z"
        fill="#1c1210"
        opacity="0.35"
      />
      <circle cx="72" cy="88" r="7" fill="#f0c14a" opacity="0.85" />
      <circle cx="58" cy="118" r="5" fill="#f3e6d0" opacity="0.7" />
      <circle cx="130" cy="96" r="6" fill="#c4a574" opacity="0.55" />
      <circle cx="145" cy="124" r="8" fill="#d9c4a0" opacity="0.5" />
      <circle cx="100" cy="100" r="92" fill="none" stroke="#f5e6c8" strokeWidth="6" />
    </svg>
  );
}
