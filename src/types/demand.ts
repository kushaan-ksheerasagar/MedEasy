export interface MonthlyDemandRecord {
  month: string;
  actualDemand: number;
  projectedDemand?: number;
}

export interface MedicineDemandProfile {
  medicineId: string;
  medicineName: string;
  category: string;
  historical6Months: { month: string; value: number }[];
  projected90Days: {
    next30Days: number;
    next60Days: number;
    next90Days: number;
  };
  trendPercent: number; // e.g. +18%
  trendDirection: 'increasing' | 'decreasing' | 'stable';
  seasonalFactorDescription: string;
}

export interface ZoneDemandSupply {
  zoneId: string;
  zoneName: string;
  region: string;
  demandIndex: number; // 0 - 100
  supplyIndex: number; // 0 - 100
  balanceRatio: number; // supply / demand
  status: 'Balanced' | 'Moderate Imbalance' | 'Significant Imbalance';
  colorCode: 'green' | 'yellow' | 'red';
  topDeficitMedicine: string;
  topSurplusMedicine: string;
  activePharmaciesCount: number;
  coveredPopulationEst: string;
  coordinates: { x: number; y: number }; // Relative coordinates for map SVG visualization
}
