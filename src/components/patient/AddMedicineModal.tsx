import React, { useState } from 'react';
import { X, Pill, ShieldAlert, Plus } from 'lucide-react';
import { PatientMedicine } from '../../types/patient';

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (medicine: PatientMedicine) => void;
}

export const AddMedicineModal: React.FC<AddMedicineModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [form, setForm] = useState('Tablet');
  const [instructions, setInstructions] = useState('');
  const [doctor, setDoctor] = useState('Dr. Sarah Jenkins, MD');
  const [quantity, setQuantity] = useState('30');
  const [dailyUnits, setDailyUnits] = useState('1');
  const [expiryDate, setExpiryDate] = useState('2027-06-30');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const qty = parseInt(quantity) || 30;
    const daily = parseInt(dailyUnits) || 1;

    const newMed: PatientMedicine = {
      id: `p-med-${Date.now()}`,
      medicineName: name,
      dosage: dosage || '1 tablet daily',
      form,
      prescribedInstructions: instructions || 'Take as instructed by your clinician',
      prescribingDoctor: doctor,
      pharmacyName: 'Central Valley Community Pharmacy',
      pharmacyPhone: '+1 (555) 019-2831',
      quantityPurchased: qty,
      quantityRemaining: qty,
      dailyDosageUnits: daily,
      daysRemaining: Math.floor(qty / daily),
      expiryDate: expiryDate || '2027-12-31',
      daysToExpiry: 280,
      refillDueDate: '2026-10-15',
      isRefillUrgent: false,
      requiresDoctorRenewal: false,
      status: 'Active',
      specialInstructions: 'Follow physician guidance',
      storageRequirement: 'Room temperature (15-25°C)',
      schedules: [
        {
          timeSlot: 'Morning',
          timeDisplay: '08:30 AM',
          takenToday: false
        }
      ]
    };

    onAdd(newMed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-clinical-100 text-clinical-700">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Add Medicine to Regimen</h3>
              <p className="text-xs text-slate-500">Record a doctor-prescribed medication</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Medicine Name & Strength</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Amlodipine 5mg"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-clinical-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Dosage Schedule</label>
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="e.g., 1 tablet daily"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-clinical-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Form</label>
              <select
                value={form}
                onChange={(e) => setForm(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-clinical-500 focus:outline-none"
              >
                <option value="Tablet">Tablet</option>
                <option value="Capsule">Capsule</option>
                <option value="Liquid">Liquid</option>
                <option value="Inhaler">Inhaler</option>
                <option value="Injection">Injection</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Total Quantity Purchased</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-clinical-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Expiry Date on Box</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-clinical-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Doctor's Prescribed Instructions</label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g., Take 1 tablet every morning with water"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-clinical-500 focus:outline-none"
            ></textarea>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>Only add medications legitimately prescribed by an authorized physician.</span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 font-semibold hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-clinical-600 hover:bg-clinical-700 text-white font-bold shadow-xs"
            >
              Save Medicine
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
