import React, { useState, useEffect } from 'react';
import { Header, AppViewMode } from './components/common/Header';
import { PharmacyDashboard } from './components/pharmacy/PharmacyDashboard';
import { PatientDashboard } from './components/patient/PatientDashboard';
import { LandingPage } from './components/landing/LandingPage';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { MedicineDetailDrawer } from './components/pharmacy/MedicineDetailDrawer';
import { inventoryService } from './services/inventoryService';
import { Medicine } from './types/inventory';
import { Sparkles, HeartPulse, Activity } from 'lucide-react';

export const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<AppViewMode>('PHARMACY');
  const [highlightedMedicine, setHighlightedMedicine] = useState<Medicine | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [pharmacyTab, setPharmacyTab] = useState<string>('overview');

  // Listen for global Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Quick Demo Scenarios Trigger
  const scenarios = [
    { label: '1. High Demand + Low Stock', id: 'med-01', desc: 'Amoxicillin: 6 days runway' },
    { label: '2. Low Demand + Excess Stock', id: 'med-06', desc: 'Doxycycline: 272 days supply' },
    { label: '3. Approaching Expiry (High Waste)', id: 'med-02', desc: 'Atorvastatin: 520 units at risk' },
    { label: '4. Balanced Inventory', id: 'med-04', desc: 'Metformin: Optimal equilibrium' },
    { label: '5. Sudden Demand Surge', id: 'med-03', desc: 'Paracetamol: +24.8% spike' },
    { label: '6. Multi-Batch Differing Expiries', id: 'med-05', desc: 'Insulin Glargine: 3 distinct batches' },
  ];

  const handleTriggerScenario = (medId: string) => {
    setCurrentMode('PHARMACY');
    const med = inventoryService.getById(medId);
    if (med) {
      setHighlightedMedicine(med);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6FAFA] flex flex-col font-sans text-[#16324F] selection:bg-[#087E8B] selection:text-white">
      
      {/* If Landing Page mode, show full marketing experience */}
      {currentMode === 'LANDING' ? (
        <LandingPage onEnterPlatform={(role) => setCurrentMode(role)} />
      ) : (
        <>
          {/* Main Application Shell Header */}
          <Header
            currentRole={currentMode}
            onRoleChange={(role) => setCurrentMode(role)}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenNotifications={() => setIsNotificationOpen(true)}
            activeBreadcrumb={currentMode === 'PHARMACY' ? pharmacyTab : 'My Plan'}
          />

          {/* Demo Scenario Fast-Switcher Strip */}
          <div className="bg-[#16324F] text-white px-4 py-2 border-b border-[#668096]/20 text-xs">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold uppercase tracking-wider text-[10px] bg-[#087E8B]/40 text-[#7CC9C3] border border-[#7CC9C3]/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#E9A23B]" />
                  MedEasy Demo Scenarios
                </span>
                <span className="text-slate-300 text-[11px] hidden sm:inline">Jump to constructed supply scenarios:</span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                {scenarios.map((sc) => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => handleTriggerScenario(sc.id)}
                    title={sc.desc}
                    className="px-2.5 py-1 rounded-lg bg-[#FFFFFF]/10 hover:bg-[#FFFFFF]/20 text-[11px] font-semibold text-slate-200 border border-[#668096]/30 hover:border-white/40 transition-colors whitespace-nowrap"
                  >
                    {sc.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dashboard Area */}
          <div className="flex-1">
            {currentMode === 'PHARMACY' ? (
              <PharmacyDashboard
                activeTab={pharmacyTab}
                onTabChange={(t) => setPharmacyTab(t)}
                selectedMedicine={highlightedMedicine}
                onSelectMedicine={(m) => setHighlightedMedicine(m)}
              />
            ) : (
              <PatientDashboard />
            )}
          </div>

          {/* Footer */}
          <footer className="bg-[#FFFFFF] border-t border-[#668096]/15 py-4 px-6 text-center text-xs text-[#668096]">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#087E8B]"></div>
                <span className="font-heading font-bold text-[#16324F]">MedEasy</span>
                <span>— Medicine management, made easy.</span>
              </div>
              <p className="text-[11px]">
                Track → Understand → Predict → Act • Non-diagnostic & Non-prescriptive
              </p>
            </div>
          </footer>
        </>
      )}

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectMedicine={(med) => {
          setCurrentMode('PHARMACY');
          setHighlightedMedicine(med);
        }}
        onSelectEntity={(type, entity) => {
          if (type === 'patient') {
            setCurrentMode('PATIENT');
          } else if (type === 'zone') {
            setCurrentMode('PHARMACY');
            setPharmacyTab('locations');
          }
        }}
      />

      {/* Smart Notification Center Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onSelectAlert={(alert) => {
          setIsNotificationOpen(false);
          setCurrentMode('PHARMACY');
          setPharmacyTab('alerts');
        }}
      />

      {/* Global Medicine Detail Drawer */}
      <MedicineDetailDrawer
        medicine={highlightedMedicine}
        onClose={() => setHighlightedMedicine(null)}
      />

    </div>
  );
};
