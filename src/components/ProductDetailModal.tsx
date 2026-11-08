import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Heart, 
  MessageCircle, 
  Mail, 
  ShoppingBag, 
  ShieldAlert, 
  Truck, 
  Sparkles, 
  Check, 
  Share2, 
  Play, 
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Plus, 
  Minus,
  AlertCircle
} from 'lucide-react';
import { Product } from '../types';
import { useCartWishlist } from '../context/CartWishlistContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onSelectRelated: (product: Product) => void;
  allProducts: Product[];
  onOpenPolicy: (policyKey: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onSelectRelated,
  allProducts,
  onOpenPolicy
}) => {
  if (!product) return null;

  const {
    addToCart,
    isInWishlist,
    toggleWishlist,
    formatINR,
    getWhatsAppOrderUrl,
    getEmailEnquiryUrl,
    showToast
  } = useCartWishlist();

  const [quantity, setQuantity] = useState(1);
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0); // 0: main, 1: angle, 2: detail, 3: video
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(4);
  const [videoError, setVideoError] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const wishlisted = isInWishlist(product.id);

  // Verified media assets
  const mediaList = [
    { type: 'image', label: 'Primary', url: product.image, tag: 'Original Photo' },
    { type: 'image', label: 'Angle', url: product.images?.[1] || `/assets/products/${product.id}_angle.jpg`, tag: 'Three-Quarter Angle' },
    { type: 'image', label: 'Detail', url: product.images?.[2] || `/assets/products/${product.id}_detail.jpg`, tag: 'Macro Craftsmanship' },
    { type: 'video', label: '4s Video', url: product.video || `/assets/products/${product.id}_preview.mp4`, tag: 'Playable 4-Sec Video' }
  ];

  // Auto-play / pause video when switching media tabs
  useEffect(() => {
    if (activeMediaIndex === 3) {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().then(() => {
          setIsVideoPlaying(true);
        }).catch(() => {
          setIsVideoPlaying(false);
        });
      }
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  }, [activeMediaIndex]);

  const toggleVideoPlayback = () => {
    if (!videoRef.current) return;
    if (isVideoPlaying) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsVideoPlaying(true);
      }).catch((e) => {
        console.error('Playback error:', e);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const dur = videoRef.current.duration || 4;
      setVideoProgress((current / dur) * 100);
      setVideoDuration(dur);
    }
  };

  const restartVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsVideoPlaying(true);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      showToast('Product link copied to clipboard');
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Related pieces
  const related = allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.subCategory === product.subCategory))
    .slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 select-none">
      <div 
        className="relative w-full max-w-5xl bg-[#B39A7A] rounded-2xl border border-[#947B5F] shadow-2xl overflow-hidden max-h-[94vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Sticky Header */}
        <div className="px-5 py-3.5 border-b border-[#947B5F] flex items-center justify-between bg-[#A88D70] shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded bg-[#681C36] text-[#E2D2BB] text-[11px] font-bold tracking-wider uppercase shadow-sm">
              {product.code}
            </span>
            <span className="text-xs font-serif text-[#201418] uppercase tracking-wide hidden sm:inline font-bold">
              Anjali Jewels Atelier · High-Definition Visuals
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-1.5 text-[#201418] hover:text-[#681C36] rounded-full hover:bg-black/5 cursor-pointer"
              title="Share piece"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-800" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#201418] hover:text-[#681C36] rounded-full hover:bg-black/5 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 md:p-8 space-y-8 bg-[#B39A7A]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Gallery & Interactive Video Player (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Main Media Viewport */}
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-[#947B5F] bg-[#A88D70] shadow-md flex items-center justify-center group">
                
                {activeMediaIndex === 3 ? (
                  /* --- ACTUAL PLAYABLE 4-SECOND PRODUCT VIDEO --- */
                  <div className="relative w-full h-full bg-[#1A1417] flex items-center justify-center">
                    <video
                      ref={videoRef}
                      src={mediaList[3].url}
                      poster={product.videoPoster || product.image}
                      playsInline
                      loop
                      muted={isMuted}
                      onTimeUpdate={handleTimeUpdate}
                      onPlay={() => setIsVideoPlaying(true)}
                      onPause={() => setIsVideoPlaying(false)}
                      onError={() => setVideoError(true)}
                      className="w-full h-full object-contain cursor-pointer"
                      onClick={toggleVideoPlayback}
                    />

                    {/* Top Video Status Pill */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium border border-white/10 pointer-events-none">
                      <Sparkles className="w-3.5 h-3.5 text-[#F7D37D]" />
                      <span>Playable 4-Sec Video ({product.code})</span>
                    </div>

                    {/* Central Play/Pause Watermark Button when paused */}
                    {!isVideoPlaying && (
                      <button
                        type="button"
                        onClick={toggleVideoPlayback}
                        className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#681C36]/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all cursor-pointer border border-[#F7D37D]/60"
                        aria-label="Play video"
                      >
                        <Play className="w-7 h-7 text-[#F7D37D] fill-[#F7D37D] ml-1" />
                      </button>
                    )}

                    {/* Bottom Custom Playback Control Bar */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 flex items-center justify-between text-white text-xs gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={toggleVideoPlayback}
                          className="p-1 rounded hover:bg-white/20 transition-colors cursor-pointer"
                          aria-label={isVideoPlaying ? 'Pause' : 'Play'}
                        >
                          {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                        </button>
                        <button
                          type="button"
                          onClick={restartVideo}
                          className="p-1 rounded hover:bg-white/20 transition-colors cursor-pointer"
                          title="Replay video"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsMuted(!isMuted)}
                          className="p-1 rounded hover:bg-white/20 transition-colors cursor-pointer"
                          title={isMuted ? 'Unmute' : 'Mute'}
                        >
                          {isMuted ? <VolumeX className="w-4 h-4 text-[#F7D37D]" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                        <span className="text-[11px] font-mono text-[#E2D2BB]">
                          0:0{Math.floor((videoProgress / 100) * 4)} / 0:04
                        </span>
                      </div>

                      {/* Video Scrubber Progress */}
                      <div className="flex-1 max-w-[120px] sm:max-w-xs h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#F7D37D] transition-all duration-100" 
                          style={{ width: `${videoProgress}%` }}
                        />
                      </div>
                    </div>

                    {videoError && (
                      <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 text-center">
                        <AlertCircle className="w-8 h-8 text-amber-400 mb-2" />
                        <p className="text-xs text-white">Video preview updating. Click to retry.</p>
                        <button
                          type="button"
                          onClick={() => {
                            setVideoError(false);
                            if (videoRef.current) videoRef.current.load();
                          }}
                          className="mt-2 px-3 py-1 rounded bg-[#681C36] text-white text-xs cursor-pointer"
                        >
                          Reload Video
                        </button>
                      </div>
                    )}

                  </div>
                ) : (
                  /* --- HIGH RESOLUTION STATIC PHOTOGRAPHY --- */
                  <div className="relative w-full h-full flex items-center justify-center bg-[#A88D70]">
                    <img
                      src={mediaList[activeMediaIndex].url}
                      alt={`${product.name} - ${mediaList[activeMediaIndex].tag}`}
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* View Label Pill */}
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium border border-white/10">
                      {mediaList[activeMediaIndex].tag}
                    </div>
                  </div>
                )}

                {/* Floating Wishlist Button */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md shadow-md transition-colors cursor-pointer ${
                    wishlisted
                      ? 'bg-[#681C36] text-white'
                      : 'bg-[#E2D2BB]/90 text-[#201418] hover:text-[#681C36]'
                  }`}
                  title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? 'fill-white' : ''}`} />
                </button>
              </div>

              {/* Thumbnails Row: Original Photo + 2 Additional Angles + 4-Sec Video */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {mediaList.map((media, idx) => {
                  const isSelected = activeMediaIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveMediaIndex(idx)}
                      className={`aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all p-0.5 bg-[#E2D2BB] relative cursor-pointer ${
                        isSelected 
                          ? 'border-[#681C36] ring-2 ring-[#681C36]/50 shadow-md scale-102' 
                          : 'border-[#C0A889] opacity-80 hover:opacity-100'
                      }`}
                    >
                      {media.type === 'video' ? (
                        <div className="w-full h-full bg-[#30252A] flex flex-col items-center justify-center text-white relative rounded">
                          <img 
                            src={product.videoPoster || product.image} 
                            alt="Video Thumbnail" 
                            className="absolute inset-0 w-full h-full object-cover opacity-50"
                          />
                          <div className="relative z-10 flex flex-col items-center">
                            <div className="w-6 h-6 rounded-full bg-[#681C36] flex items-center justify-center shadow">
                              <Play className="w-3.5 h-3.5 text-[#F7D37D] fill-[#F7D37D] ml-0.5" />
                            </div>
                            <span className="text-[10px] font-bold tracking-wider uppercase mt-1 text-[#F7D37D]">
                              4s Video
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full relative">
                          <img 
                            src={media.url} 
                            alt={media.label} 
                            className="w-full h-full object-cover rounded" 
                          />
                          <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] text-center uppercase tracking-tight py-0.5 font-bold">
                            {media.label}
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Verified Product Quality Guarantee Notice */}
              <div className="p-3.5 rounded-xl bg-[#E2D2BB] border border-[#C0A889] flex items-center gap-3 text-xs text-[#201418] shadow-sm">
                <Truck className="w-4 h-4 text-[#681C36] shrink-0" />
                <span className="font-medium">
                  Dispatched within 24-48 business hours from Janakpuri, New Delhi. Insured, tamper-evident velvet box packaging.
                </span>
              </div>

            </div>

            {/* Right Information & Purchase Actions (5 cols) */}
            <div className="lg:col-span-5 space-y-5 text-left">
              
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#681C36] font-bold">
                  {product.category} {product.subCategory ? `· ${product.subCategory}` : ''}
                </p>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#201418] mt-1">
                  {product.name}
                </h1>
                <p className="text-xs text-[#3E2F29] font-mono mt-1 font-semibold">
                  SKU / Product Code: <strong className="text-[#681C36] font-bold">{product.code}</strong>
                </p>
              </div>

              {/* Price Block */}
              <div className="p-3.5 rounded-xl bg-[#E2D2BB] border border-[#C0A889] flex items-baseline justify-between shadow-sm">
                <div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl sm:text-3xl font-bold text-[#681C36] font-sans">
                      {formatINR(product.price)}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-[#4E3C36] line-through font-sans">
                        {formatINR(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider mt-0.5">
                    All Taxes Included · Free Pan-India Insured Dispatch
                  </p>
                </div>

                <span className="px-2.5 py-1 rounded-md bg-[#681C36] text-[#E2D2BB] text-xs font-bold uppercase tracking-wider shadow">
                  FLAT 20% OFF
                </span>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-[#201418] uppercase tracking-wider mb-1">
                  Product Description
                </h4>
                <p className="text-xs sm:text-sm text-[#3E2F29] leading-relaxed font-medium">
                  {product.description}
                </p>
              </div>

              {/* Verified Specifications Table */}
              <div className="rounded-xl border border-[#C0A889] overflow-hidden text-xs divide-y divide-[#C0A889] bg-[#E2D2BB] shadow-sm">
                <div className="p-2.5 bg-[#A88D70] font-bold text-[#201418] uppercase tracking-wider text-[11px]">
                  Verified Specifications
                </div>
                <div className="grid grid-cols-3 p-2.5 bg-[#E2D2BB]">
                  <span className="text-[#4E3C36] font-semibold">Material Base</span>
                  <span className="col-span-2 text-[#201418] font-bold">{product.material || 'High-grade copper brass alloy'}</span>
                </div>
                <div className="grid grid-cols-3 p-2.5 bg-[#D9C7AF]">
                  <span className="text-[#4E3C36] font-semibold">Plating / Finish</span>
                  <span className="col-span-2 text-[#201418] font-bold">{product.plating || 'Multi-layer 22K/24K micro gold finish'}</span>
                </div>
                <div className="grid grid-cols-3 p-2.5 bg-[#E2D2BB]">
                  <span className="text-[#4E3C36] font-semibold">Stone Setting</span>
                  <span className="col-span-2 text-[#201418] font-bold">{product.stones || 'Hand-set polki, kundan & faux emeralds'}</span>
                </div>
                <div className="grid grid-cols-3 p-2.5 bg-[#D9C7AF]">
                  <span className="text-[#4E3C36] font-semibold">Included Pieces</span>
                  <span className="col-span-2 text-[#201418] font-bold">{product.includes || 'Necklace + Matching Earring Pair'}</span>
                </div>
              </div>

              {/* --- OFFICIAL ANJALI JEWELS ORDER POLICY (EXACT REQUIREMENT 9) --- */}
              <div className="rounded-xl border border-[#C0A889] bg-[#E2D2BB] p-4 text-xs space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#C0A889]">
                  <div className="flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-[#681C36]" />
                    <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#681C36]">
                      ORDER POLICIES – ANJALI JEWELS
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenPolicy('order-policies')}
                    className="text-[10px] text-[#681C36] hover:underline uppercase font-bold cursor-pointer"
                  >
                    View Terms
                  </button>
                </div>

                <div className="space-y-1.5 text-[11px] text-[#3E2F29] leading-relaxed font-medium">
                  <p><strong>1. Prepaid Orders Only:</strong> We do not offer Cash on Delivery (COD). All orders must be paid in full before processing.</p>
                  <p><strong>2. No Cancellation:</strong> Once an order is placed and confirmed, it cannot be cancelled or modified.</p>
                  <p><strong>3. No Returns or Refunds:</strong> All purchases are final. We do not accept returns or offer refunds.</p>
                  <p><strong>4. Product Care:</strong> Please review product details and descriptions carefully before placing your order.</p>
                  <p><strong>5. Order Confirmation:</strong> Orders are processed only after successful payment confirmation.</p>
                </div>

                <div className="pt-1 text-[10px] font-serif text-[#681C36] italic border-t border-[#C0A889] text-center font-bold">
                  Thank you for shopping with Anjali Jewels. With love, Anjali Jewels.
                </div>
              </div>

              {/* Purchase & Quantity Actions */}
              <div className="space-y-3 pt-1">
                {/* Quantity Stepper */}
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-[#201418] font-bold">Quantity</span>
                  <div className="flex items-center rounded-lg border border-[#C0A889] bg-[#E2D2BB]">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-1.5 text-[#201418] hover:text-[#681C36] cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-[#201418]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="p-1.5 text-[#201418] hover:text-[#681C36] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Primary Action 1: Instant WhatsApp Order */}
                <a
                  href={getWhatsAppOrderUrl(product, quantity)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 bg-[#681C36] hover:bg-[#75253F] text-white rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all text-center cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-[#F7D37D]" />
                  <span>Order Now on WhatsApp (9319862576)</span>
                </a>

                {/* Secondary Actions: Add to Bag + Email Enquiry */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(product, quantity);
                      onClose();
                    }}
                    className="py-2.5 px-3 bg-[#C0A889] hover:bg-[#A88D70] text-[#201418] rounded-xl text-xs font-bold uppercase tracking-wider border border-[#947B5F] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#681C36]" />
                    <span>Add to Bag</span>
                  </button>

                  <a
                    href={getEmailEnquiryUrl(product, quantity)}
                    className="py-2.5 px-3 bg-[#E2D2BB] hover:bg-[#D9C7AF] text-[#201418] hover:text-[#681C36] rounded-xl text-xs font-bold uppercase tracking-wider border border-[#C0A889] flex items-center justify-center gap-1.5 transition-colors text-center cursor-pointer shadow-sm"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#681C36]" />
                    <span>Email Enquiry</span>
                  </a>
                </div>
              </div>

            </div>

          </div>

          {/* Related Pieces Carousel */}
          {related.length > 0 && (
            <div className="pt-8 border-t border-[#947B5F]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-bold text-[#201418]">
                  Pairing Suggestions & Related Pieces
                </h3>
                <span className="text-xs text-[#681C36] uppercase tracking-wider font-bold">
                  Handpicked Harmony
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {related.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelated(rel)}
                    className="group rounded-xl border border-[#C0A889] bg-[#E2D2BB] p-2.5 cursor-pointer hover:border-[#681C36] transition-all shadow-sm"
                  >
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-[#A88D70] mb-2">
                      <img 
                        src={rel.image} 
                        alt={rel.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                      />
                    </div>
                    <p className="text-[10px] font-bold text-[#681C36]">{rel.code}</p>
                    <h4 className="font-serif font-bold text-xs text-[#201418] line-clamp-1">{rel.name}</h4>
                    <p className="text-xs font-bold text-[#681C36] mt-0.5">{formatINR(rel.price)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
