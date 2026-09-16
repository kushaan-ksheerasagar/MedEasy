import React from 'react';
import { Medicine } from '../../types/inventory';
import { StatusBadge } from '../common/StatusBadge';
import { X, Calendar, MapPin, AlertTriangle, TrendingUp, ShieldAlert, Truck, Tag, RefreshCw, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

interface MedicineDetailModalProps {
  medicine: Medicine | null;
  onClose: () => void;
  onActionTriggered?: (action: string) => void;
}

export const MedicineDetailModal: React.FC<MedicineDetailModalProps> = ({
  medicine,
  onClose,
  onActionTriggered
}) => {
  if (!medicine) return null;

  // Build chart data: Current Stock vs Historical Monthly Demand vs Projected 90-Day Demand
  const chartData = [
    {
      category: 'Current Stock',
      Units: medicine.totalStock,
      fill: '#38bdf8' // Sky
    },
    {
      category: 'Monthly Demand (Avg)',
      Units: medicine.monthlyDemand,
      fill: '#10b981' // Emerald
    },
    {
      category: 'Projected 90d Demand',
      Units: medicine.projectedDemandNext90Days,
      fill: '#8b5cf6' // Violet
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-start justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900">{medicine.name}</h2>
              <StatusBadge status={medicine.stockStatus} />
              <StatusBadge status={medicine.wasteRiskLevel} size="sm" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Generic: <span className="font-medium text-slate-700">{medicine.genericName}</span> • Form: <span className="font-medium text-slate-700">{medicine.form}</span> • Class: <span className="font-medium text-slate-700">{medicine.therapeuticClass}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Flagging Explanation Section (User Prompt Requirement) */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-700 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2">
                  Why is this medicine flagged?
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-amber-200/80 text-amber-800">
                    Intelligence Analysis
                  </span>
                </h4>
                <p className="text-sm font-semibold text-slate-800 mt-1">
                  {medicine.flagReason || `Current inventory is 2.3× projected demand before the earliest batch expiry.`}
                </p>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {medicine.flagDetails || `With an estimated consumption velocity of ${medicine.stockVelocity} units/day, current stocks will outlast the earliest batch expiration date without proactive rebalancing.`}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-medium text-slate-500">Current Inventory</span>
              <p className="text-xl font-bold text-slate-900 mt-1">{medicine.totalStock.toLocaleString()} <span className="text-xs font-normal text-slate-500">units</span></p>
              <p className="text-[11px] text-slate-500 mt-0.5">${(medicine.totalStock * medicine.unitPrice).toLocaleString()} value</p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-medium text-slate-500">Stock Velocity</span>
              <p className="text-xl font-bold text-slate-900 mt-1">{medicine.stockVelocity} <span className="text-xs font-normal text-slate-500">units/day</span></p>
              <p className="text-[11px] text-slate-500 mt-0.5">{medicine.daysOfSupplyRemaining} days of supply</p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-medium text-slate-500">Earliest Expiry</span>
              <p className="text-xl font-bold text-slate-900 mt-1">{medicine.earliestDaysToExpiry} <span className="text-xs font-normal text-slate-500">days</span></p>
              <p className="text-[11px] text-slate-500 mt-0.5">{medicine.earliestExpiryDate}</p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-medium text-slate-500">Monthly Demand</span>
              <p className="text-xl font-bold text-slate-900 mt-1">{medicine.monthlyDemand.toLocaleString()} <span className="text-xs font-normal text-slate-500">units</span></p>
              <p className={`text-[11px] font-medium mt-0.5 ${medicine.demandTrendPercent >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {medicine.demandTrendPercent >= 0 ? '+' : ''}{medicine.demandTrendPercent}% trend
              </p>
            </div>
          </div>

          {/* Chart Section: Current Stock vs Historical Demand vs Projected Demand */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-brand-600" />
                  Stock vs Demand Projection
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">Comparing current physical holdings with monthly baseline and 90-day projected absorption</p>
              </div>
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="category" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', border: 'none', fontSize: '12px' }}
                    formatter={(val: number) => [`${val.toLocaleString()} units`, 'Volume']}
                  />
                  <Bar dataKey="Units" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Batch Breakdown Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">Batch-Level Inventory & Location</h4>
              <span className="text-xs text-slate-500">{medicine.batches.length} batch(es) tracked</span>
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                  <tr>
                    <th className="px-4 py-2.5">Batch #</th>
                    <th className="px-4 py-2.5">Location</th>
                    <th className="px-4 py-2.5">Expiry Date</th>
                    <th className="px-4 py-2.5">Days to Expiry</th>
                    <th className="px-4 py-2.5">Remaining / Initial</th>
                    <th className="px-4 py-2.5 text-right">Unit Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {medicine.batches.map(b => (
                    <tr key={b.batchNumber} className="hover:bg-slate-50/60">
                      <td className="px-4 py-2.5 font-mono font-medium text-slate-800">{b.batchNumber}</td>
                      <td className="px-4 py-2.5 text-slate-600 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {b.locationName}
                      </td>
                      <td className="px-4 py-2.5 text-slate-800">{b.expiryDate}</td>
                      <td className="px-4 py-2.5">
                        <span className={`font-semibold ${b.daysToExpiry <= 45 ? 'text-rose-600' : b.daysToExpiry <= 90 ? 'text-amber-600' : 'text-slate-700'}`}>
                          {b.daysToExpiry} days
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-slate-700 font-medium">
                        {b.remainingQuantity} / {b.initialQuantity} units
                      </td>
                      <td className="px-4 py-2.5 text-right font-medium text-slate-800">${b.unitCost.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Clinical Specifications */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <p><span className="font-semibold text-slate-800">Active Ingredients:</span> {medicine.activeIngredients}</p>
            <p><span className="font-semibold text-slate-800">Storage Specification:</span> {medicine.storage}</p>
            <p><span className="font-semibold text-slate-800">Reorder Safety Threshold:</span> Safety buffer is {medicine.safetyStock} units; automatic reorder triggers at {medicine.reorderPoint} units.</p>
          </div>

        </div>

        {/* Action Buttons Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Last inventory audit: <span className="font-medium text-slate-700">{medicine.lastUpdated}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                alert(`Inter-Zone transfer requested for ${medicine.name}. Allocation request dispatched to Logistics.`);
                onActionTriggered?.('transfer');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
            >
              <Truck className="w-3.5 h-3.5 text-brand-600" />
              Transfer Stock
            </button>
            <button
              type="button"
              onClick={() => {
                alert(`Dispensing tier updated for ${medicine.name}. FIFO prioritised across partner clinics.`);
                onActionTriggered?.('tier');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
            >
              <Tag className="w-3.5 h-3.5 text-amber-600" />
              Priority Dispense Tier
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 shadow-xs"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
