import React from 'react';
import { Sparkles, MessageCircle } from 'lucide-react';
import { Product } from '../types';
import { useCartWishlist } from '../context/CartWishlistContext';

interface FeaturedJewelleryProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const FeaturedJewellery: React.FC<FeaturedJewelleryProps> = ({
  products,
  onSelectProduct
}) => {
  const { formatINR, getWhatsAppOrderUrl } = useCartWishlist();
  
  // Spotlight on grand bridal signature: Rajlakshmi Temple Haar (AJ-12) or Celestia (AJ-11)
  const spotlightPiece = products.find((p) => p.code === 'AJ-12') || products[0];
  const secondaryPiece = products.find((p) => p.code === 'AJ-05') || products[1];

  if (!spotlightPiece) return null;

  return (
    <section aria-labelledby="featured-spotlight-heading" className="py-12 sm:py-16 bg-[#A88D70] border-b border-[#8F7558]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#681C36] font-bold flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#681C36]" />
            <span>Artisan Spotlight</span>
          </span>
          <h2 id="featured-spotlight-heading" className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#201418] mt-2">
            Featured Jewellery
          </h2>
          <p className="text-xs sm:text-sm text-[#3E2F29] mt-2 font-medium">
            An intimate study in classical Indian jewellery architecture, symmetry, and handcrafted stone settings.
          </p>
        </div>

        {/* Dual Spotlight Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Spotlight Item 1: Rajlakshmi Temple Haar */}
          <div className="rounded-2xl border border-[#C0A889] bg-[#E2D2BB] overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
            <div 
              className="relative aspect-[4/3] w-full overflow-hidden bg-[#B39A7A] cursor-pointer group"
              onClick={() => onSelectProduct(spotlightPiece)}
            >
              <img
                src={spotlightPiece.image}
                alt={spotlightPiece.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded bg-[#681C36] text-[#E2D2BB] text-[11px] font-bold uppercase tracking-wider shadow">
                  {spotlightPiece.code} · Grand Masterpiece
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4 text-left bg-[#E2D2BB] flex-grow flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[#681C36] uppercase tracking-wider">
                  Royal Temple Haar
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#201418] mt-1">
                  {spotlightPiece.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#3E2F29] leading-relaxed mt-2 font-medium">
                  {spotlightPiece.description}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#C0A889]/40 border border-[#947B5F]/40 space-y-1.5 text-xs">
                <div className="flex justify-between text-[#201418]">
                  <span className="font-semibold">Plating & Polish:</span>
                  <span className="font-bold">Antique 22K Matte Temple Gold</span>
                </div>
                <div className="flex justify-between text-[#201418]">
                  <span className="font-semibold">Stone Craftsmanship:</span>
                  <span className="font-bold">Potra Ruby Beads & Basra-style Pearls</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-[#C0A889]/60">
                <span className="text-2xl font-bold text-[#681C36] font-sans">
                  {formatINR(spotlightPiece.price)}
                </span>

                <div className="flex items-center gap-2">
                  <a
                    href={getWhatsAppOrderUrl(spotlightPiece, 1)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-4 rounded-xl bg-[#681C36] hover:bg-[#75253F] text-white text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-[#F7D37D]" />
                    <span>Enquire WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => onSelectProduct(spotlightPiece)}
                    className="py-2.5 px-3 rounded-xl bg-[#C0A889] hover:bg-[#A88D70] text-[#201418] text-xs font-bold uppercase tracking-wider transition-colors border border-[#947B5F] cursor-pointer"
                  >
                    Inspect
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Spotlight Item 2: Secondary Featured Piece */}
          {secondaryPiece && (
            <div className="rounded-2xl border border-[#C0A889] bg-[#E2D2BB] overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
              <div 
                className="relative aspect-[4/3] w-full overflow-hidden bg-[#B39A7A] cursor-pointer group"
                onClick={() => onSelectProduct(secondaryPiece)}
              >
                <img
                  src={secondaryPiece.image}
                  alt={secondaryPiece.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded bg-[#681C36] text-[#E2D2BB] text-[11px] font-bold uppercase tracking-wider shadow">
                    {secondaryPiece.code} · Signature Selection
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4 text-left bg-[#E2D2BB] flex-grow flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-[#681C36] uppercase tracking-wider">
                    Jaipur Heritage Rani Haar
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#201418] mt-1">
                    {secondaryPiece.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#3E2F29] leading-relaxed mt-2 font-medium">
                    {secondaryPiece.description}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#C0A889]/40 border border-[#947B5F]/40 space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#201418]">
                    <span className="font-semibold">Plating & Polish:</span>
                    <span className="font-bold">24K Micro Gold Plated Brass</span>
                  </div>
                  <div className="flex justify-between text-[#201418]">
                    <span className="font-semibold">Stone Setting:</span>
                    <span className="font-bold">Precision Kundan with Russian Emeralds</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[#C0A889]/60">
                  <span className="text-2xl font-bold text-[#681C36] font-sans">
                    {formatINR(secondaryPiece.price)}
                  </span>

                  <div className="flex items-center gap-2">
                    <a
                      href={getWhatsAppOrderUrl(secondaryPiece, 1)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-4 rounded-xl bg-[#681C36] hover:bg-[#75253F] text-white text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 text-[#F7D37D]" />
                      <span>Enquire WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => onSelectProduct(secondaryPiece)}
                      className="py-2.5 px-3 rounded-xl bg-[#C0A889] hover:bg-[#A88D70] text-[#201418] text-xs font-bold uppercase tracking-wider transition-colors border border-[#947B5F] cursor-pointer"
                    >
                      Inspect
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
