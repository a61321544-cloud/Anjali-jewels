import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';
import { Review } from '../types';

interface CustomerReviewsProps {
  reviews: Review[];
}

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({ reviews }) => {
  return (
    <section aria-labelledby="reviews-heading" className="py-12 sm:py-16 bg-[#B39A7A] border-b border-[#947B5F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#681C36] font-bold">
            Client Words & Experiences
          </span>
          <h2 id="reviews-heading" className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#201418] mt-2">
            Customer Reviews
          </h2>
          <p className="text-xs sm:text-sm text-[#3E2F29] mt-2 font-medium">
            Real feedback from discerning clients who adorned Anjali Jewels for their most cherished milestones.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 sm:p-6 rounded-xl border border-[#C0A889] bg-[#E2D2BB] shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* Star rating */}
                <div className="flex items-center gap-1 mb-3 text-[#681C36]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#681C36]" />
                  ))}
                </div>

                <Quote className="w-6 h-6 text-[#C0A889] mb-2" />

                <p className="text-xs sm:text-sm text-[#201418] leading-relaxed italic font-serif">
                  "{rev.comment}"
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-[#C0A889]/60">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-sm text-[#681C36]">
                      {rev.customerName}
                    </h3>
                    <p className="text-[11px] text-[#4E3C36] font-medium">{rev.location}</p>
                  </div>
                  {rev.verifiedBuyer && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-800 bg-[#C0A889]/40 px-2 py-0.5 rounded border border-[#947B5F]/40 font-bold">
                      <CheckCircle className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                <p className="text-[10px] text-[#681C36] mt-2 font-bold tracking-wide">
                  Piece: {rev.productName}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Boutique Trust Badges */}
        <div className="mt-10 p-6 rounded-2xl bg-[#A88D70] border border-[#947B5F] grid grid-cols-1 sm:grid-cols-3 gap-6 text-center shadow-sm">
          <div>
            <h4 className="font-serif font-bold text-base text-[#681C36]">Mastercraft Quality</h4>
            <p className="text-xs text-[#201418] mt-1 font-medium">Every stone is hand-set and micro-lacquered for lasting luster.</p>
          </div>
          <div className="border-t sm:border-t-0 sm:border-x border-[#947B5F] pt-4 sm:pt-0">
            <h4 className="font-serif font-bold text-base text-[#681C36]">Direct Boutique WhatsApp</h4>
            <p className="text-xs text-[#201418] mt-1 font-medium">Real-time consultation and live videos before dispatch.</p>
          </div>
          <div className="border-t sm:border-t-0 border-[#947B5F] pt-4 sm:pt-0">
            <h4 className="font-serif font-bold text-base text-[#681C36]">Secure Pan-India Shipping</h4>
            <p className="text-xs text-[#201418] mt-1 font-medium">Dispatches with tamper-proof packaging & tracking.</p>
          </div>
        </div>

      </div>
    </section>
  );
};
