import React, { useState } from 'react';
import { patientService } from '../../services/patientService';
import { PatientMedicine } from '../../types/patient';
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  ChevronRight, 
  Pill,
  Sun,
  ShieldCheck,
  PhoneCall
} from 'lucide-react';

interface PatientHomeTabProps {
  onSelectMedicine: (med: PatientMedicine) => void;
  onNavigateTab: (tabId: string) => void;
}

export const PatientHomeTab: React.FC<PatientHomeTabProps> = ({
  onSelectMedicine,
  onNavigateTab,
}) => {
  const profile = patientService.getProfile();
  const [activeMeds, setActiveMeds] = useState<PatientMedicine[]>(patientService.getActiveMedicines());
  const [summary, setSummary] = useState(patientService.getTodaySummary());

  const handleToggleDose = (medId: string, timeSlot: string) => {
    patientService.toggleDoseTaken(medId, timeSlot);
    setActiveMeds(patientService.getActiveMedicines());
    setSummary(patientService.getTodaySummary());
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      
      {/* PATIENT HOME HEADER (Exact text from prompt) */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold text-[#087E8B]">
          <Sun className="w-4 h-4 text-[#E9A23B]" />
          <span>Wednesday, September 16, 2026</span>
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-[#16324F] tracking-tight">
          Good morning, {profile.name.split(' ')[0]}
        </h1>
        <p className="text-sm text-[#668096] font-medium">
          Here's your medication plan for today.
        </p>
      </div>

      {/* Daily Dose Completion Status Bar */}
      <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#668096]/20 shadow-subtle flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-[#668096] uppercase tracking-wider block">Today's Progress</span>
          <p className="font-heading text-xl font-bold text-[#16324F] mt-0.5">
            {summary.completedDoses} of {summary.totalScheduledDoses} doses taken
          </p>
        </div>
        <div className="w-36">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#087E8B] mb-1">
            <span>Adherence</span>
            <span>{summary.adherencePercent}%</span>
          </div>
          <div className="w-full bg-[#EEF5FA] h-2.5 rounded-full overflow-hidden">
            <div
              style={{ width: `${summary.adherencePercent}%` }}
              className="bg-[#3A9D74] h-full rounded-full transition-all duration-300"
            ></div>
          </div>
        </div>
      </div>

      {/* Refill Notice if supply is low */}
      {activeMeds.some(m => m.daysRemaining <= 7) && (
        <div className="p-4 rounded-2xl bg-[#E9A23B]/10 border border-[#E9A23B]/30 flex items-start justify-between gap-3 text-xs text-[#16324F]">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-[#E9A23B] shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-[#16324F] block">Estimated Refill Approaching:</strong>
              <span className="text-[#668096]">
                Your estimated supply of Lisinopril 10mg is running low (5 days remaining). Contact your pharmacy or clinician if a refill is needed.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('refills')}
            className="px-3 py-1.5 rounded-btn bg-[#E9A23B] text-white font-bold hover:bg-[#d68f29] text-xs shrink-0"
          >
            Refill Center
          </button>
        </div>
      )}

      {/* TODAY'S MEDICATION CARDS (Clean, calm, accessible) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pt-2">
          <h2 className="font-heading text-lg font-bold text-[#16324F]">Today's Medicines</h2>
          <span className="text-xs text-[#668096] font-medium">{activeMeds.length} active prescriptions</span>
        </div>

        {activeMeds.map(med => {
          return (
            <div
              key={med.id}
              className="bg-[#FFFFFF] rounded-2xl border border-[#668096]/20 p-5 sm:p-6 shadow-subtle hover:border-[#087E8B]/40 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                
                {/* Left: Info */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF7F6] text-[#087E8B] flex items-center justify-center font-bold">
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 
                        onClick={() => onSelectMedicine(med)}
                        className="font-heading text-base font-bold text-[#16324F] hover:text-[#087E8B] cursor-pointer transition-colors"
                      >
                        {med.medicineName}
                      </h3>
                      <p className="text-xs font-semibold text-[#087E8B]">
                        {med.dosage}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-[#668096] pt-1">
                    {med.prescribedInstructions}
                  </p>

                  {/* Quantity & Days Left Chips */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
                    <span className="font-bold text-[#16324F] bg-[#F6FAFA] px-2.5 py-1 rounded-lg border border-[#668096]/15">
                      {med.quantityRemaining} tablets left
                    </span>
                    <span className={`font-bold px-2.5 py-1 rounded-lg ${
                      med.daysRemaining <= 7 
                        ? 'bg-[#D95D5D]/10 text-[#D95D5D] border border-[#D95D5D]/20' 
                        : 'bg-[#F6FAFA] text-[#16324F] border border-[#668096]/15'
                    }`}>
                      {med.daysRemaining} days remaining
                    </span>
                    <span className="text-[#668096] bg-[#F6FAFA] px-2.5 py-1 rounded-lg border border-[#668096]/15 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#668096]" />
                      Expiry: <strong className="text-[#16324F]">{med.expiryDate}</strong>
                    </span>
                  </div>
                </div>

                {/* Right: Dose check & Detail action */}
                <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#668096]/10">
                  {med.schedules.map(schedule => (
                    <button
                      key={schedule.timeSlot}
                      type="button"
                      onClick={() => handleToggleDose(med.id, schedule.timeSlot)}
                      className={`px-4 py-2.5 rounded-btn text-xs font-bold transition-all flex items-center gap-2 shadow-subtle ${
                        schedule.takenToday
                          ? 'bg-[#3A9D74]/15 text-[#3A9D74] border border-[#3A9D74]/30'
                          : 'bg-[#087E8B] hover:bg-[#066570] text-white'
                      }`}
                    >
                      {schedule.takenToday ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-[#3A9D74]" />
                          <span>Taken ({schedule.timeSlot})</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-4 h-4" />
                          <span>Take {schedule.timeSlot} Dose</span>
                        </>
                      )}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => onSelectMedicine(med)}
                    className="text-xs font-bold text-[#087E8B] hover:underline flex items-center gap-0.5 mt-1"
                  >
                    View details <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
