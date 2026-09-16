export interface IntelligenceInsight {
  id: string;
  category: 'DEMAND_SURGE' | 'ZONAL_IMBALANCE' | 'WASTE_PREVENTION' | 'SUPPLY_DEFICIT';
  headline: string;
  detail: string;
  recommendation: string;
  confidenceScore: number; // e.g. 94%
  impactType: 'Risk Reduction' | 'Stockout Prevention' | 'Capital Protection';
  zoneId?: string;
  medicineId?: string;
}

class IntelligenceService {
  public getDemoInsights(): IntelligenceInsight[] {
    return [
      {
        id: 'ins-01',
        category: 'DEMAND_SURGE',
        headline: 'Demand for Paracetamol 500mg increased 24.8% over the last 30 days.',
        detail: 'Regional symptom tracking and outpatient dispensing data correlate with early seasonal viral surge across Zone B and Zone A.',
        recommendation: 'Advance automated replenishment PO by 7 days to preserve secondary safety buffer.',
        confidenceScore: 96,
        impactType: 'Stockout Prevention',
        zoneId: 'zone-b',
        medicineId: 'med-03'
      },
      {
        id: 'ins-02',
        category: 'ZONAL_IMBALANCE',
        headline: 'Pharmacy Zone C has 2.34× more inventory than projected 90-day demand.',
        detail: 'Zone C (East Harbor) currently holds 2,100 aggregate units across cardiovascular and antibiotic categories with slowing velocity.',
        recommendation: 'Rebalance 450 units of Atorvastatin and 300 units of Doxycycline toward high-velocity Zone A clinics.',
        confidenceScore: 92,
        impactType: 'Capital Protection',
        zoneId: 'zone-c',
        medicineId: 'med-02'
      },
      {
        id: 'ins-03',
        category: 'WASTE_PREVENTION',
        headline: '520 units of Atorvastatin 20mg at risk of expiration if current demand continues.',
        detail: 'Batch ATV-24-991 expires in 45 days. Local run rate will only absorb 320 units, leaving $11,440 retail value vulnerable.',
        recommendation: 'Initiate priority routing to Metro Core outpatient health centers with active refill queues.',
        confidenceScore: 94,
        impactType: 'Capital Protection',
        zoneId: 'zone-c',
        medicineId: 'med-02'
      },
      {
        id: 'ins-04',
        category: 'SUPPLY_DEFICIT',
        headline: 'Zone A has high demand (94/100) but comparatively low inventory (48/100).',
        detail: 'Supply-to-demand ratio is 0.51:1 in Zone A, creating acute vulnerability for pediatric and adult broad-spectrum antibiotics.',
        recommendation: 'Execute inter-facility inventory redistribution from Zone C and Zone B before the weekend peak.',
        confidenceScore: 98,
        impactType: 'Stockout Prevention',
        zoneId: 'zone-a',
        medicineId: 'med-01'
      },
      {
        id: 'ins-05',
        category: 'WASTE_PREVENTION',
        headline: 'Cold chain specialty alert: 4 vials of Pembrolizumab expire in 32 days.',
        detail: 'High unit-cost oncology therapy ($4,850/vial) has only 1 confirmed local administration scheduled before expiry date.',
        recommendation: 'Notify regional oncology consortium to schedule 3 transfers to Central Valley Oncology Clinic.',
        confidenceScore: 99,
        impactType: 'Capital Protection',
        zoneId: 'zone-a',
        medicineId: 'med-15'
      }
    ];
  }
}

export const intelligenceService = new IntelligenceService();
