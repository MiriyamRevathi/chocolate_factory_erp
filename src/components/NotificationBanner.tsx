import React from 'react';
import { useFactory } from '../context/FactoryContext';
import { AlertCircle, ShieldAlert, X } from 'lucide-react';

export const NotificationBanner: React.FC = () => {
  const { accessDeniedMessage, clearAccessDenied } = useFactory();

  if (!accessDeniedMessage) return null;

  return (
    <div
      id="access-denied-alert"
      className="bg-[#F9E4E8] border-b border-[#D9A05B]/30 text-[#3D2B1F] px-4 py-3 shadow-xs relative flex items-center justify-between"
    >
      <div className="flex items-center gap-2.5 max-w-4xl mx-auto">
        <ShieldAlert className="w-5 h-5 shrink-0 text-[#D9A05B]" />
        <p className="text-xs sm:text-sm font-semibold">
          {accessDeniedMessage}
        </p>
      </div>
      <button
        onClick={clearAccessDenied}
        className="p-1.5 rounded-xl hover:bg-[#3D2B1F]/10 text-[#3D2B1F] transition-colors"
        title="Dismiss message"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
