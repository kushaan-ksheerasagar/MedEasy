import { PatientMedicine, PatientProfile } from '../types/patient';

export const MOCK_PATIENT_PROFILE: PatientProfile = {
  id: 'pat-9021',
  name: 'Elena Rostova',
  age: 64,
  preferredLanguage: 'English',
  assignedCaregiver: 'Marcus Rostova (Son / Authorized Caregiver)',
  caregiverPhone: '+1 (555) 349-8291',
  homeZone: 'Zone B — Central Valley Health',
  primaryClinic: 'Valley Community Medical & Pharmacy',
};

export const MOCK_PATIENT_MEDICINES: PatientMedicine[] = [
  {
    id: 'p-med-01',
    medicineName: 'Metformin 500mg',
    dosage: '1 tablet twice daily',
    form: 'Tablet',
    prescribedInstructions: 'Take 1 tablet twice daily with breakfast and evening dinner to minimize stomach upset.',
    prescribingDoctor: 'Dr. Sarah Jenkins, MD (Endocrinology)',
    pharmacyName: 'Central Valley Community Pharmacy',
    pharmacyPhone: '+1 (555) 019-2831',
    quantityPurchased: 60,
    quantityRemaining: 42,
    dailyDosageUnits: 2,
    daysRemaining: 21,
    expiryDate: '2027-03-15',
    daysToExpiry: 180,
    refillDueDate: '2026-10-02',
    isRefillUrgent: false,
    requiresDoctorRenewal: false,
    status: 'Active',
    specialInstructions: 'Store in dry place away from heat. Avoid skipping meals while taking.',
    storageRequirement: 'Room temperature (15-25°C)',
    schedules: [
      {
        timeSlot: 'Morning',
        timeDisplay: '08:30 AM',
        takenToday: true,
        takenTimestamp: '8:32 AM',
      },
      {
        timeSlot: 'Evening',
        timeDisplay: '07:30 PM',
        takenToday: false,
      }
    ]
  },
  {
    id: 'p-med-02',
    medicineName: 'Lisinopril 10mg',
    dosage: '1 tablet once daily',
    form: 'Tablet',
    prescribedInstructions: 'Take 1 tablet every morning with or without food. Monitor blood pressure weekly.',
    prescribingDoctor: 'Dr. David Chen, MD (Cardiology)',
    pharmacyName: 'Central Valley Community Pharmacy',
    pharmacyPhone: '+1 (555) 019-2831',
    quantityPurchased: 30,
    quantityRemaining: 5, // Running low!
    dailyDosageUnits: 1,
    daysRemaining: 5,
    expiryDate: '2027-08-30',
    daysToExpiry: 348,
    refillDueDate: '2026-09-21',
    isRefillUrgent: true,
    requiresDoctorRenewal: false, // Refills remain on prescription
    status: 'Active',
    specialInstructions: 'Do not take potassium supplements without consulting your doctor.',
    storageRequirement: 'Room temperature (15-25°C)',
    schedules: [
      {
        timeSlot: 'Morning',
        timeDisplay: '08:30 AM',
        takenToday: true,
        takenTimestamp: '8:30 AM',
      }
    ]
  },
  {
    id: 'p-med-03',
    medicineName: 'Atorvastatin 20mg',
    dosage: '1 tablet once daily at bedtime',
    form: 'Tablet',
    prescribedInstructions: 'Take 1 tablet every evening before sleep. Report any unusual muscle aches or stiffness promptly.',
    prescribingDoctor: 'Dr. David Chen, MD (Cardiology)',
    pharmacyName: 'East Harbor Dispensary (Transferred)',
    pharmacyPhone: '+1 (555) 014-9922',
    quantityPurchased: 30,
    quantityRemaining: 18,
    dailyDosageUnits: 1,
    daysRemaining: 18,
    expiryDate: '2026-10-31', // Expiry approaching in 45 days!
    daysToExpiry: 45,
    refillDueDate: '2026-10-04',
    isRefillUrgent: false,
    requiresDoctorRenewal: true, // Prescription renewal required
    status: 'Active',
    specialInstructions: 'Limit grapefruit juice consumption.',
    storageRequirement: 'Room temperature (15-25°C)',
    schedules: [
      {
        timeSlot: 'Bedtime',
        timeDisplay: '10:00 PM',
        takenToday: false,
      }
    ]
  },
  {
    id: 'p-med-04',
    medicineName: 'Salbutamol 100mcg Inhaler',
    dosage: '1 to 2 puffs as needed for shortness of breath',
    form: 'Inhaler',
    prescribedInstructions: 'Inhale 1-2 puffs every 4-6 hours as needed for sudden wheezing or asthma symptoms.',
    prescribingDoctor: 'Dr. Sarah Jenkins, MD',
    pharmacyName: 'Central Valley Community Pharmacy',
    pharmacyPhone: '+1 (555) 019-2831',
    quantityPurchased: 200, // actuations
    quantityRemaining: 140,
    dailyDosageUnits: 2,
    daysRemaining: 70,
    expiryDate: '2027-03-31',
    daysToExpiry: 196,
    refillDueDate: '2026-11-20',
    isRefillUrgent: false,
    requiresDoctorRenewal: false,
    status: 'Active',
    specialInstructions: 'Rinse mouth with water after use. Shake well before each inhalation.',
    storageRequirement: 'Room temperature (15-25°C), do not puncture canister',
    schedules: [
      {
        timeSlot: 'Noon',
        timeDisplay: '01:00 PM (As needed)',
        takenToday: false,
      }
    ]
  }
];
