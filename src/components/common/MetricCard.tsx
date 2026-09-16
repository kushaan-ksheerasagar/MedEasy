import React, { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
    label?: string;
  };
  icon: ReactNode;
  variant?: 'default' | 'critical' | 'warning' | 'emerald';
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtext,
  trend,
  icon,
  variant = 'default',
  onClick,
}) => {
  let borderStyle = 'border-slate-200 hover:border-slate-300';
  let iconBg = 'bg-slate-100 text-slate-700';

  if (variant === 'critical') {
    borderStyle = 'border-rose-200 bg-rose-50/30 hover:border-rose-300';
    iconBg = 'bg-rose-100 text-rose-700';
  } else if (variant === 'warning') {
    borderStyle = 'border-amber-200 bg-amber-50/30 hover:border-amber-300';
    iconBg = 'bg-amber-100 text-amber-700';
  } else if (variant === 'emerald') {
    borderStyle = 'border-emerald-200 bg-emerald-50/30 hover:border-emerald-300';
    iconBg = 'bg-emerald-100 text-emerald-700';
  }

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border p-5 transition-all shadow-sm ${borderStyle} ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">{value}</span>
            {trend && (
              <span
                className={`inline-flex items-center text-xs font-semibold px-1.5 py-0.5 rounded ${
                  trend.isNeutral
                    ? 'bg-slate-100 text-slate-700'
                    : trend.isPositive
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {trend.value}
              </span>
            )}
          </div>
          {subtext && <p className="mt-1 text-xs text-slate-500">{subtext}</p>}
        </div>
        <div className={`p-2.5 rounded-lg ${iconBg}`}>{icon}</div>
      </div>
    </div>
  );
};
