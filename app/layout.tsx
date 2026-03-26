import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ApiKeyProvider } from "@/app/context/api-key-context";
import { ThemeProvider } from "@/app/context/theme-context";
import { ToastProvider } from "@/app/context/toast-context";
import { TerritoryDataProvider } from "@/app/context/territory-data-context";
import { Providers } from "@/app/providers";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://www.anthropic.com/");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Ciena Account Strategy | Claude Enterprise",
  description:
    "How I’d win Ciena for Claude Enterprise. Wedge, proof plan, value model and expansion map.",
  icons: {
    icon: [{ url: "/adaptive-logo-dark.png", type: "image/png", sizes: "any" }],
    apple: [{ url: "/adaptive-logo-dark.png", type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    title: "Ciena Account Strategy | Claude Enterprise",
    description:
      "How I’d win Ciena for Claude Enterprise. Wedge, proof plan, value model and expansion map.",
    url: "/",
    siteName: "Ciena Account Strategy",
    type: "website",
    images: [
      {
        url: "/adaptive-logo-dark.png",
        width: 512,
        height: 512,
        alt: "Claude",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Ciena Account Strategy | Claude Enterprise",
    description: "How I’d win Ciena for Claude Enterprise.",
    images: ["/adaptive-logo-dark.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeScript = `
    (() => {
      try {
        var s = localStorage.getItem("ciena-claude-theme");
        var theme = (s === "light" || s === "dark") ? s : "dark";
        document.documentElement.dataset.theme = theme;
        document.documentElement.classList.toggle("dark", theme === "dark");
        document.documentElement.classList.toggle("light", theme === "light");
      } catch {}
    })();
  `;

  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <Providers>
          <ThemeProvider>
            <ApiKeyProvider>
              <TerritoryDataProvider>
                <ToastProvider>{children}</ToastProvider>
              </TerritoryDataProvider>
            </ApiKeyProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
