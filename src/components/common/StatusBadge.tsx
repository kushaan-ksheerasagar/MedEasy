import React from 'react';
import { StockStatus, WasteRiskLevel } from '../../types/inventory';

interface StatusBadgeProps {
  status?: StockStatus | WasteRiskLevel | 'Balanced' | 'Moderate Imbalance' | 'Significant Imbalance' | 'Active' | 'Discontinued' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'Healthy' | 'Attention' | 'Critical';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  if (!status) return null;

  let bg = 'bg-[#EEF5FA] text-[#16324F] border-[#668096]/20';
  let dot = 'bg-[#668096]';

  switch (status) {
    case 'Healthy':
    case 'Balanced':
    case 'Active':
    case 'LOW':
      bg = 'bg-[#3A9D74]/10 text-[#3A9D74] border-[#3A9D74]/30';
      dot = 'bg-[#3A9D74]';
      break;
    case 'Low Stock':
    case 'CRITICAL':
    case 'Critical':
    case 'Significant Imbalance':
      bg = 'bg-[#D95D5D]/10 text-[#D95D5D] border-[#D95D5D]/30';
      dot = 'bg-[#D95D5D]';
      break;
    case 'Expiring Soon':
    case 'Moderate Imbalance':
    case 'Attention':
    case 'MEDIUM':
      bg = 'bg-[#E9A23B]/10 text-[#E9A23B] border-[#E9A23B]/30';
      dot = 'bg-[#E9A23B]';
      break;
    case 'Overstocked':
    case 'HIGH':
    case 'High Waste Risk':
      bg = 'bg-[#EAF7F6] text-[#087E8B] border-[#7CC9C3]/50';
      dot = 'bg-[#087E8B]';
      break;
    case 'Discontinued':
      bg = 'bg-[#F6FAFA] text-[#668096] border-[#668096]/30 line-through';
      dot = 'bg-[#668096]';
      break;
  }

  const padding = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${padding} ${bg} font-sans`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`}></span>
      <span>{status}</span>
    </span>
  );
};
