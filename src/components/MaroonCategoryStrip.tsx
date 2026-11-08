import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Category } from '../types';

interface MaroonCategoryStripProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (slug: string) => void;
}

export const MaroonCategoryStrip: React.FC<MaroonCategoryStripProps> = ({
  categories,
  activeCategory,
  onSelectCategory
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 260;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav 
      aria-label="Category strip navigation"
      className="bg-[#681C36] text-[#F5EBDD] border-y border-[#7B2945]/60 py-2 sm:py-2.5 relative shadow-md select-none sticky top-20 z-30"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between gap-1 sm:gap-3">
          
          {/* Scroll Left Button */}
          <button
            type="button"
            onClick={() => scroll('left')}
            className="p-1 sm:p-1.5 rounded-full bg-[#7B2945] text-[#F5EBDD] hover:text-[#F7D37D] hover:bg-[#55152b] transition-colors shrink-0 shadow-sm cursor-pointer"
            aria-label="Scroll categories left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Horizontal Scrolling Pill Strip */}
          <div
            ref={scrollRef}
            className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1 flex-grow"
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(cat.slug)}
                  className={`px-3.5 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-wider uppercase whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#F7D37D] text-[#55152b] shadow-md font-bold'
                      : 'bg-[#7B2945]/60 text-[#FAF7F1] hover:bg-[#7B2945] hover:text-[#F7D37D] border border-[#B89A68]/30'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          <button
            type="button"
            onClick={() => scroll('right')}
            className="p-1 sm:p-1.5 rounded-full bg-[#7B2945] text-[#F5EBDD] hover:text-[#F7D37D] hover:bg-[#55152b] transition-colors shrink-0 shadow-sm cursor-pointer"
            aria-label="Scroll categories right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>
      </div>
    </nav>
  );
};
