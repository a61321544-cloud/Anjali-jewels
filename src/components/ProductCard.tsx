import React from 'react';
import { Heart, MessageCircle, Eye, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { useCartWishlist } from '../context/CartWishlistContext';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onQuickView
}) => {
  const { isInWishlist, toggleWishlist, addToCart, formatINR, getWhatsAppOrderUrl } = useCartWishlist();
  const wishlisted = isInWishlist(product.id);

  return (
    <div className="group relative rounded-xl border border-[#C0A889] bg-[#E2D2BB] hover:border-[#681C36] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden">
      
      {/* Top Image Showcase */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#A88D70] cursor-pointer" onClick={() => onSelectProduct(product)}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Scrim on Image Bottom for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

        {/* Product Code Badge */}
        <div className="absolute top-2.5 left-2.5">
          <span className="px-2 py-0.5 rounded bg-[#B39A7A] text-[11px] font-bold text-[#201418] shadow-sm border border-[#8F7558]">
            {product.code}
          </span>
        </div>

        {/* Discount Badge */}
        {product.discountPercentage > 0 && (
          <div className="absolute top-2.5 right-11">
            <span className="px-1.5 py-0.5 rounded bg-[#681C36] text-[10px] font-semibold text-[#E2D2BB] uppercase shadow">
              20% Off
            </span>
          </div>
        )}

        {/* Wishlist Button (Heart) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-colors shadow-sm cursor-pointer ${
            wishlisted
              ? 'bg-[#681C36] text-white'
              : 'bg-[#E2D2BB]/90 text-[#4E3C36] hover:text-[#681C36] hover:bg-white'
          }`}
          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          aria-label={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-white' : ''}`} />
        </button>

        {/* Quick View Button on Image Hover */}
        {onQuickView && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute bottom-2.5 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-full bg-[#E2D2BB] hover:bg-[#C0A889] text-[#201418] text-xs font-bold shadow-md opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer border border-[#C0A889]"
          >
            <Eye className="w-3.5 h-3.5 text-[#681C36]" />
            <span>Quick View</span>
          </button>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-grow justify-between text-left bg-[#E2D2BB]">
        <div>
          <div className="flex items-center justify-between text-[11px] text-[#4E3C36] mb-1">
            <span className="uppercase tracking-wider font-semibold">{product.category}</span>
            <span className="text-emerald-800 font-bold">In Stock</span>
          </div>

          <h3 
            onClick={() => onSelectProduct(product)}
            className="font-serif text-base sm:text-lg font-bold text-[#201418] hover:text-[#681C36] transition-colors line-clamp-1 cursor-pointer"
          >
            {product.name}
          </h3>

          <p className="text-xs text-[#4E3C36] line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price Row */}
        <div className="mt-3 pt-3 border-t border-[#C0A889]/70">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold text-[#681C36] font-sans">
                {formatINR(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-[#4E3C36] line-through">
                  {formatINR(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#4E3C36] uppercase tracking-wide font-semibold">
              Prepaid Only
            </span>
          </div>

          {/* Action CTAs: Order on WhatsApp & Add to Cart */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <a
              href={getWhatsAppOrderUrl(product, 1)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 px-2 bg-[#681C36] hover:bg-[#75253F] text-white rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors text-center cursor-pointer shadow-sm"
              title="Order this product directly on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#F7D37D]" />
              <span className="truncate">Order Now</span>
            </a>

            <button
              type="button"
              onClick={() => addToCart(product, 1)}
              className="flex items-center justify-center gap-1.5 py-2 px-2 bg-[#C0A889] hover:bg-[#A88D70] text-[#201418] rounded-lg text-xs font-bold tracking-wider uppercase border border-[#947B5F] transition-colors text-center cursor-pointer shadow-sm"
              title="Add to Shopping Bag"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#681C36]" />
              <span className="truncate">Add to Bag</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
