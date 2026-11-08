import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MessageCircle, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { useCartWishlist } from '../context/CartWishlistContext';

interface HeroSliderProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onExploreCollection: (category: string) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
  products,
  onSelectProduct,
  onExploreCollection
}) => {
  const { formatINR, getWhatsAppOrderUrl } = useCartWishlist();
  
  // Select 5 key featured pieces
  const featuredSlides = products.filter(
    (p) => ['aj-01', 'aj-04', 'aj-05', 'aj-03', 'aj-11'].includes(p.id) || p.isFeatured
  ).slice(0, 5);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || featuredSlides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredSlides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, featuredSlides.length]);

  if (featuredSlides.length === 0) return null;

  const current = featuredSlides[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredSlides.length) % featuredSlides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredSlides.length);
  };

  return (
    <section 
      aria-label="Featured Collection Hero"
      className="relative bg-gradient-to-b from-[#A88D70] via-[#B39A7A] to-[#B39A7A] border-b border-[#947B5F] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[460px]">
          
          {/* Left Column: Product Narrative & Ordering Actions */}
          <div className="lg:col-span-5 flex flex-col justify-center text-left space-y-4 sm:space-y-6 z-10">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#681C36]">
                Featured Masterpiece · {current.code}
              </span>
              <span className="text-[#681C36]/50">/</span>
              <span className="text-xs text-[#201418]/80 font-bold tracking-wider uppercase">
                {current.category}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#201418] leading-tight tracking-tight">
              {current.name}
            </h1>

            <p className="text-sm sm:text-base text-[#201418]/85 leading-relaxed line-clamp-3 font-medium">
              {current.description}
            </p>

            {/* Price Presentation */}
            <div className="pt-2 flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-[#681C36] font-sans">
                {formatINR(current.price)}
              </span>
              {current.originalPrice > current.price && (
                <>
                  <span className="text-sm sm:text-base text-[#201418]/60 line-through font-medium">
                    {formatINR(current.originalPrice)}
                  </span>
                  <span className="px-2.5 py-0.5 text-xs font-bold text-[#681C36] bg-[#E2D2BB] rounded-md border border-[#C0A889]">
                    FLAT 20% OFF
                  </span>
                </>
              )}
            </div>

            {/* Strict Policy Reminder Notice */}
            <p className="text-[11px] text-[#201418]/80 tracking-wide font-medium">
              *Prepaid Order Only · Pan-India Dispatch from Janakpuri, New Delhi · <strong className="text-[#681C36]">NO COD / NO RETURN</strong>
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={getWhatsAppOrderUrl(current, 1)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#681C36] hover:bg-[#7B2945] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-lg shadow-sm hover:shadow transition-all group cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#F5EBDD]" />
                <span>Order on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => onSelectProduct(current)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#E2D2BB] hover:bg-[#D4BEA3] text-[#201418] border border-[#C0A889] text-xs sm:text-sm font-bold tracking-wider uppercase rounded-lg transition-all cursor-pointer shadow-sm"
              >
                <span>View Full Details</span>
                <ArrowRight className="w-4 h-4 text-[#681C36]" />
              </button>
            </div>
          </div>

          {/* Right Column: Rectangular Editorial Product Showcase */}
          <div className="lg:col-span-7 relative flex items-center justify-center">
            <div 
              className="relative w-full max-w-lg lg:max-w-none aspect-[4/3] rounded-2xl overflow-hidden border border-[#C0A889] shadow-2xl bg-gradient-to-tr from-[#A88D70] to-[#B39A7A] group cursor-pointer"
              onClick={() => onSelectProduct(current)}
            >
              <img
                src={current.image}
                alt={current.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                loading="eager"
              />
              
              {/* Subtle Luxury Gradient Overlay at Bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

              {/* Floating Product Code & Badge */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <span className="px-3 py-1 bg-[#E2D2BB]/95 backdrop-blur-md rounded-md text-xs font-bold text-[#681C36] border border-[#C0A889] shadow-sm">
                  {current.code} · Handcrafted Edition
                </span>
                <span className="px-3 py-1 bg-[#681C36]/90 backdrop-blur-md text-[#FAF7F1] text-xs font-semibold rounded-md shadow-sm">
                  Tap to Inspect
                </span>
              </div>
            </div>

            {/* Slider Controls (Prev / Next Arrows) */}
            <button
              type="button"
              onClick={handlePrev}
              className="absolute -left-3 lg:-left-5 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#E2D2BB] border border-[#C0A889] text-[#201418] hover:text-white hover:bg-[#681C36] shadow-md transition-all cursor-pointer z-20"
              aria-label="Previous featured product"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="absolute -right-3 lg:-right-5 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#E2D2BB] border border-[#C0A889] text-[#201418] hover:text-white hover:bg-[#681C36] shadow-md transition-all cursor-pointer z-20"
              aria-label="Next featured product"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Slide Indicators & Quick Navigation Bar */}
        <div className="mt-8 pt-4 border-t border-[#947B5F]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {featuredSlides.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 transition-all rounded-full cursor-pointer ${
                  currentIndex === idx
                    ? 'w-8 bg-[#681C36]'
                    : 'w-2 bg-[#947B5F] hover:bg-[#681C36]'
                }`}
                aria-label={`Go to slide ${idx + 1}: ${slide.name}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-[#201418]">
            <span>Slide {currentIndex + 1} of {featuredSlides.length}</span>
            <span>·</span>
            <button
              type="button"
              onClick={() => onExploreCollection('all')}
              className="text-[#681C36] hover:underline font-bold cursor-pointer"
            >
              View Full 36-Piece Catalogue →
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
