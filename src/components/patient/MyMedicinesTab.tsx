import React, { useState } from 'react';
import { patientService } from '../../services/patientService';
import { PatientMedicine } from '../../types/patient';
import { SimulatedScanModal } from './SimulatedScanModal';
import { AddMedicineModal } from './AddMedicineModal';
import { 
  Plus, 
  Camera, 
  Pill, 
  Calendar, 
  Clock, 
  ChevronRight, 
  Search, 
  AlertCircle,
  ShieldCheck,
  Building2
} from 'lucide-react';

interface MyMedicinesTabProps {
  onSelectMedicine: (med: PatientMedicine) => void;
}

export const MyMedicinesTab: React.FC<MyMedicinesTabProps> = ({ onSelectMedicine }) => {
  const [medicines, setMedicines] = useState<PatientMedicine[]>(patientService.getAllMedicines());
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleStatusChange = (id: string, newStatus: 'Active' | 'Discontinued') => {
    patientService.markMedicineStatus(id, newStatus);
    setMedicines(patientService.getAllMedicines());
  };

  const handleAddMedicine = (newMed: PatientMedicine) => {
    patientService.addMedicine(newMed);
    setMedicines(patientService.getAllMedicines());
  };

  const filtered = medicines.filter(m => 
    m.medicineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.prescribedInstructions.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">My Prescribed Medicines</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Active medications, supply runways, and pharmacy synchronization
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsScanModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Camera className="w-4 h-4 text-clinical-600" />
            Scan Medicine Box
          </button>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-clinical-600 hover:bg-clinical-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Medicine
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by medicine name, instruction, or doctor..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-900 focus:ring-2 focus:ring-clinical-500/20 focus:border-clinical-500 focus:outline-none shadow-xs"
        />
      </div>

      {/* Grid of Medicines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(med => {
          const isDiscontinued = med.status === 'Discontinued';
          return (
            <div
              key={med.id}
              className={`bg-white rounded-2xl border p-5 transition-all shadow-xs flex flex-col justify-between ${
                isDiscontinued ? 'border-slate-200 bg-slate-50/50 opacity-60' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-clinical-100 text-clinical-700 flex items-center justify-center">
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={`font-bold text-sm ${isDiscontinued ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                        {med.medicineName}
                      </h3>
                      <span className="text-xs text-slate-500 font-medium">{med.dosage}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    isDiscontinued ? 'bg-slate-200 text-slate-700' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {med.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {med.prescribedInstructions}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <span className="text-[10px] font-medium text-slate-400 uppercase">Remaining</span>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">{med.quantityRemaining} units</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <span className="text-[10px] font-medium text-slate-400 uppercase">Runway</span>
                    <p className={`text-sm font-bold mt-0.5 ${med.daysRemaining <= 7 ? 'text-rose-600' : 'text-slate-800'}`}>
                      {med.daysRemaining} days
                    </p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <span className="text-[10px] font-medium text-slate-400 uppercase">Expiry</span>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">{med.daysToExpiry}d</p>
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{med.pharmacyName}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                {!isDiscontinued ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Mark ${med.medicineName} as discontinued?`)) {
                        handleStatusChange(med.id, 'Discontinued');
                      }
                    }}
                    className="text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    Discontinue
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(med.id, 'Active')}
                    className="text-xs font-semibold text-clinical-600 hover:underline"
                  >
                    Reactivate
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onSelectMedicine(med)}
                  className="px-3 py-1.5 rounded-lg bg-clinical-50 text-clinical-700 hover:bg-clinical-100 text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  View Details <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Modals */}
      <SimulatedScanModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        onMedicineScanned={(scanned) => {
          handleAddMedicine({
            id: `p-med-${Date.now()}`,
            medicineName: scanned.medicineName || 'Scanned Medicine',
            dosage: scanned.dosage || 'As prescribed',
            form: (scanned.form as any) || 'Tablet',
            prescribedInstructions: 'Scanned prescription instructions',
            prescribingDoctor: scanned.prescribingDoctor || 'Dr. Sarah Jenkins, MD',
            pharmacyName: scanned.pharmacyName || 'Central Valley Community Pharmacy',
            pharmacyPhone: '+1 (555) 019-2831',
            quantityPurchased: scanned.quantityPurchased || 60,
            quantityRemaining: scanned.quantityPurchased || 60,
            dailyDosageUnits: 2,
            daysRemaining: 30,
            expiryDate: scanned.expiryDate || '2027-06-30',
            daysToExpiry: 280,
            refillDueDate: '2026-10-15',
            isRefillUrgent: false,
            requiresDoctorRenewal: false,
            status: 'Active',
            specialInstructions: 'Verified by camera OCR scanner',
            storageRequirement: 'Room temperature',
            schedules: [
              { timeSlot: 'Morning', timeDisplay: '08:30 AM', takenToday: false }
            ]
          });
        }}
      />

      <AddMedicineModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddMedicine}
      />

    </div>
  );
};
