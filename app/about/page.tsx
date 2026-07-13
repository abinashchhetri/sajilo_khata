"use client";

import Link from "next/link";
import { ArrowRight, TrendingUp, Wallet, Heart, Music, Utensils, DollarSign, Zap } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                SK
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">Sajilo Khata</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition">Features</a>
              <a href="#how-it-works" className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition">How It Works</a>
              <a href="#blockchain" className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition">Blockchain</a>
              <a href="#technology" className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition">Technology</a>
              <a href="#bounty" className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition">Bounty</a>
              <Link href="/login" className="text-sm px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="space-y-6 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
            Take Control of Your Money, Health, and Life
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Sajilo Khata is a unified personal finance and wellness platform that brings together spending management, fitness planning, meal tracking, and investments—all in one place you can trust.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
              Start Free <ArrowRight size={18} />
            </Link>
            <a href="#features" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              Explore Features
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200 dark:border-slate-800">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">What You Can Do</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">Everything you need to build better habits and understand your finances.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Financial Management */}
          <div className="p-8 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800 transition bg-white dark:bg-slate-900">
            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
              <Wallet className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Account & Transaction Management</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Track multiple accounts, categorize expenses, and understand your spending patterns at a glance. Get detailed insights into where your money goes.
            </p>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>• Multiple account types and balances</li>
              <li>• Smart transaction categorization</li>
              <li>• Transfer management between accounts</li>
              <li>• Historical transaction tracking</li>
            </ul>
          </div>

          {/* Analytics & Insights */}
          <div className="p-8 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-800 transition bg-white dark:bg-slate-900">
            <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
              <TrendingUp className="text-emerald-600 dark:text-emerald-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Financial Analytics</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Visualize your financial health with interactive charts and reports. See trends over time and identify opportunities to save more.
            </p>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>• Spending trends and patterns</li>
              <li>• Category breakdowns</li>
              <li>• Income vs expense analysis</li>
              <li>• Custom time period filters</li>
            </ul>
          </div>

          {/* Fitness & Wellness */}
          <div className="p-8 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-red-300 dark:hover:border-red-800 transition bg-white dark:bg-slate-900">
            <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
              <Heart className="text-red-600 dark:text-red-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Fitness Planning</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Create and manage workout plans, track exercise progress, and get personalized recommendations based on your fitness history.
            </p>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>• Workout schedule management</li>
              <li>• Exercise tracking with sets and reps</li>
              <li>• Weekly plan templates</li>
              <li>• AI-generated personalized plans</li>
            </ul>
          </div>

          {/* Meal Tracking */}
          <div className="p-8 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-orange-300 dark:hover:border-orange-800 transition bg-white dark:bg-slate-900">
            <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
              <Utensils className="text-orange-600 dark:text-orange-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Nutrition Tracking</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Log meals, monitor calories, and maintain your nutrition goals. Understand your eating habits and make informed dietary choices.
            </p>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>• Daily meal logging</li>
              <li>• Calorie tracking</li>
              <li>• Meal type categorization</li>
              <li>• Nutrition history</li>
            </ul>
          </div>

          {/* Music & Playlists */}
          <div className="p-8 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-800 transition bg-white dark:bg-slate-900">
            <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
              <Music className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Music Collection</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Organize and manage your music playlists. Keep track of your favorite songs and curated collections in one unified space.
            </p>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>• Playlist creation and management</li>
              <li>• Music organization</li>
              <li>• Personal collection tracking</li>
              <li>• Mood-based playlists</li>
            </ul>
          </div>

          {/* Investments */}
          <div className="p-8 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-800 transition bg-white dark:bg-slate-900">
            <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
              <DollarSign className="text-amber-600 dark:text-amber-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Investment Tracking</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Keep tabs on your investment portfolio, track returns, and monitor your wealth growth across different asset classes.
            </p>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>• Portfolio management</li>
              <li>• Investment tracking</li>
              <li>• Return monitoring</li>
              <li>• Asset allocation overview</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200 dark:border-slate-800">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">How It Works</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">A simple, straightforward approach to managing your complete life.</p>
        </div>

        <div className="space-y-8">
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600 text-white font-bold">1</div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Sign Up & Get Started</h3>
              <p className="text-slate-600 dark:text-slate-300">Create your account in seconds. No credit card required. You'll land in your personalized dashboard right away.</p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600 text-white font-bold">2</div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Connect Your Accounts</h3>
              <p className="text-slate-600 dark:text-slate-300">Add your bank accounts, wallets, and financial accounts to track everything in one place. Full control over what you share.</p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600 text-white font-bold">3</div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Log Your Activity</h3>
              <p className="text-slate-600 dark:text-slate-300">Record transactions, workouts, meals, and investments. Quick entry makes it easy to stay consistent.</p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600 text-white font-bold">4</div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Get Insights & Act</h3>
              <p className="text-slate-600 dark:text-slate-300">View detailed analytics, identify patterns, and make smarter decisions about money, fitness, and wellness.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Blockchain & Solana */}
      <section id="blockchain" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200 dark:border-slate-800">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Blockchain Integration: Solana</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">Advanced cryptocurrency payment infrastructure built on Solana, enabling secure, fast, and transparent transactions.</p>
        </div>

        <div className="space-y-8">
          {/* Solana Pay */}
          <div className="p-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                <Wallet className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Solana Pay Integration</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  Industry-standard payment protocol that enables QR code-based transactions. Users can scan and pay directly from Phantom wallet without leaving the app.
                </p>
                <div className="space-y-3">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                    <h4 className="font-medium text-slate-900 dark:text-white mb-2">Key Features</h4>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600 dark:text-purple-400">→</span>
                        <span><strong>QR Code Generation:</strong> Dynamic QR codes for each payment, instantly shareable</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600 dark:text-purple-400">→</span>
                        <span><strong>Phantom Wallet Integration:</strong> One-click signing and approval within browser extension</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600 dark:text-purple-400">→</span>
                        <span><strong>USDC Support:</strong> USD Coin (SPL token) for stablecoin payments with no volatility</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600 dark:text-purple-400">→</span>
                        <span><strong>Transaction Verification:</strong> On-chain verification ensures payment authenticity</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600 dark:text-purple-400">→</span>
                        <span><strong>Devnet Support:</strong> Full testing environment on Solana devnet before mainnet</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* x402 Payment Protocol */}
          <div className="p-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                <DollarSign className="text-indigo-600 dark:text-indigo-400" size={24} />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">HTTP 402 Payment Challenge (x402)</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  Advanced payment protocol that enables AI agents and applications to request payments before delivering content. Built for the AI economy where agents need to pay for services programmatically.
                </p>
                <div className="space-y-3">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                    <h4 className="font-medium text-slate-900 dark:text-white mb-2">How It Works</h4>
                    <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                      <div className="flex gap-3">
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold min-w-fit">1. Request</span>
                        <span>Client requests a resource (AI plan, data, service)</span>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold min-w-fit">2. Challenge</span>
                        <span>Server responds with HTTP 402 status + payment challenge details (amount, recipient, asset)</span>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold min-w-fit">3. Payment</span>
                        <span>Client signs and submits payment via Solana blockchain with memo containing proof</span>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold min-w-fit">4. Verify</span>
                        <span>Client retries request with X-PAYMENT header containing quote ID + transaction signature</span>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold min-w-fit">5. Deliver</span>
                        <span>Server verifies payment on blockchain and returns the requested resource</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
                    <h4 className="font-medium text-slate-900 dark:text-white mb-2">Use Case: AI-Generated Fitness Plans</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Users can preview an AI-generated personalized 7-day fitness + meal plan for free. To generate a custom plan based on their 90-day history, they pay 0.01 USDC via Phantom wallet. The plan is delivered immediately after payment verification on the blockchain.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Flow Details */}
          <div className="p-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <Zap className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Smart Payment Processing</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  Complete transaction lifecycle management with security verification at every step.
                </p>
                <div className="space-y-3">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg space-y-3">
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white mb-1">💰 USDC Stablecoin</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Payments use USD Coin (USDC), an SPL token on Solana with 1:1 USD backing. Eliminates volatility risk for both users and merchants.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white mb-1">🔐 Phantom Wallet</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Browser-based wallet that keeps private keys secure on user's device. Users review and sign transactions without trusting the app with keys.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white mb-1">✅ On-Chain Verification</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Every payment is verified on the Solana blockchain. Backend queries the blockchain to confirm transfer occurred before granting access.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white mb-1">📊 Transaction Tracking</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        All transactions are recorded on immutable blockchain ledger. View transaction details, signatures, and confirmations in Solana Explorer.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white mb-1">⏱️ Sub-Second Processing</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Solana's high throughput means payments confirm within seconds, not minutes. Devnet can confirm in 1-3 seconds typically.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Devnet Testing */}
          <div className="p-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center flex-shrink-0">
                <Zap className="text-cyan-600 dark:text-cyan-400" size={24} />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Devnet Testing Environment</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  Full Solana environment for testing without real money. Perfect for development, demos, and learning.
                </p>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg space-y-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">Getting Started with Devnet</p>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      <li>• <strong>1.</strong> Install Phantom wallet browser extension</li>
                      <li>• <strong>2.</strong> Go to Settings → Developer Settings → Toggle Devnet</li>
                      <li>• <strong>3.</strong> Get devnet SOL from faucet (for gas fees)</li>
                      <li>• <strong>4.</strong> Get devnet USDC from Circle Faucet (https://faucet.circle.com)</li>
                      <li>• <strong>5.</strong> Try payments in Sajilo Khata with real transaction confirmation</li>
                    </ul>
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                    <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">Why Devnet?</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Devnet mirrors mainnet exactly but with free tokens. This means you can test the entire payment flow, verify on-chain logic, and ensure everything works before using real money.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security & Transparency */}
          <div className="p-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Security & Transparency</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">🔒 Key Security Features</h4>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li>• Private keys never leave user's device</li>
                  <li>• All transactions cryptographically signed</li>
                  <li>• Blockchain verification of all payments</li>
                  <li>• No central point of failure</li>
                  <li>• Transparent audit trail on-chain</li>
                </ul>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">📋 Full Transparency</h4>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li>• View every transaction in Solana Explorer</li>
                  <li>• Verify recipient addresses publicly</li>
                  <li>• Check payment amounts and token details</li>
                  <li>• Confirm transaction signatures</li>
                  <li>• Monitor account balances anytime</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section id="technology" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200 dark:border-slate-800">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Built With Modern Technology</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">A solid foundation for speed, security, and reliability.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Frontend</h3>
            <ul className="space-y-3 text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold mt-1">•</span>
                <div>
                  <strong>Next.js 15</strong> — Modern React framework with app routing, server components, and optimized performance
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold mt-1">•</span>
                <div>
                  <strong>React Query</strong> — Powerful server state management and data fetching
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold mt-1">•</span>
                <div>
                  <strong>Tailwind CSS</strong> — Utility-first styling for responsive design
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold mt-1">•</span>
                <div>
                  <strong>TypeScript</strong> — Type-safe development for fewer bugs
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold mt-1">•</span>
                <div>
                  <strong>Solana Web3.js</strong> — Native blockchain transaction building and verification
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Backend & Blockchain</h3>
            <ul className="space-y-3 text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold mt-1">•</span>
                <div>
                  <strong>NestJS</strong> — Scalable Node.js framework with modular architecture
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold mt-1">•</span>
                <div>
                  <strong>PostgreSQL</strong> — Reliable relational database for data integrity
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold mt-1">•</span>
                <div>
                  <strong>Solana Blockchain</strong> — Payment processing, transaction verification, on-chain storage
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold mt-1">•</span>
                <div>
                  <strong>Phantom Wallet API</strong> — Secure signing and transaction approval
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold mt-1">•</span>
                <div>
                  <strong>OAuth 2.0</strong> — Secure user authentication and authorization
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 p-8 rounded-xl bg-slate-100 dark:bg-slate-800">
          <div className="flex items-start gap-3">
            <Zap className="text-amber-600 dark:text-amber-400 mt-1 flex-shrink-0" size={24} />
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Enterprise-Grade Infrastructure</h4>
              <p className="text-slate-600 dark:text-slate-300">
                Sajilo Khata combines traditional fintech best practices with blockchain innovation. Solana Pay and x402 payment protocol enable truly decentralized payment flows where users maintain full control over their funds, while our backend provides seamless integration, verification, and user experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bounty Section */}
      <section id="bounty" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200 dark:border-slate-800">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Development & Bounty</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">Supporting open development and rewarding contributions.</p>
        </div>

        <div className="space-y-8">
          <div className="p-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Features Currently Developed</h3>
            <div className="space-y-4 text-slate-600 dark:text-slate-300">
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">Solana Pay Integration</h4>
                <p>Full cryptocurrency payment support using Solana blockchain. Users can pay with USDC on devnet for premium features. QR code generation and Phantom wallet integration for seamless transactions.</p>
              </div>
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">AI-Generated Fitness Plans</h4>
                <p>Personalized 7-day workout and meal plans generated by AI based on your 90-day history. Uses the HTTP 402 payment challenge protocol (x402) for agent-friendly pricing. Available as both free preview and paid generation.</p>
              </div>
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">Multi-tier Access Model</h4>
                <p>Tier A provides free preview showcase of AI capabilities. Tier B enables live payments through Phantom wallet for generated plans. Feature flags allow flexible deployment and testing.</p>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">What This Achieves</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white flex-shrink-0 mt-1">
                  <span className="text-sm">✓</span>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong>Crypto Integration:</strong> Shows how to safely integrate blockchain payments into traditional finance apps
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white flex-shrink-0 mt-1">
                  <span className="text-sm">✓</span>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong>AI Integration:</strong> Demonstrates practical AI features (generated fitness plans) as part of a real application
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white flex-shrink-0 mt-1">
                  <span className="text-sm">✓</span>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong>Modern Architecture:</strong> Full-stack implementation of a scalable, production-ready SaaS platform
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white flex-shrink-0 mt-1">
                  <span className="text-sm">✓</span>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong>Payment Protocols:</strong> Implementation of advanced payment standards (Solana Pay, x402 protocol)
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white flex-shrink-0 mt-1">
                  <span className="text-sm">✓</span>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong>Multi-Modal User Experience:</strong> Combines finance, health, lifestyle, and entertainment in one unified platform
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Bounty Opportunities</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Saxilo Khata is actively developed with clear feature milestones. Contributions addressing bounty items receive recognition and rewards.
            </p>
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border-l-4 border-blue-600">
                <p className="font-medium text-slate-900 dark:text-white">Frontend Implementation</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">UI components, feature development, performance optimization</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border-l-4 border-blue-600">
                <p className="font-medium text-slate-900 dark:text-white">Backend Services</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">API endpoints, database optimization, payment processing</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border-l-4 border-blue-600">
                <p className="font-medium text-slate-900 dark:text-white">Security & Testing</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Security audits, test coverage, compliance implementation</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border-l-4 border-blue-600">
                <p className="font-medium text-slate-900 dark:text-white">Documentation</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">API docs, deployment guides, developer guides</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Ready to Get Started?</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Join thousands of users managing their finances and wellness in one place. Sign up free today and start tracking what matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
              Start Your Journey <ArrowRight size={18} />
            </Link>
            <a href="#features" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#features" className="hover:text-slate-900 dark:hover:text-white transition">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-slate-900 dark:hover:text-white transition">How It Works</a></li>
                <li><a href="#blockchain" className="hover:text-slate-900 dark:hover:text-white transition">Blockchain</a></li>
                <li><a href="#technology" className="hover:text-slate-900 dark:hover:text-white transition">Technology</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Developers</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#bounty" className="hover:text-slate-900 dark:hover:text-white transition">Bounty</a></li>
                <li><a href="#technology" className="hover:text-slate-900 dark:hover:text-white transition">API</a></li>
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
            <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
              © 2026 Sajilo Khata. All rights reserved. Built with care for your financial and wellness journey.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
