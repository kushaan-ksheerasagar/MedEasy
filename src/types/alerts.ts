export type AlertCategory = 
  | 'STOCKOUT_RISK'
  | 'WASTE_RISK'
  | 'EXPIRY_APPROACHING'
  | 'DEMAND_SPIKE'
  | 'UNUSUAL_CONSUMPTION'
  | 'SAFE_DISPOSAL';

export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';

export interface AlertItem {
  id: string;
  category: AlertCategory;
  severity: AlertSeverity;
  medicineId: string;
  medicineName: string;
  location: string;
  zoneId: string;
  timestamp: string;
  headline: string;
  reason: string;
  suggestedOperationalAction: string;
  actionType: 'TRANSFER' | 'REORDER' | 'CLEARANCE' | 'INSPECT' | 'DISPOSE';
  impactMetric: string;
  isAcknowledged?: boolean;
}
