export type StockStatus = 'Healthy' | 'Low Stock' | 'Overstocked' | 'Expiring Soon' | 'High Waste Risk';
export type WasteRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type StorageCondition = 'Room Temperature (15-25°C)' | 'Refrigerated (2-8°C)' | 'Controlled Humidity' | 'Cold Storage (-20°C)';
export type MedicineCategory = 
  | 'Antibiotics'
  | 'Cardiovascular'
  | 'Endocrine & Diabetes'
  | 'Analgesics & Anti-inflammatory'
  | 'Respiratory'
  | 'Specialty & Oncology'
  | 'Gastrointestinal'
  | 'Neurological';

export interface BatchInfo {
  batchNumber: string;
  manufactureDate: string;
  expiryDate: string;
  daysToExpiry: number;
  initialQuantity: number;
  remainingQuantity: number;
  locationZoneId: string;
  locationName: string;
  unitCost: number; // in USD
}

export interface DemandPoint {
  period: string; // e.g., 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct (Proj)'
  actual?: number;
  projected?: number;
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  form: 'Tablet' | 'Capsule' | 'Liquid' | 'Injection' | 'Inhaler' | 'Ointment';
  category: MedicineCategory;
  therapeuticClass: string;
  activeIngredients: string;
  storage: StorageCondition;
  unitPrice: number; // dispensing price

  // Stock summary
  totalStock: number;
  safetyStock: number;
  reorderPoint: number;
  stockStatus: StockStatus;
  wasteRiskLevel: WasteRiskLevel;

  // Demand & velocity
  monthlyDemand: number;
  stockVelocity: number; // units consumed per day
  daysOfSupplyRemaining: number;
  projectedDemandNext90Days: number;
  demandTrendPercent: number; // positive or negative %

  // Earliest batch & batches
  earliestExpiryDate: string;
  earliestDaysToExpiry: number;
  batches: BatchInfo[];

  // Risk Flagging Analysis
  flagReason?: string;
  flagDetails?: string;
  primaryZoneId: string;
  lastUpdated: string;
}
