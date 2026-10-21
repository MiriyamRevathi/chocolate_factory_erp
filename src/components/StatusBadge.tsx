import React from 'react';

interface StatusBadgeProps {
  status: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '', size = 'md' }) => {
  const norm = (status || '').trim().toLowerCase();

  let styles = 'bg-stone-100 text-stone-700 border-stone-200';

  if (
    norm === 'approved' ||
    norm === 'completed' ||
    norm === 'pass' ||
    norm === 'delivered' ||
    norm === 'active' ||
    norm === 'preferred'
  ) {
    // Soft green compliance
    styles = 'bg-emerald-100 text-emerald-900 border-emerald-300';
  } else if (
    norm === 'pending' ||
    norm === 'planned' ||
    norm === 'qc pending' ||
    norm === 'under review'
  ) {
    // Artistic flair Gold pill
    styles = 'bg-[#D9A05B] text-white border-[#D9A05B] shadow-xs';
  } else if (
    norm === 'in production' ||
    norm === 'in progress' ||
    norm === 'processing' ||
    norm === 'packed' ||
    norm === 'shipped' ||
    norm === 'placed' ||
    norm === 'confirmed' ||
    norm === 'sent to qc'
  ) {
    // Soft confectionery pink with espresso text
    styles = 'bg-[#F9E4E8] text-[#3D2B1F] border-[#D9A05B]/30';
  } else if (
    norm === 'low stock' ||
    norm === 'expiring soon'
  ) {
    // Warm warning
    styles = 'bg-amber-100 text-amber-900 border-amber-300';
  } else if (
    norm === 'rejected' ||
    norm === 'fail' ||
    norm === 'cancelled' ||
    norm === 'out of stock' ||
    norm === 'inactive'
  ) {
    // Crisp red quarantine
    styles = 'bg-rose-100 text-rose-900 border-rose-300';
  }

  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-[10px]';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-full border whitespace-nowrap ${sizeClasses} ${styles} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
};
