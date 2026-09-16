import React, { useState } from 'react';
import { wasteService } from '../../services/wasteService';
import { inventoryService } from '../../services/inventoryService';
import { disposalService } from '../../services/disposalService';
import { Medicine } from '../../types/inventory';
import { StatusBadge } from '../common/StatusBadge';
import { DemoIntelligenceBanner } from '../common/DemoIntelligenceBanner';
import { 
  Trash2, 
  DollarSign, 
  Clock, 
  MapPin, 
  Truck, 
  ChevronRight, 
  Building2, 
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Flame,
  CheckCircle2,
  Info
} from 'lucide-react';

interface WasteRiskTabProps {
  onSelectMedicine: (med: Medicine) => void;
  onNavigateTab?: (tab: string) => void;
}

export const WasteRiskTab: React.FC<WasteRiskTabProps> = ({ onSelectMedicine, onNavigateTab }) => {
  const wasteItems = wasteService.getWasteRiskItems();
  const loopAnalytics = disposalService.getWasteLoopAnalytics();
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM'>('ALL');

  const totalAtRiskUnits = wasteItems.reduce((acc, i) => acc + i.potentialExcessUnits, 0);
  const totalFinancialWaste = wasteItems.reduce((acc, i) => acc + i.potentialFinancialWaste, 0);
  const batchesExpiringSoonCount = 4; // batches under 60 days
  const highRiskLocation = 'Zone C (East Harbor)';

  const filteredItems = selectedRiskLevel === 'ALL'
    ? wasteItems
    : wasteItems.filter(item => item.wasteRiskLevel === selectedRiskLevel);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* HEADER (Exact UX text required by user) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#16324F]">Waste Risk Intelligence</h1>
          <p className="text-xs text-[#668096] mt-0.5 font-medium">
            Prevent waste before it happens.
          </p>
        </div>
      </div>

      <DemoIntelligenceBanner message="Waste risk ranking evaluates (Current Stock - Forecast Demand Prior to Earliest Expiry). Early algorithmic detection allows cross-facility rebalancing before chemical degradation." />

      {/* 4 SUMMARY CARDS: Total units at risk, Estimated inventory at risk, Batches expiring soon, High-risk locations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total units at risk */}
        <div className="bg-[#FFFFFF] rounded-card p-5 border border-[#668096]/15 shadow-subtle">
          <span className="text-xs font-semibold text-[#668096]">Total units at risk</span>
          <p className="font-heading text-2xl font-bold text-[#D95D5D] mt-1">
            {totalAtRiskUnits.toLocaleString()} <span className="text-xs font-normal text-[#668096]">units</span>
          </p>
          <p className="text-[11px] text-[#668096] mt-0.5">Projected surplus at expiration</p>
        </div>

        {/* Estimated inventory at risk */}
        <div className="bg-[#FFFFFF] rounded-card p-5 border border-[#668096]/15 shadow-subtle">
          <span className="text-xs font-semibold text-[#668096]">Estimated inventory at risk</span>
          <p className="font-heading text-2xl font-bold text-[#16324F] mt-1">
            ${totalFinancialWaste.toLocaleString()}
          </p>
          <p className="text-[11px] text-[#668096] mt-0.5">At wholesale acquisition cost</p>
        </div>

        {/* Batches expiring soon */}
        <div className="bg-[#FFFFFF] rounded-card p-5 border border-[#668096]/15 shadow-subtle">
          <span className="text-xs font-semibold text-[#668096]">Batches expiring soon</span>
          <p className="font-heading text-2xl font-bold text-[#E9A23B] mt-1">
            {batchesExpiringSoonCount} <span className="text-xs font-normal text-[#668096]">batches</span>
          </p>
          <p className="text-[11px] text-[#668096] mt-0.5">Expiring in &lt; 60 days</p>
        </div>

        {/* High-risk locations */}
        <div className="bg-[#FFFFFF] rounded-card p-5 border border-[#668096]/15 shadow-subtle">
          <span className="text-xs font-semibold text-[#668096]">High-risk location</span>
          <p className="font-heading text-lg font-bold text-[#16324F] mt-1 truncate">
            {highRiskLocation}
          </p>
          <p className="text-[11px] text-[#3A9D74] font-semibold mt-0.5">Rebalance pipeline ready</p>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 6. WASTE INTELLIGENCE CONNECTION & FULL LIFECYCLE */}
      {/* ========================================================================= */}
      <div className="bg-[#FFFFFF] rounded-card border border-[#668096]/15 shadow-subtle p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#668096]/15">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-[#087E8B] uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Full Lifecycle Tracking Architecture</span>
            </div>
            <h3 className="font-heading text-base font-bold text-[#16324F]">
              Medicine Waste Lifecycle & Custody Flow
            </h3>
            <p className="text-xs text-[#668096]">
              MedEasy tracks the full medicine journey rather than stopping at prediction.
            </p>
          </div>
          {onNavigateTab && (
            <button
              type="button"
              onClick={() => onNavigateTab('disposal')}
              className="px-3.5 py-1.5 rounded-btn bg-[#EAF7F6] text-[#087E8B] hover:bg-[#087E8B] hover:text-white border border-[#7CC9C3]/40 text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Manage Reverse Logistics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 5-STAGE LIFECYCLE TRACKER (Exact requirement) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {[
            { step: '01', title: 'AT RISK', desc: 'Predicted surplus before expiry', color: 'border-[#E9A23B] bg-[#E9A23B]/5 text-[#E9A23B]' },
            { step: '02', title: 'UNUSED / EXPIRED', desc: 'Confirmed unusable or retired', color: 'border-[#D95D5D] bg-[#D95D5D]/5 text-[#D95D5D]' },
            { step: '03', title: 'COLLECTION', desc: 'Secure take-back box or courier', color: 'border-[#087E8B] bg-[#087E8B]/5 text-[#087E8B]' },
            { step: '04', title: 'AUTHORIZED PROCESSING', desc: 'Certified thermal neutralization', color: 'border-[#12A4A6] bg-[#12A4A6]/5 text-[#12A4A6]' },
            { step: '05', title: 'COMPLETED', desc: 'Audited closed-loop certificate', color: 'border-[#3A9D74] bg-[#3A9D74]/5 text-[#3A9D74]' },
          ].map((s, idx) => (
            <div key={idx} className={`p-3 rounded-xl border ${s.color} space-y-1`}>
              <div className="flex items-center justify-between text-[10px] font-extrabold opacity-80">
                <span>STAGE {s.step}</span>
                {idx < 4 && <ArrowRight className="w-3 h-3 hidden sm:block" />}
              </div>
              <h4 className="font-heading font-bold text-xs">{s.title}</h4>
              <p className="text-[10px] opacity-80 leading-tight">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* 3 Clear State Distinctions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-[#F6FAFA] border border-[#668096]/15 space-y-1">
            <span className="font-bold text-[#E9A23B] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> PREDICTED WASTE
            </span>
            <p className="text-[11px] text-[#668096]">
              Medicine that is currently at risk of becoming waste due to inventory exceeding projected demand before expiry.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#F6FAFA] border border-[#668096]/15 space-y-1">
            <span className="font-bold text-[#D95D5D] flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> ACTUAL WASTE
            </span>
            <p className="text-[11px] text-[#668096]">
              Medicine that has passed its expiration date, suffered cold-chain damage, or was retired due to treatment changes.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#F6FAFA] border border-[#668096]/15 space-y-1">
            <span className="font-bold text-[#087E8B] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> DISPOSED
            </span>
            <p className="text-[11px] text-[#668096]">
              Medicine that has safely entered an authorized take-back or high-temperature destruction workflow with chain-of-custody proof.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 7. WASTE ANALYTICS: "Closing the waste loop" */}
      {/* ========================================================================= */}
      <div className="bg-[#FFFFFF] rounded-card border border-[#668096]/15 shadow-subtle p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#3A9D74] uppercase tracking-wider">
              <RefreshCw className="w-3 h-3" />
              <span>Closed-Loop Analytics</span>
            </div>
            <h3 className="font-heading text-base font-bold text-[#16324F]">
              Closing the waste loop
            </h3>
            <p className="text-xs text-[#668096]">
              Quantifying waste prevention, safe recovery, and authorized take-back completion.
            </p>
          </div>
          <span className="text-xs font-bold text-[#087E8B] bg-[#EAF7F6] px-3 py-1 rounded-full border border-[#7CC9C3]/30">
            Audit Period: 2026 Q3 Live
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#F6FAFA] border border-[#668096]/15">
            <span className="text-xs font-semibold text-[#668096]">Units Identified At Risk</span>
            <p className="font-heading text-2xl font-bold text-[#16324F] mt-1">
              {loopAnalytics.unitsIdentifiedAtRisk.toLocaleString()}
            </p>
            <p className="text-[11px] text-[#668096] mt-0.5">Identified &gt; 45 days before expiry</p>
          </div>

          <div className="p-4 rounded-xl bg-[#F6FAFA] border border-[#668096]/15">
            <span className="text-xs font-semibold text-[#668096]">Units Recovered from Waste</span>
            <p className="font-heading text-2xl font-bold text-[#3A9D74] mt-1">
              {loopAnalytics.unitsRecoveredFromWaste.toLocaleString()}
            </p>
            <p className="text-[11px] text-[#3A9D74] font-medium mt-0.5">Rebalanced before expiration</p>
          </div>

          <div className="p-4 rounded-xl bg-[#F6FAFA] border border-[#668096]/15">
            <span className="text-xs font-semibold text-[#668096]">Units Sent for Disposal</span>
            <p className="font-heading text-2xl font-bold text-[#087E8B] mt-1">
              {loopAnalytics.unitsSentForDisposal.toLocaleString()}
            </p>
            <p className="text-[11px] text-[#668096] mt-0.5">Entered authorized take-back</p>
          </div>

          <div className="p-4 rounded-xl bg-[#F6FAFA] border border-[#668096]/15">
            <span className="text-xs font-semibold text-[#668096]">Disposal Completion Rate</span>
            <p className="font-heading text-2xl font-bold text-[#16324F] mt-1">
              {loopAnalytics.disposalCompletionRate}%
            </p>
            <p className="text-[11px] text-[#3A9D74] font-semibold mt-0.5">237 / 252 units verified destroyed</p>
          </div>
        </div>

        {/* IMPORTANT PROMPT DISCLAIMER */}
        <div className="p-3 bg-[#EEF5FA] rounded-xl border border-[#668096]/15 flex items-start gap-2.5 text-xs text-[#16324F]">
          <Info className="w-4 h-4 text-[#087E8B] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Environmental Accounting Note:</strong> Recovery does not mean all medicine is redistributed or reused. In clinical waste accounting, recovery means that at-risk and expired pharmaceuticals were proactively intercepted and prevented from entering inappropriate waste streams (such as domestic sewage or municipal landfills).
          </p>
        </div>
      </div>

      {/* WASTE RISK TABLE & EXPLAINABLE CARDS */}
      <div className="bg-[#FFFFFF] rounded-card border border-[#668096]/15 shadow-subtle overflow-hidden">
        
        {/* Table Header Filter */}
        <div className="p-4 border-b border-[#668096]/15 bg-[#F6FAFA] flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-heading font-bold text-sm text-[#16324F]">Ranked Waste Risk Monitor</h3>
            <p className="text-xs text-[#668096]">Clear natural-language explanations for each flagged record</p>
          </div>

          <div className="flex items-center gap-1.5">
            {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'] as const).map(tier => (
              <button
                key={tier}
                type="button"
                onClick={() => setSelectedRiskLevel(tier)}
                className={`px-3 py-1 rounded-btn text-xs font-bold transition-colors ${
                  selectedRiskLevel === tier
                    ? 'bg-[#087E8B] text-white shadow-subtle'
                    : 'bg-[#FFFFFF] text-[#668096] border border-[#668096]/20 hover:bg-[#EEF5FA]'
                }`}
              >
                {tier === 'ALL' ? 'All Tiers' : tier}
              </button>
            ))}
          </div>
        </div>

        {/* Table: Medicine, Location, Current stock, Projected demand, Potential excess, Expiry, Risk */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFFFFF] border-b border-[#668096]/15 text-[#668096] font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Medicine</th>
                <th className="px-4 py-3.5">Location</th>
                <th className="px-4 py-3.5">Current Stock</th>
                <th className="px-4 py-3.5">Projected Demand</th>
                <th className="px-4 py-3.5 text-[#D95D5D] font-extrabold">Potential Excess</th>
                <th className="px-4 py-3.5">Expiry</th>
                <th className="px-4 py-3.5">Risk</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#668096]/10">
              {filteredItems.map(item => {
                const med = inventoryService.getById(item.medicineId);
                return (
                  <tr
                    key={item.id}
                    onClick={() => med && onSelectMedicine(med)}
                    className="hover:bg-[#EAF7F6]/40 cursor-pointer transition-colors"
                  >
                    {/* Medicine */}
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-[#16324F] hover:text-[#087E8B] transition-colors">
                        {item.medicineName}
                      </div>
                      <div className="text-[11px] text-[#668096]">{item.dosage}</div>
                      
                      {/* Explainable Risk Sentence (User Prompt Requirement) */}
                      <div className="mt-1 text-[11px] font-medium text-[#16324F] bg-[#EEF5FA] p-1.5 rounded-lg border border-[#668096]/10">
                        {item.wasteRiskLevel === 'HIGH' || item.wasteRiskLevel === 'CRITICAL' ? (
                          <span>
                            "High risk because inventory exceeds projected demand and the earliest batch expires within {item.daysToExpiry} days."
                          </span>
                        ) : (
                          <span>
                            "Moderate risk: stock exceeds projected demand before expiry by {item.potentialExcessUnits} units."
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-3.5 font-medium text-[#16324F]">
                      {item.primaryLocation.split('—')[0]}
                    </td>

                    {/* Current Stock */}
                    <td className="px-4 py-3.5 font-semibold text-[#16324F]">
                      {item.currentStock.toLocaleString()}
                    </td>

                    {/* Projected Demand */}
                    <td className="px-4 py-3.5 text-[#668096] font-medium">
                      {item.projectedDemandBeforeExpiry.toLocaleString()}
                    </td>

                    {/* Potential Excess */}
                    <td className="px-4 py-3.5 font-heading font-bold text-[#D95D5D] text-sm">
                      +{item.potentialExcessUnits.toLocaleString()}
                    </td>

                    {/* Expiry */}
                    <td className="px-4 py-3.5">
                      <span className={`font-bold ${item.daysToExpiry <= 45 ? 'text-[#D95D5D]' : 'text-[#E9A23B]'}`}>
                        {item.daysToExpiry} days
                      </span>
                      <div className="text-[10px] text-[#668096]">{item.earliestExpiryDate}</div>
                    </td>

                    {/* Risk Badge */}
                    <td className="px-4 py-3.5">
                      <StatusBadge status={item.wasteRiskLevel} size="sm" />
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => alert(`Transfer route planned for ${item.medicineName}. Scheduled for next dispatch window.`)}
                        className="px-3 py-1.5 rounded-btn bg-[#FFFFFF] border border-[#087E8B]/40 text-[#087E8B] hover:bg-[#EAF7F6] text-xs font-bold transition-colors shadow-subtle inline-flex items-center gap-1"
                      >
                        <Truck className="w-3 h-3" />
                        Rebalance
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
