import React, { useState } from 'react';
import { inventoryService } from '../../services/inventoryService';
import { wasteService } from '../../services/wasteService';
import { demandService } from '../../services/demandService';
import { DemoIntelligenceBanner } from '../common/DemoIntelligenceBanner';
import { Download, Table } from 'lucide-react';

export const ReportsTab: React.FC = () => {
  const [reportType, setReportType] = useState<'inventory' | 'waste' | 'demand' | 'expiry'>('inventory');
  const [dateRange, setDateRange] = useState<'30' | '60' | '90' | '365'>('30');
  const [selectedZone, setSelectedZone] = useState<string>('ALL');

  const medicines = inventoryService.getAll();
  const wasteItems = wasteService.getWasteRiskItems();
  const zones = demandService.getAllZones();

  const handleDownloadCSV = () => {
    let headers: string[] = [];
    let rows: string[][] = [];
    // Strictly MedEasy filename
    let filename = `MedEasy_${reportType}_report_${new Date().toISOString().slice(0, 10)}.csv`;

    if (reportType === 'inventory') {
      headers = ['Medicine Name', 'Category', 'Stock Status', 'Total Stock', 'Monthly Demand', 'Days To Expiry', 'Stock Velocity', 'Unit Price ($)'];
      rows = medicines.map(m => [
        `"${m.name}"`,
        `"${m.category}"`,
        `"${m.stockStatus}"`,
        m.totalStock.toString(),
        m.monthlyDemand.toString(),
        m.earliestDaysToExpiry.toString(),
        m.stockVelocity.toString(),
        m.unitPrice.toFixed(2)
      ]);
    } else if (reportType === 'waste') {
      headers = ['Medicine Name', 'Current Stock', 'Projected Demand Before Expiry', 'Units At Risk', 'Potential Financial Waste ($)', 'Expiry Date', 'Waste Risk Level', 'Location'];
      rows = wasteItems.map(w => [
        `"${w.medicineName}"`,
        w.currentStock.toString(),
        w.projectedDemandBeforeExpiry.toString(),
        w.potentialExcessUnits.toString(),
        w.potentialFinancialWaste.toString(),
        `"${w.earliestExpiryDate}"`,
        `"${w.wasteRiskLevel}"`,
        `"${w.primaryLocation}"`
      ]);
    } else if (reportType === 'demand') {
      headers = ['Zone', 'Demand Index', 'Supply Index', 'Status', 'Top Deficit Medicine', 'Top Surplus Medicine'];
      rows = zones.map(z => [
        `"${z.zoneName}"`,
        z.demandIndex.toString(),
        z.supplyIndex.toString(),
        `"${z.status}"`,
        `"${z.topDeficitMedicine}"`,
        `"${z.topSurplusMedicine}"`
      ]);
    } else {
      headers = ['Medicine Name', 'Batch Number', 'Expiry Date', 'Days To Expiry', 'Remaining Quantity', 'Location'];
      rows = [];
      medicines.forEach(m => {
        m.batches.forEach(b => {
          rows.push([
            `"${m.name}"`,
            `"${b.batchNumber}"`,
            `"${b.expiryDate}"`,
            b.daysToExpiry.toString(),
            b.remainingQuantity.toString(),
            `"${b.locationName}"`
          ]);
        });
      });
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#16324F]">Audit & Inventory Reports</h1>
        <p className="text-xs text-[#668096] mt-0.5 font-medium">
          Generate structured CSV audit summaries for healthcare networks and inventory controllers
        </p>
      </div>

      <DemoIntelligenceBanner message="Reports aggregate real-time system state across physical facilities. Exports are formatted for standard ERP or supply-chain ingestion." />

      {/* Control Panel */}
      <div className="bg-[#FFFFFF] p-6 rounded-card border border-[#668096]/15 shadow-subtle space-y-4">
        <h3 className="font-heading text-sm font-bold text-[#16324F]">Report Parameters</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Report Type */}
          <div>
            <label className="block text-xs font-bold text-[#16324F] mb-1.5">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full px-3 py-2 bg-[#F6FAFA] border border-[#668096]/20 rounded-input text-xs font-semibold text-[#16324F]"
            >
              <option value="inventory">Inventory Valuation & Status</option>
              <option value="waste">Waste Risk & Excess Projection</option>
              <option value="demand">Demand & Zonal Balance</option>
              <option value="expiry">Batch Expiry Timeline Audit</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-xs font-bold text-[#16324F] mb-1.5">Reporting Horizon</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="w-full px-3 py-2 bg-[#F6FAFA] border border-[#668096]/20 rounded-input text-xs font-semibold text-[#16324F]"
            >
              <option value="30">Next 30 Days Forecast</option>
              <option value="60">Next 60 Days Forecast</option>
              <option value="90">Next 90 Days Forecast</option>
              <option value="365">Past 12 Months Historical</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-[#16324F] mb-1.5">Geographic Territory</label>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full px-3 py-2 bg-[#F6FAFA] border border-[#668096]/20 rounded-input text-xs font-semibold text-[#16324F]"
            >
              <option value="ALL">All Consolidated Zones (A–E)</option>
              {zones.map(z => (
                <option key={z.zoneId} value={z.zoneId}>{z.zoneName}</option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={handleDownloadCSV}
              className="w-full py-2 px-4 rounded-btn bg-[#087E8B] hover:bg-[#066570] text-white text-xs font-bold shadow-subtle flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download CSV
            </button>
          </div>

        </div>
      </div>

      {/* Live Table Preview */}
      <div className="bg-[#FFFFFF] rounded-card border border-[#668096]/15 shadow-subtle overflow-hidden">
        <div className="p-4 border-b border-[#668096]/15 bg-[#F6FAFA] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-[#087E8B]" />
            <h3 className="font-heading text-sm font-bold text-[#16324F] capitalize">
              Data Preview: {reportType} Report
            </h3>
          </div>
          <span className="text-xs text-[#668096]">
            Export Source: MedEasy Audit Engine
          </span>
        </div>

        <div className="overflow-x-auto max-h-96">
          {reportType === 'inventory' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFFFFF] border-b border-[#668096]/15 text-[#668096] font-bold uppercase sticky top-0">
                <tr>
                  <th className="px-4 py-3">Medicine</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Monthly Demand</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Unit Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#668096]/10">
                {medicines.map(m => (
                  <tr key={m.id} className="hover:bg-[#F6FAFA]">
                    <td className="px-4 py-2.5 font-bold text-[#16324F]">{m.name}</td>
                    <td className="px-4 py-2.5 text-[#668096]">{m.category}</td>
                    <td className="px-4 py-2.5 font-semibold text-[#16324F]">{m.totalStock.toLocaleString()} units</td>
                    <td className="px-4 py-2.5 text-[#16324F]">{m.monthlyDemand.toLocaleString()}</td>
                    <td className="px-4 py-2.5">{m.stockStatus}</td>
                    <td className="px-4 py-2.5 font-mono">${m.unitPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'waste' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFFFFF] border-b border-[#668096]/15 text-[#668096] font-bold uppercase sticky top-0">
                <tr>
                  <th className="px-4 py-3">Medicine</th>
                  <th className="px-4 py-3">Current Stock</th>
                  <th className="px-4 py-3">Demand Before Expiry</th>
                  <th className="px-4 py-3 text-[#D95D5D]">Excess Units</th>
                  <th className="px-4 py-3">Financial Value</th>
                  <th className="px-4 py-3">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#668096]/10">
                {wasteItems.map(w => (
                  <tr key={w.id} className="hover:bg-[#F6FAFA]">
                    <td className="px-4 py-2.5 font-bold text-[#16324F]">{w.medicineName}</td>
                    <td className="px-4 py-2.5 font-semibold text-[#16324F]">{w.currentStock.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-[#668096]">{w.projectedDemandBeforeExpiry.toLocaleString()}</td>
                    <td className="px-4 py-2.5 font-bold text-[#D95D5D]">+{w.potentialExcessUnits.toLocaleString()}</td>
                    <td className="px-4 py-2.5 font-bold text-[#16324F]">${w.potentialFinancialWaste.toLocaleString()}</td>
                    <td className="px-4 py-2.5">{w.wasteRiskLevel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'demand' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFFFFF] border-b border-[#668096]/15 text-[#668096] font-bold uppercase sticky top-0">
                <tr>
                  <th className="px-4 py-3">Zone</th>
                  <th className="px-4 py-3">Demand Index</th>
                  <th className="px-4 py-3">Supply Index</th>
                  <th className="px-4 py-3">Balance Ratio</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#668096]/10">
                {zones.map(z => (
                  <tr key={z.zoneId} className="hover:bg-[#F6FAFA]">
                    <td className="px-4 py-2.5 font-bold text-[#16324F]">{z.zoneName}</td>
                    <td className="px-4 py-2.5 font-semibold text-[#D95D5D]">{z.demandIndex} / 100</td>
                    <td className="px-4 py-2.5 font-semibold text-[#3A9D74]">{z.supplyIndex} / 100</td>
                    <td className="px-4 py-2.5 font-bold">{z.balanceRatio.toFixed(2)}x</td>
                    <td className="px-4 py-2.5">{z.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'expiry' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFFFFF] border-b border-[#668096]/15 text-[#668096] font-bold uppercase sticky top-0">
                <tr>
                  <th className="px-4 py-3">Medicine</th>
                  <th className="px-4 py-3">Batch Number</th>
                  <th className="px-4 py-3">Expiry Date</th>
                  <th className="px-4 py-3">Days Left</th>
                  <th className="px-4 py-3">Remaining Units</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#668096]/10">
                {medicines.flatMap(m => m.batches.map(b => (
                  <tr key={b.batchNumber} className="hover:bg-[#F6FAFA]">
                    <td className="px-4 py-2.5 font-bold text-[#16324F]">{m.name}</td>
                    <td className="px-4 py-2.5 font-mono text-[#16324F]">{b.batchNumber}</td>
                    <td className="px-4 py-2.5 text-[#16324F]">{b.expiryDate}</td>
                    <td className="px-4 py-2.5 font-bold text-[#D95D5D]">{b.daysToExpiry} days</td>
                    <td className="px-4 py-2.5 font-semibold text-[#16324F]">{b.remainingQuantity} units</td>
                  </tr>
                )))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
};
