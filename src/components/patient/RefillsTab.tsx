import React from 'react';
import { patientService } from '../../services/patientService';
import { PatientMedicine } from '../../types/patient';
import { 
  RefreshCw, 
  PhoneCall, 
  AlertCircle, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  ChevronRight 
} from 'lucide-react';

interface RefillsTabProps {
  onSelectMedicine: (med: PatientMedicine) => void;
}

export const RefillsTab: React.FC<RefillsTabProps> = ({ onSelectMedicine }) => {
  const medicines = patientService.getActiveMedicines();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#16324F]">Refill Center</h1>
        <p className="text-xs text-[#668096] mt-0.5 font-medium">
          Monitor your supply runway and prepare repeat dispensations in advance
        </p>
      </div>

      {/* Safety Notice & Wording Guidance */}
      <div className="p-4 rounded-2xl bg-[#EEF5FA] border border-[#668096]/20 text-xs text-[#16324F] space-y-2">
        <div className="flex items-center gap-2 font-bold text-[#087E8B]">
          <ShieldCheck className="w-5 h-5" />
          <span>Patient Guidance & Safety Protocol</span>
        </div>
        <p className="text-[#668096] leading-relaxed">
          MedEasy tracks estimated consumption based on your prescribed dosage schedule. <strong>The platform never independently prescribes, alters dosage, or authorizes repeat medicine orders.</strong> Always consult your pharmacist or clinician if a refill is needed.
        </p>
      </div>

      {/* Section: Refills coming up */}
      <div className="space-y-4">
        <h2 className="font-heading text-base font-bold text-[#16324F]">Refills coming up</h2>

        {medicines.map(med => {
          const isLow = med.daysRemaining <= 7;
          return (
            <div
              key={med.id}
              className={`bg-[#FFFFFF] rounded-2xl border p-5 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isLow ? 'border-[#E9A23B] ring-2 ring-[#E9A23B]/15' : 'border-[#668096]/20'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3
                    onClick={() => onSelectMedicine(med)}
                    className="font-heading font-bold text-base text-[#16324F] hover:text-[#087E8B] cursor-pointer"
                  >
                    {med.medicineName}
                  </h3>
                  {isLow && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#E9A23B]/15 text-[#E9A23B]">
                      Attention Required
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#668096]">
                  Prescribed: <strong className="text-[#16324F]">{med.dosage}</strong> • Remaining: {med.quantityRemaining} units
                </p>

                {/* Exact prompt specification: Medicine, Days remaining, Estimated refill date */}
                <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
                  <span className={`font-bold px-2 py-0.5 rounded ${
                    isLow ? 'bg-[#D95D5D]/10 text-[#D95D5D]' : 'bg-[#EEF5FA] text-[#16324F]'
                  }`}>
                    {med.daysRemaining} days remaining
                  </span>
                  <span className="flex items-center gap-1 text-[#668096]">
                    <Calendar className="w-3.5 h-3.5 text-[#087E8B]" />
                    Estimated refill: <strong className="text-[#16324F]">{med.refillDueDate}</strong>
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`tel:${med.pharmacyPhone}`}
                  className="px-4 py-2.5 rounded-btn bg-[#087E8B] hover:bg-[#066570] text-white text-xs font-bold shadow-subtle flex items-center gap-1.5 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Pharmacy</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reassurance text */}
      <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#668096]/15 text-xs text-[#668096] text-center">
        "Contact your pharmacist or clinician if a refill is needed."
      </div>

    </div>
  );
};
