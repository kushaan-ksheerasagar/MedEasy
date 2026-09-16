import React, { useState } from 'react';
import { DemoIntelligenceBanner } from '../common/DemoIntelligenceBanner';
import { Sliders, Bell, Shield, Database, Save, Check } from 'lucide-react';

export const SettingsTab: React.FC = () => {
  const [safetyBufferDays, setSafetyBufferDays] = useState('14');
  const [wasteThresholdDays, setWasteThresholdDays] = useState('60');
  const [autoRebalance, setAutoRebalance] = useState(true);
  const [coldChainAlerts, setColdChainAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Organization System Settings</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure safety buffers, automated rebalancing policies, and intelligence engine thresholds
        </p>
      </div>

      <DemoIntelligenceBanner />

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        
        {/* Thresholds */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-brand-600" />
            Inventory & Safety Thresholds
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Safety Stock Minimum Run-rate Buffer (Days)
              </label>
              <input
                type="number"
                value={safetyBufferDays}
                onChange={(e) => setSafetyBufferDays(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
              />
              <p className="text-[11px] text-slate-400 mt-1">Alert triggers when supply dips below this threshold.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Waste Risk Horizon Warning (Days to Expiry)
              </label>
              <input
                type="number"
                value={wasteThresholdDays}
                onChange={(e) => setWasteThresholdDays(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
              />
              <p className="text-[11px] text-slate-400 mt-1">Evaluates batches expiring within this number of days.</p>
            </div>
          </div>
        </div>

        {/* Automated Intelligence Actions */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-brand-600" />
            Automation & Telemetry Preferences
          </h3>

          <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 cursor-pointer">
            <div>
              <p className="text-xs font-bold text-slate-900">Inter-Zone Stock Rebalancing Suggestions</p>
              <p className="text-[11px] text-slate-500">Automatically propose vehicle routes from surplus zones to stockout zones</p>
            </div>
            <input
              type="checkbox"
              checked={autoRebalance}
              onChange={(e) => setAutoRebalance(e.target.checked)}
              className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 cursor-pointer">
            <div>
              <p className="text-xs font-bold text-slate-900">Cold-Chain Temperature Warning Dispatch</p>
              <p className="text-[11px] text-slate-500">Immediate critical notification on biologic / vaccine storage excursion</p>
            </div>
            <input
              type="checkbox"
              checked={coldChainAlerts}
              onChange={(e) => setColdChainAlerts(e.target.checked)}
              className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
            />
          </label>
        </div>

        {/* Save button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">Settings are persisted locally in Phase 1 prototype</span>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? 'Saved Successfully' : 'Save Preferences'}
          </button>
        </div>

      </div>
    </div>
  );
};
