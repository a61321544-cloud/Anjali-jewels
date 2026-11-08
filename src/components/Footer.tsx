import React from 'react';
import { Phone, Mail, MapPin, Instagram, ShieldAlert, Heart, Lock } from 'lucide-react';

interface FooterProps {
  onOpenPolicy: (policyKey: string) => void;
  onOpenAdmin: () => void;
  onOpenFaq: () => void;
  onOpenContact: () => void;
  onSelectCategory: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPolicy,
  onOpenAdmin,
  onOpenFaq,
  onOpenContact,
  onSelectCategory
}) => {
  return (
    <footer className="bg-[#30252A] text-[#F5EBDD] border-t border-[#7B2945]/40 pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Intro Column (4 cols) */}
          <div className="lg:col-span-4 space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-[#F7D37D] bg-transparent p-0.5 shrink-0">
                <img src="/anjali_jewels_logo.png" alt="Anjali Jewels" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-wider text-[#F7D37D] uppercase block">
                  Anjali Jewels
                </span>
                <span className="text-[10px] tracking-[0.25em] text-[#B89A68] uppercase font-medium">
                  Tradition, Adorned.
                </span>
              </div>
            </div>

            <p className="text-xs text-[#E8DDD2]/80 leading-relaxed max-w-sm">
              Luxury artificial jewellery boutique curating imperial Kundan, sculpted South Indian temple ornaments, and luminous evening crystals. Designed for timeless celebrations.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://wa.me/919319862576"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#681C36] flex items-center justify-center text-white transition-colors"
                title="WhatsApp Boutique"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href="mailto:maliyan04@icloud.com"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#681C36] flex items-center justify-center text-white transition-colors"
                title="Email Support"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/anjalijewels"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#681C36] flex items-center justify-center text-white transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Categories Column (2 cols) */}
          <div className="lg:col-span-2 space-y-3 text-left">
            <h4 className="font-serif text-sm font-semibold text-white uppercase tracking-wider">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-[#E8DDD2]/80">
              <li>
                <button type="button" onClick={() => onSelectCategory('necklaces')} className="hover:text-white transition-colors">
                  Necklaces
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSelectCategory('chokers')} className="hover:text-white transition-colors">
                  Choker Sets
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSelectCategory('earrings')} className="hover:text-white transition-colors">
                  Earrings & Jhumkas
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSelectCategory('bangles')} className="hover:text-white transition-colors">
                  Bangles & Kadas
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSelectCategory('bridal')} className="hover:text-white transition-colors">
                  Bridal Suites
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSelectCategory('temple')} className="hover:text-white transition-colors">
                  Temple Jewellery
                </button>
              </li>
            </ul>
          </div>

          {/* Mandatory Store Policies Column (3 cols) */}
          <div className="lg:col-span-3 space-y-3 text-left">
            <div className="flex items-center gap-1.5 text-rose-400">
              <ShieldAlert className="w-4 h-4" />
              <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-white">
                Store Policies
              </h4>
            </div>
            <ul className="space-y-2 text-xs text-[#E8DDD2]/80">
              <li>
                <button 
                  type="button" 
                  onClick={() => onOpenPolicy('order-policies')}
                  className="hover:text-[#F7D37D] font-bold text-[#F7D37D] transition-colors text-left"
                >
                  ORDER POLICIES – ANJALI JEWELS
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => onOpenPolicy('no-refund')}
                  className="hover:text-white font-medium transition-colors text-left"
                >
                  Strictly NO REFUND Policy
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => onOpenPolicy('no-exchange')}
                  className="hover:text-white font-medium transition-colors text-left"
                >
                  Strictly NO EXCHANGE Policy
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => onOpenPolicy('no-cod')}
                  className="hover:text-white font-medium transition-colors text-left"
                >
                  Prepaid Only (NO COD Policy)
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => onOpenPolicy('shipping')}
                  className="hover:text-white transition-colors text-left"
                >
                  Shipping & Delivery Timeline
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => onOpenPolicy('terms')}
                  className="hover:text-white transition-colors text-left"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => onOpenPolicy('privacy')}
                  className="hover:text-white transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Verified Contact Details Column (3 cols) */}
          <div className="lg:col-span-3 space-y-3 text-left">
            <h4 className="font-serif text-sm font-semibold text-white uppercase tracking-wider">
              Boutique Information
            </h4>
            
            <div className="space-y-2.5 text-xs text-[#E8DDD2]/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#B89A68] shrink-0 mt-0.5" />
                <span>Janakpuri, New Delhi, India</span>
              </div>
              
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="https://wa.me/919319862576" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  +91 9319862576 (WhatsApp)
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#B89A68] shrink-0" />
                <a href="mailto:maliyan04@icloud.com" className="hover:text-white">
                  maliyan04@icloud.com
                </a>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenContact}
                  className="w-full py-2 px-3 rounded-lg bg-[#681C36] hover:bg-[#7B2945] text-white text-xs font-semibold uppercase tracking-wider transition-colors text-center"
                >
                  Contact Boutique Support
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Admin Portal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E8DDD2]/60 text-center sm:text-left">
          <p>© {new Date().getFullYear()} ANJALI JEWELS. All rights reserved. Handcrafted with reverence in New Delhi.</p>
          
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onOpenFaq}
              className="hover:text-white transition-colors"
            >
              FAQ
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => onOpenPolicy('terms')}
              className="hover:text-white transition-colors"
            >
              Terms
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={onOpenAdmin}
              className="flex items-center gap-1 text-[#B89A68] hover:text-white transition-colors font-medium"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
