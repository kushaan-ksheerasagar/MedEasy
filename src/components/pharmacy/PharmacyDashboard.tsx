import React, { useState } from 'react';
import { Medicine } from '../../types/inventory';
import { OverviewTab } from './OverviewTab';
import { InventoryTab } from './InventoryTab';
import { DemandIntelligenceTab } from './DemandIntelligenceTab';
import { WasteRiskTab } from './WasteRiskTab';
import { ExpiryTab } from './ExpiryTab';
import { LocationsTab } from './LocationsTab';
import { PatientsTab } from './PatientsTab';
import { AlertsTab } from './AlertsTab';
import { ReportsTab } from './ReportsTab';
import { SettingsTab } from './SettingsTab';
import { DisposalManagementTab } from './DisposalManagementTab';
import { MedicineDetailDrawer } from './MedicineDetailDrawer';
import { 
  LayoutDashboard, 
  Package, 
  TrendingUp, 
  Trash2, 
  CalendarClock, 
  MapPin, 
  Users, 
  Bell, 
  FileText, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';

interface PharmacyDashboardProps {
  selectedMedicine?: Medicine | null;
  onSelectMedicine?: (med: Medicine | null) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const PharmacyDashboard: React.FC<PharmacyDashboardProps> = ({
  selectedMedicine: propSelectedMed,
  onSelectMedicine: propOnSelectMed,
  activeTab: propActiveTab,
  onTabChange: propOnTabChange,
}) => {
  const [internalTab, setInternalTab] = useState<string>('overview');
  const [internalSelectedMed, setInternalSelectedMed] = useState<Medicine | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeTab = propActiveTab !== undefined ? propActiveTab : internalTab;
  const setActiveTab = (tab: string) => {
    if (propOnTabChange) propOnTabChange(tab);
    else setInternalTab(tab);
  };

  const selectedMedicine = propSelectedMed !== undefined ? propSelectedMed : internalSelectedMed;
  const setSelectedMedicine = (med: Medicine | null) => {
    if (propOnSelectMed) propOnSelectMed(med);
    else setInternalSelectedMed(med);
  };

  const mainNavItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'demand', label: 'Demand', icon: TrendingUp },
    { id: 'waste', label: 'Waste Risk', icon: Trash2 },
    { id: 'disposal', label: 'Disposal Mgmt', icon: ShieldCheck, badge: '5' },
    { id: 'expiry', label: 'Expiry', icon: CalendarClock },
    { id: 'locations', label: 'Locations', icon: MapPin },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  const bottomNavItems = [
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: '6' },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex flex-col md:flex-row bg-[#F6FAFA]">
      
      {/* Mobile Toggle Bar */}
      <div className="md:hidden bg-[#FFFFFF] border-b border-[#668096]/15 p-3 flex items-center justify-between">
        <span className="text-xs font-bold text-[#16324F] uppercase tracking-wider">
          {[...mainNavItems, ...bottomNavItems].find(n => n.id === activeTab)?.label}
        </span>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg border border-[#668096]/20 text-[#16324F]"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Persistent Left Sidebar (240-260px or Collapsible to 72px) */}
      <aside 
        className={`bg-[#FFFFFF] border-r border-[#668096]/15 shrink-0 p-3 flex flex-col justify-between transition-all duration-300 ${
          isSidebarCollapsed ? 'md:w-20' : 'md:w-60'
        } ${mobileMenuOpen ? 'block' : 'hidden md:flex'}`}
      >
        <div className="space-y-4">
          
          {/* Collapse button header */}
          <div className="hidden md:flex items-center justify-between px-2 pt-1">
            {!isSidebarCollapsed && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#668096]">
                Analytics Workspace
              </span>
            )}
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-lg text-[#668096] hover:text-[#16324F] hover:bg-[#EEF5FA] transition-colors ml-auto"
              title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Main Navigation Items */}
          <nav className="space-y-1">
            {mainNavItems.map(item => {
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
                  title={isSidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative group ${
                    isActive
                      ? 'bg-[#EAF7F6] text-[#087E8B] shadow-subtle border border-[#7CC9C3]/30'
                      : 'text-[#668096] hover:bg-[#EEF5FA] hover:text-[#16324F]'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#087E8B]' : 'text-[#668096]'}`} />
                  
                  {!isSidebarCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}

                  {/* Tooltip on Collapsed */}
                  {isSidebarCollapsed && (
                    <div className="absolute left-full ml-2 px-2.5 py-1 bg-[#16324F] text-white text-[11px] font-bold rounded-md shadow-card opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="pt-2 border-t border-[#668096]/15">
            {!isSidebarCollapsed && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#668096] px-2 block mb-2">
                Operations
              </span>
            )}
            <nav className="space-y-1">
              {bottomNavItems.map(item => {
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
                    title={isSidebarCollapsed ? item.label : undefined}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative group ${
                      isActive
                        ? 'bg-[#EAF7F6] text-[#087E8B] shadow-subtle border border-[#7CC9C3]/30'
                        : 'text-[#668096] hover:bg-[#EEF5FA] hover:text-[#16324F]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#087E8B]' : 'text-[#668096]'}`} />
                      {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {item.badge && !isSidebarCollapsed && (
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-[#D95D5D]/15 text-[#D95D5D]">
                        {item.badge}
                      </span>
                    )}

                    {/* Tooltip on Collapsed */}
                    {isSidebarCollapsed && (
                      <div className="absolute left-full ml-2 px-2.5 py-1 bg-[#16324F] text-white text-[11px] font-bold rounded-md shadow-card opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                        {item.label}
                      </div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Profile / Node status */}
        <div className="pt-4 border-t border-[#668096]/15">
          {!isSidebarCollapsed ? (
            <div className="p-2.5 rounded-xl bg-[#F6FAFA] border border-[#668096]/10 text-xs">
              <p className="font-bold text-[#16324F] truncate">MedEasy Node #402</p>
              <p className="text-[11px] text-[#668096]">North Central Network</p>
              <span className="text-[10px] text-[#3A9D74] font-bold flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3A9D74]"></span>
                Live Telemetry Active
              </span>
            </div>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-[#F6FAFA] border border-[#668096]/15 flex items-center justify-center text-[#087E8B] mx-auto" title="MedEasy Node #402 (Active)">
              <span className="w-2 h-2 rounded-full bg-[#3A9D74]"></span>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {activeTab === 'overview' && (
          <OverviewTab 
            onSelectMedicine={(med) => setSelectedMedicine(med)} 
            onNavigateTab={(tab) => setActiveTab(tab)} 
          />
        )}
        {activeTab === 'inventory' && (
          <InventoryTab onSelectMedicine={(med) => setSelectedMedicine(med)} />
        )}
        {activeTab === 'demand' && (
          <DemandIntelligenceTab 
            onSelectMedicine={(med) => setSelectedMedicine(med)} 
            onNavigateTab={(tab) => setActiveTab(tab)} 
          />
        )}
        {activeTab === 'waste' && (
          <WasteRiskTab onSelectMedicine={(med) => setSelectedMedicine(med)} />
        )}
        {activeTab === 'disposal' && (
          <DisposalManagementTab />
        )}
        {activeTab === 'expiry' && (
          <ExpiryTab onSelectMedicine={(med) => setSelectedMedicine(med)} />
        )}
        {activeTab === 'locations' && <LocationsTab />}
        {activeTab === 'patients' && <PatientsTab />}
        {activeTab === 'alerts' && (
          <AlertsTab onSelectMedicine={(med) => setSelectedMedicine(med)} />
        )}
        {activeTab === 'reports' && <ReportsTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </main>

      {/* Slide-over Right Detail Drawer */}
      <MedicineDetailDrawer
        medicine={selectedMedicine}
        onClose={() => setSelectedMedicine(null)}
      />

    </div>
  );
};
