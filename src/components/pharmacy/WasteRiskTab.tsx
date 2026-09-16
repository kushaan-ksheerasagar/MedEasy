import React, { useState } from 'react';
import { wasteService } from '../../services/wasteService';
import { inventoryService } from '../../services/inventoryService';
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
  AlertTriangle 
} from 'lucide-react';

interface WasteRiskTabProps {
  onSelectMedicine: (med: Medicine) => void;
}

export const WasteRiskTab: React.FC<WasteRiskTabProps> = ({ onSelectMedicine }) => {
  const wasteItems = wasteService.getWasteRiskItems();
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
