import React from 'react';

interface AnnouncementBarProps {
  onPolicyClick?: (policy: string) => void;
  onOpenPolicy?: (policy: string) => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onPolicyClick, onOpenPolicy }) => {
  const handlePolicy = (policy: string) => {
    if (onOpenPolicy) onOpenPolicy(policy);
    else if (onPolicyClick) onPolicyClick(policy);
  };
  return (
    <aside aria-label="Announcement" className="bg-[#681C36] text-[#F5EBDD] text-xs font-medium tracking-wider uppercase border-b border-[#7B2945]/40 select-none">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
        <div className="flex items-center gap-2 justify-center">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#B89A68]" />
          <span className="font-semibold text-white tracking-widest">FLAT 20% OFF</span>
          <span className="hidden md:inline text-[#E8DDD2]/80">· Launch Festive Offer Auto-Applied</span>
        </div>
        
        <div className="flex items-center gap-3 text-[11px] text-[#F5EBDD]/90 justify-center">
          <span>Pan-India Insured Dispatch</span>
          <span className="text-[#B89A68]">·</span>
          <button 
            type="button"
            onClick={() => handlePolicy('no-cod')}
            className="hover:text-white transition-colors underline underline-offset-2 decoration-[#B89A68]/60 cursor-pointer"
          >
            Strictly NO COD
          </button>
          <span className="text-[#B89A68]">·</span>
          <button 
            type="button"
            onClick={() => handlePolicy('no-refund')}
            className="hover:text-white transition-colors underline underline-offset-2 decoration-[#B89A68]/60 cursor-pointer"
          >
            No Refund / Exchange
          </button>
        </div>
      </div>
    </aside>
  );
};
