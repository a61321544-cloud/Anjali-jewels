import React from 'react';
import { Search, Heart, ShoppingBag, User } from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';
import { ThreeDotMenu } from './ThreeDotMenu';

interface HeaderProps {
  currentCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  onOpenWishlist: () => void;
  onOpenAdmin: () => void;
  onOpenPolicy: (policyKey: string) => void;
  onOpenFaq: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  onSelectCategory,
  onOpenSearch,
  onOpenAccount,
  onOpenWishlist,
  onOpenAdmin,
  onOpenPolicy,
  onOpenFaq
}) => {
  const { cartCount, wishlistCount, setIsCartOpen } = useCartWishlist();

  const navItems = [
    { label: 'All Pieces', value: 'all' },
    { label: 'Necklaces', value: 'necklaces' },
    { label: 'Chokers', value: 'chokers' },
    { label: 'Earrings & Jhumkas', value: 'earrings' },
    { label: 'Bangles', value: 'bangles' },
    { label: 'Bridal Suites', value: 'bridal' },
    { label: 'Temple Heirlooms', value: 'temple' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#75253F] shadow-md border-b border-[#8C324E]/50 transition-all select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-2 sm:gap-4">
          
          {/* Left: Three-Dot Category Menu + Original Circular Logo + Brand Name on ONE LINE */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* 1. Three-Dot Category Navigation Menu */}
            <ThreeDotMenu
              onSelectCategory={onSelectCategory}
              onOpenSearch={onOpenSearch}
              onOpenCart={() => setIsCartOpen(true)}
              onOpenPolicy={onOpenPolicy}
              onOpenAdmin={onOpenAdmin}
              onOpenFaq={onOpenFaq}
            />

            {/* 2. Logo + Brand Name (Immediate Placement Beside Three-Dot Menu) */}
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 sm:gap-3 group focus:outline-none"
              title="ANJALI JEWELS — Home"
            >
              {/* Circular Logo Presentation with Transparent Exterior */}
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-[#E5BE65]/70 bg-transparent shrink-0 p-0.5 shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center">
                <img
                  src="/anjali_jewels_logo.png"
                  alt="ANJALI JEWELS Logo"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>

              {/* Exact Brand Name on ONE LINE in Premium Yellow/Gold Typography */}
              <span className="font-serif text-lg sm:text-2xl lg:text-2xl font-bold tracking-[0.16em] sm:tracking-[0.22em] text-[#F7D37D] uppercase whitespace-nowrap transition-colors drop-shadow-sm">
                ANJALI JEWELS
              </span>
            </a>
          </div>

          {/* Center: Desktop Navigation Links in Light Champagne & Yellow Gold */}
          <nav className="hidden xl:flex items-center gap-6 text-[11px] font-semibold tracking-[0.12em] uppercase">
            {navItems.map((item) => {
              const isActive = currentCategory === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => onSelectCategory(item.value)}
                  className={`relative py-1.5 transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-[#F7D37D] font-bold'
                      : 'text-[#F5EBDD]/90 hover:text-[#F7D37D]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F7D37D] rounded-full shadow-sm" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Functional Shopping Actions (Search, Wishlist, Account, Cart) */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Search */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="p-2 text-[#F5EBDD] hover:text-[#F7D37D] hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              aria-label="Search Jewellery Catalogue"
              title="Search pieces"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              type="button"
              onClick={onOpenWishlist}
              className="p-2 text-[#F5EBDD] hover:text-[#F7D37D] hover:bg-white/10 rounded-full transition-colors relative cursor-pointer"
              aria-label="View Wishlist"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#F7D37D] text-[#55152b] text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Account Profile */}
            <button
              type="button"
              onClick={onOpenAccount}
              className="hidden sm:inline-flex p-2 text-[#F5EBDD] hover:text-[#F7D37D] hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              aria-label="My Account"
              title="Account"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Cart Drawer Trigger */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-[#F5EBDD] hover:text-[#F7D37D] hover:bg-white/10 rounded-full transition-colors relative cursor-pointer"
              aria-label="Open Shopping Bag"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#F7D37D] text-[#55152b] text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
