import React from 'react';
import { Medicine } from '../../types/inventory';
import { StatusBadge } from '../common/StatusBadge';
import { X, Calendar, MapPin, AlertTriangle, TrendingUp, ShieldAlert, Truck, Tag, RefreshCw, BarChart2, CheckCircle2, PackageCheck } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface MedicineDetailDrawerProps {
  medicine: Medicine | null;
  onClose: () => void;
  onActionTriggered?: (action: string) => void;
}

export const MedicineDetailDrawer: React.FC<MedicineDetailDrawerProps> = ({
  medicine,
  onClose,
  onActionTriggered
}) => {
  if (!medicine) return null;

  const chartData = [
    {
      category: 'Current Stock',
      Units: medicine.totalStock,
      fill: '#12A4A6' // Secondary Teal
    },
    {
      category: 'Monthly Demand',
      Units: medicine.monthlyDemand,
      fill: '#087E8B' // Primary Teal
    },
    {
      category: '90-Day Projection',
      Units: medicine.projectedDemandNext90Days,
      fill: '#16324F' // Deep Navy
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#16324F]/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] w-full max-w-2xl h-full shadow-drawer border-l border-[#668096]/20 flex flex-col animate-drawer overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-[#668096]/15 flex items-start justify-between bg-[#F6FAFA]">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-heading text-xl font-bold text-[#16324F]">{medicine.name}</h2>
              <StatusBadge status={medicine.stockStatus} />
              <StatusBadge status={medicine.wasteRiskLevel} size="sm" />
            </div>
            <p className="text-xs text-[#668096] mt-1 font-medium">
              {medicine.dosage} • {medicine.form} • <span className="text-[#16324F]">{medicine.therapeuticClass}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#668096] hover:text-[#16324F] hover:bg-[#FFFFFF] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Key Metrics Strip: CURRENT STOCK, DEMAND, EXPIRY, RISK */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-[#F6FAFA] rounded-xl border border-[#668096]/15">
              <span className="text-[11px] font-bold text-[#668096] uppercase tracking-wider block">Current Stock</span>
              <p className="font-heading text-xl font-extrabold text-[#16324F] mt-1">
                {medicine.totalStock.toLocaleString()} <span className="text-xs font-normal text-[#668096]">units</span>
              </p>
              <p className="text-[11px] text-[#668096] mt-0.5">${(medicine.totalStock * medicine.unitPrice).toLocaleString()} val</p>
            </div>

            <div className="p-3.5 bg-[#F6FAFA] rounded-xl border border-[#668096]/15">
              <span className="text-[11px] font-bold text-[#668096] uppercase tracking-wider block">Monthly Demand</span>
              <p className="font-heading text-xl font-extrabold text-[#16324F] mt-1">
                {medicine.monthlyDemand.toLocaleString()}
              </p>
              <p className={`text-[11px] font-semibold mt-0.5 ${medicine.demandTrendPercent >= 0 ? 'text-[#3A9D74]' : 'text-[#D95D5D]'}`}>
                {medicine.demandTrendPercent >= 0 ? '+' : ''}{medicine.demandTrendPercent}% velocity
              </p>
            </div>

            <div className="p-3.5 bg-[#F6FAFA] rounded-xl border border-[#668096]/15">
              <span className="text-[11px] font-bold text-[#668096] uppercase tracking-wider block">Earliest Expiry</span>
              <p className={`font-heading text-xl font-extrabold mt-1 ${medicine.earliestDaysToExpiry <= 45 ? 'text-[#D95D5D]' : medicine.earliestDaysToExpiry <= 90 ? 'text-[#E9A23B]' : 'text-[#16324F]'}`}>
                {medicine.earliestDaysToExpiry} <span className="text-xs font-normal text-[#668096]">days</span>
              </p>
              <p className="text-[11px] text-[#668096] mt-0.5">{medicine.earliestExpiryDate}</p>
            </div>

            <div className="p-3.5 bg-[#F6FAFA] rounded-xl border border-[#668096]/15">
              <span className="text-[11px] font-bold text-[#668096] uppercase tracking-wider block">Waste Risk</span>
              <p className="font-heading text-xl font-extrabold text-[#16324F] mt-1">
                {medicine.wasteRiskLevel}
              </p>
              <p className="text-[11px] text-[#668096] mt-0.5">{medicine.daysOfSupplyRemaining}d runway</p>
            </div>
          </div>

          {/* Section: "Why is this flagged?" (Human-readable explanation) */}
          <div className="rounded-xl border border-[#E9A23B]/30 bg-[#E9A23B]/5 p-4.5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#E9A23B]/15 text-[#E9A23B] shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-heading text-sm font-bold text-[#16324F]">
                    Why is this medicine flagged?
                  </h4>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#FFFFFF] border border-[#E9A23B]/30 text-[#E9A23B]">
                    MedEasy Explanation
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#16324F] mt-1.5 leading-relaxed">
                  {medicine.flagReason || "Current inventory is approximately 2.2× projected demand before the earliest batch expiry."}
                </p>
                <p className="text-xs text-[#668096] mt-1 leading-relaxed">
                  {medicine.flagDetails || `With daily consumption at ${medicine.stockVelocity} units/day, current stocks will outlast the earliest batch expiration date unless proactively redistributed.`}
                </p>
              </div>
            </div>
          </div>

          {/* Demand vs Inventory Graph */}
          <div className="p-5 bg-[#FFFFFF] rounded-xl border border-[#668096]/15 shadow-subtle">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-heading text-sm font-bold text-[#16324F] flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-[#087E8B]" />
                  Stock vs Demand Projection
                </h4>
                <p className="text-xs text-[#668096] mt-0.5">Comparing physical stock against monthly baseline and 90-day absorption</p>
              </div>
            </div>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF5FA" />
                  <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#668096' }} axisLine={{ stroke: '#EEF5FA' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#668096' }} axisLine={{ stroke: '#EEF5FA' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#16324F', borderRadius: '10px', color: '#fff', border: 'none', fontSize: '12px' }}
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
              <h4 className="font-heading text-sm font-bold text-[#16324F]">Batch-Level Tracking & Facility Location</h4>
              <span className="text-xs text-[#668096]">{medicine.batches.length} batch(es) registered</span>
            </div>
            <div className="border border-[#668096]/15 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F6FAFA] border-b border-[#668096]/15 text-[#668096] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-3.5 py-2.5">Batch #</th>
                    <th className="px-3.5 py-2.5">Location</th>
                    <th className="px-3.5 py-2.5">Expiry</th>
                    <th className="px-3.5 py-2.5">Days Left</th>
                    <th className="px-3.5 py-2.5">Remaining Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#668096]/10">
                  {medicine.batches.map(b => (
                    <tr key={b.batchNumber} className="hover:bg-[#F6FAFA]">
                      <td className="px-3.5 py-2.5 font-mono font-semibold text-[#16324F]">{b.batchNumber}</td>
                      <td className="px-3.5 py-2.5 text-[#668096] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#087E8B]" />
                        {b.locationName}
                      </td>
                      <td className="px-3.5 py-2.5 text-[#16324F]">{b.expiryDate}</td>
                      <td className="px-3.5 py-2.5">
                        <span className={`font-bold ${b.daysToExpiry <= 45 ? 'text-[#D95D5D]' : b.daysToExpiry <= 90 ? 'text-[#E9A23B]' : 'text-[#3A9D74]'}`}>
                          {b.daysToExpiry}d
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5 text-[#16324F] font-medium">
                        {b.remainingQuantity} / {b.initialQuantity} units
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: Recommended Operational Actions (User Prompt Requirement) */}
          <div className="space-y-2">
            <h4 className="font-heading text-sm font-bold text-[#16324F] flex items-center gap-1.5">
              <PackageCheck className="w-4 h-4 text-[#087E8B]" />
              Recommended Operational Actions
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-3 bg-[#EEF5FA] rounded-xl border border-[#668096]/15">
                <span className="font-bold text-[#16324F] block">Review Upcoming Orders</span>
                <p className="text-[11px] text-[#668096] mt-1">Check supplier order queue to avoid compounding excess buffer.</p>
              </div>
              <div className="p-3 bg-[#EEF5FA] rounded-xl border border-[#668096]/15">
                <span className="font-bold text-[#16324F] block">Review Slow-Moving Batches</span>
                <p className="text-[11px] text-[#668096] mt-1">Audit earliest expiring LOT to enforce strict FIFO dispensing.</p>
              </div>
              <div className="p-3 bg-[#EEF5FA] rounded-xl border border-[#668096]/15">
                <span className="font-bold text-[#16324F] block">Monitor Demand</span>
                <p className="text-[11px] text-[#668096] mt-1">Track regional outpatient repeat refills over the next 14 days.</p>
              </div>
            </div>
            <p className="text-[11px] text-[#668096] italic pt-1">
              *Actions represent supply-chain coordination policies and do not constitute clinical guidance.
            </p>
          </div>

        </div>

        {/* Action Buttons Footer */}
        <div className="p-4 bg-[#F6FAFA] border-t border-[#668096]/15 flex items-center justify-between gap-3">
          <div className="text-xs text-[#668096]">
            Audited: <strong className="text-[#16324F]">{medicine.lastUpdated}</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                alert(`Stock rebalancing request created for ${medicine.name}. Logistics notified.`);
                onActionTriggered?.('transfer');
              }}
              className="px-3 py-2 rounded-btn bg-[#FFFFFF] border border-[#668096]/30 text-xs font-bold text-[#16324F] hover:bg-[#EEF5FA] shadow-subtle flex items-center gap-1.5 transition-colors"
            >
              <Truck className="w-3.5 h-3.5 text-[#087E8B]" />
              Transfer Stock
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-btn bg-[#087E8B] hover:bg-[#066570] text-white text-xs font-bold shadow-subtle transition-colors"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
