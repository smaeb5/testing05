import React, { useState } from 'react';

interface SwatFlagLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWhiteOutline?: boolean;
}

export const SwatFlagLogo: React.FC<SwatFlagLogoProps> = ({
  className = '',
  size = 'md',
  showWhiteOutline = true,
}) => {
  const [imgSrc, setImgSrc] = useState('/images/swat_flag_waving.png');
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: 'h-8 w-auto',
    md: 'h-11 w-auto',
    lg: 'h-16 w-auto',
    xl: 'h-24 w-auto',
  };

  const outlineClass = showWhiteOutline ? 'flag-white-outline' : 'drop-shadow-md';

  const handleError = () => {
    if (imgSrc === '/images/swat_flag_waving.png') {
      setImgSrc('/images/swat_flag_cutout.png');
    } else if (imgSrc === '/images/swat_flag_cutout.png') {
      setImgSrc('/images/swat_flag_transparent.png');
    } else {
      setHasError(true);
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 select-none bg-transparent ${className}`}
    >
      {!hasError ? (
        <img
          src={imgSrc}
          alt="Swat State Flag"
          referrerPolicy="no-referrer"
          className={`object-contain transition-transform duration-200 bg-transparent ${outlineClass} ${sizeClasses[size]}`}
          onError={handleError}
        />
      ) : (
        <svg
          viewBox="0 0 120 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${outlineClass} ${sizeClasses[size]}`}
        >
          <defs>
            <linearGradient id="swatRed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DC2626" />
              <stop offset="50%" stopColor="#B91C1C" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>
            <linearGradient id="swatGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
          <rect width="120" height="80" rx="6" fill="url(#swatRed)" stroke="#FFFFFF" strokeWidth="2.5" />
          <path
            d="M 50 18 A 24 24 0 1 0 50 62 A 20 20 0 1 1 50 18 Z"
            fill="url(#swatGold)"
          />
          <polygon
            points="68,28 72,36 81,37 74,43 76,51 68,46 60,51 62,43 55,37 64,36"
            fill="url(#swatGold)"
          />
        </svg>
      )}
    </div>
  );
};

