import React from 'react';
import { MedEasyLogo } from '../common/MedEasyLogo';
import { 
  ArrowRight, 
  Pill, 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Clock, 
  Layers, 
  CheckCircle2, 
  Users, 
  Activity, 
  Globe 
} from 'lucide-react';

interface LandingPageProps {
  onEnterPlatform: (role: 'PHARMACY' | 'PATIENT') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterPlatform }) => {
  return (
    <div className="min-h-screen bg-[#F6FAFA] text-[#16324F] flex flex-col selection:bg-[#087E8B] selection:text-white">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#668096]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <MedEasyLogo size="md" showTagline={false} />

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#668096]">
            <a href="#problem" className="hover:text-[#087E8B] transition-colors">The Problem</a>
            <a href="#solution" className="hover:text-[#087E8B] transition-colors">The Solution</a>
            <a href="#how-it-works" className="hover:text-[#087E8B] transition-colors">How It Works</a>
            <a href="#stakeholders" className="hover:text-[#087E8B] transition-colors">Platform Ecosystem</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onEnterPlatform('PATIENT')}
              className="px-4 py-2.5 rounded-btn border border-[#668096]/20 bg-[#FFFFFF] hover:bg-[#EEF5FA] text-[#16324F] text-xs font-bold transition-all shadow-subtle"
            >
              Patient Portal
            </button>
            <button
              type="button"
              onClick={() => onEnterPlatform('PHARMACY')}
              className="px-5 py-2.5 rounded-btn bg-[#087E8B] hover:bg-[#066570] text-white text-xs font-bold transition-all shadow-subtle flex items-center gap-1.5"
            >
              <span>Explore Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF7F6] border border-[#7CC9C3]/50 text-[#087E8B] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#087E8B]" />
            <span>Healthcare Intelligence & Waste Elimination Platform</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl font-extrabold text-[#16324F] tracking-tight leading-[1.15]">
            Medicine management, <br className="hidden sm:inline" />
            <span className="text-[#087E8B]">made easy.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#668096] font-normal leading-relaxed pt-1">
            Connect medication, inventory and demand in one intelligent platform. Eliminate unnecessary medicine wastage while ensuring availability where patients need it most.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onEnterPlatform('PHARMACY')}
              className="px-6 py-3.5 rounded-btn bg-[#087E8B] hover:bg-[#066570] text-white text-sm font-bold shadow-card flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <span>Explore the platform</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#how-it-works"
              className="px-6 py-3.5 rounded-btn bg-[#FFFFFF] border border-[#668096]/25 hover:bg-[#EEF5FA] text-[#16324F] text-sm font-bold shadow-subtle transition-all"
            >
              See how it works
            </a>
          </div>
        </div>

        {/* HERO VISUAL: Patient ↔ MedEasy ↔ Pharmacy */}
        <div className="mt-14 max-w-4xl mx-auto bg-[#FFFFFF] rounded-2xl border border-[#668096]/20 p-6 sm:p-10 shadow-elevated relative overflow-hidden">
          <div className="text-center mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#668096]">
              Intelligent Medicine Synchronization Loop
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center relative">
            
            {/* Patient Node */}
            <div 
              onClick={() => onEnterPlatform('PATIENT')}
              className="p-6 rounded-2xl bg-[#F6FAFA] border border-[#668096]/15 text-center cursor-pointer hover:border-[#087E8B] transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#EAF7F6] text-[#087E8B] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="font-heading font-bold text-base text-[#16324F]">Patients & Caregivers</h4>
              <p className="text-xs text-[#668096] mt-1">Dose schedules, runway visibility, estimated refills, take-back returns</p>
              <span className="mt-3 inline-block text-[11px] font-bold text-[#087E8B]">
                Open Patient App →
              </span>
            </div>

            {/* MedEasy Intelligence Core */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#EAF7F6] to-[#EEF5FA] border-2 border-[#087E8B] text-center shadow-card relative">
              <div className="w-14 h-14 rounded-2xl bg-[#087E8B] text-white flex items-center justify-center mx-auto mb-3 shadow-subtle">
                <Sparkles className="w-7 h-7" />
              </div>
              <h4 className="font-heading font-bold text-lg text-[#16324F]">MedEasy Intelligence</h4>
              <p className="text-xs text-[#087E8B] font-semibold mt-0.5">Track → Understand → Predict → Act</p>
              <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-mono font-bold text-[#16324F] bg-[#FFFFFF] px-2.5 py-1 rounded-full border border-[#7CC9C3]/50">
                <span className="w-2 h-2 rounded-full bg-[#3A9D74] animate-pulse"></span>
                Real-Time Supply & Demand Sync
              </div>
            </div>

            {/* Pharmacy Node */}
            <div 
              onClick={() => onEnterPlatform('PHARMACY')}
              className="p-6 rounded-2xl bg-[#F6FAFA] border border-[#668096]/15 text-center cursor-pointer hover:border-[#087E8B] transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#EEF5FA] text-[#16324F] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <h4 className="font-heading font-bold text-base text-[#16324F]">Pharmacies & Hospitals</h4>
              <p className="text-xs text-[#668096] mt-1">Batch expiry tracking, waste-risk prediction, inter-zone rebalancing</p>
              <span className="mt-3 inline-block text-[11px] font-bold text-[#087E8B]">
                Open Pharmacy Hub →
              </span>
            </div>

          </div>

          {/* Subtext */}
          <div className="mt-8 pt-6 border-t border-[#668096]/15 text-center text-xs text-[#668096]">
            Continuous data-flow prevents stockouts in urban centers while eliminating expired medicine destruction in suburban dispensaries.
          </div>
        </div>
      </section>

      {/* THE PROBLEM SECTION */}
      <section id="problem" className="py-16 bg-[#FFFFFF] border-y border-[#668096]/15 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D95D5D]">The Core Problem</span>
            <h2 className="font-heading text-3xl font-extrabold text-[#16324F]">
              Medicine wastage is a supply-demand coordination problem.
            </h2>
            <p className="text-sm text-[#668096]">
              Medicine can be available in one place while urgent demand exists somewhere else.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div className="p-6 rounded-2xl bg-[#F6FAFA] border border-[#668096]/15 space-y-2">
              <span className="font-heading font-bold text-lg text-[#16324F]">Expired Batches</span>
              <p className="text-xs text-[#668096] leading-relaxed">
                Pharmacies hold excess inventory that steadily marches toward expiry date, without cross-facility visibility to redistribute stock in time.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-[#F6FAFA] border border-[#668096]/15 space-y-2">
              <span className="font-heading font-bold text-lg text-[#16324F]">Sudden Stockouts</span>
              <p className="text-xs text-[#668096] leading-relaxed">
                Adjacent clinics run out of critical antibiotics and chronic therapies because regional supply pipelines lack predictive demand velocity modeling.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-[#F6FAFA] border border-[#668096]/15 space-y-2">
              <span className="font-heading font-bold text-lg text-[#16324F]">Unused Patient Meds</span>
              <p className="text-xs text-[#668096] leading-relaxed">
                Patients purchase more medication than they consume due to unmonitored refill timing and lack of guided safe take-back disposal channels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* THE SOLUTION & HOW IT WORKS */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#087E8B]">The Solution</span>
          <h2 className="font-heading text-3xl font-extrabold text-[#16324F]">
            How MedEasy Works
          </h2>
          <p className="text-sm text-[#668096]">
            A continuous loop from physical batches to patient refills.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          
          <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#668096]/15 shadow-subtle space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#087E8B]/10 text-[#087E8B] flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="font-heading font-bold text-base text-[#16324F]">Track</h3>
            <p className="text-xs text-[#668096] leading-relaxed">
              Every batch, location, expiry horizon, and patient daily dose is monitored in a unified ledger.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#668096]/15 shadow-subtle space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#087E8B]/10 text-[#087E8B] flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="font-heading font-bold text-base text-[#16324F]">Understand</h3>
            <p className="text-xs text-[#668096] leading-relaxed">
              Analyze consumption velocity against shelf-life to calculate true days of supply remaining.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#668096]/15 shadow-subtle space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#087E8B]/10 text-[#087E8B] flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="font-heading font-bold text-base text-[#16324F]">Predict</h3>
            <p className="text-xs text-[#668096] leading-relaxed">
              Deterministic models forecast 30/60/90-day demand and flag excess units before expiration.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#668096]/15 shadow-subtle space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#087E8B]/10 text-[#087E8B] flex items-center justify-center font-bold text-sm">
              04
            </div>
            <h3 className="font-heading font-bold text-base text-[#16324F]">Act</h3>
            <p className="text-xs text-[#668096] leading-relaxed">
              Execute inter-zone rebalances, prioritize FIFO dispensing, and stage timely patient refills.
            </p>
          </div>

        </div>
      </section>

      {/* ECOSYSTEM / STAKEHOLDERS */}
      <section id="stakeholders" className="py-16 bg-[#EEF5FA]/60 border-t border-[#668096]/15 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#087E8B]">Platform Value</span>
            <h2 className="font-heading text-3xl font-extrabold text-[#16324F] mt-1">
              Built for the Entire Healthcare Network
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* For Patients */}
            <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#668096]/15 shadow-card space-y-3 flex flex-col justify-between">
              <div>
                <div className="p-2.5 rounded-xl bg-[#EAF7F6] text-[#087E8B] w-fit mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-lg text-[#16324F]">For Patients</h3>
                <p className="text-xs text-[#668096] leading-relaxed mt-1">
                  Simple medication tracking with camera OCR scan, daily dose reminders, and estimated refill coordination.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onEnterPlatform('PATIENT')}
                className="w-full py-2 rounded-btn bg-[#F6FAFA] hover:bg-[#EAF7F6] text-[#087E8B] text-xs font-bold transition-colors"
              >
                Launch Patient Demo
              </button>
            </div>

            {/* For Pharmacies */}
            <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#668096]/15 shadow-card space-y-3 flex flex-col justify-between">
              <div>
                <div className="p-2.5 rounded-xl bg-[#EEF5FA] text-[#16324F] w-fit mb-3">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-lg text-[#16324F]">For Pharmacies</h3>
                <p className="text-xs text-[#668096] leading-relaxed mt-1">
                  Intelligent inventory management, batch-level tracking, waste risk rankings, and automated reorder buffer calculations.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onEnterPlatform('PHARMACY')}
                className="w-full py-2 rounded-btn bg-[#087E8B] hover:bg-[#066570] text-white text-xs font-bold transition-colors"
              >
                Launch Pharmacy Hub
              </button>
            </div>

            {/* For Healthcare Orgs */}
            <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#668096]/15 shadow-card space-y-3 flex flex-col justify-between">
              <div>
                <div className="p-2.5 rounded-xl bg-[#EEF5FA] text-[#3A9D74] w-fit mb-3">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-lg text-[#16324F]">For Healthcare Networks</h3>
                <p className="text-xs text-[#668096] leading-relaxed mt-1">
                  Geospatial supply-demand balance maps, multi-district logistics rebalancing, and regulatory waste audit reports.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onEnterPlatform('PHARMACY')}
                className="w-full py-2 rounded-btn bg-[#F6FAFA] hover:bg-[#EEF5FA] text-[#16324F] text-xs font-bold transition-colors"
              >
                Inspect Zonal Intelligence
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* CLOSING CALL TO ACTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#16324F] text-white text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
            "Make every medicine count."
          </h2>
          <p className="text-sm text-[#668096] max-w-lg mx-auto">
            Experience the complete Phase 2 MedEasy platform now. No logins required for demo evaluation.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onEnterPlatform('PHARMACY')}
              className="px-6 py-3.5 rounded-btn bg-[#087E8B] hover:bg-[#12A4A6] text-white text-sm font-bold shadow-card transition-all"
            >
              Enter Pharmacy Analytics
            </button>
            <button
              type="button"
              onClick={() => onEnterPlatform('PATIENT')}
              className="px-6 py-3.5 rounded-btn bg-[#FFFFFF] hover:bg-[#EEF5FA] text-[#16324F] text-sm font-bold shadow-card transition-all"
            >
              Enter Patient Experience
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 sm:px-6 lg:px-8 bg-[#FFFFFF] border-t border-[#668096]/15 text-xs text-[#668096]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <MedEasyLogo size="sm" showTagline={true} />
          <p className="text-[11px]">
            MedEasy is non-diagnostic and non-prescriptive. Designed for medicine inventory visibility and adherence coordination.
          </p>
        </div>
      </footer>

    </div>
  );
};
