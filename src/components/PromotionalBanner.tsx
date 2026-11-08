import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Tag } from 'lucide-react';

interface PromotionalBannerProps {
  variant: 'heritage-kundan' | 'temple-auspicious' | 'flat-20-offer' | 'bridal-trousseau';
  onActionClick: () => void;
}

export const PromotionalBanner: React.FC<PromotionalBannerProps> = ({
  variant,
  onActionClick
}) => {
  const bannerConfigs = {
    'heritage-kundan': {
      bg: 'bg-gradient-to-r from-[#4A1124] via-[#5C162D] to-[#3B0B1B]',
      border: 'border-[#B89A68]/40',
      tag: 'Heritage Signature',
      title: 'The Royal Jaipur Kundan & Polki Edit',
      subtitle: 'Handcrafted with 24K pure gold-foil bedding, uncut polki stones & lightweight imperial brass alloy.',
      actionText: 'Explore Choker Sets',
      image: '/assets/aistudio/IMG-20261105-WA0010_8e8012bd.jpg'
    },
    'temple-auspicious': {
      bg: 'bg-gradient-to-r from-[#501327] via-[#631831] to-[#3D0A1B]',
      border: 'border-[#B89A68]/40',
      tag: 'Sacred Heirlooms',
      title: 'Auspicious Temple Haar & Jhumka Suites',
      subtitle: 'Devika goddess motifs and sculpted peacock kalash in deep matte antique gold for holy wedding rituals.',
      actionText: 'View Temple Pieces',
      image: '/assets/aistudio/IMG-20261105-WA0036_19be3205.jpg'
    },
    'flat-20-offer': {
      bg: 'bg-gradient-to-r from-[#59152C] via-[#6F1B37] to-[#420C1F]',
      border: 'border-[#F7D37D]/50',
      tag: 'Launch Festive Offer',
      title: 'FLAT 20% OFF Launch Celebration',
      subtitle: 'Enjoy 20% discount across our debut collection · Strictly Prepaid Orders · Insured Express Pan-India Courier.',
      actionText: 'Shop Launch Pieces',
      image: '/assets/aistudio/IMG-20261105-WA0019_f5ddb6ed.jpg'
    },
    'bridal-trousseau': {
      bg: 'bg-gradient-to-r from-[#3C0F20] via-[#52142B] to-[#2B0816]',
      border: 'border-[#B89A68]/40',
      tag: 'Royal Bridal Trousseau',
      title: 'Imperial Bridal Haars & Statement Sets',
      subtitle: 'Grandeur designed for royal receptions, sangeets, and pheras · Custom bridal styling assistance available.',
      actionText: 'View Bridal Suites',
      image: '/assets/aistudio/IMG-20261105-WA0037_47946587.jpg'
    }
  };

  const config = bannerConfigs[variant];

  return (
    <section className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className={`relative overflow-hidden rounded-2xl ${config.bg} border ${config.border} shadow-lg text-[#F5EBDD]`}>
          
          {/* Subtle Background Pattern Accent */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F7D37D_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6 p-6 sm:p-8 lg:p-10 relative z-10">
            
            {/* Left/Center Text Content */}
            <div className="md:col-span-8 lg:col-span-9 space-y-2.5 text-left">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7D37D]/15 text-[#F7D37D] text-[10px] font-bold tracking-[0.2em] uppercase border border-[#F7D37D]/30">
                  <Sparkles className="w-3 h-3" />
                  {config.tag}
                </span>
                <span className="text-[11px] text-[#F5EBDD]/70 font-serif italic">
                  Anjali Jewels Atelier
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide text-white">
                {config.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#F5EBDD]/90 max-w-2xl leading-relaxed font-sans font-light">
                {config.subtitle}
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onActionClick}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F7D37D] text-[#501327] font-semibold text-xs tracking-wider uppercase hover:bg-white transition-all shadow-md cursor-pointer group"
                >
                  <span>{config.actionText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Vignette Thumbnail Preview */}
            <div className="hidden md:flex md:col-span-4 lg:col-span-3 justify-end">
              <div className="w-36 h-36 lg:w-44 lg:h-44 rounded-2xl overflow-hidden border-2 border-[#F7D37D]/40 shadow-xl relative shrink-0">
                <img
                  src={config.image}
                  alt={config.title}
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
