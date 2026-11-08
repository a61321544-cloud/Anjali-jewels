import React from 'react';
import { X, Heart, Trash2, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';
import { Product } from '../types';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct
}) => {
  const { wishlist, toggleWishlist, addToCart, formatINR, getWhatsAppOrderUrl } = useCartWishlist();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="w-full max-w-2xl bg-[#B39A7A] rounded-2xl border border-[#947B5F] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#947B5F] flex items-center justify-between bg-[#A88D70]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#681C36] fill-[#681C36]" />
            <h2 className="font-serif text-lg font-bold text-[#201418] uppercase tracking-wide">
              Saved Wishlist ({wishlist.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#201418]/80 hover:text-[#201418] rounded-full hover:bg-black/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-3">
          {wishlist.length === 0 ? (
            <div className="py-16 text-center">
              <Heart className="w-12 h-12 text-[#947B5F] mx-auto mb-3" />
              <p className="font-serif text-lg font-bold text-[#201418]">Your wishlist is currently empty</p>
              <p className="text-xs text-[#3D2C31] mt-1 font-medium">Click the heart icon on any piece to save it for later.</p>
            </div>
          ) : (
            wishlist.map((product) => (
              <div key={product.id} className="p-3.5 bg-[#E2D2BB] border border-[#C0A889] rounded-xl shadow-sm flex items-center justify-between gap-4 text-left">
                <div 
                  className="flex items-center gap-3.5 cursor-pointer flex-1"
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#A88D70] border border-[#C0A889] shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#681C36]">{product.code}</span>
                    <h4 className="font-serif font-bold text-sm text-[#201418] hover:text-[#681C36] transition-colors line-clamp-1">
                      {product.name}
                    </h4>
                    <p className="text-xs font-bold text-[#681C36] mt-0.5 font-sans">
                      {formatINR(product.price)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={getWhatsAppOrderUrl(product, 1)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#681C36] hover:bg-[#7B2945] text-white rounded-lg transition-colors shadow-sm"
                    title="Order on WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      addToCart(product, 1);
                      toggleWishlist(product);
                    }}
                    className="p-2 bg-[#FAF5EE] hover:bg-[#D4BEA3] text-[#201418] rounded-lg transition-colors border border-[#C0A889]"
                    title="Move to Shopping Bag"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#681C36]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    className="p-2 text-[#681C36]/70 hover:text-rose-800 transition-colors"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
