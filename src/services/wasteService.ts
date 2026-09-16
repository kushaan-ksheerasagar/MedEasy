import { MOCK_MEDICINES } from '../data/mockMedicines';
import { MOCK_ZONES } from '../data/mockZones';
import { WasteRiskItem, ZoneWasteSummary } from '../types/waste';

class WasteService {
  public getWasteRiskItems(): WasteRiskItem[] {
    const items: WasteRiskItem[] = [];

    MOCK_MEDICINES.forEach(med => {
      // Calculate projected demand before earliest expiry
      const monthsUntilExpiry = Math.max(0.2, med.earliestDaysToExpiry / 30);
      const projectedDemandBeforeExpiry = Math.round(med.monthlyDemand * monthsUntilExpiry);
      const potentialExcessUnits = Math.max(0, med.totalStock - projectedDemandBeforeExpiry);
      const potentialFinancialWaste = Math.round(potentialExcessUnits * med.unitPrice);

      let level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
      if (potentialExcessUnits > 0 && med.earliestDaysToExpiry <= 45) {
        level = potentialFinancialWaste > 5000 ? 'CRITICAL' : 'HIGH';
      } else if (potentialExcessUnits > 0 && med.earliestDaysToExpiry <= 90) {
        level = 'HIGH';
      } else if (potentialExcessUnits > 0 && med.earliestDaysToExpiry <= 180) {
        level = 'MEDIUM';
      }

      if (potentialExcessUnits > 0 || med.wasteRiskLevel !== 'LOW') {
        const zone = MOCK_ZONES.find(z => z.zoneId === med.primaryZoneId);
        
        let suggestedAction: WasteRiskItem['suggestedAction'] = 'Inter-Zone Stock Transfer';
        if (med.storage.includes('Cold')) {
          suggestedAction = 'Batch Quarantine';
        } else if (potentialExcessUnits > 300) {
          suggestedAction = 'Clinic Network Redistribution';
        } else if (med.earliestDaysToExpiry < 30) {
          suggestedAction = 'Accelerated Dispense Tier';
        }

        items.push({
          id: `waste-${med.id}`,
          medicineId: med.id,
          medicineName: med.name,
          dosage: med.dosage,
          category: med.category,
          currentStock: med.totalStock,
          projectedDemandBeforeExpiry,
          potentialExcessUnits,
          unitValue: med.unitPrice,
          potentialFinancialWaste,
          earliestExpiryDate: med.earliestExpiryDate,
          daysToExpiry: med.earliestDaysToExpiry,
          wasteRiskLevel: level,
          primaryLocation: zone?.zoneName || 'Metro Central Hub',
          zoneId: med.primaryZoneId,
          reason: med.flagReason || `Current stock exceeds projected demand before expiry by ${potentialExcessUnits} units.`,
          suggestedAction
        });
      }
    });

    // Rank primarily by potential financial waste and urgency of expiry
    return items.sort((a, b) => {
      const riskWeight = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      if (riskWeight[b.wasteRiskLevel] !== riskWeight[a.wasteRiskLevel]) {
        return riskWeight[b.wasteRiskLevel] - riskWeight[a.wasteRiskLevel];
      }
      return b.potentialFinancialWaste - a.potentialFinancialWaste;
    });
  }

  public getPotentialWasteByLocation(): ZoneWasteSummary[] {
    const riskItems = this.getWasteRiskItems();

    return MOCK_ZONES.map(zone => {
      const zoneItems = riskItems.filter(item => item.zoneId === zone.zoneId);
      const totalAtRiskUnits = zoneItems.reduce((acc, item) => acc + item.potentialExcessUnits, 0);
      const estimatedFinancialWaste = zoneItems.reduce((acc, item) => acc + item.potentialFinancialWaste, 0);
      const highRiskMedicineCount = zoneItems.filter(item => item.wasteRiskLevel === 'HIGH' || item.wasteRiskLevel === 'CRITICAL').length;

      return {
        zoneId: zone.zoneId,
        zoneName: zone.zoneName,
        totalAtRiskUnits,
        estimatedFinancialWaste,
        highRiskMedicineCount
      };
    });
  }
}

export const wasteService = new WasteService();
