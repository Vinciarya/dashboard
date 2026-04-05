<div align="center">
  
# 🌌 Personal Finance Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-16+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Shadcn UI](https://img.shields.io/badge/Shadcn_UI-Latest-black?style=for-the-badge&logo=uiomatic)](https://ui.shadcn.com/)
[![Recharts](https://img.shields.io/badge/Recharts-2.15-FF6384?style=for-the-badge)](https://recharts.org/)

***

An ultra-modern, lightning-fast finance management platform delivering spatial, premium aesthetics alongside robust functional flows.

<br />
</div>

![Finance Dashboard Preview](public/dashboard-preview.png)

## ✨ Features Implemented

The following features were successfully implemented and integrated into the ecosystem:

- ✅ **Dashboard Overview with Summary Cards** (High-level glanceable metrics with glassmorphic backing).
- ✅ **Time Based Visualization** (Interactive balance trend charts highlighting trajectory).
- ✅ **Categorical Visualization** (Vibrant, accessible spending breakdowns).
- ✅ **Transaction List with Details** (Deep-dive interface for exploring financial logs).
- ✅ **Transaction Filtering** (Real-time facet and date-range extraction).
- ✅ **Transaction Sorting or Search** (Immediate Tanstack Table powered queries).
- ✅ **Role Based UI (Viewer and Admin)** (Granular permission emulation with smooth contextual transition).
- ✅ **Insights Section** (Automated logic breaking down spending trends with targeted advice components).
- ✅ **State Management** (A cleanly localized Context API framework, negating external setup latency).
- ✅ **Responsive Design** (Fluid interface from 300px mobile widths up to 4K Ultrawide spans).

---

## 🛠️ Technical Decisions and Trade-offs

### 1. Framework: Next.js 16 (App Router)
- **Decision:** Built utilizing Next.js to leverage server components efficiently while preserving raw client interplay.
- **Trade-off:** Embracing a strict Next.js environment slightly increases the initial mental model complexity over standard Vite/React single-page-apps, but returns significantly better routing architectures and asset optimizations out-of-the-box.

### 2. Styling: Tailwind CSS v4 + Shadcn Primitives
- **Decision:** Upgraded strictly to Tailwind v4, consolidating all legacy inline variables to centralized CSS constants.
- **Trade-offs:** Custom Shadcn component ejection means slightly more files to maintain directly in the `/components` folder vs an NPM import, but allows 100% granular design control required to ship our exact "premium aesthetic".

### 3. State Management: React Context API natively
- **Decision:** Engineered a bespoke overarching `FinanceContext` to handle CRUD states.
- **Trade-offs:** Bypassed adopting heavier external ecosystems like Redux or Zustand. The trade-off is potential extra re-renders per localized change, but it was deemed a worthy sacrifice for reduced bundle size and immense logical simplicity.

### 4. Interface Rendering Model (TanStack & Recharts)
- Headless UI interactions ensure accessible screen-reader bindings natively, decoupling the complex search/filter logic (TanStack Table) from our bespoke physical design system. 

---

## 🎨 Design Philosophy: The 3D Premium Aesthetic

We engineered this dashboard specifically away from raw "flat" uninspiring interfaces:

- **Subtle Depth Profiling:** Replaced hard borders with delicate rings and drop-shadow variables (`box-shadow` abstractions) to push components off the page virtually, producing a soft 3D perception.
- **Harmonious HSL Palettes:** Steered completely clear from default HTML generic hex colorings. Legibility is bolstered through curated dark-mode contrast matrices. 
- **Micro-Animations:** Fluid state transitions, hover liftoffs (mimicking Apple/Vercel spatial concepts), and staggered data-load entries maintain an "alive" feeling.

---

## 📝 Additional Notes & Future Roadmap

- **Lighthouse Refinements:** Specific architectural time was invested into resolving local-storage hydration glitches and `aria-label` accessibility mappings. The site evaluates purely on a performance standpoint without DOM layout shifts.
- **Extensibility:** The Context hook abstraction simulates API latency natively, establishing a plug-and-play foundation awaiting a true REST or GraphQL backend ingestion wrapper in the future.
- **Known Limitations:** Current sorting supports client-side indexing primarily; scaling beyond 10,000+ local rows would optimally trigger a pipeline transition to Server-Side actions.

<br />

<div align="center">
  <sub>Built with ❤️ and extreme attention to detail for a state-of-the-art interactive experience.</sub>
</div>
