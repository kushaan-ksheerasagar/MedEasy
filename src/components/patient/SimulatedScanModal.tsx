import React, { useState } from 'react';
import { X, Camera, Upload, Sparkles, CheckCircle2, Barcode, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { PatientMedicine } from '../../types/patient';

interface SimulatedScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMedicineScanned: (med: Partial<PatientMedicine>) => void;
  onManualAddRequested?: () => void;
}

export const SimulatedScanModal: React.FC<SimulatedScanModalProps> = ({
  isOpen,
  onClose,
  onMedicineScanned,
  onManualAddRequested,
}) => {
  const [activeMode, setActiveMode] = useState<'scan' | 'upload' | 'manual'>('scan');
  const [step, setStep] = useState<'ready' | 'processing' | 'detected'>('ready');
  
  // Detected details state
  const [detectedData, setDetectedData] = useState({
    medicineName: 'Metformin Hydrochloride',
    strength: '500 mg',
    quantity: 60,
    batch: 'MET-26-402',
    expiry: '2027-04-30',
    dosage: '1 tablet twice daily with meals',
    form: 'Tablet'
  });

  if (!isOpen) return null;

  const handleTriggerCapture = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('detected');
    }, 1600);
  };

  const handleConfirmAndSave = () => {
    onMedicineScanned({
      medicineName: `${detectedData.medicineName} ${detectedData.strength}`,
      dosage: detectedData.dosage,
      form: detectedData.form as any,
      quantityPurchased: detectedData.quantity,
      quantityRemaining: detectedData.quantity,
      expiryDate: detectedData.expiry,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#16324F]/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-[#FFFFFF] rounded-2xl max-w-lg w-full p-6 shadow-elevated border border-[#668096]/20">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#668096]/15">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#087E8B]/10 text-[#087E8B]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-[#16324F]">Add Medicine to Plan</h3>
              <p className="text-xs text-[#668096]">MedEasy Computer Vision & Optical Recognition</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#668096] hover:text-[#16324F]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Options: Scan package, Upload prescription, Add manually */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveMode('scan');
              setStep('ready');
            }}
            className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
              activeMode === 'scan'
                ? 'bg-[#EAF7F6] border-[#087E8B] text-[#087E8B] shadow-subtle'
                : 'bg-[#F6FAFA] border-[#668096]/20 text-[#668096] hover:bg-[#EEF5FA]'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Scan Package</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMode('upload');
              setStep('ready');
            }}
            className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
              activeMode === 'upload'
                ? 'bg-[#EAF7F6] border-[#087E8B] text-[#087E8B] shadow-subtle'
                : 'bg-[#F6FAFA] border-[#668096]/20 text-[#668096] hover:bg-[#EEF5FA]'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Rx</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onManualAddRequested?.();
            }}
            className="p-2.5 rounded-xl border bg-[#F6FAFA] border-[#668096]/20 text-[#668096] hover:bg-[#EEF5FA] hover:text-[#16324F] text-xs font-bold flex flex-col items-center gap-1.5 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Add Manually</span>
          </button>
        </div>

        {/* Scanner Body Simulation */}
        <div className="mt-4">
          {step !== 'detected' ? (
            <div className="relative bg-[#16324F] rounded-xl h-56 overflow-hidden flex flex-col items-center justify-center border border-[#668096]/30 text-white p-4">
              {/* Target Bounding Box */}
              <div className="w-48 h-32 border-2 border-dashed border-[#7CC9C3] rounded-xl flex items-center justify-center relative">
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#7CC9C3]"></div>
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#7CC9C3]"></div>
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#7CC9C3]"></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#7CC9C3]"></div>

                {step === 'processing' ? (
                  <div className="text-center space-y-2">
                    <Sparkles className="w-6 h-6 text-[#7CC9C3] animate-spin mx-auto" />
                    <span className="text-xs font-semibold text-[#7CC9C3] block">
                      Extracting NDC barcode & dosage...
                    </span>
                  </div>
                ) : (
                  <div className="text-center p-2">
                    <Barcode className="w-8 h-8 text-[#668096] mx-auto mb-1" />
                    <span className="text-xs text-slate-300 block">
                      Align box label or QR code
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  disabled={step === 'processing'}
                  onClick={handleTriggerCapture}
                  className="px-5 py-2 rounded-btn bg-[#087E8B] hover:bg-[#12A4A6] text-white text-xs font-bold shadow-subtle transition-all"
                >
                  {step === 'processing' ? 'Processing...' : 'Simulate Capture'}
                </button>
              </div>
            </div>
          ) : (
            /* DETECTED CONFIRMATION SCREEN (Display detected: Medicine, Strength, Quantity, Batch, Expiry) */
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-xl bg-[#3A9D74]/10 border border-[#3A9D74]/30 flex items-center gap-2 text-xs text-[#3A9D74] font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Medicine Detected Successfully! Verify details below:</span>
              </div>

              <div className="p-4 rounded-xl bg-[#F6FAFA] border border-[#668096]/20 space-y-2.5 text-xs text-[#16324F]">
                <div className="flex items-center justify-between border-b border-[#668096]/10 pb-1.5">
                  <span className="text-[#668096]">Detected Medicine:</span>
                  <strong className="text-sm font-bold text-[#16324F]">{detectedData.medicineName}</strong>
                </div>

                <div className="flex items-center justify-between border-b border-[#668096]/10 pb-1.5">
                  <span className="text-[#668096]">Strength:</span>
                  <span className="font-bold">{detectedData.strength}</span>
                </div>

                <div className="flex items-center justify-between border-b border-[#668096]/10 pb-1.5">
                  <span className="text-[#668096]">Total Quantity:</span>
                  <span className="font-bold">{detectedData.quantity} units</span>
                </div>

                <div className="flex items-center justify-between border-b border-[#668096]/10 pb-1.5">
                  <span className="text-[#668096]">Batch / Lot #:</span>
                  <span className="font-mono font-bold">{detectedData.batch}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#668096]">Package Expiry Date:</span>
                  <span className="font-bold text-[#3A9D74]">{detectedData.expiry}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('ready')}
                  className="px-3.5 py-2 rounded-btn border border-[#668096]/25 text-xs font-bold text-[#16324F] hover:bg-[#F6FAFA]"
                >
                  Scan Again
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAndSave}
                  className="px-5 py-2 rounded-btn bg-[#087E8B] hover:bg-[#066570] text-white text-xs font-bold shadow-subtle"
                >
                  Confirm & Add to Medication List
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
