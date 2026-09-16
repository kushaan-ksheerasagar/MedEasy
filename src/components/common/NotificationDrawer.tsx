import React, { useState } from 'react';
import { X, Bell, ShieldAlert, AlertTriangle, Clock, TrendingUp, Users, Check, ExternalLink } from 'lucide-react';
import { MOCK_ALERTS } from '../../data/mockAlerts';
import { AlertItem } from '../../types/alerts';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAlert?: (alert: AlertItem) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onSelectAlert,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [alerts, setAlerts] = useState<AlertItem[]>([...MOCK_ALERTS]);

  if (!isOpen) return null;

  const categories = [
    { id: 'ALL', label: 'All' },
    { id: 'STOCKOUT_RISK', label: 'Inventory' },
    { id: 'DEMAND_SPIKE', label: 'Demand' },
    { id: 'EXPIRY_APPROACHING', label: 'Expiry' },
    { id: 'WASTE_RISK', label: 'Waste' },
  ];

  const filtered = alerts.filter(a => activeCategory === 'ALL' || a.category === activeCategory);

  const markAllRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, isAcknowledged: true })));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#16324F]/30 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div className="bg-[#FFFFFF] w-full max-w-md h-full shadow-drawer border-l border-[#668096]/20 flex flex-col animate-drawer">
        
        {/* Header */}
        <div className="p-5 border-b border-[#668096]/15 flex items-center justify-between bg-[#F6FAFA]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#087E8B]/10 text-[#087E8B]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-[#16324F]">Smart Notifications</h3>
              <p className="text-xs text-[#668096]">Urgency & impact prioritised feed</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#668096] hover:text-[#16324F] hover:bg-[#FFFFFF] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="p-3 border-b border-[#668096]/10 flex items-center justify-between gap-2 overflow-x-auto bg-[#FFFFFF]">
          <div className="flex items-center gap-1.5">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-[#087E8B] text-white shadow-subtle'
                    : 'bg-[#EEF5FA] text-[#668096] hover:bg-[#EAF7F6] hover:text-[#16324F]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={markAllRead}
            className="text-[11px] text-[#087E8B] font-semibold hover:underline shrink-0"
          >
            Mark all read
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.map(item => (
            <div
              key={item.id}
              onClick={() => onSelectAlert?.(item)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                item.isAcknowledged
                  ? 'bg-[#FFFFFF] border-[#668096]/15 opacity-60'
                  : item.severity === 'CRITICAL'
                  ? 'bg-[#D95D5D]/5 border-[#D95D5D]/30 shadow-subtle'
                  : 'bg-[#FFFFFF] border-[#668096]/20 shadow-subtle hover:border-[#087E8B]/40'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      item.severity === 'CRITICAL'
                        ? 'bg-[#D95D5D]/15 text-[#D95D5D]'
                        : item.severity === 'HIGH'
                        ? 'bg-[#E9A23B]/15 text-[#E9A23B]'
                        : 'bg-[#087E8B]/10 text-[#087E8B]'
                    }`}
                  >
                    {item.severity}
                  </span>
                  <span className="text-xs font-bold text-[#16324F]">{item.medicineName}</span>
                </div>
                <span className="text-[10px] text-[#668096]">{item.timestamp}</span>
              </div>

              <h4 className="text-xs font-bold text-[#16324F] mt-2">{item.headline}</h4>
              <p className="text-xs text-[#668096] mt-1 leading-relaxed">{item.reason}</p>

              <div className="mt-2 text-[11px] p-2 rounded-lg bg-[#F6FAFA] border border-[#668096]/10 text-[#16324F]">
                <strong className="text-[#087E8B]">Action: </strong> {item.suggestedOperationalAction}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#F6FAFA] border-t border-[#668096]/15 text-[11px] text-[#668096] flex items-center justify-between">
          <span>Priority dispatch engine connected</span>
          <span className="font-mono text-[#087E8B]">MedEasy SafeSync</span>
        </div>

      </div>
    </div>
  );
};
