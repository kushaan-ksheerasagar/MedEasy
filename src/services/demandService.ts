import { MOCK_MEDICINES } from '../data/mockMedicines';
import { MOCK_ZONES } from '../data/mockZones';
import { MedicineDemandProfile, ZoneDemandSupply } from '../types/demand';

class DemandService {
  public getTrendingMedicines(): {
    increasing: { medicineId: string; name: string; category: string; currentDemand: number; changePercent: number }[];
    decreasing: { medicineId: string; name: string; category: string; currentDemand: number; changePercent: number }[];
  } {
    const sorted = [...MOCK_MEDICINES].sort((a, b) => b.demandTrendPercent - a.demandTrendPercent);

    const increasing = sorted
      .filter(m => m.demandTrendPercent > 0)
      .slice(0, 5)
      .map(m => ({
        medicineId: m.id,
        name: m.name,
        category: m.category,
        currentDemand: m.monthlyDemand,
        changePercent: m.demandTrendPercent,
      }));

    const decreasing = [...sorted]
      .reverse()
      .filter(m => m.demandTrendPercent < 0)
      .slice(0, 5)
      .map(m => ({
        medicineId: m.id,
        name: m.name,
        category: m.category,
        currentDemand: m.monthlyDemand,
        changePercent: m.demandTrendPercent,
      }));

    return { increasing, decreasing };
  }

  public getDemandProfile(medicineId: string): MedicineDemandProfile | undefined {
    const med = MOCK_MEDICINES.find(m => m.id === medicineId);
    if (!med) return undefined;

    const base = med.monthlyDemand;
    const trend = med.demandTrendPercent / 100;

    // Build realistic 6-month historical curve
    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    const historical6Months = months.map((month, idx) => {
      // Historical curve leading up to current base
      const step = (idx - 5) * (trend / 3);
      const val = Math.round(base * (1 + step) + (Math.sin(idx) * (base * 0.04)));
      return { month, value: Math.max(10, val) };
    });

    const next30Days = Math.round(base * (1 + trend * 0.5));
    const next60Days = Math.round(next30Days * 2.05);
    const next90Days = Math.round(next30Days * 3.12);

    return {
      medicineId: med.id,
      medicineName: med.name,
      category: med.category,
      historical6Months,
      projected90Days: {
        next30Days,
        next60Days,
        next90Days,
      },
      trendPercent: med.demandTrendPercent,
      trendDirection: med.demandTrendPercent > 2 ? 'increasing' : med.demandTrendPercent < -2 ? 'decreasing' : 'stable',
      seasonalFactorDescription: med.demandTrendPercent > 10 
        ? 'High seasonal surge detected (viral/respiratory factors)'
        : med.demandTrendPercent < -10 
        ? 'Demand contraction following post-seasonal protocol adjustment'
        : 'Steady baseline outpatient consumption'
    };
  }

  public getAggregatedDemandHistory(): { month: string; actualDemand: number; projectedDemand: number }[] {
    // Total aggregate across all 22 medicines
    return [
      { month: 'Apr 2026', actualDemand: 8200, projectedDemand: 8150 },
      { month: 'May 2026', actualDemand: 8550, projectedDemand: 8400 },
      { month: 'Jun 2026', actualDemand: 8900, projectedDemand: 8850 },
      { month: 'Jul 2026', actualDemand: 9340, projectedDemand: 9100 },
      { month: 'Aug 2026', actualDemand: 9810, projectedDemand: 9600 },
      { month: 'Sep 2026', actualDemand: 10420, projectedDemand: 10200 },
      { month: 'Oct 2026 (Est)', actualDemand: 0, projectedDemand: 11150 },
      { month: 'Nov 2026 (Est)', actualDemand: 0, projectedDemand: 11680 },
      { month: 'Dec 2026 (Est)', actualDemand: 0, projectedDemand: 12200 },
    ];
  }

  public getAllZones(): ZoneDemandSupply[] {
    return [...MOCK_ZONES];
  }

  public getZoneById(zoneId: string): ZoneDemandSupply | undefined {
    return MOCK_ZONES.find(z => z.zoneId === zoneId);
  }
}

export const demandService = new DemandService();
