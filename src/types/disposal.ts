export type DisposalReason = 
  | 'Expired'
  | 'Damaged'
  | 'No longer needed'
  | 'Treatment changed'
  | 'Other';

export type DisposalHandlingCategory = 
  | 'PHARMACY TAKE-BACK'
  | 'AUTHORIZED COLLECTION'
  | 'SPECIAL HANDLING';

export type DisposalRequestStatus = 
  | 'REQUESTED'
  | 'SCHEDULED'
  | 'COLLECTED'
  | 'RESPONSIBLY PROCESSED';

export type CollectionStatus = 
  | 'Pending'
  | 'Scheduled'
  | 'Collected'
  | 'Processed';

export interface DisposalLocation {
  id: string;
  name: string;
  distanceKm: number;
  address: string;
  operatingHours: string;
  acceptedTypes: string[];
  status: 'Open' | 'Open 24/7' | 'Closed' | 'Appointment Only';
  isFictionalDemo: boolean;
  contactPhone: string;
  coordinates: { lat: number; lng: number };
}

export interface DisposalRequest {
  id: string;
  referenceId: string; // e.g. ME-2026-00421
  patientName: string;
  medicineName: string;
  dosage: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  reason: DisposalReason;
  handlingCategory: DisposalHandlingCategory;
  method: 'Pharmacy Drop-off' | 'Scheduled Courier Collection' | 'Specialized Clinical Take-Back';
  locationName: string;
  locationAddress?: string;
  createdAt: string;
  status: DisposalRequestStatus;
  notes?: string;
  auditTrail: {
    stage: DisposalRequestStatus;
    timestamp: string;
    description: string;
  }[];
}

export interface IncomingReturnItem {
  id: string;
  referenceId: string;
  medicineName: string;
  dosage: string;
  batchNumber: string;
  quantity: number;
  source: 'Patient return' | 'Community drop-box' | 'Clinic surplus' | 'Home collection';
  patientId?: string;
  reason: DisposalReason;
  date: string;
  status: 'Pending' | 'Inspected' | 'Accepted for Neutralization' | 'Completed';
  handlingCategory: DisposalHandlingCategory;
}

export interface CollectionBatch {
  id: string;
  collectionCode: string; // e.g. COL-8921
  originPoint: string;
  itemCount: number;
  totalUnits: number;
  scheduledDate: string;
  courierService: string;
  status: CollectionStatus;
  carrierManifestId: string;
}

export interface NeutralizationLog {
  id: string;
  lotId: string;
  method: 'High-Temperature Thermal Oxidation' | 'Chemical Neutralization' | 'Autoclave Shredding';
  processedWeightKg: number;
  unitsNeutralized: number;
  certifiedFacility: string;
  completionDate: string;
  certificateNumber: string;
  environmentalComplianceScore: string;
}

export interface WasteLoopAnalytics {
  unitsIdentifiedAtRisk: number;
  unitsRecoveredFromWaste: number;
  unitsSentForDisposal: number;
  disposalCompletionRate: number; // percentage e.g. 94.2
}
