import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface PromotionalCollectionsProps {
  onSelectCategory: (category: string) => void;
}

export const PromotionalCollections: React.FC<PromotionalCollectionsProps> = ({
  onSelectCategory
}) => {
  const promotions = [
    {
      id: 'promo-1',
      title: 'The Imperial Temple Suite',
      subtitle: 'Auspicious South Indian Heirlooms',
      tag: 'Festive Launch',
      category: 'temple',
      image: '/assets/aistudio/IMG-20261105-WA0036_19be3205.jpg',
      description: 'Devika goddess medallions, carved peacock pillars and antique matte 22K gold tones designed for sacred wedding rituals.'
    },
    {
      id: 'promo-2',
      title: 'Kundan & Polki Grandeur',
      subtitle: 'The Royal Jaipur Heritage Edit',
      tag: 'Boutique Signature',
      category: 'bridal',
      image: '/assets/aistudio/IMG-20261105-WA0016_d0464254.jpg',
      description: 'Uncut foil-backed polki, emerald drops and basra-inspired pearls that radiate royal elegance under evening chandeliers.'
    },
    {
      id: 'promo-3',
      title: 'The Midnight Crystal Gala',
      subtitle: 'Contemporary Evening Radiance',
      tag: 'Cocktail & Reception',
      category: 'necklaces',
      image: '/assets/aistudio/IMG-20261105-WA0037_47946587.jpg',
      description: 'Diamond-simulant cubic zirconia and high-gloss rhodium craftsmanship for receptions, sangeets and cocktail galas.'
    }
  ];

  return (
    <section aria-labelledby="promotional-collections-heading" className="py-12 sm:py-16 bg-[#A88D70] border-b border-[#8F7558]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#681C36] font-bold flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#681C36]" />
            <span>Curated Heritage Editions</span>
          </span>
          <h2 id="promotional-collections-heading" className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#201418] mt-2">
            Promotional Collections
          </h2>
          <p className="text-xs sm:text-sm text-[#3E2F29] mt-2 font-medium">
            Signature curation designed for weddings, trousseau gifts, and festive celebrations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              onClick={() => onSelectCategory(promo.category)}
              className="group relative rounded-2xl overflow-hidden border border-[#C0A889] bg-[#E2D2BB] shadow-sm hover:shadow-xl hover:border-[#681C36] transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="aspect-[16/10] w-full overflow-hidden relative bg-[#B39A7A]">
                <img
                  src={promo.image}
                  alt={promo.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded bg-[#B39A7A] text-[10px] font-bold uppercase tracking-wider text-[#201418] border border-[#8F7558] shadow">
                    {promo.tag}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-xs text-[#E2D2BB] font-medium tracking-wide uppercase">
                    {promo.subtitle}
                  </p>
                  <h3 className="font-serif text-lg sm:text-xl font-bold">
                    {promo.title}
                  </h3>
                </div>
              </div>

              <div className="p-4 sm:p-5 flex flex-col justify-between flex-grow bg-[#E2D2BB]">
                <p className="text-xs text-[#3E2F29] leading-relaxed line-clamp-2 font-medium">
                  {promo.description}
                </p>

                <div className="mt-4 pt-3 border-t border-[#C0A889]/60 flex items-center justify-between text-xs font-bold text-[#681C36] group-hover:text-[#55152b]">
                  <span className="uppercase tracking-wider">Explore Collection</span>
                  <ArrowRight className="w-4 h-4 text-[#681C36] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
