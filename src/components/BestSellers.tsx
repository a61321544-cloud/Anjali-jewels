import React from 'react';
import { Award, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface BestSellersProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onViewAll: () => void;
}

export const BestSellers: React.FC<BestSellersProps> = ({
  products,
  onSelectProduct,
  onQuickView,
  onViewAll
}) => {
  // Verified best sellers (Neelam Noor, Mayura Bangles, Lakshmi Choker, Celestia Crystal)
  const bestSellersList = products.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <section aria-labelledby="best-sellers-heading" className="py-12 sm:py-16 bg-[#A88D70] border-b border-[#8F7558]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#681C36] font-bold">
              <Award className="w-3.5 h-3.5 text-[#681C36]" />
              <span>Timeless Signatures</span>
            </div>
            <h2 id="best-sellers-heading" className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#201418] mt-2">
              Featured & Best Sellers
            </h2>
            <p className="text-xs sm:text-sm text-[#3E2F29] mt-1 font-medium">
              Our most-coveted bridal haar, chokers, and sculpted bangles cherished by royal brides across India.
            </p>
          </div>

          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#681C36] hover:text-[#55152b] transition-colors group cursor-pointer self-start md:self-auto"
          >
            <span>View Full Edit</span>
            <ArrowRight className="w-4 h-4 text-[#681C36] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 4-Item Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellersList.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onQuickView={onQuickView}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
