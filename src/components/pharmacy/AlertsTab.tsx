import React, { useState } from 'react';
import { MOCK_ALERTS } from '../../data/mockAlerts';
import { AlertItem, AlertSeverity, AlertCategory } from '../../types/alerts';
import { inventoryService } from '../../services/inventoryService';
import { Medicine } from '../../types/inventory';
import { DemoIntelligenceBanner } from '../common/DemoIntelligenceBanner';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  CheckCircle, 
  Truck, 
  ShoppingCart, 
  Tag, 
  Filter,
  Check
} from 'lucide-react';

interface AlertsTabProps {
  onSelectMedicine: (med: Medicine) => void;
}

export const AlertsTab: React.FC<AlertsTabProps> = ({ onSelectMedicine }) => {
  const [alerts, setAlerts] = useState<AlertItem[]>([...MOCK_ALERTS]);
  const [selectedSeverity, setSelectedSeverity] = useState<AlertSeverity | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<AlertCategory | 'ALL'>('ALL');

  const handleAcknowledge = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isAcknowledged: true } : a));
  };

  const handleAction = (alertItem: AlertItem) => {
    alert(`Operational action "${alertItem.actionType}" executed for ${alertItem.medicineName} at ${alertItem.location}. Task assigned to pharmacy operations.`);
    handleAcknowledge(alertItem.id);
  };

  const filteredAlerts = alerts.filter(a => {
    if (selectedSeverity !== 'ALL' && a.severity !== selectedSeverity) return false;
    if (selectedCategory !== 'ALL' && a.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Actionable Operational Alerts</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Prescription-neutral inventory alerts driving logistics, safety buffers, and waste mitigation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800">
            {alerts.filter(a => !a.isAcknowledged).length} Unacknowledged
          </span>
        </div>
      </div>

      <DemoIntelligenceBanner message="Alerts provide operational supply-chain guidance (reorders, inter-zone transfers, priority FIFO tiers). They do NOT make clinical recommendations or alter patient prescriptions." />

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-600 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Severity:
          </span>
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'] as const).map(sev => (
            <button
              key={sev}
              type="button"
              onClick={() => setSelectedSeverity(sev)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedSeverity === sev
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
          >
            <option value="ALL">All Categories ({alerts.length})</option>
            <option value="STOCKOUT_RISK">Stockout Risk</option>
            <option value="WASTE_RISK">Waste Risk</option>
            <option value="EXPIRY_APPROACHING">Expiry Approaching</option>
            <option value="DEMAND_SPIKE">Demand Spike</option>
            <option value="UNUSUAL_CONSUMPTION">Unusual Consumption</option>
          </select>
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400">
            <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No active alerts matching filter criteria</p>
          </div>
        ) : (
          filteredAlerts.map(alertItem => {
            const med = inventoryService.getById(alertItem.medicineId);
            return (
              <div
                key={alertItem.id}
                className={`p-5 rounded-2xl border transition-all ${
                  alertItem.isAcknowledged
                    ? 'bg-slate-50/70 border-slate-200 opacity-60'
                    : alertItem.severity === 'CRITICAL'
                    ? 'bg-white border-rose-200 shadow-xs ring-1 ring-rose-500/10'
                    : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                        alertItem.severity === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800'
                          : alertItem.severity === 'HIGH'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {alertItem.severity}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {alertItem.category.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {alertItem.medicineName}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500">{alertItem.location}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 pt-1">{alertItem.headline}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{alertItem.reason}</p>

                    <div className="mt-2 text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
                      <strong className="text-brand-900">Suggested Operational Action: </strong>
                      {alertItem.suggestedOperationalAction}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0">
                    <span className="text-xs text-slate-400">{alertItem.timestamp}</span>
                    <span className="text-xs font-bold text-brand-700">{alertItem.impactMetric}</span>

                    <div className="flex items-center gap-2 mt-2">
                      {med && (
                        <button
                          type="button"
                          onClick={() => onSelectMedicine(med)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
                        >
                          View SKU
                        </button>
                      )}

                      {!alertItem.isAcknowledged ? (
                        <button
                          type="button"
                          onClick={() => handleAction(alertItem)}
                          className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                        >
                          {alertItem.actionType === 'TRANSFER' && <Truck className="w-3.5 h-3.5" />}
                          {alertItem.actionType === 'REORDER' && <ShoppingCart className="w-3.5 h-3.5" />}
                          {alertItem.actionType === 'CLEARANCE' && <Tag className="w-3.5 h-3.5" />}
                          Execute Action
                        </button>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg">
                          <Check className="w-3.5 h-3.5" /> Acknowledged
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
