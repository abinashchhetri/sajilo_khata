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
  description: "Personal finance tracker for Nepal",
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
