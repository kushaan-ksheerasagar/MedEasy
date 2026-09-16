import React from 'react';
import { patientService } from '../../services/patientService';
import { PatientMedicine } from '../../types/patient';
import { 
  AlertTriangle, 
  Recycle, 
  ShieldAlert, 
  MapPin, 
  CheckCircle2, 
  Info,
  Calendar
} from 'lucide-react';

interface ExpiryWarningTabProps {
  onSelectMedicine: (med: PatientMedicine) => void;
}

export const ExpiryWarningTab: React.FC<ExpiryWarningTabProps> = ({ onSelectMedicine }) => {
  const medicines = patientService.getAllMedicines();
  const expiringSoon = medicines.filter(m => m.daysToExpiry <= 90);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Medicine Expiry & Safe Disposal</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Track medication chemical viability and protect your community from expired or diverted pharmaceutical waste
        </p>
      </div>

      {/* Strict Anti-Diversion & Safe Disposal Banner (User prompt requirement) */}
      <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-950">
          <ShieldAlert className="w-5 h-5 text-amber-600" />
          <span>Crucial Health & Legal Safety Rule</span>
        </div>
        <p className="leading-relaxed">
          "Follow your local pharmacy or healthcare provider's approved medicine take-back or disposal process. <strong>Never share or give prescription medication to other people</strong>, as medications are strictly calibrated to individual clinical diagnoses and lab profiles."
        </p>
      </div>

      {/* Approaching Expiry Warnings List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Medicines Approaching Expiry</h3>
        
        {expiringSoon.map(med => (
          <div
            key={med.id}
            className="bg-white rounded-2xl border border-rose-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                <h4 
                  onClick={() => onSelectMedicine(med)}
                  className="font-bold text-sm text-slate-900 hover:text-clinical-600 cursor-pointer"
                >
                  {med.medicineName}
                </h4>
                <span className="text-xs text-slate-500">({med.dosage})</span>
              </div>

              {/* Exact user prompt requirement: "Your medicine expires in 45 days." */}
              <p className="text-xs font-bold text-rose-700 mt-1">
                "Your medicine expires in {med.daysToExpiry} days."
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Earliest batch expiry date: <strong className="text-slate-700">{med.expiryDate}</strong> • Remaining in pack: {med.quantityRemaining} units
              </p>
            </div>

            <button
              type="button"
              onClick={() => alert(`Safe Take-Back kiosk located at: ${med.pharmacyName}. Drop off any remaining pills in the secure receptacle before ${med.expiryDate}.`)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold shrink-0 flex items-center gap-1.5 transition-colors"
            >
              <Recycle className="w-4 h-4 text-emerald-600" />
              Find Take-Back Kiosk
            </button>
          </div>
        ))}
      </div>

      {/* Approved Take-Back Locations Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Recycle className="w-4 h-4 text-emerald-600" />
          Nearby Approved Medicine Take-Back Locations
        </h3>
        <p className="text-xs text-slate-500">
          Drop off unused, discontinued, or expired medicines safely with zero environmental leaching.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-800 block">Central Valley Community Pharmacy</span>
            <p className="text-slate-500 text-[11px] mt-0.5">104 Valley Blvd • Open 8am–9pm Daily</p>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-2 inline-block">
              24/7 Drop Box Available
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-800 block">Valley Hospital Outpatient Dispensary</span>
            <p className="text-slate-500 text-[11px] mt-0.5">500 Health Way, Ground Floor • 9am–5pm</p>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-2 inline-block">
              Pharmacist Supervised Disposal
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
