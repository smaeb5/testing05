import React from 'react';

interface HeadsetLogoProps {
  className?: string;
  size?: number;
}

export const HeadsetLogo: React.FC<HeadsetLogoProps> = ({
  className = 'w-10 h-10',
  size = 40,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer Headset Arch */}
      <path
        d="M 22 52 A 28 28 0 0 1 78 52"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Left Ear Cushion */}
      <rect
        x="16"
        y="42"
        width="8"
        height="20"
        rx="4"
        stroke="currentColor"
        strokeWidth="3.5"
        fill="none"
      />

      {/* Right Ear Cushion */}
      <rect
        x="76"
        y="42"
        width="8"
        height="20"
        rx="4"
        stroke="currentColor"
        strokeWidth="3.5"
        fill="none"
      />

      {/* Microphone Boom */}
      <path
        d="M 76 56 C 76 74 60 76 52 76"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="49" cy="76" r="3.5" fill="currentColor" />

      {/* Speech bubble inside */}
      <path
        d="M 33 34 C 33 27 67 27 67 34 C 67 44 54 48 45 49 L 36 55 L 38 48 C 34 46 33 41 33 34 Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
        fill="none"
      />

      {/* 3 Message Lines inside bubble */}
      <line x1="42" y1="34" x2="58" y2="34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="40" y1="40" x2="60" y2="40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="43" y1="46" x2="57" y2="46" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
};
