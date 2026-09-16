import React, { useState } from 'react';
import { 
  disposalService, 
  MOCK_DISPOSAL_LOCATIONS 
} from '../../services/disposalService';
import { 
  DisposalLocation, 
  DisposalRequest, 
  DisposalReason, 
  DisposalHandlingCategory 
} from '../../types/disposal';
import { patientService } from '../../services/patientService';
import { StatusBadge } from '../common/StatusBadge';
import { 
  ShieldCheck, 
  Scan, 
  MapPin, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight, 
  Building2, 
  FileText, 
  Info, 
  Phone, 
  ExternalLink,
  Plus,
  X,
  Sparkles,
  Search,
  Navigation
} from 'lucide-react';

interface SafeDisposalTabProps {
  onOpenScanner?: () => void;
}

export const SafeDisposalTab: React.FC<SafeDisposalTabProps> = ({ onOpenScanner }) => {
  const patientMeds = patientService.getAllMedicines();
  const [requests, setRequests] = useState<DisposalRequest[]>(disposalService.getPatientRequests());
  const [locations] = useState<DisposalLocation[]>(disposalService.getDisposalLocations());

  // Modal / Wizard state
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);

  // Form selections
  const [selectedMedSource, setSelectedMedSource] = useState<'existing' | 'custom'>('existing');
  const [selectedMedId, setSelectedMedId] = useState<string>(patientMeds[0]?.id || '');
  const [customMedName, setCustomMedName] = useState('');
  const [customDosage, setCustomDosage] = useState('');
  const [quantity, setQuantity] = useState<number>(10);
  const [unit, setUnit] = useState<string>('tablets');
  const [expiryDate, setExpiryDate] = useState<string>('2026-08-30');
  const [disposalReason, setDisposalReason] = useState<DisposalReason>('No longer needed');
  const [handlingInfo, setHandlingInfo] = useState<{
    category: DisposalHandlingCategory;
    title: string;
    description: string;
    actionInstruction: string;
  }>(disposalService.determineHandlingCategory(patientMeds[0]?.medicineName || 'Paracetamol'));
  const [selectedLocationId, setSelectedLocationId] = useState<string>(locations[0]?.id || '');
  const [disposalMethod, setDisposalMethod] = useState<'Pharmacy Drop-off' | 'Scheduled Courier Collection'>('Pharmacy Drop-off');
  const [createdRequest, setCreatedRequest] = useState<DisposalRequest | null>(null);

  // Active Map Location Detail Modal
  const [viewingLocation, setViewingLocation] = useState<DisposalLocation | null>(null);
  const [directionsModalLocation, setDirectionsModalLocation] = useState<DisposalLocation | null>(null);

  // Filter for locator list
  const [searchQuery, setSearchQuery] = useState('');

  const activeMedicine = selectedMedSource === 'existing' 
    ? patientMeds.find(m => m.id === selectedMedId) 
    : null;

  const currentMedName = selectedMedSource === 'existing' 
    ? (activeMedicine?.medicineName || 'Paracetamol') 
    : (customMedName || 'Medicine');

  const currentDosage = selectedMedSource === 'existing'
    ? (activeMedicine?.dosage || '500mg')
    : (customDosage || 'Standard dose');

  // Trigger wizard and prepare classification
  const handleStartDisposal = (defaultMedName?: string) => {
    if (defaultMedName) {
      const match = patientMeds.find(m => m.medicineName.toLowerCase() === defaultMedName.toLowerCase());
      if (match) {
        setSelectedMedSource('existing');
        setSelectedMedId(match.id);
        setHandlingInfo(disposalService.determineHandlingCategory(match.medicineName, match.form));
      } else {
        setSelectedMedSource('custom');
        setCustomMedName(defaultMedName);
        setHandlingInfo(disposalService.determineHandlingCategory(defaultMedName));
      }
    } else {
      const first = patientMeds[0];
      if (first) {
        setSelectedMedSource('existing');
        setSelectedMedId(first.id);
        setHandlingInfo(disposalService.determineHandlingCategory(first.medicineName, first.form));
      }
    }
    setWizardStep(1);
    setIsWizardOpen(true);
  };

  const handleMedicineChange = (id: string) => {
    setSelectedMedId(id);
    const med = patientMeds.find(m => m.id === id);
    if (med) {
      setHandlingInfo(disposalService.determineHandlingCategory(med.medicineName, med.form));
    }
  };

  const handleCustomNameBlur = () => {
    if (customMedName) {
      setHandlingInfo(disposalService.determineHandlingCategory(customMedName));
    }
  };

  const handleCreateRequest = () => {
    const loc = locations.find(l => l.id === selectedLocationId) || locations[0];
    const newReq = disposalService.createDisposalRequest({
      patientName: 'Elena Rostova',
      medicineName: currentMedName,
      dosage: currentDosage,
      quantity,
      unit,
      expiryDate,
      reason: disposalReason,
      handlingCategory: handlingInfo.category,
      method: disposalMethod,
      locationName: loc.name,
      locationAddress: loc.address,
      notes: `Patient reported: ${disposalReason}. Approved via MedEasy take-back flow.`
    });

    setCreatedRequest(newReq);
    setRequests(disposalService.getPatientRequests());
    setWizardStep(4);
  };

  const filteredLocations = locations.filter(loc => 
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.acceptedTypes.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Calm, Trustworthy & Clear Message) */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#087E8B] via-[#12A4A6] to-[#16324F] text-white p-6 sm:p-10 shadow-card">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white backdrop-blur-sm text-xs font-bold tracking-wide">
            <ShieldCheck className="w-4 h-4 text-[#7CC9C3]" />
            <span>MedEasy Certified Safe Disposal</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Have medicines you don't need anymore?
          </h1>

          <p className="text-sm sm:text-base text-[#EAF7F6] font-medium leading-relaxed">
            Dispose safely. Keep medicines out of the wrong hands, domestic water supplies, and landfills.
          </p>

          {/* PRIMARY & SECONDARY CTAS */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => handleStartDisposal()}
              className="px-6 py-3 rounded-btn bg-[#FFFFFF] text-[#087E8B] hover:bg-[#EAF7F6] text-sm font-extrabold shadow-card transition-all flex items-center gap-2"
            >
              <span>Find a disposal option</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                if (onOpenScanner) onOpenScanner();
                else handleStartDisposal('Insulin Glargine');
              }}
              className="px-5 py-3 rounded-btn bg-white/10 hover:bg-white/20 text-white border border-white/30 text-sm font-bold backdrop-blur-sm transition-all flex items-center gap-2"
            >
              <Scan className="w-4 h-4 text-[#7CC9C3]" />
              <span>Scan a medicine</span>
            </button>
          </div>
        </div>

        {/* Decorative background geometric rings */}
        <div className="absolute -right-12 -bottom-16 w-80 h-80 rounded-full bg-white/5 pointer-events-none blur-xl"></div>
      </div>

      {/* ========================================================================= */}
      {/* 2. REASONS & DEMO CLASSIFICATION EXPLAINER */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#FFFFFF] p-5 rounded-card border border-[#668096]/15 shadow-subtle space-y-2">
          <div className="w-8 h-8 rounded-lg bg-[#EAF7F6] text-[#087E8B] flex items-center justify-center font-bold text-xs">
            01
          </div>
          <h3 className="font-heading text-sm font-bold text-[#16324F]">Expired or Damaged</h3>
          <p className="text-xs text-[#668096] leading-relaxed">
            Active ingredients degrade over time. Safe take-back ensures authorized thermal oxidation with zero environmental leakage.
          </p>
        </div>

        <div className="bg-[#FFFFFF] p-5 rounded-card border border-[#668096]/15 shadow-subtle space-y-2">
          <div className="w-8 h-8 rounded-lg bg-[#EEF5FA] text-[#16324F] flex items-center justify-center font-bold text-xs">
            02
          </div>
          <h3 className="font-heading text-sm font-bold text-[#16324F]">Treatment Changed</h3>
          <p className="text-xs text-[#668096] leading-relaxed">
            Prescriptions discontinued by your doctor should be retired immediately to eliminate household confusion or accidental ingestion.
          </p>
        </div>

        <div className="bg-[#FFFFFF] p-5 rounded-card border border-[#668096]/15 shadow-subtle space-y-2">
          <div className="w-8 h-8 rounded-lg bg-[#EAF7F6] text-[#3A9D74] flex items-center justify-center font-bold text-xs">
            03
          </div>
          <h3 className="font-heading text-sm font-bold text-[#16324F]">Leftover Unused Supply</h3>
          <p className="text-xs text-[#668096] leading-relaxed">
            Surplus doses are logged into closed-loop audits and returned to certified community pharmacy neutralization centers.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. DISPOSAL LOCATOR ("Find a disposal point") */}
      {/* ========================================================================= */}
      <div className="bg-[#FFFFFF] rounded-card border border-[#668096]/15 shadow-subtle overflow-hidden space-y-4 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#668096]/15">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#087E8B] uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" />
              <span>Authorized Network Locator</span>
            </div>
            <h2 className="font-heading text-xl font-bold text-[#16324F] mt-0.5">
              Find a disposal point
            </h2>
            <p className="text-xs text-[#668096]">
              Verified take-back kiosks, community pharmacies, and specialized disposal clinics.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#668096] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by neighborhood or medicine type..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#668096]/25 bg-[#F6FAFA] text-[#16324F] focus:outline-none focus:border-[#087E8B]"
            />
          </div>
        </div>

        {/* DEMO Notice Banner */}
        <div className="p-3 bg-[#EEF5FA] rounded-xl border border-[#668096]/15 flex items-start gap-2.5 text-xs text-[#16324F]">
          <Info className="w-4 h-4 text-[#087E8B] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Prototype Demonstration Notice: </span>
            The locations and drop-off points displayed below represent realistic fictional facilities for demonstration purposes. In real-world operation, MedEasy integrates with municipal and certified pharmacy disposal APIs.
          </div>
        </div>

        {/* Locations List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {filteredLocations.map(loc => (
            <div
              key={loc.id}
              className="p-4 rounded-xl border border-[#668096]/20 bg-[#F6FAFA] hover:bg-[#EAF7F6]/20 hover:border-[#087E8B]/40 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-heading font-bold text-sm text-[#16324F]">
                    {loc.name}
                  </h4>
                  <span className="shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#087E8B]/10 text-[#087E8B]">
                    {loc.distanceKm} km away
                  </span>
                </div>

                <p className="text-xs text-[#668096] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#668096]" />
                  <span>{loc.address}</span>
                </p>

                <p className="text-xs text-[#16324F] font-medium flex items-center gap-1 pt-1">
                  <Clock className="w-3 h-3 text-[#087E8B]" />
                  <span>{loc.operatingHours}</span>
                </p>

                <div className="pt-2 flex flex-wrap gap-1">
                  {loc.acceptedTypes.map((t, idx) => (
                    <span key={idx} className="text-[10px] bg-[#FFFFFF] border border-[#668096]/20 text-[#16324F] px-2 py-0.5 rounded font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[#668096]/10 flex items-center justify-between">
                <span className={`text-[11px] font-bold ${loc.status.includes('Open') ? 'text-[#3A9D74]' : 'text-[#E9A23B]'}`}>
                  ● {loc.status}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDirectionsModalLocation(loc)}
                    className="px-3 py-1.5 rounded-btn bg-[#FFFFFF] hover:bg-[#EEF5FA] border border-[#668096]/25 text-[#16324F] text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <Navigation className="w-3 h-3 text-[#087E8B]" />
                    <span>Get directions</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLocationId(loc.id);
                      handleStartDisposal();
                    }}
                    className="px-3 py-1.5 rounded-btn bg-[#087E8B] hover:bg-[#12A4A6] text-white text-xs font-bold transition-colors"
                  >
                    Select
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. DISPOSAL HISTORY SECTION */}
      {/* ========================================================================= */}
      <div className="bg-[#FFFFFF] rounded-card border border-[#668096]/15 shadow-subtle p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#668096]/15">
          <div>
            <h3 className="font-heading text-base font-bold text-[#16324F]">
              Disposal History & Audit Records
            </h3>
            <p className="text-xs text-[#668096]">
              Verified record of medicines retired through authorized take-back streams.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleStartDisposal()}
            className="px-3 py-1.5 rounded-btn bg-[#EAF7F6] text-[#087E8B] border border-[#7CC9C3]/40 text-xs font-bold hover:bg-[#087E8B] hover:text-white transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Disposal</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F6FAFA] text-[#668096] font-bold uppercase tracking-wider border-b border-[#668096]/15">
              <tr>
                <th className="px-4 py-3">Medicine</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Disposal Method</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Reference ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#668096]/10">
              {requests.map(req => (
                <tr key={req.id} className="hover:bg-[#F6FAFA] transition-colors">
                  <td className="px-4 py-3.5">
                    <span className="font-bold text-[#16324F] block">{req.medicineName}</span>
                    <span className="text-[11px] text-[#668096]">{req.dosage} • Reason: {req.reason}</span>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-[#16324F]">
                    {req.quantity} {req.unit}
                  </td>
                  <td className="px-4 py-3.5 text-[#668096]">
                    {req.createdAt}
                  </td>
                  <td className="px-4 py-3.5 text-[#16324F] font-medium">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#087E8B]" />
                      <span>{req.method}</span>
                    </div>
                    <span className="text-[10px] text-[#668096] block truncate max-w-[200px]">{req.locationName}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      req.status === 'RESPONSIBLY PROCESSED'
                        ? 'bg-[#3A9D74]/15 text-[#3A9D74]'
                        : req.status === 'COLLECTED'
                        ? 'bg-[#087E8B]/15 text-[#087E8B]'
                        : req.status === 'SCHEDULED'
                        ? 'bg-[#E9A23B]/15 text-[#E9A23B]'
                        : 'bg-[#668096]/15 text-[#16324F]'
                    }`}>
                      <CheckCircle2 className="w-3 h-3" />
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono font-bold text-[#087E8B]">
                    {req.referenceId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. SAFETY & TRUST DISCLAIMER (Exact requirements) */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#668096]/20 shadow-subtle flex flex-col sm:flex-row items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#EAF7F6] text-[#087E8B] flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1.5 text-xs text-[#16324F]">
          <h4 className="font-heading font-bold text-sm text-[#16324F]">
            Safety, Healthcare & Environmental Regulations Notice
          </h4>
          <p className="text-[#668096] leading-relaxed">
            "Disposal guidance varies by medicine and local regulations. Follow instructions from authorized healthcare or waste-management services."
          </p>
          <div className="pt-1 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-[#668096]">
            <span className="flex items-center gap-1 text-[#D95D5D] font-bold">
              ✕ Never flush down toilets or sinks
            </span>
            <span className="flex items-center gap-1 text-[#D95D5D] font-bold">
              ✕ Never place in household trash
            </span>
            <span className="flex items-center gap-1 text-[#D95D5D] font-bold">
              ✕ Never give prescription medicines to others
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE 4-STEP DISPOSAL WIZARD MODAL */}
      {/* ========================================================================= */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#16324F]/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#668096]/20 shadow-card max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Wizard Header */}
            <div className="px-6 py-4 border-b border-[#668096]/15 bg-[#F6FAFA] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#087E8B] uppercase tracking-wider">
                  Step {wizardStep} of 4 — MedEasy Safe Take-Back
                </span>
                <h3 className="font-heading text-lg font-bold text-[#16324F]">
                  {wizardStep === 1 && "Step 1: Select or confirm medicine"}
                  {wizardStep === 2 && "Step 2: How should this medicine be handled?"}
                  {wizardStep === 3 && "Step 3: Choose disposal location & method"}
                  {wizardStep === 4 && "Disposal Request Created"}
                </h3>
              </div>
              <button
                onClick={() => setIsWizardOpen(false)}
                className="p-1.5 rounded-lg text-[#668096] hover:bg-[#EEF5FA] hover:text-[#16324F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wizard Progress Bar */}
            <div className="w-full bg-[#EEF5FA] h-1.5">
              <div 
                className="bg-[#087E8B] h-1.5 transition-all duration-300"
                style={{ width: `${(wizardStep / 4) * 100}%` }}
              ></div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              
              {/* STEP 1: SELECT OR SCAN MEDICINE */}
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <div className="flex rounded-xl bg-[#F6FAFA] p-1 border border-[#668096]/15">
                    <button
                      type="button"
                      onClick={() => setSelectedMedSource('existing')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                        selectedMedSource === 'existing'
                          ? 'bg-[#FFFFFF] text-[#087E8B] shadow-subtle'
                          : 'text-[#668096]'
                      }`}
                    >
                      From My Active Medicines
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedMedSource('custom')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                        selectedMedSource === 'custom'
                          ? 'bg-[#FFFFFF] text-[#087E8B] shadow-subtle'
                          : 'text-[#668096]'
                      }`}
                    >
                      Unlisted / Other Medicine
                    </button>
                  </div>

                  {selectedMedSource === 'existing' ? (
                    <div>
                      <label className="block text-xs font-bold text-[#16324F] mb-1">
                        Select from your cabinet:
                      </label>
                      <select
                        value={selectedMedId}
                        onChange={e => handleMedicineChange(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#668096]/25 bg-[#FFFFFF] text-xs font-semibold text-[#16324F] focus:outline-none focus:border-[#087E8B]"
                      >
                        {patientMeds.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.medicineName} ({m.dosage}) — Expires {m.expiryDate}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#16324F] mb-1">
                          Medicine Name:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Atorvastatin"
                          value={customMedName}
                          onChange={e => setCustomMedName(e.target.value)}
                          onBlur={handleCustomNameBlur}
                          className="w-full px-3 py-2 rounded-xl border border-[#668096]/25 text-xs text-[#16324F] focus:outline-none focus:border-[#087E8B]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#16324F] mb-1">
                          Dosage / Strength:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., 20mg"
                          value={customDosage}
                          onChange={e => setCustomDosage(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-[#668096]/25 text-xs text-[#16324F] focus:outline-none focus:border-[#087E8B]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Quantity & Expiry */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#16324F] mb-1">
                        Quantity to Dispose:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min={1}
                          max={500}
                          value={quantity}
                          onChange={e => setQuantity(Number(e.target.value))}
                          className="w-24 px-3 py-2 rounded-xl border border-[#668096]/25 text-xs font-bold text-[#16324F]"
                        />
                        <select
                          value={unit}
                          onChange={e => setUnit(e.target.value)}
                          className="flex-1 px-2 py-2 rounded-xl border border-[#668096]/25 text-xs text-[#16324F]"
                        >
                          <option value="tablets">tablets</option>
                          <option value="capsules">capsules</option>
                          <option value="vials">vials</option>
                          <option value="bottles">bottles</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#16324F] mb-1">
                        Expiry Date:
                      </label>
                      <input
                        type="date"
                        value={expiryDate}
                        onChange={e => setExpiryDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#668096]/25 text-xs text-[#16324F]"
                      />
                    </div>
                  </div>

                  {/* Reason for disposal */}
                  <div>
                    <label className="block text-xs font-bold text-[#16324F] mb-1">
                      Reason for disposal:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {(['Expired', 'Damaged', 'No longer needed', 'Treatment changed', 'Other'] as DisposalReason[]).map(r => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setDisposalReason(r)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-left ${
                            disposalReason === r
                              ? 'border-[#087E8B] bg-[#EAF7F6] text-[#087E8B] shadow-subtle'
                              : 'border-[#668096]/20 bg-[#FFFFFF] text-[#668096] hover:bg-[#EEF5FA]'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: DEMO CLASSIFICATION SYSTEM */}
              {wizardStep === 2 && (
                <div className="space-y-4">
                  <div className="p-3 bg-[#EEF5FA] rounded-xl border border-[#668096]/15 text-xs text-[#16324F]">
                    <span className="font-bold">DEMO Classification Guidance: </span>
                    MedEasy analyzes medicine formulation and therapeutic class to recommend authorized handling paths.
                  </div>

                  <div className="p-5 rounded-2xl bg-[#F6FAFA] border-2 border-[#087E8B]/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[#668096] uppercase tracking-wider">
                        Assigned Category
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        handlingInfo.category === 'SPECIAL HANDLING'
                          ? 'bg-[#D95D5D]/15 text-[#D95D5D]'
                          : handlingInfo.category === 'AUTHORIZED COLLECTION'
                          ? 'bg-[#E9A23B]/15 text-[#E9A23B]'
                          : 'bg-[#087E8B]/15 text-[#087E8B]'
                      }`}>
                        {handlingInfo.category}
                      </span>
                    </div>

                    <h4 className="font-heading text-base font-bold text-[#16324F]">
                      {handlingInfo.title}
                    </h4>

                    <p className="text-xs text-[#668096] leading-relaxed">
                      {handlingInfo.description}
                    </p>

                    <div className="p-3 bg-[#FFFFFF] rounded-xl border border-[#668096]/15 text-xs text-[#16324F] space-y-1">
                      <span className="font-bold text-[#087E8B] block">Safe Handling Protocol:</span>
                      <p>{handlingInfo.actionInstruction}</p>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#668096] italic">
                    * Do not provide unsafe disposal instructions for specific medicines unless supported by an authoritative disposal database.
                  </div>
                </div>
              )}

              {/* STEP 3: DISPOSAL LOCATOR & METHOD */}
              {wizardStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#16324F] mb-1">
                      Choose Hand-off Method:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDisposalMethod('Pharmacy Drop-off')}
                        className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                          disposalMethod === 'Pharmacy Drop-off'
                            ? 'border-[#087E8B] bg-[#EAF7F6] text-[#087E8B] shadow-subtle'
                            : 'border-[#668096]/20 bg-[#FFFFFF] text-[#668096]'
                        }`}
                      >
                        <Building2 className="w-4 h-4 mb-1" />
                        <span>Pharmacy / Kiosk Drop-off</span>
                        <span className="block text-[10px] font-normal text-[#668096] mt-0.5">Drop into secure bin anytime</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDisposalMethod('Scheduled Courier Collection')}
                        className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                          disposalMethod === 'Scheduled Courier Collection'
                            ? 'border-[#087E8B] bg-[#EAF7F6] text-[#087E8B] shadow-subtle'
                            : 'border-[#668096]/20 bg-[#FFFFFF] text-[#668096]'
                        }`}
                      >
                        <Clock className="w-4 h-4 mb-1" />
                        <span>Authorized Pickup</span>
                        <span className="block text-[10px] font-normal text-[#668096] mt-0.5">Scheduled carrier custody</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#16324F] mb-1">
                      Select Authorized Disposal Location:
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {locations.map(loc => (
                        <div
                          key={loc.id}
                          onClick={() => setSelectedLocationId(loc.id)}
                          className={`p-3 rounded-xl border cursor-pointer text-xs transition-all ${
                            selectedLocationId === loc.id
                              ? 'border-[#087E8B] bg-[#EAF7F6]/50 shadow-subtle'
                              : 'border-[#668096]/15 hover:bg-[#F6FAFA]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#16324F]">{loc.name}</span>
                            <span className="text-[10px] font-bold text-[#087E8B]">{loc.distanceKm} km</span>
                          </div>
                          <span className="text-[11px] text-[#668096] block truncate">{loc.address}</span>
                          <span className="text-[10px] text-[#3A9D74] font-semibold">{loc.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: CONFIRMATION & 4-STAGE PROGRESS TRACKER */}
              {wizardStep === 4 && createdRequest && (
                <div className="space-y-5 text-center py-2">
                  <div className="w-12 h-12 rounded-full bg-[#3A9D74]/15 text-[#3A9D74] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>

                  <div>
                    <span className="text-xs font-bold text-[#3A9D74] uppercase tracking-wider">
                      Disposal Request Created
                    </span>
                    <h3 className="font-heading text-xl font-extrabold text-[#16324F] mt-1">
                      Reference: {createdRequest.referenceId}
                    </h3>
                    <p className="text-xs text-[#668096] mt-0.5">
                      {createdRequest.quantity} {createdRequest.unit} of {createdRequest.medicineName} ({createdRequest.dosage})
                    </p>
                  </div>

                  {/* 4-STAGE PROGRESS TRACKER (Exact requirement) */}
                  <div className="p-4 bg-[#F6FAFA] rounded-xl border border-[#668096]/15 text-left space-y-3">
                    <span className="text-[10px] font-extrabold text-[#668096] uppercase tracking-wider block">
                      Disposal Lifecycle Tracker
                    </span>

                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      {[
                        { label: 'REQUESTED', active: true, done: true },
                        { label: 'SCHEDULED', active: false, done: false },
                        { label: 'COLLECTED', active: false, done: false },
                        { label: 'RESPONSIBLY PROCESSED', active: false, done: false },
                      ].map((st, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className={`h-2 rounded-full ${
                            st.done ? 'bg-[#087E8B]' : 'bg-[#668096]/20'
                          }`}></div>
                          <span className={`text-[10px] font-bold block ${
                            st.done ? 'text-[#087E8B]' : 'text-[#668096]'
                          }`}>
                            {st.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-[#FFFFFF] rounded-lg border border-[#668096]/10 text-xs text-[#16324F]">
                      <span className="font-bold text-[#087E8B]">Next Step: </span>
                      Bring the medication in its original blister/packaging to <strong>{createdRequest.locationName}</strong> or await courier verification.
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Wizard Navigation Footer */}
            <div className="px-6 py-4 border-t border-[#668096]/15 bg-[#F6FAFA] flex items-center justify-between">
              {wizardStep > 1 && wizardStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setWizardStep((wizardStep - 1) as 1 | 2 | 3)}
                  className="px-4 py-2 rounded-btn bg-[#FFFFFF] border border-[#668096]/20 text-[#16324F] text-xs font-bold hover:bg-[#EEF5FA]"
                >
                  Back
                </button>
              ) : <div></div>}

              {wizardStep === 1 && (
                <button
                  type="button"
                  onClick={() => setWizardStep(2)}
                  className="px-5 py-2.5 rounded-btn bg-[#087E8B] hover:bg-[#12A4A6] text-white text-xs font-bold transition-colors"
                >
                  Review Handling Category
                </button>
              )}

              {wizardStep === 2 && (
                <button
                  type="button"
                  onClick={() => setWizardStep(3)}
                  className="px-5 py-2.5 rounded-btn bg-[#087E8B] hover:bg-[#12A4A6] text-white text-xs font-bold transition-colors"
                >
                  Choose Disposal Point
                </button>
              )}

              {wizardStep === 3 && (
                <button
                  type="button"
                  onClick={handleCreateRequest}
                  className="px-5 py-2.5 rounded-btn bg-[#087E8B] hover:bg-[#12A4A6] text-white text-xs font-bold transition-colors"
                >
                  Confirm & Create Request
                </button>
              )}

              {wizardStep === 4 && (
                <button
                  type="button"
                  onClick={() => setIsWizardOpen(false)}
                  className="px-6 py-2.5 rounded-btn bg-[#087E8B] hover:bg-[#12A4A6] text-white text-xs font-bold transition-colors"
                >
                  Done & View in History
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* DIRECTIONS MODAL */}
      {directionsModalLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#16324F]/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#668096]/20 shadow-card max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#668096]/15">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#087E8B]" />
                <h3 className="font-heading font-bold text-sm text-[#16324F]">Directions to Take-Back Point</h3>
              </div>
              <button onClick={() => setDirectionsModalLocation(null)} className="text-[#668096]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="font-heading text-base font-bold text-[#16324F]">{directionsModalLocation.name}</h4>
              <p className="text-xs text-[#668096]">{directionsModalLocation.address}</p>
              <div className="p-3 bg-[#F6FAFA] rounded-xl border border-[#668096]/15 text-xs text-[#16324F] space-y-1.5">
                <div className="flex items-center justify-between font-bold">
                  <span>Distance: {directionsModalLocation.distanceKm} km</span>
                  <span className="text-[#3A9D74]">Est. 8 mins by car</span>
                </div>
                <p className="text-[11px] text-[#668096]">Transit: Bus route #14 stops directly in front of main entrance.</p>
                <p className="text-[11px] text-[#087E8B] font-bold">Phone: {directionsModalLocation.contactPhone}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setDirectionsModalLocation(null)}
              className="w-full py-2.5 rounded-btn bg-[#087E8B] hover:bg-[#12A4A6] text-white text-xs font-bold transition-colors"
            >
              Close Directions
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
