import { 
  DisposalLocation, 
  DisposalRequest, 
  IncomingReturnItem, 
  CollectionBatch, 
  NeutralizationLog, 
  WasteLoopAnalytics, 
  DisposalHandlingCategory, 
  DisposalReason 
} from '../types/disposal';

export const MOCK_DISPOSAL_LOCATIONS: DisposalLocation[] = [
  {
    id: 'loc-1',
    name: 'MedEasy Take-Back Point (Central Valley Pharmacy)',
    distanceKm: 1.2,
    address: '428 Health Parkway, Medical District, Zone A',
    operatingHours: 'Mon–Sat: 08:00 AM – 09:00 PM',
    acceptedTypes: ['Unused & expired tablets', 'Capsules', 'Blister packs', 'Unopened oral liquids'],
    status: 'Open',
    isFictionalDemo: true,
    contactPhone: '+1 (555) 019-2831',
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  {
    id: 'loc-2',
    name: 'St. Jude Clinical Take-Back Kiosk',
    distanceKm: 2.4,
    address: '890 Wellness Avenue, Pavilion B Lobby, Zone B',
    operatingHours: 'Open 24/7 (Automated Secure Kiosk)',
    acceptedTypes: ['Oral solids', 'Topical ointments', 'Unused packaging', 'Inhaler canisters'],
    status: 'Open 24/7',
    isFictionalDemo: true,
    contactPhone: '+1 (555) 014-9920',
    coordinates: { lat: 40.7282, lng: -73.9942 }
  },
  {
    id: 'loc-3',
    name: 'Metro North Health Hub Drop-Box',
    distanceKm: 3.8,
    address: '1204 Civic Center Blvd, Suite 100, Zone C',
    operatingHours: 'Mon–Fri: 08:30 AM – 07:00 PM',
    acceptedTypes: ['All standard medications', 'Syrups & liquids', 'Skin patches'],
    status: 'Open',
    isFictionalDemo: true,
    contactPhone: '+1 (555) 017-4832',
    coordinates: { lat: 40.7484, lng: -73.9857 }
  },
  {
    id: 'loc-4',
    name: 'Southside Regional Clinical Special Center',
    distanceKm: 5.1,
    address: '235 Harbor View Road, Facility Gate 3, Zone D',
    operatingHours: 'Mon–Fri: 09:00 AM – 05:00 PM (Appointment Only)',
    acceptedTypes: ['Special handling', 'Biologics & cold-chain vials', 'Insulin cartridges', 'Controlled substances'],
    status: 'Appointment Only',
    isFictionalDemo: true,
    contactPhone: '+1 (555) 012-7719',
    coordinates: { lat: 40.6905, lng: -74.0120 }
  },
  {
    id: 'loc-5',
    name: 'Westside Eco-Neutralization Station',
    distanceKm: 6.5,
    address: '512 Industrial Parkway, Environmental Gate A, Zone E',
    operatingHours: 'Mon–Sat: 07:00 AM – 06:00 PM',
    acceptedTypes: ['Bulk pharmacy take-back', 'Expired clinical stock', 'High-volume packaging'],
    status: 'Open',
    isFictionalDemo: true,
    contactPhone: '+1 (555) 018-3341',
    coordinates: { lat: 40.7614, lng: -73.9776 }
  }
];

class DisposalService {
  private requests: DisposalRequest[] = [
    {
      id: 'disp-req-1',
      referenceId: 'ME-2026-00421',
      patientName: 'Elena Rostova',
      medicineName: 'Paracetamol',
      dosage: '500mg',
      quantity: 24,
      unit: 'tablets',
      expiryDate: '2026-08-15',
      reason: 'Expired',
      handlingCategory: 'PHARMACY TAKE-BACK',
      method: 'Pharmacy Drop-off',
      locationName: 'MedEasy Take-Back Point (Central Valley Pharmacy)',
      locationAddress: '428 Health Parkway, Medical District',
      createdAt: '16 Sep 2026',
      status: 'RESPONSIBLY PROCESSED',
      notes: 'Expired 1 month ago. Deposited into certified tamper-proof container.',
      auditTrail: [
        { stage: 'REQUESTED', timestamp: '14 Sep 2026, 09:15 AM', description: 'Patient initiated take-back request for 24 tablets.' },
        { stage: 'SCHEDULED', timestamp: '14 Sep 2026, 11:30 AM', description: 'Drop-off verified for Central Valley Community Pharmacy.' },
        { stage: 'COLLECTED', timestamp: '15 Sep 2026, 02:45 PM', description: 'Deposited into secure kiosk and verified by pharmacist.' },
        { stage: 'RESPONSIBLY PROCESSED', timestamp: '16 Sep 2026, 08:30 AM', description: 'Neutralized via certified eco-friendly thermal degradation (Audit #ECO-7821).' }
      ]
    },
    {
      id: 'disp-req-2',
      referenceId: 'ME-2026-00422',
      patientName: 'Elena Rostova',
      medicineName: 'Amoxicillin',
      dosage: '500mg',
      quantity: 12,
      unit: 'capsules',
      expiryDate: '2026-09-10',
      reason: 'Treatment changed',
      handlingCategory: 'PHARMACY TAKE-BACK',
      method: 'Pharmacy Drop-off',
      locationName: 'St. Jude Clinical Take-Back Kiosk',
      locationAddress: '890 Wellness Avenue, Pavilion B',
      createdAt: '15 Sep 2026',
      status: 'COLLECTED',
      notes: 'Doctor adjusted antibiotic therapy. Leftover capsules.',
      auditTrail: [
        { stage: 'REQUESTED', timestamp: '15 Sep 2026, 10:00 AM', description: 'Disposal request created online.' },
        { stage: 'SCHEDULED', timestamp: '15 Sep 2026, 10:15 AM', description: 'Assigned to St. Jude automated kiosk.' },
        { stage: 'COLLECTED', timestamp: '15 Sep 2026, 04:30 PM', description: 'Physical drop-off logged into secure vault.' }
      ]
    },
    {
      id: 'disp-req-3',
      referenceId: 'ME-2026-00423',
      patientName: 'Elena Rostova',
      medicineName: 'Insulin Glargine',
      dosage: '100U/ml',
      quantity: 1,
      unit: 'vial (10ml)',
      expiryDate: '2026-09-01',
      reason: 'Damaged',
      handlingCategory: 'SPECIAL HANDLING',
      method: 'Specialized Clinical Take-Back',
      locationName: 'Southside Regional Clinical Special Center',
      locationAddress: '235 Harbor View Road',
      createdAt: '16 Sep 2026',
      status: 'SCHEDULED',
      notes: 'Vial exposed to room temperature beyond allowed stability window.',
      auditTrail: [
        { stage: 'REQUESTED', timestamp: '16 Sep 2026, 08:20 AM', description: 'Special handling biologic intake flagged.' },
        { stage: 'SCHEDULED', timestamp: '16 Sep 2026, 09:00 AM', description: 'Cold-chain disposal courier window assigned.' }
      ]
    }
  ];

  private incomingReturns: IncomingReturnItem[] = [
    {
      id: 'ret-1',
      referenceId: 'ME-2026-00421',
      medicineName: 'Paracetamol 500mg',
      dosage: '500mg',
      batchNumber: 'PARA-2024-B9',
      quantity: 24,
      source: 'Patient return',
      patientId: 'PT-902',
      reason: 'Expired',
      date: '16 Sep 2026',
      status: 'Completed',
      handlingCategory: 'PHARMACY TAKE-BACK'
    },
    {
      id: 'ret-2',
      referenceId: 'ME-2026-00422',
      medicineName: 'Amoxicillin 500mg',
      dosage: '500mg',
      batchNumber: 'AMX-9941',
      quantity: 12,
      source: 'Patient return',
      patientId: 'PT-902',
      reason: 'Treatment changed',
      date: '15 Sep 2026',
      status: 'Accepted for Neutralization',
      handlingCategory: 'PHARMACY TAKE-BACK'
    },
    {
      id: 'ret-3',
      referenceId: 'ME-2026-00418',
      medicineName: 'Atorvastatin 20mg',
      dosage: '20mg',
      batchNumber: 'ATV-7821-B',
      quantity: 36,
      source: 'Community drop-box',
      reason: 'Expired',
      date: '16 Sep 2026',
      status: 'Pending',
      handlingCategory: 'PHARMACY TAKE-BACK'
    },
    {
      id: 'ret-4',
      referenceId: 'ME-2026-00419',
      medicineName: 'Insulin Glargine 100U/ml',
      dosage: '100U/ml',
      batchNumber: 'INS-GL-302',
      quantity: 2,
      source: 'Patient return',
      reason: 'Damaged',
      date: '16 Sep 2026',
      status: 'Inspected',
      handlingCategory: 'SPECIAL HANDLING'
    },
    {
      id: 'ret-5',
      referenceId: 'ME-2026-00415',
      medicineName: 'Doxycycline 100mg',
      dosage: '100mg',
      batchNumber: 'DOX-8821',
      quantity: 45,
      source: 'Clinic surplus',
      reason: 'No longer needed',
      date: '14 Sep 2026',
      status: 'Accepted for Neutralization',
      handlingCategory: 'AUTHORIZED COLLECTION'
    }
  ];

  private collectionBatches: CollectionBatch[] = [
    {
      id: 'col-1',
      collectionCode: 'COL-2026-8921',
      originPoint: 'Central Valley Community Pharmacy (Take-Back Bin #1)',
      itemCount: 14,
      totalUnits: 186,
      scheduledDate: '17 Sep 2026',
      courierService: 'EcoMed Logistics Secure Transmit',
      status: 'Scheduled',
      carrierManifestId: 'MNF-EC-4491'
    },
    {
      id: 'col-2',
      collectionCode: 'COL-2026-8919',
      originPoint: 'St. Jude Clinical Automated Kiosk',
      itemCount: 22,
      totalUnits: 310,
      scheduledDate: '15 Sep 2026',
      courierService: 'EcoMed Logistics Secure Transmit',
      status: 'Collected',
      carrierManifestId: 'MNF-EC-4482'
    },
    {
      id: 'col-3',
      collectionCode: 'COL-2026-8912',
      originPoint: 'Metro North Health Hub Drop-Box',
      itemCount: 18,
      totalUnits: 242,
      scheduledDate: '12 Sep 2026',
      courierService: 'City Health SafeWaste Transit',
      status: 'Processed',
      carrierManifestId: 'MNF-CH-3310'
    }
  ];

  private neutralizationLogs: NeutralizationLog[] = [
    {
      id: 'neut-1',
      lotId: 'LOT-DISP-781',
      method: 'High-Temperature Thermal Oxidation',
      processedWeightKg: 42.6,
      unitsNeutralized: 1420,
      certifiedFacility: 'Metropolitan Environmental SafeDestruct Plant #4',
      completionDate: '16 Sep 2026',
      certificateNumber: 'CERT-NEUT-2026-9021',
      environmentalComplianceScore: '99.8% emissions compliance'
    },
    {
      id: 'neut-2',
      lotId: 'LOT-DISP-779',
      method: 'Chemical Neutralization',
      processedWeightKg: 18.2,
      unitsNeutralized: 580,
      certifiedFacility: 'State Bio-Waste Environmental Facility',
      completionDate: '13 Sep 2026',
      certificateNumber: 'CERT-NEUT-2026-8974',
      environmentalComplianceScore: '100% containment verified'
    }
  ];

  // Helper to determine demo handling category
  public determineHandlingCategory(medicineName: string, form?: string): {
    category: DisposalHandlingCategory;
    title: string;
    description: string;
    actionInstruction: string;
  } {
    const lowerName = medicineName.toLowerCase();
    const lowerForm = (form || '').toLowerCase();

    if (
      lowerName.includes('insulin') || 
      lowerName.includes('morphine') || 
      lowerName.includes('fentanyl') || 
      lowerName.includes('biologic') ||
      lowerForm.includes('vial') ||
      lowerForm.includes('injection')
    ) {
      return {
        category: 'SPECIAL HANDLING',
        title: 'Specialized Healthcare Channel Required',
        description: 'Requires specific handling through an appropriate healthcare/waste channel due to cold-chain, biologic composition, or regulatory classification.',
        actionInstruction: 'Drop off at an authorized clinical hospital depot or request temperature-controlled courier collection. Never crush or discard.'
      };
    }

    if (lowerName.includes('doxycycline') || lowerName.includes('chemo') || lowerForm.includes('bulk')) {
      return {
        category: 'AUTHORIZED COLLECTION',
        title: 'Approved Medicine-Waste Collection Service',
        description: 'Use an approved medicine-waste collection service or certified healthcare facility drop-box.',
        actionInstruction: 'Keep in original blister or child-proof container. Deposit in designated secure medicine-waste drop box.'
      };
    }

    return {
      category: 'PHARMACY TAKE-BACK',
      title: 'Authorized Pharmacy Take-Back',
      description: 'Return to an authorized community pharmacy or participating clinic take-back point.',
      actionInstruction: 'Hand directly to a pharmacy team member or place in a verified community take-back bin. Do not flush or place in domestic trash.'
    };
  }

  public getDisposalLocations(): DisposalLocation[] {
    return MOCK_DISPOSAL_LOCATIONS;
  }

  public getPatientRequests(): DisposalRequest[] {
    return [...this.requests];
  }

  public createDisposalRequest(req: Omit<DisposalRequest, 'id' | 'referenceId' | 'createdAt' | 'status' | 'auditTrail'>): DisposalRequest {
    const nextNum = 420 + this.requests.length + 1;
    const referenceId = `ME-2026-00${nextNum}`;
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newReq: DisposalRequest = {
      ...req,
      id: `disp-req-${Date.now()}`,
      referenceId,
      createdAt: today,
      status: 'REQUESTED',
      auditTrail: [
        {
          stage: 'REQUESTED',
          timestamp: `${today}, ${nowTime}`,
          description: `Disposal request initiated by ${req.patientName} for ${req.quantity} ${req.unit} (${req.reason}).`
        }
      ]
    };

    this.requests.unshift(newReq);

    // Also register into incoming pharmacy returns
    const newReturn: IncomingReturnItem = {
      id: `ret-${Date.now()}`,
      referenceId,
      medicineName: `${req.medicineName} ${req.dosage}`,
      dosage: req.dosage,
      batchNumber: `RET-${Math.floor(1000 + Math.random() * 9000)}`,
      quantity: req.quantity,
      source: 'Patient return',
      reason: req.reason,
      date: today,
      status: 'Pending',
      handlingCategory: req.handlingCategory
    };
    this.incomingReturns.unshift(newReturn);

    return newReq;
  }

  public getIncomingReturns(): IncomingReturnItem[] {
    return [...this.incomingReturns];
  }

  public updateReturnStatus(id: string, newStatus: IncomingReturnItem['status']) {
    const item = this.incomingReturns.find(r => r.id === id);
    if (item) {
      item.status = newStatus;
      // Also advance corresponding patient request if matching
      const req = this.requests.find(r => r.referenceId === item.referenceId);
      if (req) {
        if (newStatus === 'Accepted for Neutralization') {
          req.status = 'COLLECTED';
          req.auditTrail.push({
            stage: 'COLLECTED',
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            description: 'Pharmacy verified intake and accepted for certified batch neutralization.'
          });
        } else if (newStatus === 'Completed') {
          req.status = 'RESPONSIBLY PROCESSED';
          req.auditTrail.push({
            stage: 'RESPONSIBLY PROCESSED',
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            description: 'Responsibly processed and neutralized via certified environmental facility.'
          });
        }
      }
    }
  }

  public getCollectionBatches(): CollectionBatch[] {
    return [...this.collectionBatches];
  }

  public getNeutralizationLogs(): NeutralizationLog[] {
    return [...this.neutralizationLogs];
  }

  public getWasteLoopAnalytics(): WasteLoopAnalytics {
    return {
      unitsIdentifiedAtRisk: 684,
      unitsRecoveredFromWaste: 432,
      unitsSentForDisposal: 252,
      disposalCompletionRate: 94.2
    };
  }
}

export const disposalService = new DisposalService();
