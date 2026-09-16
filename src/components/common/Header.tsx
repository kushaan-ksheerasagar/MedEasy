import React from 'react';
import { MedEasyLogo } from './MedEasyLogo';
import { 
  Search, 
  Bell, 
  User, 
  Building2, 
  Sparkles, 
  Home, 
  ChevronRight,
  SlidersHorizontal
} from 'lucide-react';

export type AppViewMode = 'PHARMACY' | 'PATIENT' | 'LANDING';

interface HeaderProps {
  currentRole: AppViewMode;
  onRoleChange: (role: AppViewMode) => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  activeBreadcrumb?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onOpenSearch,
  onOpenNotifications,
  activeBreadcrumb,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FFFFFF] border-b border-[#668096]/15 shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo & Breadcrumbs */}
          <div className="flex items-center gap-4">
            <button 
              type="button" 
              onClick={() => onRoleChange('LANDING')}
              className="hover:opacity-90 transition-opacity"
            >
              <MedEasyLogo size="md" showTagline={false} />
            </button>

            {/* Breadcrumbs */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#668096] pl-2 border-l border-[#668096]/20">
              <span className="font-semibold text-[#16324F]">
                {currentRole === 'PHARMACY' ? 'Pharmacy Hub' : currentRole === 'PATIENT' ? 'Patient Portal' : 'Public'}
              </span>
              {activeBreadcrumb && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-[#668096]" />
                  <span className="capitalize">{activeBreadcrumb}</span>
                </>
              )}
            </div>
          </div>

          {/* Center: Global Search Trigger Button */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <button
              type="button"
              onClick={onOpenSearch}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-btn bg-[#F6FAFA] hover:bg-[#EEF5FA] border border-[#668096]/20 text-xs text-[#668096] shadow-subtle transition-all"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#087E8B]" />
                <span>Search medicine, batch, patient, or zone...</span>
              </div>
              <kbd className="hidden sm:inline-block font-mono text-[10px] text-[#668096] bg-[#FFFFFF] px-1.5 py-0.5 rounded border border-[#668096]/20">
                Ctrl+K
              </kbd>
            </button>
          </div>

          {/* Right Controls: Role Switcher, Search Icon (Mobile), Notifications, Profile */}
          <div className="flex items-center gap-3">
            
            {/* Mobile Search Button */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="md:hidden p-2 rounded-btn bg-[#F6FAFA] text-[#16324F] border border-[#668096]/20"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Role Switcher Pill */}
            <div className="flex items-center bg-[#F6FAFA] p-1 rounded-btn border border-[#668096]/20">
              <button
                type="button"
                onClick={() => onRoleChange('PHARMACY')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentRole === 'PHARMACY'
                    ? 'bg-[#FFFFFF] text-[#087E8B] shadow-subtle ring-1 ring-[#668096]/15'
                    : 'text-[#668096] hover:text-[#16324F]'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pharmacy Hub</span>
              </button>
              <button
                type="button"
                onClick={() => onRoleChange('PATIENT')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentRole === 'PATIENT'
                    ? 'bg-[#FFFFFF] text-[#087E8B] shadow-subtle ring-1 ring-[#668096]/15'
                    : 'text-[#668096] hover:text-[#16324F]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Patient Portal</span>
              </button>
            </div>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={onOpenNotifications}
              className="p-2 rounded-btn bg-[#F6FAFA] hover:bg-[#EEF5FA] border border-[#668096]/20 text-[#16324F] relative transition-colors"
              title="Smart Notifications"
            >
              <Bell className="w-4 h-4 text-[#16324F]" />
              <span className="w-2 h-2 rounded-full bg-[#D95D5D] absolute top-1.5 right-1.5 ring-2 ring-[#FFFFFF]"></span>
            </button>

            {/* Landing Page Home Link */}
            <button
              type="button"
              onClick={() => onRoleChange('LANDING')}
              className="p-2 rounded-btn bg-[#F6FAFA] hover:bg-[#EEF5FA] border border-[#668096]/20 text-[#668096] hover:text-[#16324F] transition-colors"
              title="Return to Public Landing Page"
            >
              <Home className="w-4 h-4" />
            </button>

            {/* User Profile Avatar Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-[#668096]/20">
              <div className="w-8 h-8 rounded-full bg-[#087E8B] text-white flex items-center justify-center font-bold text-xs shadow-subtle">
                {currentRole === 'PHARMACY' ? 'PH' : 'ER'}
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
