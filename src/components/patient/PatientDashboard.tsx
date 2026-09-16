import React, { useState } from 'react';
import { PatientMedicine } from '../../types/patient';
import { PatientHomeTab } from './PatientHomeTab';
import { MyMedicinesTab } from './MyMedicinesTab';
import { RefillsTab } from './RefillsTab';
import { ExpiryWarningTab } from './ExpiryWarningTab';
import { SafeDisposalTab } from './SafeDisposalTab';
import { PatientProfileTab } from './PatientProfileTab';
import { PatientMedicineDetailModal } from './PatientMedicineDetailModal';
import { patientService } from '../../services/patientService';
import { 
  Sun, 
  Pill, 
  RefreshCw, 
  AlertTriangle, 
  User, 
  History, 
  CheckCircle2,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';

interface PatientDashboardProps {
  selectedMedicine?: PatientMedicine | null;
  onSelectMedicine?: (med: PatientMedicine | null) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  selectedMedicine: propSelectedMed,
  onSelectMedicine: propOnSelectMed,
  activeTab: propActiveTab,
  onTabChange: propOnTabChange,
}) => {
  const [internalTab, setInternalTab] = useState<string>('home');
  const [internalSelectedMed, setInternalSelectedMed] = useState<PatientMedicine | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeTab = propActiveTab !== undefined ? propActiveTab : internalTab;
  const setActiveTab = (tab: string) => {
    if (propOnTabChange) propOnTabChange(tab);
    else setInternalTab(tab);
  };

  const selectedMedicine = propSelectedMed !== undefined ? propSelectedMed : internalSelectedMed;
  const setSelectedMedicine = (med: PatientMedicine | null) => {
    if (propOnSelectMed) propOnSelectMed(med);
    else setInternalSelectedMed(med);
  };

  const navItems = [
    { id: 'home', label: 'Today (Home)', icon: Sun },
    { id: 'my-medicines', label: 'My Medicines', icon: Pill },
    { id: 'refills', label: 'Refill Center', icon: RefreshCw, badge: '1 Due' },
    { id: 'safe-disposal', label: 'Safe Disposal', icon: ShieldCheck, badge: 'Take-Back' },
    { id: 'expiry', label: 'Expiry & Take-Back', icon: AlertTriangle, badge: '1 Soon' },
    { id: 'history', label: 'Adherence Log', icon: History },
    { id: 'profile', label: 'Profile & Caregiver', icon: User },
  ];

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex flex-col md:flex-row bg-[#F6FAFA]">
      
      {/* Mobile Bar */}
      <div className="md:hidden bg-[#FFFFFF] border-b border-[#668096]/15 p-3 flex items-center justify-between">
        <span className="text-xs font-bold text-[#16324F]">
          {navItems.find(n => n.id === activeTab)?.label}
        </span>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg border border-[#668096]/20 text-[#16324F]"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation (Calm & Accessible) */}
      <aside className={`md:w-60 bg-[#FFFFFF] border-r border-[#668096]/15 shrink-0 p-4 space-y-2 ${
        mobileMenuOpen ? 'block' : 'hidden md:block'
      }`}>
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#668096] px-3 py-1">
          Patient Portal
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-btn text-xs font-bold transition-all ${
                isActive
                  ? 'bg-[#EAF7F6] text-[#087E8B] border border-[#7CC9C3]/40 shadow-subtle'
                  : 'text-[#668096] hover:bg-[#EEF5FA] hover:text-[#16324F]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#087E8B]' : 'text-[#668096]'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#E9A23B]/15 text-[#E9A23B]">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-6 mt-6 border-t border-[#668096]/15 px-3 text-xs text-[#668096] space-y-2">
          <div className="flex items-center gap-2 font-bold text-[#16324F]">
            <CheckCircle2 className="w-4 h-4 text-[#3A9D74]" />
            <span>Primary Pharmacy</span>
          </div>
          <p className="text-[11px] text-[#668096]">Central Valley Community Pharmacy</p>
          <p className="text-[11px] text-[#087E8B] font-bold">+1 (555) 019-2831</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
        {activeTab === 'home' && (
          <PatientHomeTab
            onSelectMedicine={(med) => setSelectedMedicine(med)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}
        {activeTab === 'my-medicines' && (
          <MyMedicinesTab
            onSelectMedicine={(med) => setSelectedMedicine(med)}
          />
        )}
        {activeTab === 'refills' && (
          <RefillsTab
            onSelectMedicine={(med) => setSelectedMedicine(med)}
          />
        )}
        {activeTab === 'safe-disposal' && (
          <SafeDisposalTab />
        )}
        {activeTab === 'expiry' && (
          <ExpiryWarningTab
            onSelectMedicine={(med) => setSelectedMedicine(med)}
          />
        )}
        {activeTab === 'history' && (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div>
              <h1 className="font-heading text-2xl font-bold text-[#16324F]">Adherence History</h1>
              <p className="text-xs text-[#668096] mt-0.5 font-medium">Historical verification of completed daily doses</p>
            </div>
            <div className="bg-[#FFFFFF] rounded-card border border-[#668096]/15 p-6 shadow-subtle space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-[#668096]/10">
                <span className="text-xs font-bold text-[#16324F]">Weekly Consistency</span>
                <span className="text-xs font-bold text-[#3A9D74] bg-[#3A9D74]/10 px-2 py-0.5 rounded">94% Target Met</span>
              </div>
              <div className="space-y-2">
                {[
                  { date: 'Today (Sep 16)', taken: 'Metformin 500mg, Lisinopril 10mg', status: 'On Schedule' },
                  { date: 'Yesterday (Sep 15)', taken: 'All 3 scheduled doses confirmed', status: 'Completed' },
                  { date: 'Monday (Sep 14)', taken: 'All 3 scheduled doses confirmed', status: 'Completed' },
                  { date: 'Sunday (Sep 13)', taken: 'All 3 scheduled doses confirmed', status: 'Completed' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-[#F6FAFA] rounded-xl border border-[#668096]/10 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#16324F] block">{item.date}</span>
                      <span className="text-[#668096]">{item.taken}</span>
                    </div>
                    <span className="text-[#3A9D74] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'profile' && <PatientProfileTab />}
      </main>

      {/* Patient Medicine Detail Modal */}
      <PatientMedicineDetailModal
        medicine={selectedMedicine}
        onClose={() => setSelectedMedicine(null)}
        onStatusChange={(id, status) => {
          patientService.markMedicineStatus(id, status);
        }}
      />

    </div>
  );
};
