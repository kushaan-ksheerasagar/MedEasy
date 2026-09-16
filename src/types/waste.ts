export interface WasteRiskItem {
  id: string;
  medicineId: string;
  medicineName: string;
  dosage: string;
  category: string;
  currentStock: number;
  projectedDemandBeforeExpiry: number;
  potentialExcessUnits: number;
  unitValue: number;
  potentialFinancialWaste: number;
  earliestExpiryDate: string;
  daysToExpiry: number;
  wasteRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  primaryLocation: string;
  zoneId: string;
  reason: string;
  suggestedAction: 'Inter-Zone Stock Transfer' | 'Clinic Network Redistribution' | 'Accelerated Dispense Tier' | 'Batch Quarantine' | 'Manufacturer Return';
}

export interface ZoneWasteSummary {
  zoneId: string;
  zoneName: string;
  totalAtRiskUnits: number;
  estimatedFinancialWaste: number;
  highRiskMedicineCount: number;
}
