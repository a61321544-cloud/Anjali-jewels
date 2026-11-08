import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { useCartWishlist } from '../context/CartWishlistContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { formatINR } = useCartWishlist();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = query.trim()
    ? products.filter((p) => {
        const q = query.toLowerCase().trim();
        return (
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.stones && p.stones.toLowerCase().includes(q))
        );
      })
    : [];

  const quickPicks = ['AJ-01', 'AJ-02', 'AJ-03', 'AJ-04', 'AJ-12', 'Temple', 'Kundan', 'Choker'];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="w-full max-w-2xl bg-[#B39A7A] rounded-2xl border border-[#947B5F] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#947B5F] flex items-center gap-3 bg-[#A88D70]">
          <Search className="w-5 h-5 text-[#681C36] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by code (e.g. AJ-01), piece name, Kundan, Temple..."
            className="w-full text-sm sm:text-base text-[#201418] placeholder-[#5A454B] focus:outline-none bg-transparent font-medium"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-[#201418]/70 hover:text-[#201418]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-xs font-bold text-[#681C36] hover:bg-[#C0A889]/30 rounded-lg uppercase tracking-wider"
          >
            Esc
          </button>
        </div>

        {/* Quick Search Chips */}
        <div className="px-4 py-2.5 bg-[#B39A7A] border-b border-[#947B5F]/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] uppercase font-bold text-[#201418] tracking-wider whitespace-nowrap">
            Popular:
          </span>
          {quickPicks.map((pick) => (
            <button
              key={pick}
              type="button"
              onClick={() => setQuery(pick)}
              className="px-2.5 py-1 rounded-full bg-[#E2D2BB] border border-[#C0A889] text-[11px] font-semibold text-[#201418] hover:bg-[#681C36] hover:text-white transition-colors whitespace-nowrap cursor-pointer"
            >
              {pick}
            </button>
          ))}
        </div>

        {/* Search Results */}
        <div className="overflow-y-auto p-4 flex-1 space-y-2">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-xs text-[#201418] font-medium">
              <p>Type a code like <strong className="text-[#681C36]">AJ-01</strong>, <strong className="text-[#681C36]">AJ-12</strong> or search by stone style.</p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#201418] font-medium">
              <p>No pieces found matching "{query}".</p>
              <p className="mt-1">Try searching by category such as "Choker", "Jhumkas", or "Emerald".</p>
            </div>
          ) : (
            results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  onSelectProduct(product);
                  onClose();
                }}
                className="p-3 rounded-xl flex items-center gap-3.5 bg-[#E2D2BB] hover:bg-[#D4BEA3] border border-[#C0A889] transition-colors cursor-pointer group shadow-sm"
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#A88D70] border border-[#C0A889] shrink-0">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#681C36]">{product.code}</span>
                    <span className="text-[10px] text-[#201418]/70 uppercase font-semibold">{product.category}</span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#201418] group-hover:text-[#681C36] transition-colors line-clamp-1">
                    {product.name}
                  </h4>
                  <p className="text-xs font-bold text-[#681C36] font-sans mt-0.5">
                    {formatINR(product.price)}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#681C36] group-hover:translate-x-1 transition-transform shrink-0" />
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
