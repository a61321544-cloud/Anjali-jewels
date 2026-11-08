import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, MessageCircle, Mail, ShieldAlert, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
  onOpenPolicy: (policyKey: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onProceedToCheckout,
  onOpenPolicy
}) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    subtotal,
    cartCount,
    formatINR,
    getWhatsAppCartUrl,
    getEmailCartUrl
  } = useCartWishlist();

  const [notes, setNotes] = useState('');

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#B39A7A] shadow-2xl flex flex-col justify-between border-l border-[#947B5F]">
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-[#947B5F] flex items-center justify-between bg-[#A88D70]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#681C36]" />
              <h2 className="font-serif text-lg font-bold text-[#201418] uppercase tracking-wide">
                Shopping Bag ({cartCount})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#201418]/80 hover:text-[#201418] rounded-full hover:bg-black/10 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-12 h-12 text-[#947B5F] mx-auto mb-3" />
                <p className="font-serif text-lg font-bold text-[#201418]">Your shopping bag is empty</p>
                <p className="text-xs text-[#3D2C31] mt-1">Explore our 36-piece royal launch collection to begin.</p>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-5 px-6 py-2.5 bg-[#681C36] text-white rounded-lg text-xs font-semibold uppercase tracking-wider shadow-sm hover:bg-[#7B2945] transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="p-3.5 bg-[#E2D2BB] border border-[#C0A889] rounded-xl flex gap-3.5 shadow-sm">
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-[#C0A889] bg-[#A88D70] shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif font-bold text-sm text-[#201418] leading-tight line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-[#681C36]/70 hover:text-rose-800 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-[#681C36] font-bold mt-0.5">
                        Code: {item.product.code}
                      </p>
                      <p className="text-xs font-bold text-[#681C36] mt-1 font-sans">
                        {formatINR(item.product.price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#C0A889] rounded-md bg-[#FAF5EE]">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-[#201418] hover:bg-[#C0A889]/30"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-[#201418]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-[#201418] hover:bg-[#C0A889]/30"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-[#201418] font-sans">
                        {formatINR(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer (Subtotal, Policy Warning, Checkout CTAs) */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#947B5F] bg-[#A88D70] space-y-4">
              
              {/* Special Instructions Note */}
              <div>
                <label className="block text-[11px] font-bold text-[#201418] uppercase tracking-wider mb-1">
                  Special Instructions / Gifting Note
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="E.g., custom gift card message, preferred delivery date..."
                  className="w-full p-2 text-xs bg-[#E2D2BB] border border-[#C0A889] rounded-lg text-[#201418] placeholder-[#5A454B] focus:outline-none focus:ring-1 focus:ring-[#681C36]"
                />
              </div>

              {/* Strict Policy Banner */}
              <div className="p-3 rounded-xl bg-[#681C36]/15 border border-[#681C36]/35 flex items-start gap-2.5 text-[11px] text-[#681C36]">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-[#681C36]" />
                <div className="space-y-1">
                  <div className="font-bold uppercase tracking-wider font-serif text-[#681C36]">ORDER POLICIES – ANJALI JEWELS</div>
                  <p className="text-[10px] text-[#201418] leading-tight font-medium">
                    Prepaid Orders Only · No COD · No Cancellation · No Returns or Refunds. Purchases are final.
                  </p>
                  <button
                    type="button"
                    onClick={() => onOpenPolicy('order-policies')}
                    className="underline text-[10px] font-bold text-[#681C36] hover:text-[#7B2945] cursor-pointer"
                  >
                    Read Complete Order Policy
                  </button>
                </div>
              </div>

              {/* Order Summary & Pricing */}
              <div className="space-y-1.5 pt-1 text-xs">
                <div className="flex justify-between text-[#201418]/85 font-medium">
                  <span>Order Subtotal</span>
                  <span className="font-bold text-[#201418] font-sans">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#201418]/85 font-medium">
                  <span>Insured Pan-India Shipping</span>
                  <span className="text-emerald-900 font-bold uppercase">Free Complimentary</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#681C36] pt-2 border-t border-[#947B5F]">
                  <span>Estimated Total</span>
                  <span className="font-sans">{formatINR(subtotal)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-1">
                {/* 1. Primary: WhatsApp Direct Order Checkout */}
                <a
                  href={getWhatsAppCartUrl(notes)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-[#681C36] hover:bg-[#7B2945] text-white rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors text-center cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-[#F5EBDD]" />
                  <span>Checkout on WhatsApp (Fastest)</span>
                </a>

                {/* 2. Secondary: Web Order Enquiry Page */}
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    onProceedToCheckout();
                  }}
                  className="w-full py-2.5 px-4 bg-[#E2D2BB] hover:bg-[#D4BEA3] text-[#201418] border border-[#C0A889] rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Review Order Enquiry Page</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#681C36]" />
                </button>
              </div>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="text-[11px] text-[#201418]/80 hover:text-[#201418] font-medium underline"
                >
                  Continue Shopping
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
