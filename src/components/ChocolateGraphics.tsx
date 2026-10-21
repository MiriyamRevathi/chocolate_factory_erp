import React from 'react';

export const CocoaPodIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M12 2C7 5 4 10 5 15C6 20 10 22 12 22C14 22 18 20 19 15C20 10 17 5 12 2Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M12 2V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 3" />
    <path d="M8 7C9.5 9.5 9.5 14.5 8 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M16 7C14.5 9.5 14.5 14.5 16 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const ChocolateBarIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.75" />
    <path d="M3 9H21" stroke="currentColor" strokeWidth="1.5" />
    <path d="M3 15H21" stroke="currentColor" strokeWidth="1.5" />
    <path d="M9 3V21" stroke="currentColor" strokeWidth="1.5" />
    <path d="M15 3V21" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const TruffleIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="1.75" />
    <path d="M12 5C12 3.5 10.5 3 9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M9 13C10 11.5 14 11.5 15 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M8 15C9.5 17 14.5 17 16 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const CocoaBeanGraphic: React.FC<{ className?: string }> = ({ className = 'w-16 h-16 opacity-10' }) => (
  <div className={`pointer-events-none select-none text-[#5C311C] ${className}`}>
    <CocoaPodIcon size={64} />
  </div>
);

export const ProductArtCard: React.FC<{
  category: string;
  name: string;
  color?: string;
  className?: string;
}> = ({ category, name, color = '#4A2818', className = 'h-48' }) => {
  const getSubtlePattern = () => {
    if (category.includes('White')) return 'from-[#FAF2E6] to-[#EBD5B7] text-[#8C5D35]';
    if (category.includes('Dark')) return 'from-[#2A140B] to-[#1A0A04] text-[#D4AF37]';
    if (category.includes('Truffle')) return 'from-[#421D12] to-[#2B1007] text-[#E0A96D]';
    if (category.includes('Gift')) return 'from-[#351C12] to-[#200F08] text-[#F3C68F]';
    return 'from-[#5A2E1B] to-[#3B1C0F] text-[#E8C5A5]';
  };

  return (
    <div
      className={`relative w-full rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 bg-gradient-to-br ${getSubtlePattern()} ${className}`}
    >
      {/* Subtle geometric chocolate grid background */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Decorative center piece */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20 shadow-inner mb-3">
          {category.includes('Truffle') ? (
            <TruffleIcon size={32} className="text-white/90" />
          ) : category.includes('Box') ? (
            <ChocolateBarIcon size={32} className="text-white/90" />
          ) : (
            <CocoaPodIcon size={32} className="text-white/90" />
          )}
        </div>
        <span className="text-xs uppercase tracking-widest font-semibold text-white/70">
          {category}
        </span>
        <span className="text-sm font-serif font-bold text-white/95 mt-1 line-clamp-1">
          {name}
        </span>
      </div>

      {/* Artisanal seal */}
      <div className="absolute top-3 right-3 text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full bg-black/30 text-amber-200 border border-amber-400/30">
        PURE CACAO
      </div>
    </div>
  );
};
