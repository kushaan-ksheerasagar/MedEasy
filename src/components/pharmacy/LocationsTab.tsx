import React, { useState } from 'react';
import { demandService } from '../../services/demandService';
import { ZoneDemandSupply } from '../../types/demand';
import { DemoIntelligenceBanner } from '../common/DemoIntelligenceBanner';
import { 
  MapPin, 
  Layers, 
  Truck, 
  TrendingDown, 
  TrendingUp, 
  ShieldAlert, 
  AlertTriangle,
  Building2
} from 'lucide-react';

export const LocationsTab: React.FC = () => {
  const zones = demandService.getAllZones();
  const [selectedZone, setSelectedZone] = useState<ZoneDemandSupply>(zones[0]);
  const [activeLayer, setActiveLayer] = useState<'demand' | 'supply' | 'waste' | 'stockout'>('demand');

  const layers = [
    { id: 'demand', label: 'Demand' },
    { id: 'supply', label: 'Supply' },
    { id: 'waste', label: 'Waste Risk' },
    { id: 'stockout', label: 'Stockout Risk' },
  ];

  // Helper to get color/status based on selected map layer
  const getZoneLayerStatus = (zone: ZoneDemandSupply) => {
    switch (activeLayer) {
      case 'demand':
        return zone.demandIndex > 80 ? 'High' : zone.demandIndex > 50 ? 'Moderate' : 'Low';
      case 'supply':
        return zone.supplyIndex > 80 ? 'Surplus' : zone.supplyIndex > 50 ? 'Adequate' : 'Deficit';
      case 'waste':
        return zone.balanceRatio > 1.4 ? 'Elevated' : 'Controlled';
      case 'stockout':
        return zone.balanceRatio < 0.7 ? 'Elevated' : 'Stable';
    }
  };

  const getPinBg = (zone: ZoneDemandSupply) => {
    if (activeLayer === 'demand') {
      return zone.demandIndex > 80 ? 'bg-[#D95D5D]' : zone.demandIndex > 50 ? 'bg-[#087E8B]' : 'bg-[#7CC9C3]';
    } else if (activeLayer === 'supply') {
      return zone.supplyIndex > 80 ? 'bg-[#087E8B]' : zone.supplyIndex > 50 ? 'bg-[#3A9D74]' : 'bg-[#D95D5D]';
    } else if (activeLayer === 'waste') {
      return zone.balanceRatio > 1.4 ? 'bg-[#D95D5D]' : 'bg-[#3A9D74]';
    } else {
      return zone.balanceRatio < 0.7 ? 'bg-[#D95D5D]' : 'bg-[#3A9D74]';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* HEADER (Exact Title & Subtext from prompt) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#16324F]">Supply & Demand Map</h1>
          <p className="text-xs text-[#668096] mt-0.5 font-medium">
            Identify geographic imbalances before they become shortages or waste.
          </p>
        </div>

        {/* MAP LAYER TOGGLES (Demand, Supply, Waste Risk, Stockout Risk) */}
        <div className="flex items-center bg-[#FFFFFF] p-1 rounded-btn border border-[#668096]/20 shadow-subtle text-xs font-bold">
          <span className="text-[#668096] text-[11px] px-2 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#087E8B]" /> Layer:
          </span>
          {layers.map(l => (
            <button
              key={l.id}
              onClick={() => setActiveLayer(l.id as any)}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeLayer === l.id
                  ? 'bg-[#087E8B] text-white shadow-subtle'
                  : 'text-[#668096] hover:text-[#16324F]'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <DemoIntelligenceBanner message="Fictional aggregated zones preserve privacy. Color codes adapt to active layer toggle (Demand, Supply, Waste Risk, Stockout Risk)." />

      {/* Main Map & Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SVG Zone Grid Canvas */}
        <div className="lg:col-span-7 bg-[#FFFFFF] rounded-card p-6 border border-[#668096]/15 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#087E8B]" />
                <h3 className="font-heading font-bold text-sm text-[#16324F]">
                  Metropolitan Distribution Grid — Active Layer: <span className="text-[#087E8B] uppercase">{activeLayer}</span>
                </h3>
              </div>
              <span className="text-[11px] text-[#668096]">Click a node to inspect</span>
            </div>

            {/* Interactive SVG Canvas */}
            <div className="relative w-full h-80 bg-[#16324F] rounded-2xl overflow-hidden border border-[#668096]/30 p-4 shadow-inner">
              
              {/* Subtle grid pattern */}
              <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="gridPattern" width="36" height="36" patternUnits="userSpaceOnUse">
                    <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#7CC9C3" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#gridPattern)" />
              </svg>

              {/* Transit corridors */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line x1="38%" y1="28%" x2="55%" y2="52%" stroke="#7CC9C3" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
                <line x1="55%" y1="52%" x2="78%" y2="35%" stroke="#7CC9C3" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
                <line x1="38%" y1="28%" x2="22%" y2="65%" stroke="#7CC9C3" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
                <line x1="55%" y1="52%" x2="50%" y2="82%" stroke="#7CC9C3" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
                <line x1="78%" y1="35%" x2="38%" y2="28%" stroke="#D95D5D" strokeWidth="2.5" strokeDasharray="6 4" opacity="0.8" />
              </svg>

              {/* Zone Pins */}
              {zones.map(z => {
                const isSelected = selectedZone.zoneId === z.zoneId;
                const pinBg = getPinBg(z);

                return (
                  <button
                    key={z.zoneId}
                    type="button"
                    onClick={() => setSelectedZone(z)}
                    style={{ left: `${z.coordinates.x}%`, top: `${z.coordinates.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all ${
                      isSelected ? 'scale-125 z-20' : 'hover:scale-110 z-10'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-card ring-4 ring-[#FFFFFF]/20 ${pinBg}`}>
                      {z.zoneId.split('-')[1].toUpperCase()}
                    </div>
                    
                    <div className="mt-1 bg-[#16324F]/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow border border-[#668096]/40 whitespace-nowrap">
                      {z.zoneName.split('—')[1]?.trim() || z.zoneName}
                    </div>
                  </button>
                );
              })}

              {/* Highway route prompt */}
              <div className="absolute bottom-3 left-3 right-3 bg-[#16324F]/95 backdrop-blur-xs border border-[#668096]/30 rounded-xl p-2.5 flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D95D5D] animate-ping"></span>
                  <span className="text-[11px]">
                    Recommended Logistics Rebalance: <strong>Zone C (East Harbor) → Zone A (North Metro)</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => alert("Rebalance corridor dispatched between Zone C and Zone A.")}
                  className="bg-[#087E8B] hover:bg-[#12A4A6] text-white px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase transition-colors"
                >
                  Dispatch
                </button>
              </div>

            </div>
          </div>
          <p className="text-[11px] text-[#668096] mt-3 italic">
            *Red vector indicates active inter-zone transfer to prevent antibiotic stockout in Zone A using surplus from Zone C.
          </p>
        </div>

        {/* Zone Detail Card (Zone name, Demand index, Supply index, Waste risk, Stockout risk, Top medicines) */}
        <div className="lg:col-span-5 bg-[#FFFFFF] rounded-card p-6 border border-[#668096]/15 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between pb-3 border-b border-[#668096]/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#668096]">
                  {selectedZone.region}
                </span>
                <h3 className="font-heading text-lg font-bold text-[#16324F] mt-0.5">{selectedZone.zoneName}</h3>
                <p className="text-xs text-[#668096]">{selectedZone.coveredPopulationEst} • {selectedZone.activePharmaciesCount} clinics</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                selectedZone.colorCode === 'green'
                  ? 'bg-[#3A9D74]/10 text-[#3A9D74]'
                  : selectedZone.colorCode === 'yellow'
                  ? 'bg-[#E9A23B]/10 text-[#E9A23B]'
                  : 'bg-[#D95D5D]/10 text-[#D95D5D]'
              }`}>
                {selectedZone.status}
              </span>
            </div>

            {/* Metrics List */}
            <div className="mt-4 space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-[#F6FAFA] rounded-xl border border-[#668096]/10">
                <span className="text-[#668096] font-medium">Demand Index:</span>
                <span className="font-bold text-[#16324F]">{selectedZone.demandIndex} / 100 ({selectedZone.demandIndex > 80 ? 'High' : 'Moderate'})</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#F6FAFA] rounded-xl border border-[#668096]/10">
                <span className="text-[#668096] font-medium">Supply Index:</span>
                <span className="font-bold text-[#16324F]">{selectedZone.supplyIndex} / 100 ({selectedZone.supplyIndex > 80 ? 'Surplus' : selectedZone.supplyIndex < 50 ? 'Low' : 'Adequate'})</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#F6FAFA] rounded-xl border border-[#668096]/10">
                <span className="text-[#668096] font-medium">Stockout Risk:</span>
                <span className={`font-bold ${selectedZone.balanceRatio < 0.7 ? 'text-[#D95D5D]' : 'text-[#3A9D74]'}`}>
                  {selectedZone.balanceRatio < 0.7 ? 'Elevated (Critical)' : 'Low'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#F6FAFA] rounded-xl border border-[#668096]/10">
                <span className="text-[#668096] font-medium">Waste Risk:</span>
                <span className={`font-bold ${selectedZone.balanceRatio > 1.4 ? 'text-[#D95D5D]' : 'text-[#3A9D74]'}`}>
                  {selectedZone.balanceRatio > 1.4 ? 'Elevated (Surplus)' : 'Minimal'}
                </span>
              </div>

              {/* Top Medicines Section */}
              <div className="pt-2 space-y-2">
                <div className="p-3 bg-[#D95D5D]/5 rounded-xl border border-[#D95D5D]/20">
                  <span className="text-[10px] font-bold text-[#D95D5D] uppercase tracking-wider block">
                    Top Deficit Medicine:
                  </span>
                  <p className="text-xs font-bold text-[#16324F] mt-0.5">{selectedZone.topDeficitMedicine}</p>
                </div>

                <div className="p-3 bg-[#EAF7F6] rounded-xl border border-[#7CC9C3]/40">
                  <span className="text-[10px] font-bold text-[#087E8B] uppercase tracking-wider block">
                    Top Surplus Medicine:
                  </span>
                  <p className="text-xs font-bold text-[#16324F] mt-0.5">{selectedZone.topSurplusMedicine}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#668096]/10">
            <button
              type="button"
              onClick={() => alert(`Coordinating rebalance from ${selectedZone.zoneName}. Automated route generated.`)}
              className="w-full py-2.5 rounded-btn bg-[#087E8B] hover:bg-[#066570] text-white text-xs font-bold shadow-subtle flex items-center justify-center gap-2 transition-colors"
            >
              <Truck className="w-4 h-4" />
              Coordinate Cross-Zone Rebalance
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
