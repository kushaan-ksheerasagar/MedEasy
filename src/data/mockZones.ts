import { ZoneDemandSupply } from '../types/demand';

export const MOCK_ZONES: ZoneDemandSupply[] = [
  {
    zoneId: 'zone-a',
    zoneName: 'Zone A — North Metro Central',
    region: 'Metropolitan Urban Core',
    demandIndex: 94,
    supplyIndex: 48,
    balanceRatio: 0.51, // Supply < Demand
    status: 'Significant Imbalance',
    colorCode: 'red', // Red = significant imbalance
    topDeficitMedicine: 'Amoxicillin 500mg (-640 units deficit)',
    topSurplusMedicine: 'Pembrolizumab 100mg (surplus 4 vials nearing expiry)',
    activePharmaciesCount: 14,
    coveredPopulationEst: '280,000 residents',
    coordinates: { x: 38, y: 28 } // SVG coordinate %
  },
  {
    zoneId: 'zone-b',
    zoneName: 'Zone B — Central Valley Health',
    region: 'Suburban Medical District',
    demandIndex: 68,
    supplyIndex: 72,
    balanceRatio: 1.06, // Balanced
    status: 'Balanced',
    colorCode: 'green', // Green = balanced
    topDeficitMedicine: 'Paracetamol 500mg (high velocity spike)',
    topSurplusMedicine: 'Lisinopril 10mg (+120 buffer)',
    activePharmaciesCount: 19,
    coveredPopulationEst: '340,000 residents',
    coordinates: { x: 55, y: 52 }
  },
  {
    zoneId: 'zone-c',
    zoneName: 'Zone C — East Harbor Dispensary',
    region: 'Coastal Commercial & Maritime',
    demandIndex: 38,
    supplyIndex: 89,
    balanceRatio: 2.34, // Supply >> Demand (Excess inventory / Waste risk!)
    status: 'Significant Imbalance',
    colorCode: 'red', // Significant imbalance: excess stock
    topDeficitMedicine: 'None (Zero active stockouts)',
    topSurplusMedicine: 'Atorvastatin 20mg (+520 excess units at risk)',
    activePharmaciesCount: 8,
    coveredPopulationEst: '125,000 residents',
    coordinates: { x: 78, y: 35 }
  },
  {
    zoneId: 'zone-d',
    zoneName: 'Zone D — West Tech Corridor',
    region: 'Innovation Park & University District',
    demandIndex: 62,
    supplyIndex: 56,
    balanceRatio: 0.90, // Moderate imbalance
    status: 'Moderate Imbalance',
    colorCode: 'yellow', // Yellow = moderate imbalance
    topDeficitMedicine: 'Insulin Glargine (Batch A expiring)',
    topSurplusMedicine: 'Gabapentin 300mg (+140 units buffer)',
    activePharmaciesCount: 11,
    coveredPopulationEst: '210,000 residents',
    coordinates: { x: 22, y: 65 }
  },
  {
    zoneId: 'zone-e',
    zoneName: 'Zone E — South County Regional',
    region: 'Southern Mixed Residential & Senior Care',
    demandIndex: 71,
    supplyIndex: 61,
    balanceRatio: 0.86, // Moderate imbalance
    status: 'Moderate Imbalance',
    colorCode: 'yellow',
    topDeficitMedicine: 'Pantoprazole 40mg (-90 buffer)',
    topSurplusMedicine: 'Omeprazole 20mg (420 units expiring in 38 days)',
    activePharmaciesCount: 12,
    coveredPopulationEst: '195,000 residents',
    coordinates: { x: 50, y: 82 }
  }
];
