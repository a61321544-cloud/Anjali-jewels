import React, { useState } from 'react';
import { 
  MoreVertical, 
  X, 
  Search, 
  ShoppingBag, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft, 
  ChevronRight, 
  Tag, 
  Truck, 
  ShieldAlert, 
  Lock, 
  MessageCircle, 
  Sparkles,
  Phone
} from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';

interface ThreeDotMenuProps {
  onSelectCategory: (category: string) => void;
  onOpenSearch: () => void;
  onOpenCart?: () => void;
  onOpenPolicy: (policyKey: string) => void;
  onOpenAdmin: () => void;
  onOpenConsultation?: () => void;
  onOpenFaq?: () => void;
}

export const ThreeDotMenu: React.FC<ThreeDotMenuProps> = ({
  onSelectCategory,
  onOpenSearch,
  onOpenCart,
  onOpenPolicy,
  onOpenAdmin,
  onOpenConsultation,
  onOpenFaq
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [collectionsExpanded, setCollectionsExpanded] = useState(false);
  const [weddingExpanded, setWeddingExpanded] = useState(false);
  const { cartCount, setIsCartOpen } = useCartWishlist();

  const handleCategoryClick = (categorySlug: string) => {
    onSelectCategory(categorySlug);
    setIsOpen(false);
  };

  const handleCartClick = () => {
    setIsOpen(false);
    if (onOpenCart) {
      onOpenCart();
    } else {
      setIsCartOpen(true);
    }
  };

  const handleSearchClick = () => {
    setIsOpen(false);
    onOpenSearch();
  };

  return (
    <>
      {/* Three-Dot Trigger Icon Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="p-2 text-[#E2D2BB] hover:text-[#F7D37D] hover:bg-white/10 rounded-full transition-all focus:outline-none focus:ring-1 focus:ring-[#F7D37D]/60 shrink-0 cursor-pointer"
        aria-label="Category Navigation Menu"
        title="Browse Collections & Categories"
      >
        <MoreVertical className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Slide-out Category Navigation Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex select-none">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Container (Royal Dark Beige Identity) */}
          <div className="relative w-full max-w-sm sm:max-w-md bg-[#B39A7A] h-full shadow-2xl flex flex-col z-10 text-left overflow-y-auto border-r border-[#947B5F]">
            
            {/* 1. Drawer Header: Close, Center Circular Logo, Search, Cart */}
            <div className="p-4 border-b border-[#947B5F] flex items-center justify-between bg-[#A88D70] shrink-0">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 text-[#201418] hover:text-[#681C36] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
                aria-label="Close category menu"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center justify-center">
                <div className="w-11 h-11 rounded-full p-0.5 border border-[#8F7558] bg-[#B39A7A] shadow-sm overflow-hidden flex items-center justify-center">
                  <img 
                    src="/anjali_jewels_logo.png" 
                    alt="Anjali Jewels Logo" 
                    className="w-full h-full object-contain" 
                  />
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleSearchClick}
                  className="p-2 text-[#201418] hover:text-[#681C36] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
                  aria-label="Search catalogue"
                >
                  <Search className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleCartClick}
                  className="p-2 text-[#201418] hover:text-[#681C36] hover:bg-black/5 rounded-full transition-colors relative cursor-pointer"
                  aria-label="Shopping bag"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#681C36] text-[#E2D2BB] text-[10px] font-bold flex items-center justify-center shadow">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* 2. Top Banner Strip inside Drawer */}
            <div className="bg-[#681C36] text-[#E2D2BB] px-3 py-2 text-[11px] font-bold tracking-wider uppercase flex items-center justify-between border-b border-[#7B2945]">
              <ChevronLeft className="w-3.5 h-3.5 text-[#F7D37D] shrink-0" />
              <span className="truncate px-2 text-center font-serif tracking-widest text-[#E2D2BB]">
                BESPOKE BRIDAL CONSULTATION VIA WHATSAPP
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-[#F7D37D] shrink-0" />
            </div>

            {/* 3. Category Navigation Items (Exact Layout from Reference Image) */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#947B5F]/50 text-sm font-bold tracking-wider text-[#201418] bg-[#B39A7A]">
              
              {/* ALL COLLECTIONS (Expandable) */}
              <div>
                <button
                  type="button"
                  onClick={() => setCollectionsExpanded(!collectionsExpanded)}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-[#C0A889]/60 transition-colors uppercase cursor-pointer"
                >
                  <span>ALL COLLECTIONS</span>
                  {collectionsExpanded ? (
                    <ChevronUp className="w-4 h-4 text-[#681C36]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#681C36]" />
                  )}
                </button>
                {collectionsExpanded && (
                  <div className="bg-[#A88D70] px-6 py-2.5 space-y-2 text-xs text-[#201418] font-semibold border-t border-[#947B5F]/40">
                    <button
                      type="button"
                      onClick={() => handleCategoryClick('all')}
                      className="block w-full text-left py-1 hover:text-[#681C36] transition-colors cursor-pointer"
                    >
                      Browse Entire 36-Piece Catalogue
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCategoryClick('necklaces')}
                      className="block w-full text-left py-1 hover:text-[#681C36] transition-colors cursor-pointer"
                    >
                      Necklaces & Rani Haars
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCategoryClick('chokers')}
                      className="block w-full text-left py-1 hover:text-[#681C36] transition-colors cursor-pointer"
                    >
                      Kundan & Crystal Chokers
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCategoryClick('earrings')}
                      className="block w-full text-left py-1 hover:text-[#681C36] transition-colors cursor-pointer"
                    >
                      Earrings & Jhumkas
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCategoryClick('bangles')}
                      className="block w-full text-left py-1 hover:text-[#681C36] transition-colors cursor-pointer"
                    >
                      Kadas & Bangles
                    </button>
                  </div>
                )}
              </div>

              {/* WEDDING & FESTIVE (Expandable) */}
              <div>
                <button
                  type="button"
                  onClick={() => setWeddingExpanded(!weddingExpanded)}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-[#C0A889]/60 transition-colors uppercase cursor-pointer"
                >
                  <span>WEDDING & FESTIVE</span>
                  {weddingExpanded ? (
                    <ChevronUp className="w-4 h-4 text-[#681C36]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#681C36]" />
                  )}
                </button>
                {weddingExpanded && (
                  <div className="bg-[#A88D70] px-6 py-2.5 space-y-2 text-xs text-[#201418] font-semibold border-t border-[#947B5F]/40">
                    <button
                      type="button"
                      onClick={() => handleCategoryClick('bridal')}
                      className="block w-full text-left py-1 hover:text-[#681C36] transition-colors cursor-pointer"
                    >
                      Royal Bridal Suites
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCategoryClick('temple')}
                      className="block w-full text-left py-1 hover:text-[#681C36] transition-colors cursor-pointer"
                    >
                      Sacred Temple Heirlooms
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCategoryClick('rani-haar')}
                      className="block w-full text-left py-1 hover:text-[#681C36] transition-colors cursor-pointer"
                    >
                      Imperial Rani Haars
                    </button>
                  </div>
                )}
              </div>

              {/* READY TO SHIP */}
              <button
                type="button"
                onClick={() => handleCategoryClick('all')}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-[#C0A889]/60 transition-colors uppercase cursor-pointer"
              >
                <span>READY TO SHIP</span>
                <span className="text-[10px] bg-[#681C36] text-[#E2D2BB] px-2 py-0.5 rounded-full font-bold shadow-sm">
                  24-48h
                </span>
              </button>

              {/* NEW ARRIVALS */}
              <button
                type="button"
                onClick={() => handleCategoryClick('new-arrivals')}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-[#C0A889]/60 transition-colors uppercase cursor-pointer"
              >
                <span>NEW ARRIVALS</span>
                <Sparkles className="w-4 h-4 text-[#681C36]" />
              </button>

              {/* BEST SELLERS */}
              <button
                type="button"
                onClick={() => handleCategoryClick('best-sellers')}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-[#C0A889]/60 transition-colors uppercase cursor-pointer"
              >
                <span>BEST SELLERS</span>
                <span className="text-[10px] text-[#681C36] font-bold">TOP PICKS</span>
              </button>

              {/* REAL JEWELLERY CATEGORIES */}
              <button
                type="button"
                onClick={() => handleCategoryClick('necklaces')}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-[#C0A889]/60 transition-colors uppercase cursor-pointer"
              >
                <span>NECKLACES & HAARS</span>
              </button>

              <button
                type="button"
                onClick={() => handleCategoryClick('chokers')}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-[#C0A889]/60 transition-colors uppercase cursor-pointer"
              >
                <span>CHOKER SETS</span>
              </button>

              <button
                type="button"
                onClick={() => handleCategoryClick('earrings')}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-[#C0A889]/60 transition-colors uppercase cursor-pointer"
              >
                <span>EARRINGS & JHUMKAS</span>
              </button>

              <button
                type="button"
                onClick={() => handleCategoryClick('bangles')}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-[#C0A889]/60 transition-colors uppercase cursor-pointer"
              >
                <span>BANGLES & BRACELETS</span>
              </button>

              <button
                type="button"
                onClick={() => handleCategoryClick('temple')}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-[#C0A889]/60 transition-colors uppercase cursor-pointer"
              >
                <span>TEMPLE HEIRLOOMS</span>
              </button>

              {/* HIGHLIGHTED FESTIVE SALE BOX */}
              <div className="p-3">
                <button
                  type="button"
                  onClick={() => handleCategoryClick('all')}
                  className="w-full p-3 rounded-xl bg-[#E2D2BB] border border-[#C0A889] flex items-center gap-3 hover:bg-[#D9C7AF] transition-colors cursor-pointer text-left shadow-sm"
                >
                  <span className="px-2 py-0.5 rounded bg-[#681C36] text-[#E2D2BB] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm shrink-0">
                    <Tag className="w-3 h-3" />
                    SALE
                  </span>
                  <span className="font-bold text-xs text-[#201418] tracking-wide">
                    Festive Sale Edit · Flat 20% Off
                  </span>
                </button>
              </div>

              {/* UTILITY LINKS */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenPolicy('shipping');
                  }}
                  className="w-full px-5 py-3.5 flex items-center gap-3 text-xs uppercase tracking-wider hover:bg-[#C0A889]/60 text-[#201418] font-bold cursor-pointer"
                >
                  <Truck className="w-4 h-4 text-[#681C36]" />
                  <span>TRACK DISPATCH & ORDER STATUS</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenPolicy('order-policies');
                  }}
                  className="w-full px-5 py-3.5 flex items-center gap-3 text-xs uppercase tracking-wider hover:bg-[#C0A889]/60 text-[#681C36] font-extrabold cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4 text-[#681C36]" />
                  <span>ORDER POLICIES (NO REFUND / NO COD)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenAdmin();
                  }}
                  className="w-full px-5 py-3.5 flex items-center gap-3 text-xs uppercase tracking-wider hover:bg-[#C0A889]/60 text-[#3E2F29] font-bold cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-[#681C36]" />
                  <span>BOUTIQUE ADMIN ACCESS</span>
                </button>
              </div>

            </div>

            {/* 4. Bottom Concierge Action Bar inside Drawer */}
            <div className="p-4 bg-[#A88D70] border-t border-[#947B5F] space-y-2 shrink-0">
              <a
                href="https://wa.me/919319862576?text=Hello%20Anjali%20Jewels,%20I%20am%20browsing%20your%20category%20collections%20and%20need%20assistance."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:bg-[#20ba59] transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp Boutique Concierge</span>
              </a>

              <div className="text-center text-[11px] text-[#201418] font-serif font-bold">
                Janakpuri, New Delhi, India · +91 9319862576
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
