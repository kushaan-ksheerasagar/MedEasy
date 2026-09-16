import React, { useState, useEffect } from 'react';
import { Search, X, Pill, Package, Building2, User, MapPin, ArrowRight } from 'lucide-react';
import { inventoryService } from '../../services/inventoryService';
import { demandService } from '../../services/demandService';
import { patientService } from '../../services/patientService';
import { Medicine } from '../../types/inventory';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMedicine: (med: Medicine) => void;
  onSelectEntity?: (type: string, entity: any) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectMedicine,
  onSelectEntity,
}) => {
  const [query, setQuery] = useState('');
  const medicines = inventoryService.getAll();
  const zones = demandService.getAllZones();
  const patient = patientService.getProfile();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        // Toggle
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Search Medicines
  const matchedMedicines = medicines.filter(m =>
    !q ? false : m.name.toLowerCase().includes(q) || m.genericName.toLowerCase().includes(q)
  );

  // Search Batches
  const matchedBatches: { medicine: Medicine; batchNumber: string; location: string }[] = [];
  if (q) {
    medicines.forEach(m => {
      m.batches.forEach(b => {
        if (b.batchNumber.toLowerCase().includes(q)) {
          matchedBatches.push({ medicine: m, batchNumber: b.batchNumber, location: b.locationName });
        }
      });
    });
  }

  // Search Locations / Zones
  const matchedZones = zones.filter(z =>
    !q ? false : z.zoneName.toLowerCase().includes(q) || z.region.toLowerCase().includes(q)
  );

  // Search Patients / Pharmacies
  const matchedPatients = q && (patient.name.toLowerCase().includes(q) || patient.id.toLowerCase().includes(q))
    ? [patient]
    : [];

  const hasResults =
    matchedMedicines.length > 0 ||
    matchedBatches.length > 0 ||
    matchedZones.length > 0 ||
    matchedPatients.length > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#16324F]/50 backdrop-blur-xs flex items-start justify-center pt-20 p-4 animate-in fade-in duration-150">
      <div className="bg-[#FFFFFF] rounded-2xl max-w-2xl w-full shadow-elevated border border-[#668096]/20 overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#668096]/15 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#087E8B] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search medicines, batches, pharmacies, patients, or zones... (e.g. Amoxicillin, Zone A, ATV-24)"
            className="w-full text-sm text-[#16324F] placeholder-[#668096] bg-transparent focus:outline-none font-medium"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 rounded text-[#668096] hover:text-[#16324F]">
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[11px] font-mono text-[#668096] bg-[#F6FAFA] px-2 py-0.5 rounded border border-[#668096]/20">
            ESC
          </span>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4 text-xs">
          {!query ? (
            <div className="py-8 text-center text-[#668096]">
              <p className="font-medium text-sm text-[#16324F]">Quick Global Intelligence Search</p>
              <p className="text-xs mt-1">Type a medicine name, batch barcode, geographic zone, or patient record.</p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                {['Amoxicillin', 'Atorvastatin', 'Zone C', 'Batch ATV-24', 'Elena'].map(term => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-2.5 py-1 bg-[#EEF5FA] hover:bg-[#EAF7F6] text-[#087E8B] rounded-lg text-xs font-semibold transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : !hasResults ? (
            <div className="py-8 text-center text-[#668096]">
              <p className="text-sm font-semibold text-[#16324F]">No matching records found</p>
              <p className="text-xs mt-1">Try searching by generic chemical name, batch number, or zone code.</p>
            </div>
          ) : (
            <>
              {/* Medicines Section */}
              {matchedMedicines.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#668096] px-2">
                    Medicines ({matchedMedicines.length})
                  </span>
                  {matchedMedicines.map(med => (
                    <div
                      key={med.id}
                      onClick={() => {
                        onSelectMedicine(med);
                        onClose();
                      }}
                      className="p-2.5 rounded-xl hover:bg-[#EAF7F6] cursor-pointer flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#EAF7F6] text-[#087E8B] flex items-center justify-center">
                          <Pill className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-[#16324F] group-hover:text-[#087E8B]">
                            {med.name}
                          </span>
                          <span className="text-[11px] text-[#668096] ml-2">
                            {med.category} • {med.totalStock.toLocaleString()} units
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#668096] group-hover:text-[#087E8B]" />
                    </div>
                  ))}
                </div>
              )}

              {/* Batches Section */}
              {matchedBatches.length > 0 && (
                <div className="space-y-1 pt-2 border-t border-[#668096]/10">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#668096] px-2">
                    Batches ({matchedBatches.length})
                  </span>
                  {matchedBatches.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        onSelectMedicine(item.medicine);
                        onClose();
                      }}
                      className="p-2.5 rounded-xl hover:bg-[#EAF7F6] cursor-pointer flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#EEF5FA] text-[#16324F] flex items-center justify-center font-mono text-[10px] font-bold">
                          LOT
                        </div>
                        <div>
                          <span className="font-mono font-bold text-[#16324F]">
                            {item.batchNumber}
                          </span>
                          <span className="text-[11px] text-[#668096] ml-2">
                            ({item.medicine.name} at {item.location})
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-[#087E8B]">Inspect SKU</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Geographic Zones Section */}
              {matchedZones.length > 0 && (
                <div className="space-y-1 pt-2 border-t border-[#668096]/10">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#668096] px-2">
                    Geographic Zones ({matchedZones.length})
                  </span>
                  {matchedZones.map(zone => (
                    <div
                      key={zone.zoneId}
                      onClick={() => {
                        onSelectEntity?.('zone', zone);
                        onClose();
                      }}
                      className="p-2.5 rounded-xl hover:bg-[#EAF7F6] cursor-pointer flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#EEF5FA] text-[#087E8B] flex items-center justify-center">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-[#16324F]">
                            {zone.zoneName}
                          </span>
                          <span className="text-[11px] text-[#668096] ml-2">
                            Demand: {zone.demandIndex}/100 • {zone.status}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-[#087E8B]">View Map</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Patients Section */}
              {matchedPatients.length > 0 && (
                <div className="space-y-1 pt-2 border-t border-[#668096]/10">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#668096] px-2">
                    Patient Regimens ({matchedPatients.length})
                  </span>
                  {matchedPatients.map(p => (
                    <div
                      key={p.id}
                      onClick={() => {
                        onSelectEntity?.('patient', p);
                        onClose();
                      }}
                      className="p-2.5 rounded-xl hover:bg-[#EAF7F6] cursor-pointer flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#EAF7F6] text-[#087E8B] flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-[#16324F]">
                            {p.name}
                          </span>
                          <span className="text-[11px] text-[#668096] ml-2">
                            ID: {p.id} • {p.homeZone}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-[#087E8B]">Switch to Patient</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#F6FAFA] border-t border-[#668096]/15 text-[11px] text-[#668096] flex items-center justify-between">
          <span>Search across 22 medicines, 5 zones, and clinical registries</span>
          <span>Press ESC to close</span>
        </div>

      </div>
    </div>
  );
};
