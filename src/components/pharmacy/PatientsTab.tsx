import React from 'react';
import { MOCK_PATIENT_MEDICINES } from '../../data/mockPatientData';
import { DemoIntelligenceBanner } from '../common/DemoIntelligenceBanner';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  Recycle, 
  AlertCircle, 
  ShieldCheck, 
  PhoneCall 
} from 'lucide-react';

export const PatientsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Patient Cohort & Refill Synchronization</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Aggregated outpatient refill demand pipelines and community medicine take-back participation (Privacy-Preserving)
        </p>
      </div>

      <DemoIntelligenceBanner message="Patient refill tracking enables pharmacies to pre-allocate inventory according to actual patient repeat cycles, preventing both patient stockouts and unnecessary distributor over-ordering." />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Regimens Tracked</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">1,420</p>
          <p className="text-xs text-slate-500 mt-0.5">Across 5 network clinics</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Refills Due (Next 7 Days)</span>
          <p className="text-2xl font-bold text-brand-600 mt-1">184</p>
          <p className="text-xs text-emerald-600 font-medium mt-0.5">Stock reserved in local hub</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cohort Adherence Index</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">87.4%</p>
          <p className="text-xs text-slate-500 mt-0.5">+3.2% vs last quarter</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Safe Take-Back Returns</span>
          <p className="text-2xl font-bold text-purple-600 mt-1">340 kg</p>
          <p className="text-xs text-slate-500 mt-0.5">Unused meds diverted safely</p>
        </div>
      </div>

      {/* Upcoming Refill Queue Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Synchronized Patient Refill Queue</h3>
          <span className="text-xs text-slate-500">De-identified patient identifiers</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Patient Code</th>
                <th className="px-4 py-3">Medicine Prescribed</th>
                <th className="px-4 py-3">Days Remaining</th>
                <th className="px-4 py-3">Estimated Refill Date</th>
                <th className="px-4 py-3">Local Pharmacy Stock Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono font-bold text-slate-800">PAT-9021 (Elena R.)</td>
                <td className="px-4 py-3 font-bold text-slate-900">Lisinopril 10mg (30 tabs)</td>
                <td className="px-4 py-3 font-bold text-rose-600">5 days remaining</td>
                <td className="px-4 py-3 text-slate-700">Sep 21, 2026</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                    640 units in stock (Ready)
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button 
                    type="button" 
                    onClick={() => alert("Refill pre-pack notice sent to dispensing technician for Elena R.")}
                    className="px-2.5 py-1 rounded bg-brand-50 border border-brand-200 text-brand-700 font-semibold hover:bg-brand-100"
                  >
                    Stage Pre-pack
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono font-bold text-slate-800">PAT-8412 (James H.)</td>
                <td className="px-4 py-3 font-bold text-slate-900">Amoxicillin 500mg (20 caps)</td>
                <td className="px-4 py-3 font-bold text-rose-600">2 days remaining</td>
                <td className="px-4 py-3 text-slate-700">Sep 18, 2026</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">
                    Low Stock: Zone A transfer in transit
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button 
                    type="button" 
                    onClick={() => alert("Emergency buffer hold requested.")}
                    className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
                  >
                    Reserve Unit
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono font-bold text-slate-800">PAT-7729 (Amina K.)</td>
                <td className="px-4 py-3 font-bold text-slate-900">Atorvastatin 20mg (30 tabs)</td>
                <td className="px-4 py-3 font-semibold text-slate-700">18 days remaining</td>
                <td className="px-4 py-3 text-slate-700">Oct 04, 2026</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800">
                    Overstocked: Batch FIFO priority
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button 
                    type="button" 
                    onClick={() => alert("Scheduled for Oct 4.")}
                    className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
                  >
                    View Schedule
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
