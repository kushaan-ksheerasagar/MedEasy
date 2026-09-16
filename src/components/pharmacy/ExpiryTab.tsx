import React, { useState } from 'react';
import { inventoryService } from '../../services/inventoryService';
import { Medicine, BatchInfo } from '../../types/inventory';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Calendar, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  Layers, 
  ChevronRight,
  Truck,
  Building2,
  Tag
} from 'lucide-react';

interface ExpiryTabProps {
  onSelectMedicine: (med: Medicine) => void;
}

export const ExpiryTab: React.FC<ExpiryTabProps> = ({ onSelectMedicine }) => {
  const allMedicines = inventoryService.getAll();
  const [selectedBucket, setSelectedBucket] = useState<'30' | '60' | '90' | '90plus'>('30');

  // Group medicines by earliest batch expiry
  const bucket30 = allMedicines.filter(m => m.earliestDaysToExpiry <= 30);
  const bucket60 = allMedicines.filter(m => m.earliestDaysToExpiry > 30 && m.earliestDaysToExpiry <= 60);
  const bucket90 = allMedicines.filter(m => m.earliestDaysToExpiry > 60 && m.earliestDaysToExpiry <= 90);
  const bucket90plus = allMedicines.filter(m => m.earliestDaysToExpiry > 90);

  const getActiveBucketMedicines = () => {
    switch (selectedBucket) {
      case '30': return bucket30;
      case '60': return bucket60;
      case '90': return bucket90;
      case '90plus': return bucket90plus;
    }
  };

  const currentList = getActiveBucketMedicines();

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Expiry Management & Batch Timeline</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Proactive batch-level expiration monitoring grouped into strict regulatory & dispensing response horizons
        </p>
      </div>

      {/* Bucket Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Bucket 1: <= 30 Days */}
        <div
          onClick={() => setSelectedBucket('30')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            selectedBucket === '30'
              ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-500/20 shadow-sm'
              : 'bg-white border-slate-200 hover:border-rose-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              Within 30 Days
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
              Critical
            </span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-3">{bucket30.length}</p>
          <p className="text-xs text-slate-500 mt-1">
            {bucket30.reduce((acc, m) => acc + m.totalStock, 0)} units requiring immediate clearance or quarantine
          </p>
        </div>

        {/* Bucket 2: 31-60 Days */}
        <div
          onClick={() => setSelectedBucket('60')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            selectedBucket === '60'
              ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-500/20 shadow-sm'
              : 'bg-white border-slate-200 hover:border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              31–60 Days
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              Urgent
            </span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-3">{bucket60.length}</p>
          <p className="text-xs text-slate-500 mt-1">
            {bucket60.reduce((acc, m) => acc + m.totalStock, 0)} units across active dispensaries
          </p>
        </div>

        {/* Bucket 3: 61-90 Days */}
        <div
          onClick={() => setSelectedBucket('90')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            selectedBucket === '90'
              ? 'bg-sky-50/80 border-sky-300 ring-2 ring-sky-500/20 shadow-sm'
              : 'bg-white border-slate-200 hover:border-sky-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
              61–90 Days
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
              Watchlist
            </span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-3">{bucket90.length}</p>
          <p className="text-xs text-slate-500 mt-1">
            {bucket90.reduce((acc, m) => acc + m.totalStock, 0)} units within standard FIFO rotation
          </p>
        </div>

        {/* Bucket 4: 90+ Days */}
        <div
          onClick={() => setSelectedBucket('90plus')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            selectedBucket === '90plus'
              ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20 shadow-sm'
              : 'bg-white border-slate-200 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              90+ Days
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Stable
            </span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-3">{bucket90plus.length}</p>
          <p className="text-xs text-slate-500 mt-1">
            {bucket90plus.reduce((acc, m) => acc + m.totalStock, 0)} long-shelf-life units
          </p>
        </div>

      </div>

      {/* Detailed Batch List for Selected Horizon */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Medicines & Batches in {selectedBucket === '30' ? 'Critical (<30 Days)' : selectedBucket === '60' ? 'Urgent (31-60 Days)' : selectedBucket === '90' ? 'Watch (61-90 Days)' : 'Stable (90+ Days)'} Horizon
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Individual batch tracking with exact units remaining and facility locations
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
            {currentList.length} Medicine(s)
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {currentList.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No medicines currently in this expiry window</p>
            </div>
          ) : (
            currentList.map(med => (
              <div 
                key={med.id}
                className="p-5 hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 
                        onClick={() => onSelectMedicine(med)}
                        className="text-sm font-bold text-slate-900 hover:text-brand-600 cursor-pointer transition-colors"
                      >
                        {med.name}
                      </h4>
                      <StatusBadge status={med.stockStatus} size="sm" />
                      <span className="text-xs text-slate-500 font-medium">({med.category})</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {med.flagReason || `Earliest batch expires on ${med.earliestExpiryDate} (${med.earliestDaysToExpiry} days remaining).`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectMedicine(med)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1"
                    >
                      View Medicine <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Sub-batches breakdown */}
                <div className="mt-3 bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Batches ({med.batches.length}):
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {med.batches.map(batch => (
                      <div 
                        key={batch.batchNumber}
                        className={`p-2.5 rounded-lg border text-xs ${
                          batch.daysToExpiry <= 30
                            ? 'bg-rose-50 border-rose-200 text-rose-900'
                            : batch.daysToExpiry <= 60
                            ? 'bg-amber-50 border-amber-200 text-amber-900'
                            : 'bg-white border-slate-200 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between font-mono font-bold">
                          <span>{batch.batchNumber}</span>
                          <span className="text-[11px] font-sans font-bold">
                            {batch.daysToExpiry}d left
                          </span>
                        </div>
                        <div className="mt-1 text-[11px] opacity-80 flex items-center justify-between">
                          <span>Qty: {batch.remainingQuantity} / {batch.initialQuantity}</span>
                          <span>Exp: {batch.expiryDate}</span>
                        </div>
                        <div className="mt-1 text-[10px] opacity-70 flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {batch.locationName}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
