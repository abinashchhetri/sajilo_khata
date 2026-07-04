// ─────────────────────────────────────────────────────────────────────────────
// Root Layout
// ─────────────────────────────────────────────────────────────────────────────
// Mounts global providers: ReactQueryProvider, AuthProvider, and the
// react-hot-toast Toaster. All pages in the app tree inherit this shell.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";

import ReactQueryProvider from "@/providers/react-query.provider";
import AuthProvider from "@/providers/auth.provider";

import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

// NotionInter is a proprietary tuning of Inter — substitute Inter directly
// per DESIGN-notion.md's font-substitute note.
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Sajilo Khata",
  description: "Personal finance and music dashboard",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", inter.variable)}>
      <body>
        <ReactQueryProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-right" />
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
