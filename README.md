# Sajilo Khata Frontend

A comprehensive personal finance and wellness platform with integrated Solana blockchain payments. Built with **Next.js**, **React Query**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Installation](#installation)
4. [Development](#development)
5. [x402 Payment Integration Guide](#-x402-payment-integration-guide)
6. [Testing x402 End-to-End](#testing-x402-end-to-end)
7. [Features](#features)
8. [Project Structure](#project-structure)
9. [Deployment](#deployment)
10. [Architecture](#architecture)
11. [Troubleshooting](#troubleshooting)

---

## 📌 Project Overview

**Sajilo Khata** (सजिलो खाता — "Easy Account" in Nepali) is a dual-purpose financial wellness platform:

### Core Features
- **Personal Finance Management**: Track accounts, transactions, investments, budgets
- **Health & Wellness**: Fitness planning, nutrition logging, AI-generated recommendations
- **Blockchain Payments**: Purchase premium AI plans using Solana USDC with x402 protocol

### x402 Innovation
Users can pay **0.01 USDC** via Phantom Wallet to unlock AI-generated 7-day personalized fitness + meal plans using the **x402 HTTP 402 Payment Required protocol**. This demonstrates:
- Cryptographic payment verification via on-chain signatures
- Full transaction transparency on Solana devnet
- Deterministic fallback for offline AI service availability
- Production-ready integration in a consumer finance app

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15+ (App Router) |
| Language | TypeScript (strict mode) |
| UI Components | shadcn/ui (Radix primitives) |
| Styling | Tailwind CSS + PostCSS |
| Data Fetching | TanStack React Query (v5+) |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios with interceptors |
| Authentication | Google OAuth via backend JWT |
| Voice Input | Web Speech API (browser-native) |
| Crypto Wallet | Phantom Wallet (Solana) |
| Notifications | react-hot-toast |
| Charts | Recharts |
| Build | Turbopack (Next.js built-in) |

---

## 🚀 Installation

### Prerequisites
- **Node.js** 18.17+ (LTS recommended)
- **npm** 9+ or **yarn** 4+
- **Git**
- **Phantom Wallet** browser extension (for x402 testing)

### Step 1: Clone Repository
```bash
git clone https://github.com/abinashchhetri/sajilo_khata
cd sajilo_khata
npm install
```

### Step 2: Configure Environment Variables
Create `.env.local` in the frontend root:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1

# Solana Configuration (devnet)
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_EXPLORER_URL=https://explorer.solana.com
```

**Important**: 
- Never commit `.env.local` to git
- Use `.env.local.example` as a template
- All `NEXT_PUBLIC_*` variables are exposed to the browser (do not put secrets here)

### Step 3: Start Development Server
```bash
npm run dev
```

Server runs on `http://localhost:3000`

### Verify Setup
1. Open http://localhost:3000 in browser
2. See "Continue with Google" button
3. Check browser console for no TypeScript errors (`npm run typecheck`)
4. Run tests: `npm run test` (if configured)

---

## 💻 Development

### Available Scripts

```bash
# Start dev server (with hot reload)
npm run dev

# Type checking (TypeScript strict mode)
npm run typecheck

# Build for production
npm run build

# Start production server
npm run start

# Run linter (ESLint)
npm run lint

# Run tests (if configured)
npm run test

# Format code (Prettier, if configured)
npm run format
```

### Project Structure

```
sajilo_khata/
├── app/                      # Next.js App Router pages
│   ├── (auth)/               # Public routes: login
│   ├── (dashboard)/          # Protected routes
│   │   ├── dashboard/        # Home page
│   │   ├── transactions/     # Transaction history
│   │   ├── accounts/         # Account management
│   │   ├── investments/      # Investment portfolio
│   │   ├── analytics/        # Analytics dashboard
│   │   ├── health/           # Health & fitness
│   │   └── settings/         # User settings
│   ├── api/                  # Next.js API routes (rarely used)
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
│
├── components/               # Reusable React components
│   ├── ui/                   # shadcn/ui primitives
│   ├── layout/               # Navbar, Sidebar, MobileNav
│   ├── shared/               # Small shared components
│   ├── voice/                # Voice recording UI
│   ├── transactions/         # Transaction feature components
│   ├── accounts/             # Account feature components
│   ├── investments/          # Investment feature components
│   └── health/               # Health & fitness components
│
├── hooks/                    # Custom React hooks
│   ├── context/              # Auth, theme context
│   ├── voice/                # Voice recording hooks
│   └── react-query/          # TanStack Query hooks
│       ├── accounts/
│       ├── transactions/
│       ├── investments/
│       ├── health/
│       └── auth/
│
├── services/                 # API client layer
│   ├── index.ts              # Axios instance + interceptors
│   ├── auth/
│   ├── accounts/
│   ├── transactions/
│   ├── investments/
│   └── health/
│
├── lib/                      # App logic & configuration
│   ├── constants/            # Toast messages, routes, query keys
│   └── validations/          # Zod schemas for forms
│
├── utils/                    # Pure utility functions
│   ├── format.utils.ts       # Currency, date, number formatting
│   ├── date.utils.ts         # Date parsing & calculations
│   ├── voice-parser.utils.ts # Voice transcript parsing
│   └── category.utils.ts     # Category lookups
│
├── types/                    # TypeScript interfaces & types
│   ├── global.types.ts       # Shared types across features
│   ├── api.types.ts          # API response envelopes
│   ├── accounts/
│   ├── transactions/
│   ├── investments/
│   └── health/
│
├── providers/                # React context providers
│   ├── auth.provider.tsx
│   └── react-query.provider.tsx
│
├── public/                   # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── .env.local.example        # Environment variable template
├── next.config.js            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── PROJECT_BLUEPRINT_frontend.md  # Code standards & patterns
```

### Coding Standards

This project follows strict conventions defined in `PROJECT_BLUEPRINT_frontend.md`. Key rules:

- **One component per file** (no exceptions)
- **Query keys** always from `QUERY_KEYS` constant (never inline strings)
- **Toast messages** always from `TOAST_MESSAGES` constant
- **Types** follow `I` prefix (interfaces) and `T` prefix (types)
- **File naming**: Components use `PascalCase.tsx`, hooks use `kebab-case.hook.ts`
- **No direct API calls** in components — always use React Query hooks
- **Pure utils** only — no side effects in `utils/` directory
- **Voice parsing** is local keyword/regex matching, never AI-powered (keeps it free)

See `PROJECT_BLUEPRINT_frontend.md` for complete guidelines.

---

## 💳 x402 Payment Integration Guide

### What is x402?

**x402** is the HTTP 402 Payment Required protocol for Solana blockchain micropayments:

1. **Request without payment** → Server returns HTTP 402 with a payment challenge (quote + recipient + amount)
2. **Send USDC transfer** → User signs a transaction with Phantom Wallet, sends 0.01 USDC
3. **Retry with proof** → Client re-requests with `X-PAYMENT` header containing the transaction signature
4. **Verify on-chain** → Backend validates the signature against Solana blockchain
5. **Access granted** → User receives the protected resource (AI-generated plan)

### User Flow (Frontend Perspective)

```
User clicks "Generate Plan" button
        ↓
POST /x402/plans/generate (no payment header)
        ↓
HTTP 402 response with challenge:
{
  "x402Version": 1,
  "accepts": [{
    "payTo": "CBGw1bivXgWhkLJwNe6wqiEwkEr5vdLtf4ZepE9KZLq4",
    "asset": "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU", // USDC
    "maxAmountRequired": "10000", // 0.01 USDC (6 decimals)
    "extra": {
      "quoteId": "...",
      "memo": "x402:..."
    }
  }]
}
        ↓
User clicks "Pay with Phantom" button
        ↓
Phantom opens, user reviews and signs transaction
        ↓
Transaction confirmed on devnet
        ↓
User copies transaction signature from Phantom
        ↓
Frontend retries request with X-PAYMENT header:
-H "X-PAYMENT: base64({"quoteId":"...","signature":"..."})"
        ↓
Backend verifies signature on-chain
        ↓
HTTP 200 response with generated plan
```

### Frontend Component Example

Here's how to implement x402 payment button in a component:

#### 1. Create Custom Hook for x402 Payment

```typescript
// hooks/react-query/health/use-generate-plan.hook.ts
"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { generatePlan, fetchPlanPreview } from "@/services/health/health.service";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

interface X402Challenge {
  x402Version: number;
  error: string;
  accepts: Array<{
    payTo: string;
    asset: string;
    maxAmountRequired: string;
    extra: {
      quoteId: string;
      memo: string;
      decimals: number;
      flow: string;
      instructions: string;
    };
  }>;
}

export const useGeneratePlan = () => {
  const [pendingChallenge, setPendingChallenge] = useState<X402Challenge | null>(null);

  const { mutateAsync: attemptGenerate, isPending } = useMutation({
    mutationFn: async (paymentHeader?: string) => {
      try {
        return await generatePlan(paymentHeader);
      } catch (err: any) {
        // If 402, extract the challenge
        if (err?.response?.status === 402) {
          const challenge = err.response.data;
          setPendingChallenge(challenge);
          throw new Error("Payment required");
        }
        throw err;
      }
    },
    onSuccess: (data) => {
      setPendingChallenge(null);
      toast.success("Plan generated successfully!");
      return data;
    },
    onError: (err: any) => {
      if (err.message !== "Payment required") {
        toast.error(TOAST_MESSAGES.GENERIC.SOMETHING_WENT_WRONG);
      }
    },
  });

  return {
    attemptGenerate,
    isPending,
    pendingChallenge,
    clearChallenge: () => setPendingChallenge(null),
  };
};
```

#### 2. Create Service Function for x402

```typescript
// services/health/health.service.ts
import apiClient from "@/services";

// Fetch plan preview (free, no payment)
export const fetchPlanPreview = async () => {
  const { data } = await apiClient.get("/x402/plans/preview");
  return data;
};

// Generate plan (paid, requires X-PAYMENT header)
export const generatePlan = async (paymentHeader?: string) => {
  const headers: Record<string, string> = {};
  if (paymentHeader) {
    headers["X-PAYMENT"] = paymentHeader;
  }
  
  const { data } = await apiClient.get("/x402/plans/generate", { headers });
  return data;
};
```

#### 3. Create UI Component

```typescript
// components/health/PlanGeneratorCard.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useGeneratePlan } from "@/hooks/react-query/health/use-generate-plan.hook";

const PlanGeneratorCard = () => {
  const { attemptGenerate, isPending, pendingChallenge, clearChallenge } = useGeneratePlan();
  const [txSignature, setTxSignature] = useState("");
  const [waitingForPayment, setWaitingForPayment] = useState(false);

  // Step 1: User clicks "Generate Plan"
  const handleGeneratePlan = async () => {
    await attemptGenerate();
  };

  // Step 2: User pays with Phantom and submits signature
  const handleSubmitPayment = async () => {
    if (!txSignature.trim() || !pendingChallenge) {
      alert("Please enter transaction signature");
      return;
    }

    const challenge = pendingChallenge.accepts[0];
    const paymentHeader = Buffer.from(
      JSON.stringify({
        quoteId: challenge.extra.quoteId,
        signature: txSignature,
      })
    ).toString("base64");

    // Retry with payment proof
    const result = await attemptGenerate(paymentHeader);
    if (result?.success) {
      setTxSignature("");
      setWaitingForPayment(false);
    }
  };

  if (!pendingChallenge) {
    return (
      <div className="p-6 rounded-lg border bg-background">
        <h3 className="text-lg font-semibold mb-4">Generate Your Plan</h3>
        <p className="text-sm text-muted-foreground mb-4">
          AI-generated 7-day fitness + meal plan based on your history
        </p>
        <Button
          onClick={handleGeneratePlan}
          disabled={isPending}
          size="lg"
        >
          {isPending ? "Loading..." : "Generate Plan"}
        </Button>
      </div>
    );
  }

  // Payment challenge received — show payment instructions
  const challenge = pendingChallenge.accepts[0];

  return (
    <div className="p-6 rounded-lg border border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
      <h3 className="text-lg font-semibold mb-4">Payment Required</h3>
      
      <div className="space-y-4 mb-6 text-sm">
        <div>
          <p className="font-semibold">Send Payment:</p>
          <code className="bg-background p-2 rounded block text-xs break-all">
            {challenge.maxAmountRequired} base units USDC to {challenge.payTo}
          </code>
        </div>

        <div>
          <p className="font-semibold">Memo (required):</p>
          <code className="bg-background p-2 rounded block text-xs break-all">
            {challenge.extra.memo}
          </code>
        </div>

        <div>
          <p className="font-semibold">Steps:</p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Open Phantom Wallet → Send USDC</li>
            <li>Paste recipient address above</li>
            <li>Add memo (required for verification)</li>
            <li>Review and sign transaction</li>
            <li>Copy transaction signature from confirmation</li>
            <li>Paste signature below</li>
          </ol>
        </div>
      </div>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Paste transaction signature here..."
          value={txSignature}
          onChange={(e) => setTxSignature(e.target.value)}
          className="w-full p-2 rounded border text-xs"
        />

        <div className="flex gap-2">
          <Button
            onClick={handleSubmitPayment}
            disabled={!txSignature.trim() || waitingForPayment}
            size="lg"
            className="flex-1"
          >
            Verify Payment
          </Button>
          <Button
            onClick={() => {
              clearChallenge();
              setTxSignature("");
            }}
            variant="outline"
            size="lg"
          >
            Cancel
          </Button>
        </div>
      </div>

      <a
        href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-blue-600 hover:underline mt-2 block"
      >
        View transaction on Solana Explorer →
      </a>
    </div>
  );
};

export default PlanGeneratorCard;
```

---

## 🧪 Testing x402 End-to-End

### Prerequisites Setup

#### 1. Install Phantom Wallet
- Download from https://phantom.app/
- Install as browser extension
- Create or import a Solana wallet
- Switch to **Devnet** (Settings → Developer Settings → Enable Testnet Mode → Devnet)

#### 2. Get Devnet SOL (Gas Fees)
```bash
# Visit: https://faucet.solana.com
# Paste your Phantom wallet public key
# Request 2-5 SOL (free, instant)
```

#### 3. Get Devnet USDC (Payment Token)
```bash
# Visit: https://faucet.circle.com
# Select "Solana" → "Devnet"
# Paste your Phantom wallet public key
# Request 100 USDC (free, instant)
```

### Complete Testing Flow

#### Phase 1: Start All Services

**Terminal 1: Start Backend**
```bash
cd personal-dashboard-backend
npm run start:dev
# Should see: "✅ Nest application successfully started"
```

**Terminal 2: Start Frontend**
```bash
cd sajilo_khata
npm run dev
# Should see: "Ready in XXXms"
```

Both services are now running:
- Frontend: http://localhost:3000
- Backend: http://localhost:4000/api/v1

#### Phase 2: Frontend Testing

**Step 1: Login to Frontend**
1. Open http://localhost:3000
2. Click "Continue with Google"
3. Complete Google OAuth (backend redirects back with JWT)
4. Should see dashboard

**Step 2: Navigate to Health/Fitness Section**
1. In sidebar, find "Health" or "Fitness" section
2. Look for "Generate AI Plan" or "Get Personalized Plan" button
3. Click the button

**Step 3: First Request (No Payment)**
```
Frontend sends: GET /x402/plans/generate (no X-PAYMENT header)
Backend responds: HTTP 402 with challenge
```

Expected UI behavior:
- Modal/card appears: "Payment Required"
- Shows payment instructions
- Displays recipient address, USDC amount, memo
- Input field for transaction signature

**Step 4: Send Payment via Phantom**
1. Open Phantom Wallet
2. Click **Send**
3. Recipient: `CBGw1bivXgWhkLJwNe6wqiEwkEr5vdLtf4ZepE9KZLq4`
4. Token: **USDC**
5. Amount: `0.01`
6. Click **Add Memo** → Paste `x402:<quoteId>` (shown in UI)
7. Click **Review** → **Confirm**
8. Wait for "Transaction Confirmed"

**Step 5: Verify Payment**
1. In Phantom, click the confirmed transaction
2. Copy the transaction signature (full hash, not short address)
3. Paste it into the frontend input field
4. Click **Verify Payment**

**Step 6: Receive Plan**
```
Frontend sends: GET /x402/plans/generate + X-PAYMENT header
Backend verifies signature on-chain
Backend responds: HTTP 200 with generated plan
```

Expected response:
```json
{
  "success": true,
  "data": {
    "generatedAt": "2026-07-13T...",
    "historyAnalysis": {
      "workoutDays": 24,
      "adherence": 0.8,
      "focusMuscles": ["back", "chest", "legs"]
    },
    "generatedPlan": {
      "startDate": "2026-07-14",
      "workouts": [...],
      "meals": [...]
    }
  }
}
```

UI shows: Generated 7-day workout + meal plan with personalized recommendations

#### Phase 3: Verification Checklist for Judges

| Component | Verification | Expected |
|-----------|--------------|----------|
| **HTTP 402 Response** | Check browser DevTools → Network | 402 status with x402Version=1 |
| **x402 Challenge** | Inspect 402 response body | quoteId, memo, recipient, amount all present |
| **Quote TTL** | Check maxTimeoutSeconds | Should be 600 (10 minutes) |
| **Payment Sent** | Open Solana Explorer | Transaction visible with correct memo |
| **Signature Verification** | Check signature format | Valid base58 or similar Solana signature |
| **Plan Generated** | Check HTTP 200 response | Contains workouts and meals arrays |
| **AI Integration** | Inspect plan content | Realistic exercises, sets, reps, macros |
| **Devnet Proof** | Visit Explorer link | Transaction shows on devnet, not mainnet |

#### Phase 4: Testing Error Cases

**Test 1: Expired Quote**
```bash
# Get a quote, wait 10+ minutes, then submit payment
# Expected: Backend rejects with "Quote expired"
```

**Test 2: Wrong Amount**
```bash
# Send 0.02 USDC instead of 0.01
# Expected: Backend rejects with "Insufficient amount"
```

**Test 3: Wrong Recipient**
```bash
# Send USDC to a different address
# Expected: Backend rejects with "Incorrect recipient"
```

**Test 4: Missing Memo**
```bash
# Send USDC without memo instruction
# Expected: Backend rejects with "Memo mismatch"
```

**Test 5: Replay Attack Prevention**
```bash
# Try using the same signature twice
# Expected: Backend rejects second attempt with "Signature already used"
```

---

## ✨ Features

### Finance Management
- ✅ Account management (cash, bank, e-payment)
- ✅ Transaction tracking (expense, income, transfers)
- ✅ Category-based organization
- ✅ Voice entry (hold-to-record, real-time transcription)
- ✅ Investment portfolio (NEPSE, SIP, FD)
- ✅ Analytics dashboard (spending trends, net worth)
- ✅ Budget planning and alerts

### Health & Wellness
- ✅ Workout logging with exercise details
- ✅ Nutrition logging (meals, calories, macros)
- ✅ Progress tracking (weight, strength, adherence)
- ✅ AI-generated fitness + meal plans (Gemini 1.5 Flash)
- ✅ x402 Solana micropayment for plan generation
- ✅ 7-day personalized recommendations

### Blockchain Integration
- ✅ Phantom Wallet integration
- ✅ Solana devnet payment processing
- ✅ USDC token transfers
- ✅ x402 signature-based verification
- ✅ On-chain payment validation
- ✅ Transaction transparency via Solana Explorer

### User Experience
- ✅ Google OAuth single sign-on
- ✅ Voice-based data entry
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark mode support
- ✅ Real-time toast notifications
- ✅ Loading states and skeletons
- ✅ Error boundary protection

---

## 🏗️ Architecture

### Data Flow

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │ Browser
       ↓
┌─────────────────────────────────────┐
│   Frontend (Next.js)                │
│  ┌─────────────────────────────────┐│
│  │ React Components                ││
│  │  • PlanGeneratorCard            ││
│  │  • TransactionForm              ││
│  │  • AnalyticsDashboard           ││
│  └──────────────┬────────────────┘│
│                 │                  │
│  ┌──────────────▼─────────────────┐│
│  │ React Query Hooks               ││
│  │  • useGeneratePlan              ││
│  │  • useGetTransactions           ││
│  │  • useHandleCreateTransaction   ││
│  └──────────────┬────────────────┘│
│                 │                  │
│  ┌──────────────▼─────────────────┐│
│  │ API Client (Axios)              ││
│  │  • withCredentials: true        ││
│  │  • Error interceptor            ││
│  │  • X-PAYMENT header support    ││
│  └──────────────┬────────────────┘│
└─────────────────┼──────────────────┘
                  │ HTTPS
                  ↓
┌─────────────────────────────────────┐
│   Backend (NestJS)                  │
│  ┌─────────────────────────────────┐│
│  │ x402PaymentGuard                ││
│  │  • Parses X-PAYMENT header      ││
│  │  • Issues 402 challenge if none ││
│  │  • Calls X402Service            ││
│  └──────────────┬────────────────┘│
│                 │                  │
│  ┌──────────────▼─────────────────┐│
│  │ X402Service                     ││
│  │  • issueQuote()                 ││
│  │  • verifyPayment()              ││
│  │  • 10-point validation          ││
│  └──────────────┬────────────────┘│
│                 │                  │
│  ┌──────────────▼─────────────────┐│
│  │ PlanGenerationService           ││
│  │  • generatePlan()               ││
│  │  • Call Gemini AI API           ││
│  │  • Fallback deterministic plan  ││
│  └──────────────┬────────────────┘│
└─────────────────┼──────────────────┘
                  │
                  ├─────→ Solana RPC (devnet)
                  │       • Verify payment signature
                  │       • Fetch tx details
                  │
                  ├─────→ Gemini AI API
                  │       • Generate personalized plan
                  │
                  └─────→ PostgreSQL
                          • Store quotes & payments
                          • Persist user data
```

### State Management

- **Auth State**: Google OAuth + httpOnly JWT cookies (backend-managed)
- **Data State**: TanStack React Query (server-state caching)
- **UI State**: React hooks + local component state (minimal)
- **Form State**: React Hook Form (mutation tracking)

### Key Flows

#### 1. Login Flow
```
User clicks "Continue with Google"
  ↓
window.location.href = "${API_URL}/auth/google"
  ↓
Backend: Google OAuth dance
  ↓
Backend: Set httpOnly JWT cookie
  ↓
Redirect to frontend /dashboard
  ↓
Frontend: useGetCurrentUser hook runs
  ↓
Dashboard renders (auth verified)
```

#### 2. x402 Payment Flow
```
User clicks "Generate Plan"
  ↓
useGeneratePlan hook calls generatePlan()
  ↓
Frontend: GET /x402/plans/generate (no header)
  ↓
Backend: 402 Payment Required (challenge)
  ↓
Frontend: Show payment UI with instructions
  ↓
User: Open Phantom, send USDC with memo
  ↓
User: Copy tx signature, paste in frontend
  ↓
Frontend: GET /x402/plans/generate + X-PAYMENT header
  ↓
Backend: Verify signature on Solana devnet
  ↓
Backend: 200 OK with generated plan
  ↓
Frontend: Display plan to user
```

---

## 🚢 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Update `NEXT_PUBLIC_API_URL` to production backend URL
- [ ] Update `NEXT_PUBLIC_SOLANA_NETWORK` to `mainnet-beta` (if using mainnet)
- [ ] Update `NEXT_PUBLIC_SOLANA_RPC_URL` to mainnet RPC
- [ ] Remove console.log statements
- [ ] Verify `package.json` scripts match CI/CD pipeline
- [ ] Run `npm run build` locally to catch build errors early
- [ ] Test TypeScript: `npm run typecheck`
- [ ] Review environment variables are not committed
- [ ] Set up CORS on backend to include production frontend URL

### Build & Deploy (Vercel Example)

```bash
# Build
npm run build

# Preview production build locally
npm run start

# Deploy to Vercel
# Connect GitHub repo → Vercel automatically deploys on push to main
```

### Environment Variables for Vercel

In Vercel project settings, add:
```
NEXT_PUBLIC_API_URL=https://api.abinashchhetri.com.np/api/v1
NEXT_PUBLIC_SOLANA_NETWORK=devnet  # or mainnet-beta
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_EXPLORER_URL=https://explorer.solana.com
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. "CORS error when calling backend"
**Cause**: Backend CORS not configured for frontend origin

**Solution**:
```bash
# Check backend .env has frontend URL in CORS_ORIGIN
CORS_ORIGIN=http://localhost:3000,https://yourdomain.com

# Restart backend: npm run start:dev
```

#### 2. "401 Unauthorized after login"
**Cause**: JWT cookie not being sent with requests

**Solution**:
```typescript
// Check services/index.ts has withCredentials: true
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,  // ← MUST be true
});
```

#### 3. "Google login redirects to /login instead of /dashboard"
**Cause**: `useGetCurrentUser` hook returns `isError` due to 401

**Solution**:
```bash
# Check backend responds to GET /auth/me with user data
curl -X GET http://localhost:4000/api/v1/auth/me \
  -H "Cookie: access_token=YOUR_TOKEN"

# Should return 200 with user object, not 401
```

#### 4. "x402 payment says 'Incorrect recipient'"
**Cause**: Transaction sent to wrong address

**Solution**:
- Double-check recipient from the 402 challenge response
- Must be exactly: `CBGw1bivXgWhkLJwNe6wqiEwkEr5vdLtf4ZepE9KZLq4`
- No typos, no abbreviations

#### 5. "Phantom wallet not connecting"
**Cause**: Browser doesn't detect Solana provider

**Solution**:
```bash
# Open browser console and check:
console.log(window.solana);  // Should exist

# If undefined:
# 1. Reinstall Phantom
# 2. Refresh browser
# 3. Check devnet is enabled in Phantom settings
```

#### 6. "TypeError: Cannot read property 'solana' of undefined"
**Cause**: Phantom extension not loaded before React renders

**Solution**:
```typescript
// Wrap Phantom calls in useEffect with window check
useEffect(() => {
  if (typeof window !== "undefined" && window.solana) {
    // Safe to use Phantom
  }
}, []);
```

#### 7. "Plan generation returns empty response"
**Cause**: Gemini API key not set or network error

**Solution**:
```bash
# Check backend logs:
# Should see: "✅ Gemini provider initialized: gemini-1.5-flash"

# If error, check backend .env:
GEMINI_API_KEY=your_key_from_aistudio.google.com
GEMINI_MODEL=gemini-1.5-flash

# Restart backend
```

---

## 📚 Additional Resources

- **Project Blueprint**: [PROJECT_BLUEPRINT_frontend.md](./PROJECT_BLUEPRINT_frontend.md)
- **Backend README**: https://github.com/abinashchhetri/personal-dashboard-backend
- **Solana Docs**: https://docs.solana.com
- **x402 Spec**: https://www.ietf.org/rfc/rfc7231.html#section-6.5.2
- **Phantom API**: https://docs.phantom.app
- **React Query**: https://tanstack.com/query/latest
- **shadcn/ui**: https://ui.shadcn.com
- **Next.js**: https://nextjs.org/docs

---

## 📝 License

**Proprietary & Confidential**

All rights reserved. This project is not open source. Unauthorized copying, modification, or distribution is prohibited. For inquiries, contact abinashchhetri.work@gmail.com.

---

## 🤝 Support

For issues, questions, or feedback:
- **Email**: abinashchhetri.work@gmail.com
- **GitHub Issues**: https://github.com/abinashchhetri/sajilo_khata/issues
- **Frontend Repo**: https://github.com/abinashchhetri/sajilo_khata
- **Backend Repo**: https://github.com/abinashchhetri/personal-dashboard-backend

---

**Last Updated**: July 2026  
**For**: Solana Workshop 101 Mini Hack
