import React, { useState, useEffect } from 'react';
import { CartWishlistProvider } from './context/CartWishlistContext';
import { Product, Category, Review, Story } from './types';
import defaultStoreData from '../data/store.json';

// Components
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { HeroSlider } from './components/HeroSlider';
import { MaroonCategoryStrip } from './components/MaroonCategoryStrip';
import { ShopByCategories } from './components/ShopByCategories';
import { PromotionalBanner } from './components/PromotionalBanner';
import { NewArrivals } from './components/NewArrivals';
import { BestSellers } from './components/BestSellers';
import { AllProducts } from './components/AllProducts';
import { PromotionalCollections } from './components/PromotionalCollections';
import { CustomerReviews } from './components/CustomerReviews';
import { FeaturedJewellery } from './components/FeaturedJewellery';
import { AboutSection } from './components/AboutSection';
import { BlogEditorial } from './components/BlogEditorial';
import { Footer } from './components/Footer';

// Modals & Overlays
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SearchModal } from './components/SearchModal';
import { WishlistModal } from './components/WishlistModal';
import { AccountModal } from './components/AccountModal';
import { PolicyModal } from './components/PolicyModal';
import { AdminPanel } from './components/AdminPanel';
import { CheckoutView } from './components/CheckoutView';
import { MessageCircle, Phone, X, ShieldAlert, Sparkles } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<Product[]>(defaultStoreData.products as Product[]);
  const [categories, setCategories] = useState<Category[]>(defaultStoreData.categories as Category[]);
  const [reviews] = useState<Review[]>(defaultStoreData.reviews as Review[]);
  const [stories] = useState<Story[]>(defaultStoreData.stories as Story[]);
  
  // Navigation & View State
  const [currentCategory, setCurrentCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'home' | 'checkout'>('home');
  
  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [policyModalKey, setPolicyModalKey] = useState<string | null>(null);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Fetch latest products and categories from backend API
  const refreshProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (data.products && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        }
      }
    } catch {
      // Fallback already populated from defaultStoreData
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  const handleSelectCategory = (categorySlug: string) => {
    setCurrentCategory(categorySlug);
    // Smooth scroll to all products grid
    const target = document.getElementById('all-products-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenPolicy = (key: string) => {
    setPolicyModalKey(key);
  };

  return (
    <CartWishlistProvider>
      <div className="min-h-screen bg-[#B39A7A] text-[#201418] flex flex-col font-sans selection:bg-[#681C36] selection:text-[#E2D2BB]">
        
        {/* 1. Slim Announcement Bar */}
        <AnnouncementBar onOpenPolicy={handleOpenPolicy} />

        {/* 2. Header & Luxury Navigation (Light Maroon Background, Single-line Gold Brand Name, Three-Dot Menu + Logo) */}
        <Header
          currentCategory={currentCategory}
          onSelectCategory={handleSelectCategory}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenAccount={() => setIsAccountOpen(true)}
          onOpenWishlist={() => setIsWishlistOpen(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onOpenPolicy={handleOpenPolicy}
          onOpenFaq={() => setIsFaqOpen(true)}
        />

        {/* Main Body: Either Checkout View or Enhanced Homepage Sequence */}
        {viewMode === 'checkout' ? (
          <main className="flex-1 bg-[#B39A7A]">
            <CheckoutView
              onBackToShopping={() => {
                setViewMode('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenPolicy={handleOpenPolicy}
            />
          </main>
        ) : (
          <main className="flex-1 bg-[#B39A7A]">
            
            {/* 3. Hero Banner Slider */}
            <HeroSlider
              products={products}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onExploreCollection={handleSelectCategory}
            />

            {/* 4. SLIM MAROON CATEGORY STRIP (Immediately below the Hero Banner) */}
            <MaroonCategoryStrip
              categories={categories}
              activeCategory={currentCategory}
              onSelectCategory={handleSelectCategory}
            />

            {/* 5. Shop by Categories */}
            <ShopByCategories
              categories={categories}
              onSelectCategory={handleSelectCategory}
            />

            {/* 6. BANNER 1: After Shop by Category (Requirement 5) */}
            <PromotionalBanner
              variant="heritage-kundan"
              onActionClick={() => handleSelectCategory('chokers')}
            />

            {/* 7. New Arrivals */}
            <NewArrivals
              products={products}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onQuickView={(p) => setSelectedProduct(p)}
              onViewAll={() => handleSelectCategory('all')}
            />

            {/* 8. BANNER 2: After New Arrivals (Requirement 5) */}
            <PromotionalBanner
              variant="temple-auspicious"
              onActionClick={() => handleSelectCategory('temple')}
            />

            {/* 9. Best Sellers */}
            <BestSellers
              products={products}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onQuickView={(p) => setSelectedProduct(p)}
              onViewAll={() => handleSelectCategory('all')}
            />

            {/* 10. BANNER 3: Between Best Sellers and All Products (Requirement 5) */}
            <PromotionalBanner
              variant="bridal-trousseau"
              onActionClick={() => handleSelectCategory('bridal')}
            />

            {/* 11. All Products Catalogue Grid (36 verified pieces) */}
            <AllProducts
              products={products}
              currentCategory={currentCategory}
              onSelectCategory={setCurrentCategory}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onQuickView={(p) => setSelectedProduct(p)}
            />

            {/* 12. BANNER 4: Around All Products (Requirement 5) */}
            <PromotionalBanner
              variant="flat-20-offer"
              onActionClick={() => handleSelectCategory('all')}
            />

            {/* 13. Curated Promotional Editions */}
            <PromotionalCollections
              onSelectCategory={handleSelectCategory}
            />

            {/* 14. Customer Testimonials */}
            <CustomerReviews reviews={reviews} />

            {/* 15. Featured Jewellery Spotlight */}
            <FeaturedJewellery
              products={products}
              onSelectProduct={(p) => setSelectedProduct(p)}
            />

            {/* 16. About Section */}
            <AboutSection />

            {/* 17. Blog & Editorial Articles */}
            <BlogEditorial stories={stories} />

          </main>
        )}

        {/* 18. Brand Footer with Official Policies & Studio Address */}
        <Footer
          onOpenPolicy={handleOpenPolicy}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onOpenFaq={() => setIsFaqOpen(true)}
          onOpenContact={() => setIsContactOpen(true)}
          onSelectCategory={handleSelectCategory}
        />

        {/* --- MODALS & OVERLAYS --- */}

        {/* Cart Drawer */}
        <CartDrawer
          onProceedToCheckout={() => {
            setViewMode('checkout');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenPolicy={handleOpenPolicy}
        />

        {/* Product Detail Modal (PDP) with Playable 4-Second Video & 3 Angles */}
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSelectRelated={(p) => setSelectedProduct(p)}
          allProducts={products}
          onOpenPolicy={handleOpenPolicy}
        />

        {/* Search Modal */}
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          products={products}
          onSelectProduct={(p) => setSelectedProduct(p)}
        />

        {/* Wishlist Modal */}
        <WishlistModal
          isOpen={isWishlistOpen}
          onClose={() => setIsWishlistOpen(false)}
          onSelectProduct={(p) => setSelectedProduct(p)}
        />

        {/* Account Modal */}
        <AccountModal
          isOpen={isAccountOpen}
          onClose={() => setIsAccountOpen(false)}
          onOpenWishlist={() => {
            setIsAccountOpen(false);
            setIsWishlistOpen(true);
          }}
        />

        {/* Policy Modal with exact ORDER POLICIES – ANJALI JEWELS */}
        <PolicyModal
          isOpen={policyModalKey !== null}
          initialPolicyKey={policyModalKey || 'order-policies'}
          onClose={() => setPolicyModalKey(null)}
        />

        {/* Admin Management Panel */}
        <AdminPanel
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          onProductsUpdated={refreshProducts}
        />

        {/* FAQ Modal */}
        {isFaqOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
            <div className="relative w-full max-w-2xl bg-[#B39A7A] rounded-2xl border border-[#947B5F] shadow-2xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-[#947B5F] mb-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#681C36]">Client Assistance</span>
                  <h3 className="font-serif text-2xl font-bold text-[#201418]">Frequently Asked Questions</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFaqOpen(false)}
                  className="p-1.5 rounded-full text-[#4E3C36] hover:text-[#201418] hover:bg-black/5 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-sm text-[#201418]">
                <div className="p-4 rounded-xl bg-[#E2D2BB] border border-[#C0A889] shadow-sm">
                  <h4 className="font-serif font-bold text-base text-[#681C36] mb-1">Do you provide Cash on Delivery (COD)?</h4>
                  <p className="text-[#3A2A2E] leading-relaxed">
                    No. ANJALI JEWELS strictly operates on a 100% PREPAID basis. We accept UPI (Google Pay, PhonePe, Paytm), Net Banking, and Bank Transfers. We do not provide COD.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#E2D2BB] border border-[#C0A889] shadow-sm">
                  <h4 className="font-serif font-bold text-base text-[#681C36] mb-1">What is your Return or Exchange policy?</h4>
                  <p className="text-[#3A2A2E] leading-relaxed">
                    We enforce a strict NO REFUND and NO EXCHANGE policy. Each piece is custom inspected, video-documented, and packed in tamper-evident velvet boxes before courier pickup.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#E2D2BB] border border-[#C0A889] shadow-sm">
                  <h4 className="font-serif font-bold text-base text-[#681C36] mb-1">How can I place an order?</h4>
                  <p className="text-[#3A2A2E] leading-relaxed">
                    You can click any "Order on WhatsApp" button or add pieces to your bag and proceed to checkout. A dedicated WhatsApp chat will open with your product codes (e.g., AJ-01), where our concierge will confirm availability and share payment instructions.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#E2D2BB] border border-[#C0A889] shadow-sm">
                  <h4 className="font-serif font-bold text-base text-[#681C36] mb-1">How long does delivery take?</h4>
                  <p className="text-[#3A2A2E] leading-relaxed">
                    Orders are dispatched within 24-48 business hours from Janakpuri, New Delhi. Metro deliveries take 2 to 4 business days; other regions take 3 to 6 business days via insured express couriers.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#947B5F] flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsFaqOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-[#681C36] text-[#E2D2BB] text-xs uppercase tracking-widest font-semibold hover:bg-[#75253F] transition-all cursor-pointer shadow-md"
                >
                  Close FAQ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contact Concierge Modal */}
        {isContactOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
            <div className="relative w-full max-w-lg bg-[#B39A7A] rounded-2xl border border-[#947B5F] shadow-2xl p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-[#947B5F] mb-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#681C36]">Direct Concierge</span>
                  <h3 className="font-serif text-2xl font-bold text-[#201418]">Contact Anjali Jewels</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsContactOpen(false)}
                  className="p-1.5 rounded-full text-[#4E3C36] hover:text-[#201418] hover:bg-black/5 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <a
                  href="https://wa.me/919319862576?text=Hello%20Anjali%20Jewels,%20I%20would%20like%20to%20enquire%20about%20your%20jewellery%20collection."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#25D366]/15 border border-[#25D366]/40 text-[#0c6b39] hover:bg-[#25D366]/25 transition-all cursor-pointer shadow-sm"
                >
                  <div className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#201418]">WhatsApp Boutique Chat</h4>
                    <p className="text-xs text-[#4E3C36]">+91 9319862576 (Instant Response)</p>
                  </div>
                </a>

                <a
                  href="mailto:maliyan04@icloud.com?subject=Anjali%20Jewels%20Boutique%20Enquiry"
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#E2D2BB] border border-[#C0A889] text-[#681C36] hover:bg-[#D9C7AF] transition-all cursor-pointer shadow-sm"
                >
                  <div className="w-12 h-12 rounded-full bg-[#681C36] text-white flex items-center justify-center shrink-0 shadow">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#201418]">Email Boutique Studio</h4>
                    <p className="text-xs text-[#4E3C36]">maliyan04@icloud.com</p>
                  </div>
                </a>

                <div className="p-4 rounded-xl bg-[#E2D2BB] border border-[#C0A889] text-xs text-[#3A2A2E] leading-relaxed shadow-sm">
                  <p className="font-semibold text-[#201418] mb-1">Studio Address:</p>
                  <p>ANJALI JEWELS, Janakpuri, New Delhi, India 110058</p>
                  <p className="mt-2 text-[11px] text-[#681C36] italic font-serif">
                    *Visits and bridal previews by prior appointment only.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating WhatsApp Quick Contact Button */}
        <aside aria-label="Quick WhatsApp Consultation" className="fixed bottom-6 right-6 z-40">
          <a
            href="https://wa.me/919319862576?text=Hello%20Anjali%20Jewels,%20I%20would%20like%20to%20enquire%20about%20your%20jewellery%20collection."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] text-white shadow-xl hover:bg-[#20ba59] transition-all hover:scale-105 group cursor-pointer"
            title="Chat with Anjali Jewels on WhatsApp"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">
              WhatsApp Concierge
            </span>
          </a>
        </aside>

      </div>
    </CartWishlistProvider>
  );
}
