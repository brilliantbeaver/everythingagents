import type { Metadata } from "next";
import Script from "next/script";
import { Inter, JetBrains_Mono, Source_Serif_4 } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-ZHRJV1Y75W";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://everythingagents.org"),
  title: {
    default: "Everything Agents",
    template: "%s · Everything Agents",
  },
  description:
    "Hands-on tutorials for building reliable agents. Guided determinism, AgentScript, Apex Invocable actions, planner traces, defense in depth. Real code, real bugs, real fixes.",
  applicationName: "Everything Agents",
  authors: [{ name: "Everything Agents" }],
  generator: "Next.js",
  keywords: [
    "Agentforce",
    "AgentScript",
    "agent tutorials",
    "guided determinism",
    "neuro-symbolic agents",
    "Apex Invocable",
    "LLM tool use",
    "agent reliability",
    "agent gating",
    "Salesforce AI",
    "ReAct",
    "session traces",
  ],
  category: "technology",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "Everything Agents",
    url: "https://everythingagents.org",
    title: "Everything Agents",
    description:
      "Hands-on tutorials for building reliable agents. Real code, real bugs, real fixes.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Everything Agents",
    description:
      "Hands-on tutorials for building reliable agents.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sourceSerif.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <a href="#main" className="skip-to-content">
          Skip to content
        </a>
        <ClerkProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </ClerkProvider>

        {/* Google Analytics 4 (gtag.js). Loaded after the page becomes
            interactive so it never blocks first paint. */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');`}
        </Script>
      </body>
    </html>
  );
}
