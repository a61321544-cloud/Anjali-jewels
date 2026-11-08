import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Grid, X } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface AllProductsProps {
  products: Product[];
  currentCategory: string;
  onSelectCategory: (category: string) => void;
  onSelectProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const AllProducts: React.FC<AllProductsProps> = ({
  products,
  currentCategory,
  onSelectCategory,
  onSelectProduct,
  onQuickView
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState<'featured' | 'price-low' | 'price-high' | 'code' | 'newest'>('featured');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under5000' | 'above5000'>('all');
  const [visibleCount, setVisibleCount] = useState(12);

  const categories = [
    { label: 'All Pieces (36)', value: 'all' },
    { label: 'Necklaces', value: 'necklaces' },
    { label: 'Chokers', value: 'chokers' },
    { label: 'Earrings & Jhumkas', value: 'earrings' },
    { label: 'Bangles', value: 'bangles' },
    { label: 'Bridal', value: 'bridal' },
    { label: 'Temple', value: 'temple' },
    { label: 'Rani Haar', value: 'rani-haar' }
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (currentCategory && currentCategory !== 'all') {
        const cat = currentCategory.toLowerCase();
        const matchesCategory = 
          product.category?.toLowerCase() === cat ||
          product.category?.toLowerCase().includes(cat) ||
          product.subCategory?.toLowerCase().includes(cat);
        if (!matchesCategory) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          product.name.toLowerCase().includes(q) ||
          product.code.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q) ||
          (product.stones && product.stones.toLowerCase().includes(q));
        if (!matchesSearch) return false;
      }

      // Price filter
      if (priceFilter === 'under5000' && product.price >= 5000) return false;
      if (priceFilter === 'above5000' && product.price < 5000) return false;

      return true;
    }).sort((a, b) => {
      if (selectedSort === 'price-low') return a.price - b.price;
      if (selectedSort === 'price-high') return b.price - a.price;
      if (selectedSort === 'code') return a.code.localeCompare(b.code);
      if (selectedSort === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, currentCategory, searchQuery, selectedSort, priceFilter]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  return (
    <section id="all-products-section" aria-labelledby="all-products-heading" className="py-12 sm:py-16 bg-[#B39A7A] border-b border-[#947B5F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#681C36] font-bold">
            Complete Boutique Collection
          </span>
          <h2 id="all-products-heading" className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#201418] mt-2">
            All Jewellery
          </h2>
          <p className="text-xs sm:text-sm text-[#3E2F29] mt-2 font-medium">
            Every piece is handmade by master artisans using premium brass alloys and authentic Kundan, Temple, and Crystal settings.
          </p>
        </div>

        {/* Filter & Controls Toolbar */}
        <div className="bg-[#A88D70] rounded-2xl border border-[#947B5F] p-4 sm:p-5 mb-8 shadow-sm">
          
          {/* Top row: Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-3 border-b border-[#947B5F]/50">
            {categories.map((cat) => {
              const active = currentCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => {
                    onSelectCategory(cat.value);
                    setVisibleCount(12);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wide uppercase whitespace-nowrap transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#681C36] text-[#E2D2BB] shadow-md'
                      : 'text-[#201418] hover:text-[#681C36] hover:bg-[#C0A889]/60'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Bottom row: Search + Price Filter + Sort + Count */}
          <div className="mt-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-grow max-w-md">
              <Search className="w-4 h-4 text-[#4E3C36] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(12);
                }}
                placeholder="Search by code (e.g. AJ-01), name or stone..."
                className="w-full pl-9 pr-8 py-2 text-xs bg-[#E2D2BB] border border-[#C0A889] rounded-lg text-[#201418] placeholder-[#5A453F] focus:outline-none focus:ring-1 focus:ring-[#681C36] shadow-inner font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#4E3C36] hover:text-[#201418] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Controls */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-between sm:justify-end">
              
              {/* Price bracket filter */}
              <div className="flex items-center gap-1.5 text-xs text-[#201418]">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#681C36]" />
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value as any)}
                  className="bg-[#E2D2BB] border border-[#C0A889] rounded-lg px-2.5 py-1.5 text-xs text-[#201418] font-bold focus:outline-none focus:ring-1 focus:ring-[#681C36] cursor-pointer shadow-sm"
                >
                  <option value="all">All Prices</option>
                  <option value="under5000">Under ₹5,000</option>
                  <option value="above5000">₹5,000 and Above</option>
                </select>
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-1.5 text-xs text-[#201418]">
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value as any)}
                  className="bg-[#E2D2BB] border border-[#C0A889] rounded-lg px-2.5 py-1.5 text-xs text-[#201418] font-bold focus:outline-none focus:ring-1 focus:ring-[#681C36] cursor-pointer shadow-sm"
                >
                  <option value="featured">Featured First</option>
                  <option value="newest">New Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="code">Product Code (AJ-01...)</option>
                </select>
              </div>

              {/* Active count badge */}
              <div className="text-xs font-bold text-[#681C36] bg-[#E2D2BB] px-2.5 py-1.5 rounded-lg border border-[#C0A889] shrink-0">
                {filteredProducts.length} Pieces
              </div>

            </div>

          </div>

        </div>

        {/* 36-Product Grid */}
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center rounded-2xl bg-[#A88D70] border border-[#947B5F] p-8">
            <Grid className="w-10 h-10 text-[#681C36] mx-auto mb-3 opacity-80" />
            <h3 className="font-serif text-lg font-bold text-[#201418]">No Pieces Found</h3>
            <p className="text-xs text-[#3E2F29] mt-1 max-w-sm mx-auto">
              No jewellery pieces matched your search filters. Try clearing filters or search by code like "AJ-01".
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setPriceFilter('all');
                onSelectCategory('all');
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-[#681C36] text-[#E2D2BB] text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Load More Pagination */}
        {hasMore && (
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 12)}
              className="px-8 py-3 rounded-full bg-[#681C36] hover:bg-[#75253F] text-[#E2D2BB] text-xs font-bold uppercase tracking-widest shadow-md transition-all cursor-pointer"
            >
              Load More Pieces ({displayedProducts.length} of {filteredProducts.length})
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
