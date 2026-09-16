import React, { useState } from 'react';
import { disposalService } from '../../services/disposalService';
import { 
  IncomingReturnItem, 
  CollectionBatch, 
  NeutralizationLog 
} from '../../types/disposal';
import { StatusBadge } from '../common/StatusBadge';
import { DemoIntelligenceBanner } from '../common/DemoIntelligenceBanner';
import { 
  ShieldCheck, 
  Package, 
  Truck, 
  Flame, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Download, 
  Filter, 
  Search, 
  ArrowUpRight,
  Sparkles,
  Building2,
  RefreshCw,
  Eye
} from 'lucide-react';

export const DisposalManagementTab: React.FC = () => {
  const [subTab, setSubTab] = useState<'returns' | 'collections' | 'processing' | 'reports'>('returns');
  const [returns, setReturns] = useState<IncomingReturnItem[]>(disposalService.getIncomingReturns());
  const [collections, setCollections] = useState<CollectionBatch[]>(disposalService.getCollectionBatches());
  const [processingLogs] = useState<NeutralizationLog[]>(disposalService.getNeutralizationLogs());

  // Filters
  const [returnFilter, setReturnFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected item for inspection modal
  const [inspectingItem, setInspectingItem] = useState<IncomingReturnItem | null>(null);

  const handleUpdateStatus = (id: string, status: IncomingReturnItem['status']) => {
    disposalService.updateReturnStatus(id, status);
    setReturns(disposalService.getIncomingReturns());
    if (inspectingItem && inspectingItem.id === id) {
      setInspectingItem({ ...inspectingItem, status });
    }
  };

  const filteredReturns = returns.filter(item => {
    const matchesStatus = returnFilter === 'ALL' || item.status === returnFilter;
    const matchesSearch = item.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.referenceId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPendingUnits = returns
    .filter(r => r.status === 'Pending' || r.status === 'Inspected')
    .reduce((sum, r) => sum + r.quantity, 0);

  const totalProcessedUnits = returns
    .filter(r => r.status === 'Accepted for Neutralization' || r.status === 'Completed')
    .reduce((sum, r) => sum + r.quantity, 0);

  const handleExportCSV = () => {
    const headers = ['Reference ID', 'Medicine', 'Batch', 'Quantity', 'Source', 'Reason', 'Date', 'Status', 'Handling Category'];
    const rows = returns.map(r => [
      r.referenceId,
      `"${r.medicineName}"`,
      r.batchNumber,
      r.quantity,
      `"${r.source}"`,
      r.reason,
      r.date,
      r.status,
      `"${r.handlingCategory}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MedEasy_Disposal_Audit_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#087E8B] uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>MedEasy Reverse Logistics & Waste Chain</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-[#16324F]">
            Disposal Management
          </h1>
          <p className="text-xs text-[#668096] font-medium">
            Authorized take-back intake, custody verification, and environmentally certified neutralization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-btn bg-[#FFFFFF] border border-[#668096]/20 text-[#16324F] hover:bg-[#EEF5FA] text-xs font-bold transition-all shadow-subtle flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#087E8B]" />
            <span>Export Disposal Audit CSV</span>
          </button>
        </div>
      </div>

      <DemoIntelligenceBanner message="MedEasy connects patient returns, clinic surplus, and expired batches into an audited disposal custody ledger. All items are routed to certified thermal or chemical neutralization facilities." />

      {/* 4 SUMMARY STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FFFFFF] rounded-card p-5 border border-[#668096]/15 shadow-subtle">
          <span className="text-xs font-semibold text-[#668096]">Active Take-Back Returns</span>
          <p className="font-heading text-2xl font-bold text-[#16324F] mt-1">
            {returns.length} <span className="text-xs font-normal text-[#668096]">batches</span>
          </p>
          <p className="text-[11px] text-[#087E8B] font-semibold mt-0.5">3 received today</p>
        </div>

        <div className="bg-[#FFFFFF] rounded-card p-5 border border-[#668096]/15 shadow-subtle">
          <span className="text-xs font-semibold text-[#668096]">Units Pending Inspection</span>
          <p className="font-heading text-2xl font-bold text-[#E9A23B] mt-1">
            {totalPendingUnits} <span className="text-xs font-normal text-[#668096]">units</span>
          </p>
          <p className="text-[11px] text-[#668096] mt-0.5">In tamper-proof storage</p>
        </div>

        <div className="bg-[#FFFFFF] rounded-card p-5 border border-[#668096]/15 shadow-subtle">
          <span className="text-xs font-semibold text-[#668096]">Neutralized Safely (YTD)</span>
          <p className="font-heading text-2xl font-bold text-[#3A9D74] mt-1">
            2,000 <span className="text-xs font-normal text-[#668096]">units</span>
          </p>
          <p className="text-[11px] text-[#3A9D74] font-semibold mt-0.5">Zero environmental leakage</p>
        </div>

        <div className="bg-[#FFFFFF] rounded-card p-5 border border-[#668096]/15 shadow-subtle">
          <span className="text-xs font-semibold text-[#668096]">Scheduled Collections</span>
          <p className="font-heading text-2xl font-bold text-[#16324F] mt-1">
            {collections.filter(c => c.status === 'Scheduled').length} <span className="text-xs font-normal text-[#668096]">routes</span>
          </p>
          <p className="text-[11px] text-[#668096] mt-0.5">Next carrier: Tomorrow, 10 AM</p>
        </div>
      </div>

      {/* SUB-NAVIGATION TABS (Incoming Returns | Collection | Processing | Reports) */}
      <div className="flex items-center gap-2 border-b border-[#668096]/15 pb-2">
        {[
          { id: 'returns', label: 'Incoming Returns', icon: Package, badge: returns.filter(r => r.status === 'Pending').length },
          { id: 'collections', label: 'Collection Management', icon: Truck, badge: collections.filter(c => c.status === 'Scheduled').length },
          { id: 'processing', label: 'Processing & Neutralization', icon: Flame },
          { id: 'reports', label: 'Audit & Compliance Reports', icon: FileText },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-[#087E8B] text-white shadow-subtle'
                  : 'bg-[#FFFFFF] text-[#668096] border border-[#668096]/15 hover:bg-[#EEF5FA] hover:text-[#16324F]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[#D95D5D]/15 text-[#D95D5D]'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. INCOMING RETURNS TAB */}
      {/* ========================================================================= */}
      {subTab === 'returns' && (
        <div className="bg-[#FFFFFF] rounded-card border border-[#668096]/15 shadow-subtle overflow-hidden space-y-4">
          
          {/* Controls Bar */}
          <div className="p-4 bg-[#F6FAFA] border-b border-[#668096]/15 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#16324F]">Filter Status:</span>
              {(['ALL', 'Pending', 'Inspected', 'Accepted for Neutralization', 'Completed'] as const).map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setReturnFilter(st)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                    returnFilter === st
                      ? 'bg-[#087E8B] text-white shadow-subtle'
                      : 'bg-[#FFFFFF] text-[#668096] border border-[#668096]/20 hover:bg-[#EEF5FA]'
                  }`}
                >
                  {st === 'ALL' ? 'All Statuses' : st}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-60">
              <Search className="w-4 h-4 text-[#668096] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search batch or medicine..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#668096]/25 bg-[#FFFFFF] text-[#16324F] focus:outline-none focus:border-[#087E8B]"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFFFFF] border-b border-[#668096]/15 text-[#668096] font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Medicine & Dosage</th>
                  <th className="px-4 py-3">Batch #</th>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#668096]/10">
                {filteredReturns.map(item => (
                  <tr key={item.id} className="hover:bg-[#F6FAFA] transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-[#16324F] block">{item.medicineName}</span>
                      <span className="text-[10px] text-[#087E8B] font-mono">{item.referenceId}</span>
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-[#16324F]">
                      {item.batchNumber}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-[#16324F]">
                      {item.quantity} units
                    </td>
                    <td className="px-4 py-3.5 text-[#16324F] font-medium">
                      {item.source}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded bg-[#EEF5FA] text-[#16324F] font-medium text-[11px]">
                        {item.reason}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-[#668096]">
                      {item.date}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Completed'
                          ? 'bg-[#3A9D74]/15 text-[#3A9D74]'
                          : item.status === 'Accepted for Neutralization'
                          ? 'bg-[#087E8B]/15 text-[#087E8B]'
                          : item.status === 'Inspected'
                          ? 'bg-[#E9A23B]/15 text-[#E9A23B]'
                          : 'bg-[#D95D5D]/15 text-[#D95D5D]'
                      }`}>
                        ● {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setInspectingItem(item)}
                          className="px-2.5 py-1 rounded-btn bg-[#FFFFFF] border border-[#668096]/20 text-[#16324F] hover:bg-[#EEF5FA] text-xs font-bold transition-colors"
                        >
                          Inspect
                        </button>
                        {item.status === 'Pending' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(item.id, 'Inspected')}
                            className="px-2.5 py-1 rounded-btn bg-[#087E8B] hover:bg-[#12A4A6] text-white text-xs font-bold transition-colors"
                          >
                            Verify Seal
                          </button>
                        )}
                        {item.status === 'Inspected' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(item.id, 'Accepted for Neutralization')}
                            className="px-2.5 py-1 rounded-btn bg-[#3A9D74] hover:bg-[#328763] text-white text-xs font-bold transition-colors"
                          >
                            Accept
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. COLLECTION MANAGEMENT TAB */}
      {/* ========================================================================= */}
      {subTab === 'collections' && (
        <div className="space-y-4">
          <div className="p-4 bg-[#FFFFFF] rounded-card border border-[#668096]/15 shadow-subtle flex items-center justify-between">
            <div>
              <h3 className="font-heading text-sm font-bold text-[#16324F]">Scheduled Courier Transits & Vault Pickups</h3>
              <p className="text-xs text-[#668096]">Authorized reverse-distributors collecting locked take-back vaults for treatment facilities.</p>
            </div>
            <span className="text-xs font-bold text-[#3A9D74] bg-[#3A9D74]/10 px-3 py-1 rounded-full">
              GPS Chain-of-Custody Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {collections.map(batch => (
              <div key={batch.id} className="bg-[#FFFFFF] p-5 rounded-card border border-[#668096]/15 shadow-subtle space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-extrabold text-[#087E8B] bg-[#EAF7F6] px-2 py-0.5 rounded">
                    {batch.collectionCode}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    batch.status === 'Processed'
                      ? 'bg-[#3A9D74]/15 text-[#3A9D74]'
                      : batch.status === 'Collected'
                      ? 'bg-[#087E8B]/15 text-[#087E8B]'
                      : 'bg-[#E9A23B]/15 text-[#E9A23B]'
                  }`}>
                    ● {batch.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-heading font-bold text-sm text-[#16324F]">{batch.originPoint}</h4>
                  <p className="text-xs text-[#668096] mt-0.5">{batch.itemCount} distinct SKU batches • {batch.totalUnits} total units</p>
                </div>

                <div className="p-2.5 bg-[#F6FAFA] rounded-xl border border-[#668096]/10 text-xs text-[#16324F] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#668096]">Scheduled Date:</span>
                    <span className="font-bold">{batch.scheduledDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#668096]">Courier:</span>
                    <span className="font-medium truncate max-w-[150px]">{batch.courierService}</span>
                  </div>
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-[#668096]">Manifest:</span>
                    <span className="text-[#087E8B] font-bold">{batch.carrierManifestId}</span>
                  </div>
                </div>

                {batch.status === 'Scheduled' && (
                  <button
                    type="button"
                    onClick={() => {
                      const updated = collections.map(c => c.id === batch.id ? { ...c, status: 'Collected' as const } : c);
                      setCollections(updated);
                    }}
                    className="w-full py-2 rounded-btn bg-[#087E8B] hover:bg-[#12A4A6] text-white text-xs font-bold transition-colors"
                  >
                    Confirm Courier Custody Hand-off
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. PROCESSING & NEUTRALIZATION TAB */}
      {/* ========================================================================= */}
      {subTab === 'processing' && (
        <div className="bg-[#FFFFFF] rounded-card border border-[#668096]/15 shadow-subtle p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#668096]/15">
            <div>
              <h3 className="font-heading text-base font-bold text-[#16324F]">
                Certified Ecological Neutralization Logs
              </h3>
              <p className="text-xs text-[#668096]">
                Permanent destruction certificates verifying high-temperature thermal oxidation with zero aquifer contamination.
              </p>
            </div>
            <span className="text-xs font-bold text-[#3A9D74] flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> EPA Standard Verified
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {processingLogs.map(log => (
              <div key={log.id} className="p-5 rounded-2xl bg-[#F6FAFA] border border-[#668096]/15 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#16324F] bg-[#FFFFFF] px-2.5 py-1 rounded-lg border border-[#668096]/15">
                    {log.lotId}
                  </span>
                  <span className="text-xs font-bold text-[#3A9D74]">{log.environmentalComplianceScore}</span>
                </div>

                <div>
                  <h4 className="font-heading font-bold text-sm text-[#16324F]">{log.method}</h4>
                  <p className="text-xs text-[#668096]">{log.certifiedFacility}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-[#FFFFFF] rounded-lg border border-[#668096]/10">
                    <span className="text-[10px] text-[#668096] block">Neutralized Units</span>
                    <span className="font-heading text-base font-bold text-[#16324F]">{log.unitsNeutralized.toLocaleString()}</span>
                  </div>
                  <div className="p-2 bg-[#FFFFFF] rounded-lg border border-[#668096]/10">
                    <span className="text-[10px] text-[#668096] block">Gross Weight</span>
                    <span className="font-heading text-base font-bold text-[#16324F]">{log.processedWeightKg} kg</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#668096]/10 flex items-center justify-between text-xs text-[#668096]">
                  <span>Completed: {log.completionDate}</span>
                  <span className="font-mono text-[10px] text-[#087E8B] font-bold">{log.certificateNumber}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. REPORTS TAB */}
      {/* ========================================================================= */}
      {subTab === 'reports' && (
        <div className="bg-[#FFFFFF] rounded-card border border-[#668096]/15 shadow-subtle p-6 space-y-6">
          <div>
            <h3 className="font-heading text-base font-bold text-[#16324F]">
              Disposal Compliance & Take-Back Reports
            </h3>
            <p className="text-xs text-[#668096]">
              Generate regulatory audit packets for health authorities, municipal waste regulators, and clinical ESG reporting.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-[#668096]/20 bg-[#F6FAFA] space-y-3">
              <FileText className="w-6 h-6 text-[#087E8B]" />
              <div>
                <h4 className="font-bold text-xs text-[#16324F]">Monthly Take-Back Ledger</h4>
                <p className="text-[11px] text-[#668096]">Comprehensive breakdown of all patient and facility drop-offs.</p>
              </div>
              <button
                type="button"
                onClick={handleExportCSV}
                className="w-full py-1.5 rounded-btn bg-[#FFFFFF] border border-[#087E8B]/30 text-[#087E8B] hover:bg-[#EAF7F6] text-xs font-bold transition-colors"
              >
                Download CSV
              </button>
            </div>

            <div className="p-4 rounded-xl border border-[#668096]/20 bg-[#F6FAFA] space-y-3">
              <ShieldCheck className="w-6 h-6 text-[#3A9D74]" />
              <div>
                <h4 className="font-bold text-xs text-[#16324F]">Destruction Certificates</h4>
                <p className="text-[11px] text-[#668096]">Audit documentation with verified facility certification numbers.</p>
              </div>
              <button
                type="button"
                onClick={() => alert('Certificate PDF generated: CERT-NEUT-2026-9021. Signed by Chief Environmental Officer.')}
                className="w-full py-1.5 rounded-btn bg-[#FFFFFF] border border-[#3A9D74]/30 text-[#3A9D74] hover:bg-[#3A9D74]/10 text-xs font-bold transition-colors"
              >
                Generate Audit PDF
              </button>
            </div>

            <div className="p-4 rounded-xl border border-[#668096]/20 bg-[#F6FAFA] space-y-3">
              <RefreshCw className="w-6 h-6 text-[#16324F]" />
              <div>
                <h4 className="font-bold text-xs text-[#16324F]">Waste Loop Closure Report</h4>
                <p className="text-[11px] text-[#668096]">Closing the loop: At-risk vs recovered vs neutralized metrics.</p>
              </div>
              <button
                type="button"
                onClick={() => alert('Waste Loop Closure Report export ready.')}
                className="w-full py-1.5 rounded-btn bg-[#FFFFFF] border border-[#16324F]/30 text-[#16324F] hover:bg-[#EEF5FA] text-xs font-bold transition-colors"
              >
                Export Summary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INSPECTION MODAL */}
      {inspectingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#16324F]/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#668096]/20 shadow-card max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#668096]/15">
              <div>
                <span className="text-[10px] font-bold text-[#087E8B] uppercase tracking-wider">SKU Batch Intake Verification</span>
                <h3 className="font-heading font-bold text-base text-[#16324F]">{inspectingItem.medicineName}</h3>
              </div>
              <button onClick={() => setInspectingItem(null)} className="text-[#668096]">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-[#F6FAFA] rounded-xl border border-[#668096]/10">
                  <span className="text-[10px] text-[#668096] block">Batch Number</span>
                  <span className="font-mono font-bold text-[#16324F]">{inspectingItem.batchNumber}</span>
                </div>
                <div className="p-2.5 bg-[#F6FAFA] rounded-xl border border-[#668096]/10">
                  <span className="text-[10px] text-[#668096] block">Quantity Received</span>
                  <span className="font-bold text-[#16324F]">{inspectingItem.quantity} units</span>
                </div>
              </div>

              <div className="p-3 bg-[#EEF5FA] rounded-xl border border-[#668096]/15 space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#668096]">Source:</span>
                  <span className="font-bold text-[#16324F]">{inspectingItem.source}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#668096]">Reported Reason:</span>
                  <span className="font-semibold text-[#16324F]">{inspectingItem.reason}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#668096]">Handling Category:</span>
                  <span className="font-bold text-[#087E8B]">{inspectingItem.handlingCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#668096]">Current Status:</span>
                  <span className="font-bold text-[#3A9D74]">{inspectingItem.status}</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold text-[#16324F] block">Update Intake Workflow:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(inspectingItem.id, 'Inspected')}
                    className="py-2 rounded-btn bg-[#FFFFFF] border border-[#668096]/25 hover:bg-[#EEF5FA] font-bold text-[#16324F]"
                  >
                    Mark Inspected
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(inspectingItem.id, 'Accepted for Neutralization')}
                    className="py-2 rounded-btn bg-[#087E8B] hover:bg-[#12A4A6] font-bold text-white"
                  >
                    Accept for Neutralization
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setInspectingItem(null)}
              className="w-full py-2 rounded-btn bg-[#F6FAFA] text-[#668096] hover:bg-[#EEF5FA] text-xs font-bold"
            >
              Close Inspection
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
