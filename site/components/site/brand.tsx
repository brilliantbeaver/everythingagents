import Link from "next/link";

export function BrandMark({
  size = 20,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      role="img"
      aria-label="Everything Agents"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path d="M3 3 L3 21 L21 21 Z" fill="oklch(var(--accent))" />
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="3"
        ry="3"
        fill="none"
        stroke="oklch(var(--foreground))"
        strokeWidth="1.5"
      />
      <path
        d="M3 3 L21 21"
        stroke="oklch(var(--foreground))"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function Wordmark({
  href,
  className,
}: {
  href?: string;
  className?: string;
}) {
  const inner = (
    <span className={`flex items-center gap-2 ${className ?? ""}`}>
      <BrandMark size={20} />
      <span className="font-serif text-base tracking-tight text-foreground">
        Everything Agents
      </span>
    </span>
  );

  if (!href) return inner;

  return (
    <Link
      href={href}
      aria-label="Everything Agents, home"
      className="rounded-md hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {inner}
    </Link>
  );
}
