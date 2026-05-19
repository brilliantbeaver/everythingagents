import Link from "next/link";
import { BrandMark } from "./brand";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-8 sm:px-6 lg:px-8">
        <p className="ui-sans flex items-center gap-2 text-xs text-muted-foreground">
          <BrandMark size={14} />
          <span>Everything Agents · free to read</span>
        </p>
        <nav className="ui-sans flex gap-4 text-xs text-muted-foreground">
          <Link href="/topics" className="hover:text-foreground">
            Topics
          </Link>
        </nav>
      </div>
    </footer>
  );
}
