export interface DoseSchedule {
  timeSlot: 'Morning' | 'Noon' | 'Evening' | 'Bedtime';
  timeDisplay: string; // e.g., '08:00 AM'
  takenToday: boolean;
  takenTimestamp?: string;
}

export interface PatientMedicine {
  id: string;
  medicineName: string;
  dosage: string;
  form: string;
  prescribedInstructions: string;
  prescribingDoctor: string;
  pharmacyName: string;
  pharmacyPhone: string;
  quantityPurchased: number;
  quantityRemaining: number;
  dailyDosageUnits: number;
  daysRemaining: number;
  expiryDate: string;
  daysToExpiry: number;
  refillDueDate: string;
  isRefillUrgent: boolean;
  requiresDoctorRenewal: boolean;
  status: 'Active' | 'Discontinued' | 'Paused';
  schedules: DoseSchedule[];
  specialInstructions: string;
  storageRequirement: string;
}

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  preferredLanguage: string;
  assignedCaregiver?: string;
  caregiverPhone?: string;
  homeZone: string;
  primaryClinic: string;
}
