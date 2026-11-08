import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';

interface CartWishlistContextType {
  cart: CartItem[];
  wishlist: Product[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  cartCount: number;
  wishlistCount: number;
  subtotal: number;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  formatINR: (amount: number) => string;
  getWhatsAppOrderUrl: (product: Product, quantity?: number) => string;
  getWhatsAppCartUrl: (notes?: string) => string;
  getEmailEnquiryUrl: (product: Product, quantity?: number) => string;
  getEmailCartUrl: (notes?: string) => string;
}

const CartWishlistContext = createContext<CartWishlistContextType | undefined>(undefined);

const WHATSAPP_NUMBER = '919319862576';
const BUSINESS_EMAIL = 'maliyan04@icloud.com';

export const CartWishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('anjali_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('anjali_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('anjali_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('anjali_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added "${product.name}" to shopping bag`);
    setIsCartOpen(true);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from shopping bag');
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`Removed from your wishlist`);
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast(`Saved to your wishlist`);
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const formatINR = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // WhatsApp order builder for single product
  const getWhatsAppOrderUrl = (product: Product, quantity = 1): string => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://anjalijewels.in';
    const productUrl = `${origin}/#product-${product.code.toLowerCase()}`;
    const total = product.price * quantity;

    const message = [
      `*ORDER ENQUIRY — ANJALI JEWELS*`,
      `Namaste, I would like to order this jewellery piece:`,
      ``,
      `• *Product:* ${product.name}`,
      `• *Product Code:* ${product.code}`,
      `• *Price:* ${formatINR(product.price)}`,
      `• *Quantity:* ${quantity}`,
      `• *Total Value:* ${formatINR(total)}`,
      `• *Product Link:* ${productUrl}`,
      ``,
      `Kindly confirm availability, delivery timeline to my pincode, and prepaid payment details (UPI/Net Banking).`,
      ``,
      `_Note: I have noted your store policies: NO REFUND, NO EXCHANGE, NO COD._`
    ].join('\n');

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  // WhatsApp order builder for entire cart
  const getWhatsAppCartUrl = (notes = ''): string => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://anjalijewels.in';
    const itemsList = cart
      .map(
        (item, idx) =>
          `${idx + 1}. *${item.product.name}* [Code: ${item.product.code}]\n   Qty: ${item.quantity} × ${formatINR(item.product.price)} = ${formatINR(item.product.price * item.quantity)}`
      )
      .join('\n\n');

    const message = [
      `*ORDER ENQUIRY — ANJALI JEWELS*`,
      `Namaste, I would like to place an order for the following cart items:`,
      ``,
      itemsList,
      ``,
      `• *Total Items:* ${cartCount}`,
      `• *Order Subtotal:* ${formatINR(subtotal)}`,
      notes ? `• *Special Notes:* ${notes}` : '',
      ``,
      `Kindly confirm item availability, dispatch schedule, and send your boutique prepaid payment details.`,
      ``,
      `_Acknowledged Boutique Policies: NO REFUND, NO EXCHANGE, NO COD._`
    ]
      .filter(Boolean)
      .join('\n');

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  // Email enquiry for single product
  const getEmailEnquiryUrl = (product: Product, quantity = 1): string => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://anjalijewels.in';
    const productUrl = `${origin}/#product-${product.code.toLowerCase()}`;
    const subject = `Order Enquiry: ${product.name} (${product.code})`;
    const body = [
      `Dear Anjali Jewels Team,`,
      ``,
      `I am interested in purchasing the following piece:`,
      `Product Name: ${product.name}`,
      `Product Code: ${product.code}`,
      `Price: ${formatINR(product.price)}`,
      `Quantity: ${quantity}`,
      `Product Link: ${productUrl}`,
      ``,
      `Please provide details on availability, express dispatch timeline, and prepaid payment instructions.`,
      ``,
      `Best regards,`
    ].join('\n');

    return `mailto:${BUSINESS_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Email enquiry for full cart
  const getEmailCartUrl = (notes = ''): string => {
    const subject = `Order Enquiry: Cart Purchase (${cartCount} items)`;
    const itemsList = cart
      .map(
        (item, idx) =>
          `${idx + 1}. ${item.product.name} (${item.product.code}) - Qty: ${item.quantity} @ ${formatINR(item.product.price)} = ${formatINR(item.product.price * item.quantity)}`
      )
      .join('\n');

    const body = [
      `Dear Anjali Jewels Team,`,
      ``,
      `I would like to order the following items from my cart:`,
      ``,
      itemsList,
      ``,
      `Total Subtotal: ${formatINR(subtotal)}`,
      notes ? `Special Instructions: ${notes}` : '',
      ``,
      `Please confirm stock availability and share payment details for prepaid dispatch.`,
      ``,
      `Best regards,`
    ]
      .filter(Boolean)
      .join('\n');

    return `mailto:${BUSINESS_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <CartWishlistContext.Provider
      value={{
        cart,
        wishlist,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isInWishlist,
        cartCount,
        wishlistCount,
        subtotal,
        toastMessage,
        showToast,
        formatINR,
        getWhatsAppOrderUrl,
        getWhatsAppCartUrl,
        getEmailEnquiryUrl,
        getEmailCartUrl
      }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
};

export const useCartWishlist = () => {
  const context = useContext(CartWishlistContext);
  if (!context) {
    throw new Error('useCartWishlist must be used within a CartWishlistProvider');
  }
  return context;
};
