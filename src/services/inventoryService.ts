import { MOCK_MEDICINES } from '../data/mockMedicines';
import { Medicine, StockStatus, MedicineCategory } from '../types/inventory';

export interface InventoryFilterOptions {
  searchQuery?: string;
  category?: MedicineCategory | 'ALL';
  stockStatus?: StockStatus | 'ALL';
  zoneId?: string | 'ALL';
  sortBy?: 'name' | 'stock' | 'daysToExpiry' | 'monthlyDemand' | 'stockVelocity';
  sortOrder?: 'asc' | 'desc';
}

export interface InventoryKPISummary {
  totalMedicinesCount: number;
  totalUnitsInStock: number;
  expiringSoonCount: number; // < 60 days
  highWasteRiskCount: number;
  stockoutRiskCount: number;
  estimatedUnitsAtRisk: number;
  totalInventoryValue: number;
  averageDaysOfSupply: number;
}

class InventoryService {
  private medicines: Medicine[] = [...MOCK_MEDICINES];

  public getAll(): Medicine[] {
    return [...this.medicines];
  }

  public getById(id: string): Medicine | undefined {
    return this.medicines.find(m => m.id === id);
  }

  public getFiltered(options: InventoryFilterOptions): Medicine[] {
    let result = [...this.medicines];

    if (options.searchQuery && options.searchQuery.trim() !== '') {
      const q = options.searchQuery.toLowerCase().trim();
      result = result.filter(m => 
        m.name.toLowerCase().includes(q) ||
        m.genericName.toLowerCase().includes(q) ||
        m.therapeuticClass.toLowerCase().includes(q) ||
        m.batches.some(b => b.batchNumber.toLowerCase().includes(q))
      );
    }

    if (options.category && options.category !== 'ALL') {
      result = result.filter(m => m.category === options.category);
    }

    if (options.stockStatus && options.stockStatus !== 'ALL') {
      result = result.filter(m => m.stockStatus === options.stockStatus);
    }

    if (options.zoneId && options.zoneId !== 'ALL') {
      result = result.filter(m => m.primaryZoneId === options.zoneId || m.batches.some(b => b.locationZoneId === options.zoneId));
    }

    if (options.sortBy) {
      result.sort((a, b) => {
        let valA: number | string = 0;
        let valB: number | string = 0;

        switch (options.sortBy) {
          case 'name':
            valA = a.name.toLowerCase();
            valB = b.name.toLowerCase();
            break;
          case 'stock':
            valA = a.totalStock;
            valB = b.totalStock;
            break;
          case 'daysToExpiry':
            valA = a.earliestDaysToExpiry;
            valB = b.earliestDaysToExpiry;
            break;
          case 'monthlyDemand':
            valA = a.monthlyDemand;
            valB = b.monthlyDemand;
            break;
          case 'stockVelocity':
            valA = a.stockVelocity;
            valB = b.stockVelocity;
            break;
        }

        if (typeof valA === 'string' && typeof valB === 'string') {
          return options.sortOrder === 'desc' 
            ? valB.localeCompare(valA)
            : valA.localeCompare(valB);
        }

        return options.sortOrder === 'desc'
          ? (Number(valB) - Number(valA))
          : (Number(valA) - Number(valB));
      });
    }

    return result;
  }

  public getKPISummary(): InventoryKPISummary {
    const totalMedicinesCount = this.medicines.length;
    let totalUnitsInStock = 0;
    let expiringSoonCount = 0;
    let highWasteRiskCount = 0;
    let stockoutRiskCount = 0;
    let estimatedUnitsAtRisk = 0;
    let totalInventoryValue = 0;
    let totalDaysSupply = 0;

    this.medicines.forEach(m => {
      totalUnitsInStock += m.totalStock;
      totalInventoryValue += m.totalStock * m.unitPrice;
      totalDaysSupply += m.daysOfSupplyRemaining;

      if (m.earliestDaysToExpiry <= 60) {
        expiringSoonCount++;
      }
      if (m.wasteRiskLevel === 'HIGH' || m.wasteRiskLevel === 'CRITICAL' || m.stockStatus === 'High Waste Risk') {
        highWasteRiskCount++;
      }
      if (m.stockStatus === 'Low Stock' || m.daysOfSupplyRemaining < 10) {
        stockoutRiskCount++;
      }

      // Calculate units at risk if inventory > demand before expiry
      const monthsToExpiry = m.earliestDaysToExpiry / 30;
      const demandBeforeExpiry = m.monthlyDemand * monthsToExpiry;
      if (m.totalStock > demandBeforeExpiry) {
        estimatedUnitsAtRisk += Math.round(m.totalStock - demandBeforeExpiry);
      }
    });

    return {
      totalMedicinesCount,
      totalUnitsInStock,
      expiringSoonCount,
      highWasteRiskCount,
      stockoutRiskCount,
      estimatedUnitsAtRisk,
      totalInventoryValue: Math.round(totalInventoryValue),
      averageDaysOfSupply: Math.round(totalDaysSupply / totalMedicinesCount)
    };
  }

  public getCategoryBreakdown(): { category: string; count: number; value: number }[] {
    const map = new Map<string, { count: number; value: number }>();
    this.medicines.forEach(m => {
      const current = map.get(m.category) || { count: 0, value: 0 };
      map.set(m.category, {
        count: current.count + 1,
        value: current.value + (m.totalStock * m.unitPrice)
      });
    });

    return Array.from(map.entries()).map(([category, data]) => ({
      category,
      count: data.count,
      value: Math.round(data.value)
    }));
  }

  public getStockHealthDistribution(): { name: string; value: number; color: string }[] {
    let healthy = 0;
    let lowStock = 0;
    let overstocked = 0;
    let expiringSoon = 0;
    let highWasteRisk = 0;

    this.medicines.forEach(m => {
      switch (m.stockStatus) {
        case 'Healthy': healthy++; break;
        case 'Low Stock': lowStock++; break;
        case 'Overstocked': overstocked++; break;
        case 'Expiring Soon': expiringSoon++; break;
        case 'High Waste Risk': highWasteRisk++; break;
      }
    });

    return [
      { name: 'Healthy Supply', value: healthy, color: '#10b981' }, // Emerald
      { name: 'Low Stock Risk', value: lowStock, color: '#f43f5e' }, // Rose
      { name: 'Overstocked', value: overstocked, color: '#38bdf8' }, // Sky
      { name: 'Expiring Soon (<60d)', value: expiringSoon, color: '#f59e0b' }, // Amber
      { name: 'High Waste Risk', value: highWasteRisk, color: '#8b5cf6' }, // Violet
    ];
  }
}

export const inventoryService = new InventoryService();
