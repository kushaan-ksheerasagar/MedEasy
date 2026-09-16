import React from 'react';
import { PatientMedicine } from '../../types/patient';
import { 
  X, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  Pill, 
  ShieldAlert, 
  PhoneCall, 
  Building2, 
  Info,
  CheckCircle2,
  Trash2
} from 'lucide-react';

interface PatientMedicineDetailModalProps {
  medicine: PatientMedicine | null;
  onClose: () => void;
  onStatusChange?: (id: string, newStatus: 'Active' | 'Discontinued') => void;
}

export const PatientMedicineDetailModal: React.FC<PatientMedicineDetailModalProps> = ({
  medicine,
  onClose,
  onStatusChange,
}) => {
  if (!medicine) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-clinical-50/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-clinical-100 text-clinical-700 flex items-center justify-center">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{medicine.medicineName}</h2>
              <p className="text-xs text-slate-500 font-medium">{medicine.dosage} • {medicine.form}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          
          {/* Strict Safety Alert (User Prompt Requirement) */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="block font-bold mb-0.5">Important Safety Notice:</strong>
              {medicine.daysRemaining <= 7 ? (
                <span>"Your estimated supply is running low. Contact your pharmacy/clinician if a refill is needed."</span>
              ) : (
                <span>MedEasy is a tracking companion. The system never independently alters dosage, changes regimens, or prescribes medications. Follow your doctor's exact instructions.</span>
              )}
            </div>
          </div>

          {/* Prescribed Regimen Instructions */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Doctor's Prescription Instructions
            </span>
            <p className="text-sm font-semibold text-slate-800">{medicine.prescribedInstructions}</p>
            <p className="text-xs text-slate-500">Prescribed by: <strong className="text-slate-700">{medicine.prescribingDoctor}</strong></p>
          </div>

          {/* Supply & Days Remaining Card Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 font-medium">Remaining Quantity</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                {medicine.quantityRemaining} <span className="text-xs font-normal text-slate-500">of {medicine.quantityPurchased}</span>
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 font-medium">Estimated Runway</span>
              <p className={`text-2xl font-extrabold mt-1 ${medicine.daysRemaining <= 7 ? 'text-rose-600' : 'text-slate-900'}`}>
                {medicine.daysRemaining} <span className="text-xs font-normal text-slate-500">days left</span>
              </p>
            </div>
          </div>

          {/* Expiry & Refill Schedule */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-600 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" /> Expiry Date
              </span>
              <span className={`font-bold ${medicine.daysToExpiry <= 60 ? 'text-rose-600' : 'text-slate-800'}`}>
                {medicine.expiryDate} ({medicine.daysToExpiry} days)
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-600 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" /> Estimated Refill Date
              </span>
              <span className="font-bold text-slate-800">
                {medicine.refillDueDate}
              </span>
            </div>
          </div>

          {/* Pharmacy Contact Card */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Dispensing Pharmacy</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{medicine.pharmacyName}</p>
              <p className="text-xs text-slate-500">{medicine.pharmacyPhone}</p>
            </div>
            <a
              href={`tel:${medicine.pharmacyPhone}`}
              className="p-2.5 rounded-xl bg-clinical-600 text-white hover:bg-clinical-700 shadow-xs flex items-center gap-1 text-xs font-bold"
            >
              <PhoneCall className="w-3.5 h-3.5" /> Call
            </a>
          </div>

          {/* Safe Take-Back Guidance (User Prompt Requirement) */}
          <div className="p-4 rounded-2xl bg-slate-100 text-xs text-slate-600 space-y-1">
            <strong className="text-slate-800 block">Medicine No Longer Needed?</strong>
            <p>
              "Follow your local pharmacy/healthcare provider's approved medicine take-back or disposal process. Do not give prescription medication to other people."
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (confirm(`Are you sure you want to mark ${medicine.medicineName} as changed or discontinued? Always consult your doctor before stopping medication.`)) {
                onStatusChange?.(medicine.id, 'Discontinued');
                onClose();
              }
            }}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 p-2 rounded-lg hover:bg-rose-50"
          >
            Mark Changed / Discontinued
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
