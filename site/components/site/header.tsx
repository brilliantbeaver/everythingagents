import { Show, UserButton, SignInButton } from "@clerk/nextjs";
import { ThemeToggle } from "./theme-toggle";
import { NotifyCTA } from "./notify-cta";
import { Wordmark } from "./brand";
import { SearchTrigger } from "./search-trigger";
import { TopicsNav } from "./topics-nav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Wordmark href="/" />

        <nav className="ml-2 hidden items-center gap-4 text-sm text-muted-foreground sm:flex">
          <TopicsNav />
        </nav>

        {/* Search bar grows to fill the middle of the header on desktop;
            on small screens it falls back to a tappable affordance after
            the Topics nav. */}
        <div className="hidden flex-1 justify-center px-4 sm:flex">
          <SearchTrigger />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Show when="signed-out">
            <NotifyCTA />
            <SignInButton mode="modal">
              <button
                type="button"
                className="hidden h-9 items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:inline-flex"
              >
                Sign in
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                },
              }}
            />
          </Show>
        </div>
      </div>
    </header>
  );
}
