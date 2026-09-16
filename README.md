# MedEasy — Medicine management, made easy.
## Phase 2 Production-Quality Intelligent Healthcare Platform

MedEasy is an intelligent medicine management platform connecting:
- **Patients & Caregivers** (regimen adherence, estimated refill management, expiration tracking)
- **Pharmacies & Healthcare Organizations** (inventory optimization, demand forecasting, waste reduction)
- **Healthcare Supply Intelligence** (explainable forecasting, multi-zone redistribution)

> **Core Problem:** Medicine wastage is fundamentally a supply-demand coordination and visibility problem.  
> **MedEasy Solution:** Track inventory, understand demand velocity, predict waste before expiry, and recommend proactive clinical actions.

---

## 🎨 MedEasy Design System & Brand Identity

- **Brand Typography**:
  - Headings: `Manrope` (600 / 700) — clean, authoritative, modern healthcare SaaS
  - Body & Data: `Inter` (400 / 500 / 600) — high-legibility clinical tabular typography
- **Tailored Healthcare Palette**:
  - **Primary Teal**: `#087E8B` (Action elements, primary buttons, focal charts)
  - **Secondary Teal**: `#12A4A6` (Active states, gradients, subtle highlights)
  - **Soft Mint**: `#7CC9C3` (Accents, brand icon precision dot)
  - **Deep Navy**: `#16324F` (Headings, primary typography, dark badges)
  - **Secondary Text**: `#668096` (Labels, metadata, descriptive microcopy)
  - **Canvas Background**: `#F6FAFA` (Calm clinical canvas)
  - **Surface**: `#FFFFFF` (Elevated cards and slide-over drawers)
  - **Status Accents**: Green (`#3A9D74`), Amber (`#E9A23B`), Critical Red (`#D95D5D`)

---

## 🚀 Key Modules & Capabilities

### 1. Public SaaS Landing Page
- Accessible anytime from the top navigation ("MedEasy Tour" / "Launch Platform").
- Clean hero banner with value proposition and interactive data flow diagram:
  `Patient Adherence & Refills ↔ MedEasy Intelligent Coordination Engine ↔ Pharmacy & Health System Supply`.
- Key pillars: Predictive Waste Prevention, Patient Adherence Without Friction, Cross-Zone Supply Optimization.
- Direct launch buttons for Pharmacy Experience and Patient Portal.

### 2. Pharmacy & Organization Intelligence Dashboard
- **Collapsible Persistent Sidebar**:
  - 240px expanded navigation with icon + label; collapses smoothly to 72px icon-only rail with hover tooltips.
  - Organized into **Supply & Intelligence** (`Overview`, `Inventory`, `Demand Intelligence`, `Waste Risk Monitor`, `Expiry Tracking`, `Locations & Grid`) and **Operations** (`Patient Refills`, `Alerts`, `Audit & Reports`, `Settings`).
- **Overview Tab**:
  - **Exact 4-KPI Primary Row**:
    1. *Total Inventory*: 12,480 units (+3.2% vs last month)
    2. *At Risk*: 684 units (5.5% of total stock)
    3. *Expiring Soon*: 126 units (next 30-60 days)
    4. *Stockout Risk*: 8 medicines (demand > supply runway)
  - **MedEasy Inventory Intelligence Card**: 3 natural-language analytical insights with direct actions.
  - **Stock Health Distribution Bar**: Visual proportion bar showing Healthy (78%), At Risk (14%), Critical (8%).
  - **Demand vs Inventory Dynamics Chart**: Recharts dual-axis comparison with `7D`, `30D`, and `90D` horizon toggles.
  - **Needs Attention Queue**: Priority action queue with instant drawer SKU inspection.
- **Unified SKU Detail Drawer**:
  - Right-side slide-over panel accessible from Inventory, Waste Risk, and Overview tables.
  - Interactive Stock vs Demand bar chart.
  - Batch breakdown table with locations and expiry dates.
  - Human-readable **"Why is this flagged?"** explanation card with clear calculations.
  - Action buttons: *Transfer Stock*, *Prioritize Dispense*, *Adjust Reorder Point*.
- **Inventory Tab**:
  - Multi-select checkboxes with bulk action bar (e.g. Export Selected, Bulk Reorder Review).
  - Search by name, generic name, batch number; category filters; status filters.
  - Tabular columns: Medicine, Batch, Available, Demand/month, Expiry, Days left, Risk, Status, Actions.
  - Paginated table with rows-per-page selector.
- **Demand Intelligence Tab**:
  - Recharts area chart with dual confidence intervals (`ConfidenceMin`, `ConfidenceMax`) and `30D / 60D / 90D` horizon toggles.
  - **Demand Anomalies Panel**: Comparing Expected vs Actual vs Diff percentage with seasonal surge tags.
- **Waste Risk Monitor**:
  - 4 summary metrics (Total units at risk, Estimated value at risk, Batches expiring soon, High-risk locations).
  - Explainable risk summaries detailing root causes (e.g., consumption rate vs expiry horizon).
- **Locations & Zonal Map**:
  - Interactive Metropolitan Healthcare Grid with multi-layer overlays (*Demand*, *Supply*, *Waste Risk*, *Stockout Risk*).
  - Zone inspection card with supply/demand ratios and cross-zone balance dispatch.

### 3. Patient & Caregiver Experience
- **Calm & Accessible UI**:
  - Warm greeting: *"Good morning, Elena"* with daily adherence progress tracker (*2 / 3 doses taken today*).
  - Actionable dose cards with time, remaining days, and interactive "Mark as Taken" button.
- **Multi-Step Simulated Medicine Scanner**:
  - Modal with 3 pathways: *Scan Package / Box*, *Upload Prescription Document*, *Add Manually*.
  - Realistic OCR camera simulation: viewfinder crosshairs → OCR text extraction ticker → structured medicine confirmation preview.
- **Refills & Expiry Tracking**:
  - Non-prescriptive, compliant terminology strictly using **"Estimated refill"** and authorized repeats.
  - Direct pharmacist / clinic contact button.
  - Expiry warnings and safe community take-back instructions.

### 4. Global Platform Capabilities
- **Global Search (`Ctrl+K` / `Cmd+K`)**:
  - Keyboard-accessible modal searching across Medicines, Batches, Pharmacies, Patients, and Locations.
- **Intelligent Notification Drawer**:
  - Category filters: Inventory, Demand, Expiry, Waste.
  - Real-time timestamp notifications with action triggers.
- **Demo Scenario Fast-Switcher**:
  - Floating pill bar allowing one-click testing of 6 realistic healthcare supply scenarios:
    1. High Demand + Low Stock (Amoxicillin)
    2. Low Demand + Excess Stock (Doxycycline)
    3. Approaching Expiry / High Waste Risk (Atorvastatin)
    4. Balanced Inventory (Metformin)
    5. Sudden Demand Surge (Paracetamol)
    6. Multi-Batch Differing Expiries (Insulin Glargine)

---

## 🛠️ Technical Architecture

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom CSS Variables (`#087E8B`, `#16324F`, `#F6FAFA`)
- **Data Visualizations**: Recharts (ResponsiveContainer, AreaChart, BarChart, PieChart)
- **Icons**: Lucide React
- **Architecture**: Service-oriented modular design ready for REST/GraphQL API integration:
  - `/src/services/inventoryService.ts`
  - `/src/services/demandService.ts`
  - `/src/services/wasteService.ts`
  - `/src/services/patientService.ts`
  - `/src/services/intelligenceService.ts`

---

## 🏃 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Build for Production**:
   ```bash
   npm run build
   ```
