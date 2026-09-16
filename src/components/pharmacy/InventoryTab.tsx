import React, { useState, useMemo } from 'react';
import { inventoryService } from '../../services/inventoryService';
import { Medicine, StockStatus, MedicineCategory } from '../../types/inventory';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  ChevronRight, 
  Package, 
  Layers,
  ChevronLeft,
  Truck,
  Download,
  CheckSquare,
  Square
} from 'lucide-react';

interface InventoryTabProps {
  onSelectMedicine: (med: Medicine) => void;
}

export const InventoryTab: React.FC<InventoryTabProps> = ({ onSelectMedicine }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MedicineCategory | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<StockStatus | 'ALL'>('ALL');
  const [selectedLocation, setSelectedLocation] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'daysToExpiry' | 'monthlyDemand' | 'stockVelocity'>('daysToExpiry');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Selection and Pagination
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const categories: (MedicineCategory | 'ALL')[] = [
    'ALL',
    'Antibiotics',
    'Cardiovascular',
    'Endocrine & Diabetes',
    'Analgesics & Anti-inflammatory',
    'Respiratory',
    'Specialty & Oncology',
    'Gastrointestinal',
    'Neurological'
  ];

  const statusFilters: (StockStatus | 'ALL')[] = [
    'ALL',
    'Healthy',
    'Low Stock',
    'Overstocked',
    'Expiring Soon',
    'High Waste Risk'
  ];

  const filteredMedicines = useMemo(() => {
    return inventoryService.getFiltered({
      searchQuery,
      category: selectedCategory,
      stockStatus: selectedStatus,
      zoneId: selectedLocation,
      sortBy,
      sortOrder,
    });
  }, [searchQuery, selectedCategory, selectedStatus, selectedLocation, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredMedicines.length / pageSize) || 1;
  const paginatedMedicines = filteredMedicines.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedMedicines.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedMedicines.map(m => m.id));
    }
  };

  const toggleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#16324F]">Medicine Inventory</h1>
          <p className="text-xs text-[#668096] mt-0.5">
            Audit batch records, calculate days of supply remaining, and manage safety stock buffers ({filteredMedicines.length} medicines)
          </p>
        </div>

        {/* Bulk Action Bar (when rows are selected) */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 bg-[#EAF7F6] px-3.5 py-1.5 rounded-btn border border-[#7CC9C3]/50 animate-in fade-in">
            <span className="text-xs font-bold text-[#087E8B]">
              {selectedIds.length} selected
            </span>
            <button
              type="button"
              onClick={() => alert(`Bulk rebalance initiated for ${selectedIds.length} medicines.`)}
              className="px-2.5 py-1 bg-[#087E8B] text-white rounded-md text-[11px] font-bold hover:bg-[#066570]"
            >
              Transfer Selected
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-[11px] text-[#668096] hover:text-[#16324F] ml-1 font-medium"
            >
              Deselect
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FFFFFF] p-4 rounded-card border border-[#668096]/15 shadow-subtle space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Search Box */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-[#668096] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by medicine, generic molecule, class, or batch..."
              className="w-full pl-10 pr-4 py-2 bg-[#F6FAFA] border border-[#668096]/20 rounded-input text-xs text-[#16324F] focus:outline-none focus:ring-2 focus:ring-[#087E8B]/20 focus:border-[#087E8B] placeholder:text-[#668096]"
            />
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-[#F6FAFA] border border-[#668096]/20 rounded-input text-xs text-[#16324F] font-medium focus:outline-none focus:ring-2 focus:ring-[#087E8B]/20 focus:border-[#087E8B]"
            >
              <option value="ALL">All Categories ({categories.length - 1})</option>
              {categories.filter(c => c !== 'ALL').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-3">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [f, o] = e.target.value.split('-');
                setSortBy(f as any);
                setSortOrder(o as any);
              }}
              className="w-full px-3 py-2 bg-[#F6FAFA] border border-[#668096]/20 rounded-input text-xs text-[#16324F] font-medium focus:outline-none focus:ring-2 focus:ring-[#087E8B]/20 focus:border-[#087E8B]"
            >
              <option value="daysToExpiry-asc">Sort: Earliest Expiry (Soonest first)</option>
              <option value="daysToExpiry-desc">Sort: Latest Expiry</option>
              <option value="stock-asc">Sort: Available Stock (Lowest first)</option>
              <option value="stock-desc">Sort: Available Stock (Highest first)</option>
              <option value="monthlyDemand-desc">Sort: Demand (Highest first)</option>
              <option value="name-asc">Sort: Medicine Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Status Quick Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#668096]/10">
          <span className="text-[11px] font-semibold text-[#668096] mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#087E8B]" /> Status:
          </span>
          {statusFilters.map(status => (
            <button
              key={status}
              type="button"
              onClick={() => {
                setSelectedStatus(status);
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedStatus === status
                  ? 'bg-[#087E8B] text-white shadow-subtle'
                  : 'bg-[#EEF5FA] text-[#668096] hover:bg-[#EAF7F6] hover:text-[#16324F]'
              }`}
            >
              {status === 'ALL' ? 'All Statuses' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table (Exact columns: Medicine, Batch, Available, Demand/month, Expiry, Days left, Risk, Status) */}
      <div className="bg-[#FFFFFF] rounded-card border border-[#668096]/15 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F6FAFA] border-b border-[#668096]/15 text-[#668096] font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5 w-10">
                  <button onClick={toggleSelectAll} className="p-0.5 rounded text-[#668096] hover:text-[#16324F]">
                    {selectedIds.length === paginatedMedicines.length && paginatedMedicines.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-[#087E8B]" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3.5 cursor-pointer hover:text-[#16324F]" onClick={() => toggleSort('name')}>
                  <div className="flex items-center gap-1.5">
                    Medicine
                    <ArrowUpDown className="w-3 h-3 text-[#668096]" />
                  </div>
                </th>
                <th className="px-4 py-3.5">Batch</th>
                <th className="px-4 py-3.5 cursor-pointer hover:text-[#16324F]" onClick={() => toggleSort('stock')}>
                  <div className="flex items-center gap-1.5">
                    Available
                    <ArrowUpDown className="w-3 h-3 text-[#668096]" />
                  </div>
                </th>
                <th className="px-4 py-3.5 cursor-pointer hover:text-[#16324F]" onClick={() => toggleSort('monthlyDemand')}>
                  <div className="flex items-center gap-1.5">
                    Demand / Month
                    <ArrowUpDown className="w-3 h-3 text-[#668096]" />
                  </div>
                </th>
                <th className="px-4 py-3.5">Expiry</th>
                <th className="px-4 py-3.5 cursor-pointer hover:text-[#16324F]" onClick={() => toggleSort('daysToExpiry')}>
                  <div className="flex items-center gap-1.5">
                    Days Left
                    <ArrowUpDown className="w-3 h-3 text-[#668096]" />
                  </div>
                </th>
                <th className="px-4 py-3.5">Risk</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#668096]/10">
              {paginatedMedicines.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-[#668096]">
                    <Package className="w-8 h-8 text-[#668096]/40 mx-auto mb-2" />
                    <p className="font-semibold text-sm text-[#16324F]">No medicines match current criteria</p>
                    <p className="text-xs mt-1">Clear your search query or reset status filters.</p>
                  </td>
                </tr>
              ) : (
                paginatedMedicines.map(med => {
                  const primaryBatch = med.batches[0];
                  const isSelected = selectedIds.includes(med.id);
                  return (
                    <tr
                      key={med.id}
                      onClick={() => onSelectMedicine(med)}
                      className={`hover:bg-[#EAF7F6]/50 cursor-pointer transition-colors group ${
                        isSelected ? 'bg-[#EAF7F6]/30' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-3.5" onClick={(e) => toggleSelectRow(med.id, e)}>
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-[#087E8B]" />
                        ) : (
                          <Square className="w-4 h-4 text-[#668096]/60" />
                        )}
                      </td>

                      {/* Medicine */}
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-[#16324F] group-hover:text-[#087E8B] transition-colors">
                          {med.name}
                        </div>
                        <div className="text-[11px] text-[#668096]">
                          {med.dosage} • {med.form}
                        </div>
                      </td>

                      {/* Batch */}
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs text-[#16324F] font-semibold bg-[#F6FAFA] px-1.5 py-0.5 rounded border border-[#668096]/20">
                          {primaryBatch?.batchNumber || 'N/A'}
                        </span>
                        {med.batches.length > 1 && (
                          <span className="ml-1 text-[10px] text-[#668096]">
                            +{med.batches.length - 1}
                          </span>
                        )}
                      </td>

                      {/* Available */}
                      <td className="px-4 py-3.5 font-bold text-[#16324F]">
                        {med.totalStock.toLocaleString()} <span className="text-xs font-normal text-[#668096]">units</span>
                      </td>

                      {/* Demand / Month */}
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-[#16324F]">
                          {med.monthlyDemand.toLocaleString()}
                        </span>
                        <span className={`text-[10px] ml-1 font-bold ${
                          med.demandTrendPercent >= 0 ? 'text-[#3A9D74]' : 'text-[#D95D5D]'
                        }`}>
                          {med.demandTrendPercent >= 0 ? '+' : ''}{med.demandTrendPercent}%
                        </span>
                      </td>

                      {/* Expiry */}
                      <td className="px-4 py-3.5 text-[#16324F]">
                        {med.earliestExpiryDate}
                      </td>

                      {/* Days Left */}
                      <td className="px-4 py-3.5">
                        <span className={`font-bold ${
                          med.earliestDaysToExpiry <= 45 
                            ? 'text-[#D95D5D]' 
                            : med.earliestDaysToExpiry <= 90 
                            ? 'text-[#E9A23B]' 
                            : 'text-[#3A9D74]'
                        }`}>
                          {med.earliestDaysToExpiry} days
                        </span>
                      </td>

                      {/* Risk */}
                      <td className="px-4 py-3.5">
                        <StatusBadge status={med.wasteRiskLevel} size="sm" />
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <StatusBadge status={med.stockStatus} />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectMedicine(med);
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#087E8B] hover:bg-[#EAF7F6] inline-flex items-center gap-1 transition-colors"
                        >
                          Drawer <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-[#F6FAFA] border-t border-[#668096]/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#668096]">
          <span>
            Showing <strong className="text-[#16324F]">{(currentPage - 1) * pageSize + 1}</strong> to <strong className="text-[#16324F]">{Math.min(currentPage * pageSize, filteredMedicines.length)}</strong> of <strong className="text-[#16324F]">{filteredMedicines.length}</strong> items
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="px-3 py-1.5 rounded-btn bg-[#FFFFFF] border border-[#668096]/20 text-[#16324F] font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#EEF5FA] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1.5 font-bold text-[#16324F]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="px-3 py-1.5 rounded-btn bg-[#FFFFFF] border border-[#668096]/20 text-[#16324F] font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#EEF5FA] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
