import React from 'react';
import { MapPin, Phone, Mail, ShieldCheck, Gem, Sparkles } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about-section" aria-labelledby="about-heading" className="py-16 sm:py-20 bg-[#B39A7A] border-b border-[#947B5F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Brand Emblem & Editorial Photo */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-2xl overflow-hidden border border-[#C0A889] shadow-xl bg-[#A88D70]">
              <img
                src="/assets/aistudio/IMG-20261105-WA0010_8e8012bd.jpg"
                alt="Anjali Jewels Heritage Craftsmanship"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Centered Circular Logo Badge Overlay */}
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#B39A7A]/95 backdrop-blur-md border border-[#8F7558] shadow-sm">
                <img src="/anjali_jewels_logo.png" alt="Anjali Jewels" className="w-6 h-6 rounded-full object-contain" />
                <span className="font-serif text-xs font-bold text-[#201418] tracking-wider uppercase">
                  Anjali Jewels
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs font-medium text-[#E2D2BB] tracking-widest uppercase">Janakpuri Boutique · New Delhi</p>
                <p className="font-serif text-base font-semibold mt-0.5">Tradition, Adorned.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Brand Narrative & Verified Details */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-5">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#681C36] font-bold">
                Our Story & Philosophy
              </span>
              <h2 id="about-heading" className="font-display text-3xl sm:text-4xl font-bold text-[#201418] mt-2">
                About ANJALI JEWELS
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#2C1E23] leading-relaxed font-medium">
              At <strong className="text-[#681C36]">ANJALI JEWELS</strong>, we curate luxury artificial jewellery that captures the timeless splendor of Indian royal courts. Based in <strong className="text-[#201418]">Janakpuri, New Delhi</strong>, our collections celebrate the sacred aesthetics of heritage Kundan, temple craftsmanship, uncut polki-style stone settings, and sparkling evening crystals.
            </p>

            <p className="text-sm sm:text-base text-[#2C1E23] leading-relaxed font-medium">
              Every necklace, choker, bridal rani haar, bangle, and sculpted jhumka is conceived to give modern women a royal, sophisticated presence without the prohibitive weight or expense of fine gold. We believe true luxury lies in detail: balanced weights, skin-safe micro-gold plating, and hand-strung basra pearls made for your grandest moments.
            </p>

            {/* Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#E2D2BB] border border-[#C0A889] shadow-sm">
                <div className="w-8 h-8 rounded-full bg-[#681C36]/15 text-[#681C36] flex items-center justify-center mb-2">
                  <Gem className="w-4 h-4" />
                </div>
                <h4 className="font-serif font-bold text-sm text-[#201418]">Royal Appearance</h4>
                <p className="text-[11px] text-[#3E2F29] mt-1 font-medium">Regal silhouettes that mirror the luster and gravitas of heritage heirloom jewellery.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#E2D2BB] border border-[#C0A889] shadow-sm">
                <div className="w-8 h-8 rounded-full bg-[#681C36]/15 text-[#681C36] flex items-center justify-center mb-2">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="font-serif font-bold text-sm text-[#201418]">Artisanal Precision</h4>
                <p className="text-[11px] text-[#3E2F29] mt-1 font-medium">Prong-set crystals, fine-foil Kundan, and hand-applied Meenakari enamel accents.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#E2D2BB] border border-[#C0A889] shadow-sm">
                <div className="w-8 h-8 rounded-full bg-[#681C36]/15 text-[#681C36] flex items-center justify-center mb-2">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="font-serif font-bold text-sm text-[#201418]">Direct Boutique Care</h4>
                <p className="text-[11px] text-[#3E2F29] mt-1 font-medium">Personalised styling on WhatsApp and transparent policies before you order.</p>
              </div>
            </div>

            {/* Verified Contact Details Row */}
            <div className="pt-4 border-t border-[#947B5F]/60 flex flex-wrap items-center gap-6 text-xs text-[#201418] font-bold">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#681C36]" />
                <span>Janakpuri, New Delhi, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#0c6b39]" />
                <span>+91 9319862576</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#681C36]" />
                <span>maliyan04@icloud.com</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
