import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Category } from '../types';

interface ShopByCategoriesProps {
  categories: Category[];
  onSelectCategory: (categorySlug: string) => void;
}

export const ShopByCategories: React.FC<ShopByCategoriesProps> = ({
  categories,
  onSelectCategory
}) => {
  // Exclude 'all' from the grid so specific visual categories stand out
  const displayCategories = categories.filter((c) => c.slug !== 'all');

  return (
    <section aria-labelledby="shop-categories-heading" className="py-12 sm:py-16 bg-[#A88D70] border-b border-[#8F7558]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#681C36] font-bold">
            Curated Boutiques
          </span>
          <h2 id="shop-categories-heading" className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#201418] mt-2">
            Shop by Categories
          </h2>
          <p className="text-xs sm:text-sm text-[#3E2F29] mt-2 leading-relaxed font-medium">
            From imperial choker collars to mastercrafted temple jhumkas, explore our heritage collections.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayCategories.map((category) => (
            <div
              key={category.id}
              onClick={() => onSelectCategory(category.slug)}
              className="group relative rounded-xl overflow-hidden border border-[#C0A889] bg-[#E2D2BB] shadow-sm hover:shadow-lg hover:border-[#681C36] transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#B39A7A] relative">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
                
                <div className="absolute top-2 right-2 p-1.5 rounded-full bg-[#E2D2BB]/90 backdrop-blur-sm text-[#681C36] opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-grow bg-[#E2D2BB]">
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#201418] group-hover:text-[#681C36] transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-[11px] text-[#4E3C36] mt-0.5 font-medium">
                    {category.count} Verified Pieces
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-[#C0A889]/60 flex items-center justify-between text-xs font-bold text-[#681C36]">
                  <span className="tracking-wide uppercase text-[11px]">View Collection</span>
                  <span className="text-[#681C36] group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
