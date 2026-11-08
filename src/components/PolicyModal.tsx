import React, { useState } from 'react';
import { X, ShieldAlert, Truck, FileText, Lock, AlertCircle } from 'lucide-react';

interface PolicyModalProps {
  initialPolicyKey?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  initialPolicyKey = 'no-refund',
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState(initialPolicyKey);

  if (!isOpen) return null;

  const policies: Record<string, { title: string; subtitle: string; content: string[] }> = {
    'order-policies': {
      title: 'ORDER POLICIES – ANJALI JEWELS',
      subtitle: 'Official Terms & Prepaid Conditions',
      content: [
        '1. Prepaid Orders Only: We do not offer Cash on Delivery (COD). All orders must be paid in full before processing.',
        '2. No Cancellation: Once an order is placed and confirmed, it cannot be cancelled or modified.',
        '3. No Returns or Refunds: All purchases are final. We do not accept returns or offer refunds.',
        '4. Product Care: Please review product details and descriptions carefully before placing your order.',
        '5. Order Confirmation: Orders are processed only after successful payment confirmation.',
        'Thank you for shopping with Anjali Jewels. We truly appreciate your trust and support.',
        'With love, Anjali Jewels.'
      ]
    },
    'no-refund': {
      title: 'No Refund Policy',
      subtitle: 'Strict Final Sale Protocol',
      content: [
        'At ANJALI JEWELS, each luxury artificial jewellery set is custom prepared, inspected, and securely packed from our studio in Janakpuri, New Delhi. Due to the personal, hygienic, and delicate festive nature of artificial jewellery, we enforce a strict NO REFUND POLICY on all orders.',
        'Once an order is confirmed, placed, and processed through our WhatsApp, email, or digital channels, no monetary refunds will be issued under any circumstances.',
        'We strongly encourage customers to review all product photographs, 4-second video previews, stone descriptions, and dimensions before confirming purchase with our concierge team.'
      ]
    },
    'no-exchange': {
      title: 'No Exchange Policy',
      subtitle: 'Hygiene & Quality Assurance Standard',
      content: [
        'To guarantee pristine hygienic standards and absolute product authenticity for every client, ANJALI JEWELS operates a strict NO EXCHANGE POLICY across all collections.',
        'Every single necklace, choker, earring pair, bangles set, and maang tikka undergoes rigorous multi-point manual inspection before being placed in tamper-evident velvet packaging.',
        'We do not accept returns or exchanges for reasons including but not limited to outfit color mismatch, change of mind, event cancellations, or styling preferences.'
      ]
    },
    'no-cod': {
      title: 'No Cash on Delivery (NO COD)',
      subtitle: '100% Prepaid Dispatch Policy',
      content: [
        'ANJALI JEWELS strictly DOES NOT OFFER CASH ON DELIVERY (COD).',
        'All purchases must be completed in advance via verified prepaid digital payment methods, including UPI (Google Pay, PhonePe, Paytm, BHIM), Net Banking, or Direct Bank Wire.',
        'Our concierge team will verify receipt of payment and issue an official order booking confirmation before dispatching your jewellery via our insured courier partners.'
      ]
    },
    'shipping': {
      title: 'Shipping & Delivery Policy',
      subtitle: 'Insured Transit & Dispatch Guidelines',
      content: [
        'Dispatch Timeline: In-stock orders are carefully packed and dispatched within 24 to 48 business hours from our boutique studio in Janakpuri, New Delhi.',
        'Transit Times: Metro cities in India typically receive deliveries within 2 to 4 business days. Regional and tier-2/3 destinations take 3 to 6 business days.',
        'Packaging & Tracking: Every order is packaged in rigid, foam-cushioned velvet presentation boxes sealed with tamper-evident tape. Full tracking credentials will be shared directly on WhatsApp/SMS once your shipment is scanned by the courier.'
      ]
    },
    'terms': {
      title: 'Terms & Conditions',
      subtitle: 'Boutique Operating Terms',
      content: [
        'By browsing, enquiring, and purchasing from ANJALI JEWELS, you acknowledge and agree to comply with our store policies, including NO REFUND, NO EXCHANGE, and NO COD terms.',
        'Product Representation: We strive to photograph our jewellery under natural studio illumination to accurately portray stone cuts and polish. Slight color variations may occur depending on your device screen calibration.',
        'Intellectual Property: All jewellery names, catalogue imagery, logos, and descriptions are proprietary assets of Anjali Jewels.'
      ]
    },
    'privacy': {
      title: 'Privacy Policy',
      subtitle: 'Client Confidentiality & Data Protection',
      content: [
        'ANJALI JEWELS respects the privacy of our esteemed clientele. We only collect essential contact information (name, WhatsApp/phone number, delivery address, email) necessary to process, pack, and ship your jewellery orders.',
        'We will never sell, rent, or lease your private information to third-party advertising brokers.',
        'Your communication over WhatsApp and email is held with strict confidentiality between you and our designated boutique directors.'
      ]
    }
  };

  const current = policies[activeTab] || policies['no-refund'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-3xl bg-[#B39A7A] rounded-2xl border border-[#947B5F] shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#947B5F] flex items-center justify-between bg-[#A88D70] shrink-0">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#681C36]" />
            <h2 className="font-serif text-lg font-bold text-[#201418] uppercase tracking-wide">
              Official Store Policies
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#201418]/80 hover:text-[#201418] rounded-full hover:bg-black/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 sm:px-6 pt-3 pb-2 bg-[#A88D70] border-b border-[#947B5F] flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          {[
            { key: 'order-policies', label: 'Order Policies' },
            { key: 'no-refund', label: 'No Refund' },
            { key: 'no-exchange', label: 'No Exchange' },
            { key: 'no-cod', label: 'No COD' },
            { key: 'shipping', label: 'Shipping' },
            { key: 'terms', label: 'Terms' },
            { key: 'privacy', label: 'Privacy' }
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-[#681C36] text-white shadow-sm'
                  : 'text-[#201418]/80 hover:text-[#201418] hover:bg-[#B39A7A]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Policy Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-4 text-left flex-1">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#681C36] font-bold">
              {current.subtitle}
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#201418] mt-1">
              {current.title}
            </h3>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-[#201418] leading-relaxed pt-2 font-medium">
            {current.content.map((p, idx) => (
              <p key={idx} className="bg-[#E2D2BB] p-3.5 rounded-xl border border-[#C0A889] shadow-sm">
                {p}
              </p>
            ))}
          </div>

          {/* Quick Contact Help */}
          <div className="p-4 rounded-xl bg-[#E2D2BB] border border-[#C0A889] flex items-center justify-between text-xs mt-6 shadow-sm">
            <div>
              <p className="font-bold text-[#681C36]">Questions regarding boutique policies?</p>
              <p className="text-[#201418]/80 font-medium">Chat directly with our team at Janakpuri, New Delhi.</p>
            </div>
            <a
              href="https://wa.me/919319862576"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#681C36] hover:bg-[#7B2945] text-white rounded-lg font-semibold uppercase tracking-wider text-[11px] whitespace-nowrap shadow-sm"
            >
              WhatsApp Us
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#947B5F] bg-[#A88D70] flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-[#681C36] hover:bg-[#7B2945] text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm"
          >
            I Acknowledge
          </button>
        </div>

      </div>
    </div>
  );
};
