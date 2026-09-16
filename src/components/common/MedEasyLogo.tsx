import React from 'react';

interface MedEasyLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const MedEasyLogo: React.FC<MedEasyLogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* MedEasy Custom Mark: Interconnected smart capsule loop in primary teal and soft mint */}
      <div className={`${iconSizes[size]} rounded-xl bg-[#087E8B] flex items-center justify-center text-white shadow-subtle shrink-0 relative overflow-hidden group`}>
        <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg">
          {/* Stylized M / Connected medicine capsule loop */}
          <path
            d="M9 19V13C9 10.7909 10.7909 9 13 9C15.2091 9 17 10.7909 17 13V19C17 21.2091 18.7909 23 21 23C23.2091 23 25 21.2091 25 19V13"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Focal precision dot in Soft Mint */}
          <circle cx="17" cy="13" r="2.2" fill="#7CC9C3" />
        </svg>
      </div>

      <div>
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-heading font-bold tracking-tight text-[#16324F] ${textSizes[size]}`}>
            Med<span className="text-[#087E8B]">Easy</span>
          </span>
        </div>
        {showTagline && (
          <p className="text-[11px] text-[#668096] font-medium tracking-normal mt-0.5">
            Medicine management, made easy.
          </p>
        )}
      </div>
    </div>
  );
};
