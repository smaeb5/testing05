import React, { useState } from 'react';

interface OfficialAvatarProps {
  officialId: string;
  name: string;
  className?: string;
  fallbackInitial?: string;
  avatarUrl?: string;
}

// Primary: Local public/images/ | Fallback: GitHub raw CDN
const OFFICIAL_IMAGE_MAP: Record<string, string[]> = {
  'appointment-lead': [
    '/images/dr_rizwan_fazal.jpeg',
    'https://raw.githubusercontent.com/smaeb5/SCCW/main/rizwan.jpeg',
  ],
  'president-district-swat': [
    '/images/najam_hashmi.jpg',
  ],
  'vice-president': [
    '/images/hassan_bacha.png',
  ],
  'finance-secretary': [
    '/images/bilal_ahmad_khan.jpeg',
    'https://raw.githubusercontent.com/smaeb5/SCCW/main/bilal.jpeg',
  ],
  'additional-general-secretary': [
    '/images/aleem_ullah.jpeg',
    'https://raw.githubusercontent.com/smaeb5/SCCW/main/aleem.jpeg',
  ],
};

export const OfficialAvatar: React.FC<OfficialAvatarProps> = ({
  officialId,
  name,
  className = 'w-full h-full',
  fallbackInitial,
  avatarUrl,
}) => {
  const mapSources = OFFICIAL_IMAGE_MAP[officialId] || [];
  // If avatarUrl provided and not already in map, prepend it
  const sources = avatarUrl && !mapSources.includes(avatarUrl)
    ? [avatarUrl, ...mapSources]
    : mapSources.length > 0
    ? mapSources
    : [avatarUrl].filter(Boolean) as string[];
  const [sourceIndex, setSourceIndex] = useState(0);
  const [allFailed, setAllFailed] = useState(false);

  const handleError = () => {
    if (sourceIndex + 1 < sources.length) {
      setSourceIndex((prev) => prev + 1);
    } else {
      setAllFailed(true);
    }
  };

  if (allFailed) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-red-950 text-amber-300 font-bold ${className}`}>
        {fallbackInitial || name.charAt(0) || '★'}
      </div>
    );
  }

  return (
    <img
      src={sources[sourceIndex]}
      alt={name}
      referrerPolicy="no-referrer"
      crossOrigin="anonymous"
      loading="eager"
      onError={handleError}
      className={`w-full h-full object-cover object-center ${className}`}
    />
  );
};
