/**
 * Skeleton.tsx — États de chargement
 * Remplace les <Loader2 className="animate-spin" /> sur les pages entières.
 */

import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
}) => (
  <div
    className={`animate-shimmer rounded-lg ${className}`}
    style={{ width, height }}
    aria-hidden="true"
  />
);

// Skeleton pour une ligne de stat card
export const StatCardSkeleton = () => (
  <div className="glass-card p-8 flex flex-col gap-3">
    <Skeleton height="12px" width="60%" />
    <Skeleton height="40px" width="40%" />
  </div>
);

// Skeleton pour une ligne de tableau
export const TableRowSkeleton = () => (
  <tr className="border-b border-[var(--color-border-subtle)]">
    <td className="px-8 py-6">
      <div className="flex items-center gap-4">
        <Skeleton width="48px" height="48px" className="rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton width="120px" height="14px" />
          <Skeleton width="80px" height="10px" />
        </div>
      </div>
    </td>
    <td className="px-8 py-6"><Skeleton width="80px" height="14px" /></td>
    <td className="px-8 py-6"><Skeleton width="60px" height="24px" className="rounded-full" /></td>
    <td className="px-8 py-6 text-right"><Skeleton width="80px" height="32px" className="rounded-lg ml-auto" /></td>
  </tr>
);

// Skeleton pour un booking card
export const BookingCardSkeleton = () => (
  <div className="glass-card p-8 flex flex-col md:flex-row items-center gap-8">
    <div className="flex-1 flex flex-col gap-3">
      <Skeleton width="100px" height="24px" className="rounded-full" />
      <Skeleton width="200px" height="28px" />
      <Skeleton width="160px" height="16px" />
    </div>
    <div className="flex items-center gap-4 px-6">
      <Skeleton width="48px" height="48px" className="rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton width="60px" height="10px" />
        <Skeleton width="100px" height="14px" />
      </div>
    </div>
    <div className="flex flex-col gap-3 w-full md:w-auto">
      <Skeleton width="160px" height="48px" className="rounded-xl" />
      <Skeleton width="160px" height="48px" className="rounded-xl" />
    </div>
  </div>
);
