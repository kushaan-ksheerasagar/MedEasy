import React, { useState } from 'react';
import { inventoryService } from '../../services/inventoryService';
import { Medicine } from '../../types/inventory';
import { DemoIntelligenceBanner } from '../common/DemoIntelligenceBanner';
import { 
  Calendar, 
  ArrowRight, 
  AlertTriangle, 
  ShieldAlert, 
  TrendingUp, 
  Sparkles, 
  ChevronRight 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

interface OverviewTabProps {
  onSelectMedicine: (med: Medicine) => void;
  onNavigateTab: (tabId: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ onSelectMedicine, onNavigateTab }) => {
  const [horizon, setHorizon] = useState<'7D' | '30D' | '90D'>('30D');
  const [selectedDate, setSelectedDate] = useState('September 2026');

  const medicines = inventoryService.getAll();

  // Multi-horizon demand vs inventory chart data
  const demandVsInventoryData = {
    '7D': [
      { period: 'Day 1', Demand: 340, Projected: 350, Inventory: 12480 },
      { period: 'Day 2', Demand: 380, Projected: 360, Inventory: 12100 },
      { period: 'Day 3', Demand: 360, Projected: 370, Inventory: 11740 },
      { period: 'Day 4', Demand: 410, Projected: 390, Inventory: 11330 },
      { period: 'Day 5', Demand: 430, Projected: 410, Inventory: 10900 },
      { period: 'Day 6', Demand: 390, Projected: 420, Inventory: 10510 },
      { period: 'Day 7', Demand: 440, Projected: 430, Inventory: 10070 },
    ],
    '30D': [
      { period: 'Week 1', Demand: 2450, Projected: 2500, Inventory: 12480 },
      { period: 'Week 2', Demand: 2680, Projected: 2600, Inventory: 9800 },
      { period: 'Week 3', Demand: 2890, Projected: 2750, Inventory: 6910 },
      { period: 'Week 4', Demand: 3120, Projected: 2900, Inventory: 3790 },
    ],
    '90D': [
      { period: 'Month 1 (Jul)', Demand: 9340, Projected: 9100, Inventory: 14200 },
      { period: 'Month 2 (Aug)', Demand: 9810, Projected: 9600, Inventory: 13100 },
      { period: 'Month 3 (Sep)', Demand: 10420, Projected: 10200, Inventory: 12480 },
      { period: 'Month 4 (Oct Est)', Demand: 0, Projected: 11150, Inventory: 9500 },
      { period: 'Month 5 (Nov Est)', Demand: 0, Projected: 11680, Inventory: 7200 },
      { period: 'Month 6 (Dec Est)', Demand: 0, Projected: 12200, Inventory: 5100 },
    ]
  };

  // SVG mini-sparkline generator for the 4 KPI cards
  const sparklines = {
    total: [40, 42, 45, 43, 48, 52, 50, 55],
    atRisk: [12, 14, 18, 16, 22, 20, 24, 21],
    expiring: [8, 9, 11, 10, 14, 15, 12, 13],
    stockout: [4, 5, 4, 6, 7, 6, 8, 8]
  };

  const renderSparkline = (points: number[], color: string) => {
    const max = Math.max(...points);
    const min = Math.min(...points);
    const width = 80;
    const height = 24;
    const step = width / (points.length - 1);
    const coords = points.map((p, i) => {
      const x = i * step;
      const y = height - ((p - min) / (max - min || 1)) * (height - 6) - 3;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg className="w-20 h-6 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={coords}
        />
      </svg>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* HEADER (Exact UX copy required by user) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#16324F]">
            Good morning, Demo Pharmacy
          </h1>
          <p className="text-xs text-[#668096] mt-0.5 font-medium">
            Here's what's happening with your medicine inventory.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-[#FFFFFF] px-3 py-1.5 rounded-btn border border-[#668096]/20 shadow-subtle text-xs text-[#16324F] font-semibold">
          <Calendar className="w-3.5 h-3.5 text-[#087E8B]" />
          <span>{selectedDate}</span>
        </div>
      </div>

      <DemoIntelligenceBanner />

      {/* PRIMARY KPI ROW (Exact 4 high-value metrics with tiny sparklines, no clutter) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Total Inventory */}
        <div 
          onClick={() => onNavigateTab('inventory')}
          className="bg-[#FFFFFF] rounded-card p-5 border border-[#668096]/15 shadow-subtle hover:border-[#087E8B]/40 cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-[#668096]">Total Inventory</span>
              <p className="font-heading text-2xl font-bold text-[#16324F] mt-1">12,480 <span className="text-xs font-normal text-[#668096]">units</span></p>
            </div>
            <div className="pt-1">
              {renderSparkline(sparklines.total, '#087E8B')}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-[#3A9D74]">
            <span>+3.4%</span>
            <span className="text-[#668096] font-normal">vs last month</span>
          </div>
        </div>

        {/* 2. At Risk */}
        <div 
          onClick={() => onNavigateTab('waste')}
          className="bg-[#FFFFFF] rounded-card p-5 border border-[#668096]/15 shadow-subtle hover:border-[#D95D5D]/40 cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-[#668096]">At Risk</span>
              <p className="font-heading text-2xl font-bold text-[#D95D5D] mt-1">684 <span className="text-xs font-normal text-[#668096]">units</span></p>
            </div>
            <div className="pt-1">
              {renderSparkline(sparklines.atRisk, '#D95D5D')}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-[#D95D5D]">
            <span>-5.2%</span>
            <span className="text-[#668096] font-normal">potential waste velocity</span>
          </div>
        </div>

        {/* 3. Expiring Soon */}
        <div 
          onClick={() => onNavigateTab('expiry')}
          className="bg-[#FFFFFF] rounded-card p-5 border border-[#668096]/15 shadow-subtle hover:border-[#E9A23B]/40 cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-[#668096]">Expiring Soon</span>
              <p className="font-heading text-2xl font-bold text-[#E9A23B] mt-1">126 <span className="text-xs font-normal text-[#668096]">units</span></p>
            </div>
            <div className="pt-1">
              {renderSparkline(sparklines.expiring, '#E9A23B')}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-[#E9A23B]">
            <span>Within 60 days</span>
            <span className="text-[#668096] font-normal">across 4 batches</span>
          </div>
        </div>

        {/* 4. Stockout Risk */}
        <div 
          onClick={() => onNavigateTab('inventory')}
          className="bg-[#FFFFFF] rounded-card p-5 border border-[#668096]/15 shadow-subtle hover:border-[#D95D5D]/40 cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-[#668096]">Stockout Risk</span>
              <p className="font-heading text-2xl font-bold text-[#16324F] mt-1">8 <span className="text-xs font-normal text-[#668096]">medicines</span></p>
            </div>
            <div className="pt-1">
              {renderSparkline(sparklines.stockout, '#D95D5D')}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-[#D95D5D]">
            <span>6 critical</span>
            <span className="text-[#668096] font-normal">&lt; 10 days runway</span>
          </div>
        </div>

      </div>

      {/* MAIN INTELLIGENCE PANEL & INVENTORY HEALTH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Intelligence Panel (3 key insights with 'View' action) */}
        <div className="lg:col-span-7 bg-[#FFFFFF] rounded-card p-6 border border-[#668096]/15 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#668096]/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#087E8B]"></div>
                <h3 className="font-heading font-bold text-base text-[#16324F]">Inventory Intelligence</h3>
              </div>
              <span className="text-[11px] font-semibold text-[#087E8B] bg-[#EAF7F6] px-2 py-0.5 rounded-full">
                Real-Time Insights
              </span>
            </div>

            <div className="divide-y divide-[#668096]/10 mt-2">
              
              {/* Insight 1: HIGH DEMAND */}
              <div className="py-3.5 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#3A9D74]">
                    HIGH DEMAND
                  </span>
                  <h4 className="text-sm font-bold text-[#16324F]">Amoxicillin demand +18%</h4>
                  <p className="text-xs text-[#668096]">Surging in Zone A outpatient clinics due to seasonal respiratory wave.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const med = medicines.find(m => m.name.includes('Amoxicillin'));
                    if (med) onSelectMedicine(med);
                  }}
                  className="text-xs font-bold text-[#087E8B] hover:text-[#066570] shrink-0 flex items-center gap-1 hover:underline"
                >
                  View <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Insight 2: WASTE RISK */}
              <div className="py-3.5 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D95D5D]">
                    WASTE RISK
                  </span>
                  <h4 className="text-sm font-bold text-[#16324F]">420 units potentially at risk</h4>
                  <p className="text-xs text-[#668096]">Atorvastatin 20mg holdings exceed projected run-rate before expiry in 45 days.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const med = medicines.find(m => m.name.includes('Atorvastatin'));
                    if (med) onSelectMedicine(med);
                  }}
                  className="text-xs font-bold text-[#087E8B] hover:text-[#066570] shrink-0 flex items-center gap-1 hover:underline"
                >
                  View <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Insight 3: STOCKOUT */}
              <div className="py-3.5 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#E9A23B]">
                    STOCKOUT
                  </span>
                  <h4 className="text-sm font-bold text-[#16324F]">3 medicines projected below safety stock</h4>
                  <p className="text-xs text-[#668096]">Lead time reorder thresholds breached for Azithromycin and Amoxicillin.</p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab('inventory')}
                  className="text-xs font-bold text-[#087E8B] hover:text-[#066570] shrink-0 flex items-center gap-1 hover:underline"
                >
                  View <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* INVENTORY HEALTH (Clean horizontal distribution visualization) */}
        <div className="lg:col-span-5 bg-[#FFFFFF] rounded-card p-6 border border-[#668096]/15 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3">
              <div>
                <h3 className="font-heading font-bold text-base text-[#16324F]">Inventory Health</h3>
                <p className="text-xs text-[#668096]">Portfolio state across 22 monitored medicines</p>
              </div>
            </div>

            {/* Horizontal Distribution Visualization */}
            <div className="mt-4 space-y-3">
              <div className="h-4 rounded-full overflow-hidden flex w-full bg-[#EEF5FA]">
                <div style={{ width: '68%' }} className="bg-[#3A9D74] transition-all" title="Healthy (68%)"></div>
                <div style={{ width: '22%' }} className="bg-[#E9A23B] transition-all" title="Attention (22%)"></div>
                <div style={{ width: '10%' }} className="bg-[#D95D5D] transition-all" title="Critical (10%)"></div>
              </div>

              {/* Legend with exact percentages and SKU counts */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
                <div className="p-3 bg-[#3A9D74]/10 rounded-xl border border-[#3A9D74]/20">
                  <span className="font-bold text-[#3A9D74] block">Healthy</span>
                  <p className="font-heading text-lg font-bold text-[#16324F] mt-0.5">68%</p>
                  <p className="text-[10px] text-[#668096]">15 medicines</p>
                </div>
                <div className="p-3 bg-[#E9A23B]/10 rounded-xl border border-[#E9A23B]/20">
                  <span className="font-bold text-[#E9A23B] block">Attention</span>
                  <p className="font-heading text-lg font-bold text-[#16324F] mt-0.5">22%</p>
                  <p className="text-[10px] text-[#668096]">5 medicines</p>
                </div>
                <div className="p-3 bg-[#D95D5D]/10 rounded-xl border border-[#D95D5D]/20">
                  <span className="font-bold text-[#D95D5D] block">Critical</span>
                  <p className="font-heading text-lg font-bold text-[#16324F] mt-0.5">10%</p>
                  <p className="text-[10px] text-[#668096]">2 medicines</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#668096]/10 text-xs text-[#668096] flex items-center justify-between">
            <span>Average inventory velocity: <strong>14.8 units/day</strong></span>
            <button 
              type="button"
              onClick={() => onNavigateTab('waste')}
              className="text-[#087E8B] font-bold hover:underline"
            >
              Waste Monitor →
            </button>
          </div>
        </div>

      </div>

      {/* DEMAND VS INVENTORY (7D, 30D, 90D toggles with Recharts) */}
      <div className="bg-[#FFFFFF] rounded-card p-6 border border-[#668096]/15 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="font-heading font-bold text-base text-[#16324F]">
              Demand vs Inventory
            </h3>
            <p className="text-xs text-[#668096] mt-0.5">
              Historical consumption compared against projected run-rate and available stock
            </p>
          </div>

          {/* Time Horizon Toggles (7D, 30D, 90D) */}
          <div className="flex items-center bg-[#EEF5FA] p-1 rounded-btn border border-[#668096]/15 text-xs font-bold">
            {(['7D', '30D', '90D'] as const).map(t => (
              <button
                key={t}
                onClick={() => setHorizon(t)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  horizon === t
                    ? 'bg-[#FFFFFF] text-[#087E8B] shadow-subtle'
                    : 'text-[#668096] hover:text-[#16324F]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={demandVsInventoryData[horizon]} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#087E8B" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#087E8B" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#12A4A6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#12A4A6" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF5FA" />
              <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#668096' }} axisLine={{ stroke: '#EEF5FA' }} />
              <YAxis tick={{ fontSize: 11, fill: '#668096' }} axisLine={{ stroke: '#EEF5FA' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#16324F', borderRadius: '10px', color: '#fff', fontSize: '12px', border: 'none' }}
                formatter={(val: number) => [`${val.toLocaleString()} units`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area 
                type="monotone" 
                dataKey="Demand" 
                stroke="#087E8B" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#colorDemand)" 
                name="Historical Demand"
              />
              <Area 
                type="monotone" 
                dataKey="Projected" 
                stroke="#12A4A6" 
                strokeWidth={2} 
                strokeDasharray="4 4" 
                fillOpacity={1} 
                fill="url(#colorProjected)" 
                name="Projected Demand (Model)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PRIORITY ACTIONS ("Needs attention" section showing WHY, WHAT, WHEN) */}
      <div className="bg-[#FFFFFF] rounded-card p-6 border border-[#668096]/15 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-base text-[#16324F]">Needs attention</h3>
            <p className="text-xs text-[#668096] mt-0.5">High-confidence operational alerts driving inventory balance</p>
          </div>
          <button 
            type="button" 
            onClick={() => onNavigateTab('alerts')}
            className="text-xs font-bold text-[#087E8B] hover:underline"
          >
            All Alerts (6) →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Action 1: Medicine A (Amoxicillin) */}
          <div className="p-4 rounded-xl border border-[#D95D5D]/25 bg-[#D95D5D]/5 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-sm text-[#16324F]">Amoxicillin 500mg</span>
                <span className="text-[10px] font-bold text-[#D95D5D] bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#D95D5D]/20">
                  Stockout Risk
                </span>
              </div>
              <div className="mt-2 space-y-1 text-xs">
                <p><strong className="text-[#16324F]">WHAT:</strong> High demand + low inventory</p>
                <p><strong className="text-[#16324F]">WHY:</strong> Consumption surged 14.2% while lead time is 4 days.</p>
                <p><strong className="text-[#16324F]">WHEN:</strong> Will fall below critical safety stock in 6 days.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const med = medicines.find(m => m.name.includes('Amoxicillin'));
                if (med) onSelectMedicine(med);
              }}
              className="mt-3 w-full py-2 rounded-btn bg-[#087E8B] hover:bg-[#066570] text-white text-xs font-bold transition-colors"
            >
              Review
            </button>
          </div>

          {/* Action 2: Medicine B (Atorvastatin) */}
          <div className="p-4 rounded-xl border border-[#E9A23B]/25 bg-[#E9A23B]/5 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-sm text-[#16324F]">Atorvastatin 20mg</span>
                <span className="text-[10px] font-bold text-[#E9A23B] bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#E9A23B]/20">
                  Excess Stock
                </span>
              </div>
              <div className="mt-2 space-y-1 text-xs">
                <p><strong className="text-[#16324F]">WHAT:</strong> Excess stock + approaching expiry</p>
                <p><strong className="text-[#16324F]">WHY:</strong> 520 units surplus above local run rate.</p>
                <p><strong className="text-[#16324F]">WHEN:</strong> 240 units may remain when Batch ATV-24 expires in 45 days.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const med = medicines.find(m => m.name.includes('Atorvastatin'));
                if (med) onSelectMedicine(med);
              }}
              className="mt-3 w-full py-2 rounded-btn bg-[#087E8B] hover:bg-[#066570] text-white text-xs font-bold transition-colors"
            >
              Review
            </button>
          </div>

          {/* Action 3: Medicine C (Paracetamol) */}
          <div className="p-4 rounded-xl border border-[#087E8B]/25 bg-[#EAF7F6] space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-sm text-[#16324F]">Paracetamol 500mg</span>
                <span className="text-[10px] font-bold text-[#087E8B] bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#087E8B]/20">
                  Demand Spike
                </span>
              </div>
              <div className="mt-2 space-y-1 text-xs">
                <p><strong className="text-[#16324F]">WHAT:</strong> Demand spike detected (+24.8%)</p>
                <p><strong className="text-[#16324F]">WHY:</strong> Regional viral wave accelerated consumption pace.</p>
                <p><strong className="text-[#16324F]">WHEN:</strong> Reorder buffer will breach in 14 days at current run-rate.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const med = medicines.find(m => m.name.includes('Paracetamol'));
                if (med) onSelectMedicine(med);
              }}
              className="mt-3 w-full py-2 rounded-btn bg-[#087E8B] hover:bg-[#066570] text-white text-xs font-bold transition-colors"
            >
              Review
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
