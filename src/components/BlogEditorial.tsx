import React, { useState } from 'react';
import { BookOpen, ArrowRight, X, Calendar, Clock } from 'lucide-react';
import { Story } from '../types';

interface BlogEditorialProps {
  stories: Story[];
}

export const BlogEditorial: React.FC<BlogEditorialProps> = ({ stories }) => {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  const fullArticles: Record<string, string[]> = {
    'story-01': [
      'The art of Kundan stone setting is considered one of the oldest forms of jewellery craftsmanship in the Indian subcontinent, originating in the royal courts of Rajasthan and Gujarat before flourishing under Mughal patronages.',
      'Unlike modern prong-set jewellery, classical Kundan relies on highly refined, 24K pure gold foils (or high-grade lac foil in premium artificial jewellery) that are meticulously inserted between the gemstone and its mount. This reflective bedding creates a luminous, candlelit shimmer that has adorned royal weddings for centuries.',
      'At Anjali Jewels, our craftsmen preserve this historic technique while optimizing each piece for contemporary comfort. By utilizing lightweight brass alloys paired with multi-layer micro-gold polish, modern brides can enjoy the imposing grandeur of antique Kundan without shoulder strain or neckline fatigue.'
    ],
    'story-02': [
      'Originating in the Chola, Pandya, and Vijayanagara dynasties of South India, Temple Jewellery was originally commissioned to adorn the idols of deities in sacred sanctums. Later, royal classical dancers (Devadasis) and queens began wearing these holy ornaments.',
      'Central to authentic Temple pieces are divine motifs: Goddess Lakshmi seated upon a blossoming lotus signifying wealth and auspicious beginnings; the peacock (Mayura) embodying grace, royalty, and immortality; and temple kalash engravings symbolizing abundance.',
      'When styling Temple jewellery for a wedding or puja, pair deep matte gold chokers with rich Kanjeevaram silk sarees, raw silk lehengas, or deep crimson and forest green ensembles for an unmistakably majestic aura.'
    ],
    'story-03': [
      'Luxury artificial jewellery is designed to be cherished across countless festive seasons. However, improper storage or exposure to moisture and chemicals can compromise its golden brilliance and stone clarity.',
      'Always observe the Golden Rule of Jewellery: "Last on, first off." Put on your necklace, earrings, and bangles only after applying perfume, hairspray, lotions, and makeup. The alcohol in fragrances reacts with micro-plating and can cause tarnishing.',
      'After removing your jewellery, gently wipe each stone with a clean, dry microfiber or soft cotton cloth to remove natural skin oils and perspiration. Always store each piece separately in an airtight zip pouch or velvet box away from direct sunlight.'
    ]
  };

  return (
    <section id="editorial-section" aria-labelledby="editorial-heading" className="py-12 sm:py-16 bg-[#A88D70] border-b border-[#8F7558]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#681C36] font-bold flex items-center justify-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#681C36]" />
            <span>The Jewellery Gazette</span>
          </span>
          <h2 id="editorial-heading" className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#201418] mt-2">
            Blog & Editorial
          </h2>
          <p className="text-xs sm:text-sm text-[#3E2F29] mt-2 font-medium">
            Styling narratives, heritage craftsmanship histories, and heirloom preservation guides.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stories.map((story) => (
            <article
              key={story.id}
              onClick={() => setSelectedStory(story)}
              className="group rounded-2xl border border-[#C0A889] bg-[#E2D2BB] overflow-hidden shadow-sm hover:shadow-xl hover:border-[#681C36] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] w-full overflow-hidden bg-[#B39A7A] relative">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded bg-[#B39A7A] text-[10px] font-bold text-[#201418] uppercase tracking-wider border border-[#8F7558] shadow">
                      {story.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 bg-[#E2D2BB]">
                  <div className="flex items-center gap-3 text-[11px] text-[#4E3C36] mb-2 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#681C36]" />
                      <span>{story.date}</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#681C36]" />
                      <span>3 min read</span>
                    </span>
                  </div>

                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#201418] group-hover:text-[#681C36] transition-colors leading-snug">
                    {story.title}
                  </h3>

                  <p className="text-xs text-[#3E2F29] mt-2 leading-relaxed line-clamp-3 font-medium">
                    {story.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-0 bg-[#E2D2BB]">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#681C36] group-hover:text-[#55152b]">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#681C36] group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Article Detail Modal */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
          <div className="relative w-full max-w-2xl bg-[#B39A7A] rounded-2xl border border-[#947B5F] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            <div className="p-4 sm:p-5 border-b border-[#947B5F] flex items-center justify-between bg-[#A88D70]">
              <span className="text-xs uppercase tracking-widest text-[#681C36] font-bold">
                {selectedStory.category}
              </span>
              <button
                type="button"
                onClick={() => setSelectedStory(null)}
                className="p-1.5 text-[#4E3C36] hover:text-[#201418] hover:bg-black/5 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 bg-[#E2D2BB] text-[#201418]">
              <div className="aspect-[16/9] w-full rounded-xl overflow-hidden mb-4 border border-[#C0A889] bg-[#A88D70]">
                <img src={selectedStory.image} alt={selectedStory.title} className="w-full h-full object-cover" />
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#201418]">
                {selectedStory.title}
              </h2>

              <p className="text-xs text-[#681C36] font-bold tracking-wide">
                Published {selectedStory.date} · Anjali Jewels Editorial Team
              </p>

              <div className="text-sm text-[#2C1E23] space-y-3 leading-relaxed font-medium">
                {(fullArticles[selectedStory.id] || [selectedStory.excerpt]).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-[#947B5F] bg-[#A88D70] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedStory(null)}
                className="px-6 py-2.5 bg-[#681C36] hover:bg-[#75253F] text-[#E2D2BB] text-xs font-bold uppercase tracking-wider rounded-lg shadow-md cursor-pointer"
              >
                Close Article
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
