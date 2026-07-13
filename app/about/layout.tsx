import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Sajilo Khata - Personal Finance & Wellness Platform",
  description: "Learn about Sajilo Khata: a unified platform for managing finances, fitness, nutrition, investments, and wellness. Built with modern technology and designed for control and insight.",
  openGraph: {
    title: "About Sajilo Khata",
    description: "A personal finance and wellness platform that brings together spending management, fitness planning, and investments in one place.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
