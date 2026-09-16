import React from 'react';
import { Sparkles, Info } from 'lucide-react';

interface DemoIntelligenceBannerProps {
  message?: string;
  variant?: 'subtle' | 'compact';
}

export const DemoIntelligenceBanner: React.FC<DemoIntelligenceBannerProps> = ({
  message = "MedEasy Intelligence Engine generates deterministic simulated insights from current supply-demand metrics. Insights are for operational supply coordination and are not medically validated prescriptions.",
  variant = 'subtle'
}) => {
  return (
    <div className="bg-[#EAF7F6] border border-[#7CC9C3]/40 rounded-card p-3.5 flex items-start gap-3 shadow-subtle">
      <div className="p-1.5 rounded-lg bg-[#087E8B]/10 text-[#087E8B] shrink-0 mt-0.5">
        <Sparkles className="w-4 h-4" />
      </div>
      <div className="text-xs text-[#16324F] leading-relaxed">
        <span className="font-semibold text-[#087E8B] mr-2 uppercase tracking-wider text-[10px] bg-[#FFFFFF] border border-[#7CC9C3]/50 px-1.5 py-0.5 rounded-md">
          MedEasy Intelligence
        </span>
        <span className="text-[#668096]">{message}</span>
      </div>
    </div>
  );
};
