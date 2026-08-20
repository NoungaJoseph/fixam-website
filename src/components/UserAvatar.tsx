import React, { useState, useEffect } from 'react';
import { getMediaUrl } from '../App';

const AVATAR_COLORS = [
  '#0D9488',
  '#2563EB',
  '#7C3AED',
  '#DB2777',
  '#DC2626',
  '#EA580C',
  '#16A34A',
  '#475569',
];

export const getInitial = (name?: string) => {
  const value = String(name || '').trim();
  if (!value) return 'U';
  const parts = value.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return (value.substring(0, 2) || 'U').toUpperCase();
};

export const getColorForName = (name?: string) => {
  const value = String(name || 'User');
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) - hash) + value.charCodeAt(i);
    hash |= 0;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

interface UserAvatarProps {
  uri?: string | null;
  name?: string;
  size?: number;
  radius?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export default function UserAvatar({
  uri,
  name,
  size = 48,
  radius = '50%',
  className = '',
  style = {}
}: UserAvatarProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [uri]);

  const resolvedUri = uri ? getMediaUrl(uri) : null;
  const initial = getInitial(name);
  const bgColor = getColorForName(name);

  if (resolvedUri && !hasError) {
    return (
      <img
        src={resolvedUri}
        alt={name || 'Avatar'}
        className={`object-cover ${className}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: typeof radius === 'number' ? `${radius}px` : radius,
          backgroundColor: bgColor,
          flexShrink: 0,
          display: 'block',
          ...style
        }}
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center font-bold text-white uppercase select-none ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: typeof radius === 'number' ? `${radius}px` : radius,
        backgroundColor: bgColor,
        fontSize: `${Math.max(11, Math.round(size * 0.38))}px`,
        lineHeight: 1,
        flexShrink: 0,
        ...style
      }}
    >
      {initial}
    </div>
  );
}
