"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Code2,
  Dumbbell,
  GitBranch,
  Landmark,
  LineChart,
  Lock,
  Menu,
  Music,
  QrCode,
  ShieldCheck,
  Utensils,
  X,
  Zap,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Public About page — no auth required. Built strictly to DESIGN-notion.md:
//   · page sits on warm canvas-soft; cards are white with hairline borders
//   · one structural accent (primary blue) for CTAs and links only
//   · sticker palette on icons/dots only, never structure
//   · feature cards: rounded-lg, 24px padding; image wells rounded-xl
//   · nav CTA = button-utility; hero CTAs = primary pill + secondary pill
//   · single inverted indigo hero-band; canvas-soft caption footer
// Anchor ids are stable: #overview #features #blockchain #built #technology.
// ─────────────────────────────────────────────────────────────────────────────

const IMAGES = {
  hero: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1600",
  payments:
    "https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=1200",
  protocol:
    "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1200",
  fitness:
    "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=1200",
};

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#blockchain", label: "Blockchain" },
  { href: "#built", label: "What was built" },
  { href: "#technology", label: "Technology" },
];

// Eyebrow badge-pill: white surface, primary text, eyebrow type, 4px/8px pad.
const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full border border-border bg-canvas px-2 py-1 text-eyebrow uppercase text-primary">
    {children}
  </span>
);

const AboutPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Nav — white surface, body-sm links, utility CTA ────────────── */}
      <nav className="sticky top-0 z-50 border-b border-border bg-canvas/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2 transition-opacity hover:opacity-70"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-foreground">
                <Landmark size={14} className="text-canvas" />
              </span>
              <span className="text-body-sm font-semibold">Sajilo Khata</span>
            </Link>

            <div className="hidden items-center gap-6 lg:flex">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-body-sm text-ink-muted transition-colors hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="hidden items-center gap-5 lg:flex">
            <Link
              href="/login"
              className="text-body-sm text-ink-muted transition-colors hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground"
            >
              Log in
            </Link>
            {/* button-utility: white, ink, rounded-md, 4px/14px padding */}
            <Link
              href="/login"
              className="rounded-md border border-border bg-canvas px-3.5 py-1.5 text-body-sm font-medium transition-colors hover:bg-muted"
            >
              Get started free
            </Link>
          </div>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="rounded-md border border-border p-2 text-ink-muted dark:text-muted-foreground lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-border bg-canvas px-4 py-3 lg:hidden">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md px-3 py-3 text-body-sm transition-colors hover:bg-muted"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/login"
                className="mt-2 rounded-full bg-primary px-6 py-3 text-center text-button text-primary-foreground"
              >
                Get started free
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero — centered display type over product shot ─────────────── */}
      <section id="overview" className="mx-auto max-w-6xl px-4 pt-20 sm:px-6 md:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-heading-1 sm:text-display-2 lg:text-display-1">
            Your money and your health. One workspace.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-body-md text-ink-muted dark:text-muted-foreground">
            Sajilo Khata brings accounts, spending, workouts, meals and
            investments together — with payments settled in USDC on Solana.
          </p>
          {/* button-primary pill + button-secondary pill (level-1) */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-button text-primary-foreground transition-colors hover:bg-primary-active"
            >
              Get started free
              <ArrowRight size={16} />
            </Link>
            <a
              href="#blockchain"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-canvas px-6 py-2.5 text-button shadow-level-1 transition-colors hover:bg-muted"
            >
              See how payments work
            </a>
          </div>
        </div>

        {/* Product shot — rounded-xl image well, hairline edge, level-1 */}
        <div className="mx-auto mt-14 max-w-5xl md:mt-20">
          <div className="overflow-hidden rounded-xl border border-border bg-canvas shadow-level-1">
            <img
              src={IMAGES.hero}
              alt="Financial charts on a laptop screen"
              className="aspect-[16/9] w-full object-cover"
              loading="eager"
            />
          </div>
        </div>

        {/* Built-on strip */}
        <div className="mx-auto max-w-4xl py-14 text-center md:py-20">
          <p className="text-eyebrow uppercase text-ink-faint">Built on</p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {["Solana", "USDC", "Phantom", "Next.js", "NestJS", "PostgreSQL"].map(
              (name) => (
                <span
                  key={name}
                  className="text-title text-ink-faint"
                >
                  {name}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────── */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <Eyebrow>Features</Eyebrow>
          <h2 className="mt-4 text-heading-2 md:text-heading-1">
            Everything in one place
          </h2>
          <p className="mt-4 text-body-md text-ink-muted dark:text-muted-foreground">
            A banking app, a fitness tracker, a calorie counter and a
            spreadsheet — replaced by one dashboard.
          </p>
        </div>

        {/* Two large white feature cards, image band on top */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-canvas">
            <div className="flex flex-1 flex-col p-6">
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-canvas-soft">
                <LineChart size={20} className="text-accent-sky" />
              </span>
              <h3 className="text-heading-3">Money, tracked properly</h3>
              <p className="mt-2 text-body-md text-ink-muted dark:text-muted-foreground">
                Balances across banks, wallets and cards. Every expense
                categorised and searchable, with transfers handled in-app.
              </p>
              <ul className="mt-5 space-y-3">
                {[
                  "Multiple accounts and in-app transfers",
                  "Smart transaction categorisation",
                  "Spending trends by category and date range",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-body-sm text-ink-muted dark:text-muted-foreground"
                  >
                    <CheckCircle2
                      size={15}
                      className="mt-0.5 shrink-0 text-accent-green"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#built"
                className="mt-auto inline-flex items-center gap-1.5 pt-6 text-body-sm font-medium text-primary hover:underline"
              >
                See the implementation
                <ArrowRight size={14} />
              </a>
            </div>
          </div>

          <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-canvas">
            <img
              src={IMAGES.fitness}
              alt="Runner training outdoors at sunrise"
              className="aspect-[2/1] w-full object-cover"
              loading="lazy"
            />
            <div className="p-6">
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-canvas-soft">
                <Dumbbell size={20} className="text-accent-orange" />
              </span>
              <h3 className="text-heading-3">Training and nutrition</h3>
              <p className="mt-2 text-body-md text-ink-muted dark:text-muted-foreground">
                Weekly workout plans with sets, reps and weight per exercise.
                Meals logged by day and type, so intake and training load sit
                side by side.
              </p>
            </div>
          </div>
        </div>

        {/* Small flat feature cards — white, rounded-lg, 24px pad */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Utensils,
              tint: "text-accent-teal",
              title: "Meal tracking",
              desc: "Calorie counts per meal, compared against your training.",
            },
            {
              icon: BarChart3,
              tint: "text-accent-purple-deep dark:text-accent-purple",
              title: "Investments",
              desc: "Holdings, returns and allocation next to your spending.",
            },
            {
              icon: Music,
              tint: "text-accent-pink",
              title: "Music library",
              desc: "Playlists live in the same dashboard as everything else.",
            },
            {
              icon: ShieldCheck,
              tint: "text-accent-green",
              title: "Private by design",
              desc: "OAuth sign-in, JWT sessions, keys never touch the server.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-border bg-canvas p-6"
            >
              <item.icon size={20} className={`mb-4 ${item.tint}`} />
              <h4 className="text-title">{item.title}</h4>
              <p className="mt-1.5 text-body-sm text-ink-muted dark:text-muted-foreground">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Blockchain ─────────────────────────────────────────────────── */}
      <section id="blockchain" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <Eyebrow>Blockchain</Eyebrow>
          <h2 className="mt-4 text-heading-2 md:text-heading-1">
            Payments that settle on-chain
          </h2>
          <p className="mt-4 text-body-md text-ink-muted dark:text-muted-foreground">
            No card forms, no stored payment details. The wallet signs, the
            chain confirms, the backend verifies.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Solana Pay card */}
          <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-canvas">
            <img
              src={IMAGES.payments}
              alt="Physical cryptocurrency coins on a dark surface"
              className="aspect-[2/1] w-full object-cover"
              loading="lazy"
            />
            <div className="flex flex-1 flex-col p-6">
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-canvas-soft">
                <QrCode size={20} className="text-foreground" />
              </span>
              <h3 className="text-heading-3">Solana Pay</h3>
              <p className="mt-2 text-body-md text-ink-muted dark:text-muted-foreground">
                Each payment request generates a QR code. Scanning it with
                Phantom shows the exact amount, token and recipient before
                anything is signed — the private key never leaves the wallet.
              </p>
              <ul className="mt-5 space-y-3">
                {[
                  "USDC transfers — a dollar-pegged SPL token",
                  "One-tap approval inside Phantom",
                  "Every transaction inspectable on Solana Explorer",
                  "Full devnet environment for risk-free testing",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-body-sm text-ink-muted dark:text-muted-foreground"
                  >
                    <CheckCircle2
                      size={15}
                      className="mt-0.5 shrink-0 text-accent-green"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* x402 card */}
          <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-canvas">
            <img
              src={IMAGES.protocol}
              alt="Source code on a developer's screen"
              className="aspect-[2/1] w-full object-cover"
              loading="lazy"
            />
            <div className="flex flex-1 flex-col p-6">
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-canvas-soft">
                <Zap size={20} className="text-foreground" />
              </span>
              <h3 className="text-heading-3">HTTP 402, put to work</h3>
              <p className="mt-2 text-body-md text-ink-muted dark:text-muted-foreground">
                The AI plan endpoint answers unpaid requests with an x402
                challenge stating the price, asset and recipient. Any client —
                a browser or an AI agent — can pay and retry.
              </p>
              {/* Step list — data-table chrome: canvas-soft header rows */}
              <div className="mt-5 overflow-hidden rounded-md border border-border">
                {[
                  "Client requests the plan endpoint",
                  "Server replies 402 with a payment quote",
                  "Phantom signs a 0.01 USDC transfer",
                  "Backend verifies the transfer on-chain",
                  "Personalised 7-day plan is delivered",
                ].map((text, i) => (
                  <div
                    key={text}
                    className={`flex items-center gap-3 bg-canvas-soft px-4 py-3 ${
                      i > 0 ? "border-t border-border" : ""
                    }`}
                  >
                    <span className="text-eyebrow uppercase text-ink-faint">
                      0{i + 1}
                    </span>
                    <span className="text-body-sm">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI coaching statement */}
        <div className="mx-auto mt-16 max-w-2xl text-center md:mt-24">
          <h3 className="text-heading-2 md:text-heading-1">
            Coaching built from your own history
          </h3>
          <p className="mt-4 text-body-md text-ink-muted dark:text-muted-foreground">
            Ninety days of logged workouts and meals feed the plan generator.
            For 0.01 USDC it returns a full week of training and nutrition —
            with the reasoning behind every choice. A free preview is available
            before paying anything.
          </p>
          <a
            href="#technology"
            className="mt-5 inline-flex items-center gap-1.5 text-button text-primary hover:underline"
          >
            See the stack behind it
            <ArrowRight size={15} />
          </a>
        </div>
      </section>

      {/* ── What was built ─────────────────────────────────────────────── */}
      <section id="built" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <Eyebrow>The work</Eyebrow>
          <h2 className="mt-4 text-heading-2 md:text-heading-1">
            What was built
          </h2>
          <p className="mt-4 text-body-md text-ink-muted dark:text-muted-foreground">
            A complete, working implementation — from database schema to wallet
            signature — not a mock-up.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Code2,
              title: "Full-stack architecture",
              desc: "Next.js 15 frontend, NestJS backend, PostgreSQL storage. TypeScript end to end.",
            },
            {
              icon: GitBranch,
              title: "Solana integration",
              desc: "Phantom connection, USDC transfer construction, memo instructions, on-chain verification.",
            },
            {
              icon: Zap,
              title: "x402 payment flow",
              desc: "402 challenge issuing, quote management, payment-header verification, replay protection.",
            },
            {
              icon: Lock,
              title: "Security",
              desc: "OAuth 2.0 sign-in, JWT sessions, and a model where private keys never touch the server.",
            },
            {
              icon: BarChart3,
              title: "Analytics",
              desc: "Interactive spending charts, fitness adherence tracking, investment performance views.",
            },
            {
              icon: ShieldCheck,
              title: "Testing",
              desc: "Documented flows for every tier: preview endpoints, live devnet payments, regression passes.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-border bg-canvas p-6"
            >
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-canvas-soft">
                <item.icon
                  size={20}
                  className="text-ink-muted dark:text-muted-foreground"
                />
              </span>
              <h4 className="text-title">{item.title}</h4>
              <p className="mt-1.5 text-body-sm text-ink-muted dark:text-muted-foreground">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Highlights — elevated white feature card */}
        <div className="mt-6 rounded-xl border border-border bg-canvas p-6 shadow-level-1 md:p-8">
          <h3 className="text-heading-3">Highlights</h3>
          <div className="mt-6 grid gap-x-10 gap-y-4 md:grid-cols-2">
            {[
              "Working x402 implementation — HTTP 402 challenges answered by real wallet payments",
              "End-to-end Solana Pay flow, from QR generation to explorer-verifiable settlement",
              "Finance, health, nutrition, investments and music in one coherent product",
              "Modular NestJS services with React Query state management on the client",
              "Devnet test environment documented step by step, including wallet funding",
              "Feature-flagged payment tier that ships safely with the flag off",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5">
                <CheckCircle2
                  size={15}
                  className="mt-0.5 shrink-0 text-accent-green"
                />
                <p className="text-body-sm text-ink-muted dark:text-muted-foreground">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Technology ─────────────────────────────────────────────────── */}
      <section id="technology" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <Eyebrow>Stack</Eyebrow>
          <h2 className="mt-4 text-heading-2 md:text-heading-1">Technology</h2>
          <p className="mt-4 text-body-md text-ink-muted dark:text-muted-foreground">
            Chosen for reliability first — every piece is widely used in
            production elsewhere.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              heading: "Frontend",
              items: [
                "Next.js 15",
                "React 19",
                "React Query",
                "TypeScript",
                "Tailwind CSS",
                "Solana web3.js",
              ],
            },
            {
              heading: "Backend",
              items: [
                "NestJS",
                "PostgreSQL",
                "Prisma ORM",
                "Solana Pay SDK",
                "SPL Token",
                "Gemini API",
              ],
            },
            {
              heading: "Infrastructure",
              items: [
                "Solana devnet / mainnet",
                "Phantom wallet",
                "OAuth 2.0",
                "JWT sessions",
                "Docker",
                "Vercel & Railway",
              ],
            },
          ].map((col) => (
            <div
              key={col.heading}
              className="rounded-lg border border-border bg-canvas p-6"
            >
              <p className="text-eyebrow uppercase text-ink-faint">
                {col.heading}
              </p>
              <ul className="mt-4 space-y-3">
                {col.items.map((tech) => (
                  <li
                    key={tech}
                    className="flex items-center gap-2.5 text-body-sm"
                  >
                    <span className="h-1 w-1 rounded-full bg-ink-faint" />
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Inverted hero-band — the single indigo night moment ────────── */}
      <section className="bg-hero">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 md:py-28">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-heading-1 text-white sm:text-display-2">
              See it running
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-body-md text-white/70">
              Sign in, add an account, log a workout — and if you have a
              Phantom wallet on devnet, try the on-chain payment flow yourself.
            </p>
            {/* button-primary + button-secondary pair on the night band */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-button text-primary-foreground transition-colors hover:bg-primary-active"
              >
                Get started free
                <ArrowRight size={16} />
              </Link>
              <a
                href="https://explorer.solana.com/?cluster=devnet"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white px-6 py-2.5 text-button text-ink shadow-level-2 transition-opacity hover:opacity-90"
              >
                Solana Explorer
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer — canvas-soft band, caption type ────────────────────── */}
      <footer className="border-t border-border bg-canvas-soft">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-10">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-foreground">
                  <Landmark size={12} className="text-canvas" />
                </span>
                <span className="text-body-sm font-semibold">Sajilo Khata</span>
              </div>
              <p className="mt-3 max-w-xs text-caption text-ink-muted dark:text-muted-foreground">
                Personal finance and wellness, with payments settled on Solana.
              </p>
            </div>

            {[
              {
                heading: "Product",
                links: [
                  { label: "Features", href: "#features" },
                  { label: "Blockchain", href: "#blockchain" },
                  { label: "Technology", href: "#technology" },
                ],
              },
              {
                heading: "Project",
                links: [
                  { label: "What was built", href: "#built" },
                  { label: "Overview", href: "#overview" },
                  { label: "Open the app", href: "/login" },
                ],
              },
              {
                heading: "Solana",
                links: [
                  {
                    label: "Explorer (devnet)",
                    href: "https://explorer.solana.com/?cluster=devnet",
                  },
                  { label: "Phantom wallet", href: "https://phantom.app" },
                  { label: "USDC faucet", href: "https://faucet.circle.com" },
                ],
              },
            ].map((col) => (
              <div key={col.heading}>
                <p className="text-eyebrow uppercase text-ink-faint">
                  {col.heading}
                </p>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        {...(link.href.startsWith("http")
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="text-caption text-ink-secondary transition-colors hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 border-t border-border pt-6">
            <p className="text-caption text-ink-muted dark:text-muted-foreground">
              © 2026 Sajilo Khata
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
