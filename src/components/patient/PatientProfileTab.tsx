import React from 'react';
import { patientService } from '../../services/patientService';
import { User, Heart, Shield, Phone, MapPin, Bell, CheckCircle } from 'lucide-react';

export const PatientProfileTab: React.FC = () => {
  const profile = patientService.getProfile();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Patient & Caregiver Profile</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage authorized caregiver access, notification channels, and pharmacy linkages
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        
        {/* Personal Details */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-clinical-100 text-clinical-700 font-extrabold text-xl flex items-center justify-center">
            {profile.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{profile.name}</h3>
            <p className="text-xs text-slate-500">Patient ID: <strong className="font-mono text-slate-700">{profile.id}</strong> • Age: {profile.age} years</p>
            <p className="text-xs text-slate-500 mt-0.5">{profile.homeZone}</p>
          </div>
        </div>

        {/* Caregiver Linkage */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Authorized Caregiver Synchronization
          </h4>
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{profile.assignedCaregiver}</p>
                <p className="text-xs text-slate-500">{profile.caregiverPhone}</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
              Active Sync
            </span>
          </div>
        </div>

        {/* Primary Clinic */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Designated Healthcare Provider
          </h4>
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-clinical-100 text-clinical-700">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{profile.primaryClinic}</p>
                <p className="text-xs text-slate-500">Connected to MedEasy Health Exchange</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => alert("Clinic contact protocol initiated.")}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-white"
            >
              Verify Provider
            </button>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="p-4 rounded-xl bg-slate-100 text-xs text-slate-600 leading-relaxed">
          <p>
            <strong>Privacy & Health Records Notice:</strong> MedEasy stores medication schedules to provide reminders and avoid overstocking. Your clinical data is never sold or used for targeted commercial advertising.
          </p>
        </div>

      </div>
    </div>
  );
};
