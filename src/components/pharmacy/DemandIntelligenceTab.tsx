import React, { useState } from 'react';
import { demandService } from '../../services/demandService';
import { inventoryService } from '../../services/inventoryService';
import { Medicine } from '../../types/inventory';
import { DemoIntelligenceBanner } from '../common/DemoIntelligenceBanner';
import { 
  TrendingUp, 
  TrendingDown, 
  MapPin, 
  Activity, 
  AlertOctagon, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  BarChart, 
  Bar 
} from 'recharts';

interface DemandIntelligenceTabProps {
  onSelectMedicine: (med: Medicine) => void;
  onNavigateTab: (tabId: string) => void;
}

export const DemandIntelligenceTab: React.FC<DemandIntelligenceTabProps> = ({ 
  onSelectMedicine,
  onNavigateTab
}) => {
  const [forecastHorizon, setForecastHorizon] = useState<'30' | '60' | '90'>('30');
  const trending = demandService.getTrendingMedicines();
  const zones = demandService.getAllZones();

  // Forecast data with confidence interval range [ConfidenceMin, ConfidenceMax]
  const forecastDataMap = {
    '30': [
      { period: 'Past 30d', Historical: 10420, Forecast: 10420, ConfidenceMin: 10420, ConfidenceMax: 10420 },
      { period: 'Day 10', Historical: null, Forecast: 10650, ConfidenceMin: 10200, ConfidenceMax: 11100 },
      { period: 'Day 20', Historical: null, Forecast: 10900, ConfidenceMin: 10350, ConfidenceMax: 11450 },
      { period: 'Day 30', Historical: null, Forecast: 11150, ConfidenceMin: 10500, ConfidenceMax: 11800 },
    ],
    '60': [
      { period: 'Month 0', Historical: 10420, Forecast: 10420, ConfidenceMin: 10420, ConfidenceMax: 10420 },
      { period: 'Month +1 (Oct)', Historical: null, Forecast: 11150, ConfidenceMin: 10400, ConfidenceMax: 11900 },
      { period: 'Month +2 (Nov)', Historical: null, Forecast: 11680, ConfidenceMin: 10700, ConfidenceMax: 12600 },
    ],
    '90': [
      { period: 'Month 0', Historical: 10420, Forecast: 10420, ConfidenceMin: 10420, ConfidenceMax: 10420 },
      { period: 'Month +1 (Oct)', Historical: null, Forecast: 11150, ConfidenceMin: 10300, ConfidenceMax: 12000 },
      { period: 'Month +2 (Nov)', Historical: null, Forecast: 11680, ConfidenceMin: 10600, ConfidenceMax: 12700 },
      { period: 'Month +3 (Dec)', Historical: null, Forecast: 12200, ConfidenceMin: 10900, ConfidenceMax: 13500 },
    ]
  };

  // Specific Demand Anomalies requested by prompt
  const demandAnomalies = [
    {
      id: 'anom-1',
      medicine: 'Paracetamol 500mg',
      zone: 'Zone A (North Zone)',
      description: 'Paracetamol demand increased 22% above expected levels in North Zone.',
      expected: 1350,
      actual: 1650,
      diffPercent: '+22.2%',
      cause: 'Early localized viral/respiratory cluster reported in clinic logs.'
    },
    {
      id: 'anom-2',
      medicine: 'Amoxicillin 500mg',
      zone: 'Zone B (Central District)',
      description: 'Amoxicillin daily draw exceeded safe lead-time buffer by 18%.',
      expected: 700,
      actual: 820,
      diffPercent: '+17.1%',
      cause: 'Secondary bacterial bronchitis prescriptions surged post-flu wave.'
    },
    {
      id: 'anom-3',
      medicine: 'Doxycycline 100mg',
      zone: 'Zone C (East Harbor)',
      description: 'Doxycycline consumption collapsed -18.4% below baseline expectation.',
      expected: 135,
      actual: 110,
      diffPercent: '-18.5%',
      cause: 'Seasonal tick-borne illness period ended sooner than prior year.'
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* HEADER (Exact UX text required by user) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#16324F]">Demand Intelligence</h1>
          <p className="text-xs text-[#668096] mt-0.5 font-medium">
            Understand what medicines are needed, where and when.
          </p>
        </div>
      </div>

      <DemoIntelligenceBanner message="Demand intelligence applies deterministic run-rate calculations from regional outpatient dispensing logs. Labeled strictly as model predictions." />

      {/* 1 & 2: DEMAND FORECAST WITH CONFIDENCE RANGE */}
      <div className="bg-[#FFFFFF] rounded-card p-6 border border-[#668096]/15 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-base text-[#16324F]">
                Regional Demand Forecast & Confidence Range
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#087E8B] bg-[#EAF7F6] px-2 py-0.5 rounded-full border border-[#7CC9C3]/40">
                Model prediction
              </span>
            </div>
            <p className="text-xs text-[#668096] mt-0.5">
              Historical baseline compared to predicted consumption band (Confidence: 92–96%)
            </p>
          </div>

          {/* 30d, 60d, 90d Horizon Toggles */}
          <div className="flex items-center bg-[#EEF5FA] p-1 rounded-btn border border-[#668096]/15 text-xs font-bold">
            {(['30', '60', '90'] as const).map(d => (
              <button
                key={d}
                onClick={() => setForecastHorizon(d)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  forecastHorizon === d
                    ? 'bg-[#FFFFFF] text-[#087E8B] shadow-subtle'
                    : 'text-[#668096] hover:text-[#16324F]'
                }`}
              >
                {d} Days
              </button>
            ))}
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastDataMap[forecastHorizon]} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7CC9C3" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#7CC9C3" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF5FA" />
              <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#668096' }} axisLine={{ stroke: '#EEF5FA' }} />
              <YAxis tick={{ fontSize: 11, fill: '#668096' }} axisLine={{ stroke: '#EEF5FA' }} domain={['dataMin - 500', 'dataMax + 500']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#16324F', borderRadius: '10px', color: '#fff', fontSize: '12px', border: 'none' }}
                formatter={(val: number) => [`${val.toLocaleString()} units`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area 
                type="monotone" 
                dataKey="ConfidenceMax" 
                stroke="#7CC9C3" 
                strokeWidth={1} 
                strokeDasharray="3 3"
                fill="url(#colorConfidence)" 
                name="Upper Confidence (95%)"
              />
              <Area 
                type="monotone" 
                dataKey="Forecast" 
                stroke="#087E8B" 
                strokeWidth={2.5} 
                fill="none" 
                name="Model Prediction (Units)"
              />
              <Area 
                type="monotone" 
                dataKey="ConfidenceMin" 
                stroke="#7CC9C3" 
                strokeWidth={1} 
                strokeDasharray="3 3"
                fill="none" 
                name="Lower Confidence (95%)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. DEMAND ANOMALIES SECTION (Expected vs Actual vs Difference) */}
      <div className="bg-[#FFFFFF] rounded-card p-6 border border-[#668096]/15 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-base text-[#16324F] flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-[#D95D5D]" />
              Demand Anomalies Detected
            </h3>
            <p className="text-xs text-[#668096] mt-0.5">Statistical deviation from seasonal multi-year run rates</p>
          </div>
          <span className="text-xs font-bold text-[#D95D5D] bg-[#D95D5D]/10 px-2.5 py-1 rounded-full">
            3 Active Anomalies
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {demandAnomalies.map(anom => (
            <div key={anom.id} className="p-4 rounded-xl border border-[#668096]/15 bg-[#F6FAFA] space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <span className="font-heading font-bold text-sm text-[#16324F]">{anom.medicine}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    anom.diffPercent.startsWith('+') ? 'bg-[#D95D5D]/15 text-[#D95D5D]' : 'bg-[#E9A23B]/15 text-[#E9A23B]'
                  }`}>
                    {anom.diffPercent}
                  </span>
                </div>
                <span className="text-[11px] text-[#668096] font-medium block mt-0.5">{anom.zone}</span>
                
                <p className="text-xs text-[#16324F] font-semibold mt-2 leading-relaxed">
                  "{anom.description}"
                </p>
                <p className="text-[11px] text-[#668096] mt-1 italic">
                  Root Cause: {anom.cause}
                </p>
              </div>

              {/* Expected vs Actual vs Diff Grid */}
              <div className="pt-3 border-t border-[#668096]/15 grid grid-cols-3 gap-1 text-center">
                <div className="p-1.5 bg-[#FFFFFF] rounded-lg border border-[#668096]/10">
                  <span className="text-[10px] text-[#668096] block">Expected</span>
                  <strong className="text-xs text-[#16324F]">{anom.expected}</strong>
                </div>
                <div className="p-1.5 bg-[#FFFFFF] rounded-lg border border-[#668096]/10">
                  <span className="text-[10px] text-[#668096] block">Actual</span>
                  <strong className="text-xs text-[#16324F]">{anom.actual}</strong>
                </div>
                <div className="p-1.5 bg-[#FFFFFF] rounded-lg border border-[#668096]/10">
                  <span className="text-[10px] text-[#668096] block">Diff</span>
                  <strong className={`text-xs ${anom.diffPercent.startsWith('+') ? 'text-[#D95D5D]' : 'text-[#E9A23B]'}`}>
                    {anom.diffPercent}
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. GEOGRAPHIC DEMAND SECTION */}
      <div className="bg-[#FFFFFF] rounded-card p-6 border border-[#668096]/15 shadow-subtle">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading font-bold text-base text-[#16324F]">Geographic Demand Distribution</h3>
            <p className="text-xs text-[#668096]">Aggregated demand intensity index across urban and suburban health zones</p>
          </div>
          <button
            onClick={() => onNavigateTab('locations')}
            className="text-xs font-bold text-[#087E8B] hover:underline"
          >
            Open Map View →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {zones.map(z => (
            <div key={z.zoneId} className="p-3.5 rounded-xl border border-[#668096]/15 bg-[#F6FAFA]">
              <span className="font-heading font-bold text-xs text-[#16324F] block truncate">{z.zoneName.split('—')[0]}</span>
              <p className="text-[11px] text-[#668096]">{z.region.split(' ')[0]}</p>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-[11px] text-[#668096]">Demand:</span>
                <span className="font-heading font-bold text-base text-[#087E8B]">{z.demandIndex}/100</span>
              </div>
              <div className="w-full bg-[#EEF5FA] h-1.5 rounded-full overflow-hidden mt-1">
                <div style={{ width: `${z.demandIndex}%` }} className="bg-[#087E8B] h-full rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
