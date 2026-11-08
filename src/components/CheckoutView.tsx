import React, { useState } from 'react';
import { ShieldAlert, MessageCircle, Mail, ArrowLeft, CheckCircle, Truck, MapPin } from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';

interface CheckoutViewProps {
  onBackToShopping: () => void;
  onOpenPolicy: (policyKey: string) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  onBackToShopping,
  onOpenPolicy
}) => {
  const { cart, subtotal, cartCount, formatINR, clearCart, showToast } = useCartWishlist();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<any | null>(null);

  const handleSubmitOrder = async (channel: 'WhatsApp' | 'Email') => {
    if (!name.trim() || !phone.trim() || !address.trim() || !pincode.trim()) {
      showToast('Please fill in your name, WhatsApp number, address and pincode');
      return;
    }

    setIsSubmitting(true);

    try {
      let generatedOrder = {
        id: `AJ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
      };

      // 1. Attempt post to backend order enquiry registry (works with Node or Netlify functions)
      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName: name,
            customerPhone: phone,
            customerEmail: email,
            items: cart.map((i) => ({
              code: i.product.code,
              name: i.product.name,
              price: i.product.price,
              quantity: i.quantity
            })),
            totalAmount: subtotal,
            channel,
            notes: `${notes} | Address: ${address}, ${city} - ${pincode}`
          })
        });

        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const resData = await response.json();
            if (resData.order) {
              generatedOrder = resData.order;
            }
          }
        }
      } catch (apiErr) {
        console.warn('API sync skipped (static Netlify mode), continuing client-side:', apiErr);
      }

      // 2. Persist order enquiry locally so owner can review in Admin Panel even on static Netlify
      try {
        const localOrders = JSON.parse(localStorage.getItem('anjali_local_orders') || '[]');
        localOrders.unshift({
          id: generatedOrder.id,
          customerName: name,
          customerPhone: phone,
          customerEmail: email,
          items: cart.map((i) => ({
            code: i.product.code,
            name: i.product.name,
            price: i.product.price,
            quantity: i.quantity
          })),
          totalAmount: subtotal,
          channel,
          createdAt: new Date().toISOString(),
          notes: `${notes} | Address: ${address}, ${city} - ${pincode}`
        });
        localStorage.setItem('anjali_local_orders', JSON.stringify(localOrders.slice(0, 50)));
      } catch (storageErr) {
        console.warn('Local storage save failed:', storageErr);
      }

      setOrderConfirmed(generatedOrder);

      // 2. Prepare message for WhatsApp or Email
      const itemsList = cart
        .map(
          (item, idx) =>
            `${idx + 1}. *${item.product.name}* [${item.product.code}]\n   Qty: ${item.quantity} × ${formatINR(item.product.price)} = ${formatINR(item.product.price * item.quantity)}`
        )
        .join('\n\n');

      if (channel === 'WhatsApp') {
        const message = [
          `*NEW ORDER ENQUIRY — ANJALI JEWELS*`,
          `Reference ID: *${generatedOrder.id}*`,
          ``,
          `*Client Details:*`,
          `• Name: ${name}`,
          `• Phone: ${phone}`,
          `• Delivery Address: ${address}, ${city} - ${pincode}`,
          ``,
          `*Items Ordered:*`,
          itemsList,
          ``,
          `• *Order Total:* ${formatINR(subtotal)} (Free Insured Delivery)`,
          notes ? `• *Special Notes:* ${notes}` : '',
          ``,
          `Kindly confirm availability and share boutique UPI / Net Banking details for prepaid payment.`,
          ``,
          `_I have read and agree to Anjali Jewels policies: NO REFUND, NO EXCHANGE, NO COD._`
        ]
          .filter(Boolean)
          .join('\n');

        const waUrl = `https://wa.me/919319862576?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');
      } else {
        const subject = `Order Enquiry ${generatedOrder.id} - ${name}`;
        const emailBody = [
          `Dear Anjali Jewels Team,`,
          ``,
          `I would like to place an order enquiry for the following pieces (Ref: ${generatedOrder.id}):`,
          ``,
          `Customer: ${name}`,
          `Phone: ${phone}`,
          `Delivery Address: ${address}, ${city} - ${pincode}`,
          ``,
          itemsList.replace(/\*/g, ''),
          ``,
          `Order Subtotal: ${formatINR(subtotal)}`,
          notes ? `Notes: ${notes}` : '',
          ``,
          `Please reply with availability and payment details for prepaid dispatch.`,
          ``,
          `Best regards,`,
          `${name}`
        ]
          .filter(Boolean)
          .join('\n');

        const mailUrl = `mailto:maliyan04@icloud.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
        window.location.href = mailUrl;
      }

      clearCart();
    } catch (err) {
      console.error(err);
      showToast('Enquiry recorded. Opening communication channel...');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderConfirmed) {
    return (
      <div className="py-16 px-4 max-w-2xl mx-auto text-center">
        <div className="p-8 rounded-2xl bg-[#B39A7A] border border-[#947B5F] shadow-xl space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle className="w-8 h-8" />
          </div>

          <span className="text-xs font-mono font-bold text-[#681C36] uppercase tracking-widest bg-[#E2D2BB] px-3 py-1 rounded-full border border-[#C0A889]">
            Enquiry Reference: {orderConfirmed.id}
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#201418]">
            Order Enquiry Received!
          </h2>

          <p className="text-xs sm:text-sm text-[#201418]/85 leading-relaxed max-w-md mx-auto">
            Thank you, <strong className="text-[#201418]">{name}</strong>. Your enquiry has been registered in our boutique system. Our Janakpuri studio team will review your selected pieces and message you on WhatsApp at <strong className="text-[#681C36]">{phone}</strong> to confirm stock availability and share prepaid payment instructions.
          </p>

          <div className="p-4 rounded-xl bg-[#E2D2BB] border border-[#C0A889] text-xs text-left space-y-2">
            <p className="font-bold text-[#681C36] uppercase tracking-wider text-[11px]">Boutique Order Protocol Reminder:</p>
            <p className="text-[#201418]">• Submitting an enquiry generates a reference but is not a confirmed order until verified prepaid payment is received.</p>
            <p className="text-[#201418]">• STRICTLY NO COD. All shipments are dispatched prepaid with insured tracking.</p>
            <p className="text-[#201418]">• For urgent assistance, message us directly on WhatsApp: <strong>9319862576</strong>.</p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://wa.me/919319862576"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-2.5 bg-[#681C36] hover:bg-[#7B2945] text-white rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat with Anjali Jewels on WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={onBackToShopping}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#E2D2BB] border border-[#C0A889] hover:bg-[#D4BEA3] text-[#201418] rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm"
            >
              Return to Boutique
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="py-20 px-4 text-center max-w-md mx-auto">
        <h2 className="font-serif text-2xl font-bold text-[#201418]">Your Shopping Bag is Empty</h2>
        <p className="text-xs text-[#3D2C31] mt-2">Please add pieces to your bag before proceeding to checkout.</p>
        <button
          type="button"
          onClick={onBackToShopping}
          className="mt-6 px-6 py-2.5 bg-[#681C36] text-white rounded-lg text-xs font-semibold uppercase tracking-wider shadow-sm hover:bg-[#7B2945]"
        >
          Explore Catalogue
        </button>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Back button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={onBackToShopping}
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#681C36] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shopping</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Customer Verification Form (7 cols) */}
        <div className="lg:col-span-7 bg-[#B39A7A] rounded-2xl border border-[#947B5F] p-6 sm:p-8 space-y-6 text-left shadow-md">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#681C36] font-bold">
              Step 1 of 2
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#201418] mt-1">
              Delivery & Order Enquiry Details
            </h2>
            <p className="text-xs text-[#201418]/85 mt-1 font-medium">
              Please provide your delivery information for express insured dispatch from Janakpuri, New Delhi.
            </p>
          </div>

          {/* Strict Policy Callout */}
          <div className="p-4 rounded-xl bg-[#681C36]/15 border border-[#681C36]/35 flex items-start gap-3 text-xs text-[#681C36]">
            <ShieldAlert className="w-5 h-5 shrink-0 text-[#681C36] mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold uppercase tracking-wide font-serif">Strict Boutique Notice: NO COD · NO REFUND · NO EXCHANGE</p>
              <p className="text-[11px] text-[#201418] font-medium leading-relaxed">
                We do not accept Cash on Delivery. Orders are processed solely upon verified prepaid payment via UPI or Bank Transfer. All sales are final.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#201418] uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g., Pooja Sharma"
                  className="w-full p-2.5 text-xs bg-[#E2D2BB] border border-[#C0A889] rounded-lg text-[#201418] placeholder-[#5A454B] focus:outline-none focus:ring-1 focus:ring-[#681C36]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#201418] uppercase tracking-wider mb-1">
                  WhatsApp / Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full p-2.5 text-xs bg-[#E2D2BB] border border-[#C0A889] rounded-lg text-[#201418] placeholder-[#5A454B] focus:outline-none focus:ring-1 focus:ring-[#681C36]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#201418] uppercase tracking-wider mb-1">
                Email Address (For Invoicing)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full p-2.5 text-xs bg-[#E2D2BB] border border-[#C0A889] rounded-lg text-[#201418] placeholder-[#5A454B] focus:outline-none focus:ring-1 focus:ring-[#681C36]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#201418] uppercase tracking-wider mb-1">
                Complete Delivery Address *
              </label>
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House / Apartment number, Street, Landmark"
                className="w-full p-2.5 text-xs bg-[#E2D2BB] border border-[#C0A889] rounded-lg text-[#201418] placeholder-[#5A454B] focus:outline-none focus:ring-1 focus:ring-[#681C36]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#201418] uppercase tracking-wider mb-1">
                  City / State *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="E.g., New Delhi"
                  className="w-full p-2.5 text-xs bg-[#E2D2BB] border border-[#C0A889] rounded-lg text-[#201418] placeholder-[#5A454B] focus:outline-none focus:ring-1 focus:ring-[#681C36]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#201418] uppercase tracking-wider mb-1">
                  Postal Pincode *
                </label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="6-digit pincode"
                  className="w-full p-2.5 text-xs bg-[#E2D2BB] border border-[#C0A889] rounded-lg text-[#201418] placeholder-[#5A454B] focus:outline-none focus:ring-1 focus:ring-[#681C36]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#201418] uppercase tracking-wider mb-1">
                Special Instructions / Custom Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g., Need delivered before wedding date, custom gift packaging note..."
                className="w-full p-2.5 text-xs bg-[#E2D2BB] border border-[#C0A889] rounded-lg text-[#201418] placeholder-[#5A454B] focus:outline-none focus:ring-1 focus:ring-[#681C36]"
              />
            </div>
          </div>

          {/* OFFICIAL ANJALI JEWELS ORDER POLICY (EXACT REQUIREMENT 9) */}
          <div className="rounded-xl border border-[#C0A889] bg-[#E2D2BB] p-4 text-xs space-y-2.5 shadow-sm text-left">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#C0A889]/60">
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
                Full Terms
              </button>
            </div>

            <div className="space-y-1.5 text-[11px] text-[#201418] leading-relaxed font-medium">
              <p><strong>1. Prepaid Orders Only:</strong> We do not offer Cash on Delivery (COD). All orders must be paid in full before processing.</p>
              <p><strong>2. No Cancellation:</strong> Once an order is placed and confirmed, it cannot be cancelled or modified.</p>
              <p><strong>3. No Returns or Refunds:</strong> All purchases are final. We do not accept returns or offer refunds.</p>
              <p><strong>4. Product Care:</strong> Please review product details and descriptions carefully before placing your order.</p>
              <p><strong>5. Order Confirmation:</strong> Orders are processed only after successful payment confirmation.</p>
            </div>

            <p className="text-[10px] font-serif text-[#681C36] font-semibold italic border-t border-[#C0A889]/60 pt-1 text-center">
              Thank you for shopping with Anjali Jewels. We truly appreciate your trust and support. With love, Anjali Jewels.
            </p>
          </div>

          {/* Checkout Action Options */}
          <div className="pt-2 border-t border-[#947B5F] space-y-3">
            <p className="text-xs font-bold text-[#201418] uppercase tracking-wider">
              Choose Order Confirmation Channel:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmitOrder('WhatsApp')}
                className="w-full py-3.5 px-4 bg-[#681C36] hover:bg-[#7B2945] text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#F5EBDD]" />
                <span>Submit & Chat on WhatsApp</span>
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmitOrder('Email')}
                className="w-full py-3.5 px-4 bg-[#E2D2BB] hover:bg-[#D4BEA3] text-[#201418] border border-[#C0A889] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <Mail className="w-4 h-4 text-[#681C36]" />
                <span>Submit & Email Enquiry</span>
              </button>
            </div>

            <p className="text-[11px] text-[#201418]/80 text-center font-medium">
              Our studio team confirms pieces within 30 minutes during standard boutique hours (10 AM - 8 PM IST).
            </p>
          </div>

        </div>

        {/* Right: Order Summary Sidebar (5 cols) */}
        <div className="lg:col-span-5 bg-[#B39A7A] rounded-2xl border border-[#947B5F] p-6 space-y-5 text-left shadow-md">
          <div className="flex items-center justify-between border-b border-[#947B5F] pb-3">
            <h3 className="font-serif font-bold text-lg text-[#201418]">
              Order Summary ({cartCount} pieces)
            </h3>
            <span className="text-xs font-bold text-[#681C36] bg-[#E2D2BB] border border-[#C0A889] px-2.5 py-0.5 rounded">
              Prepaid Only
            </span>
          </div>

          <div className="divide-y divide-[#947B5F]/60 max-h-72 overflow-y-auto space-y-3 pr-1">
            {cart.map((item) => (
              <div key={item.product.id} className="pt-3 first:pt-0 flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#A88D70] border border-[#C0A889] shrink-0">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-[#681C36]">{item.product.code}</p>
                  <h4 className="font-serif font-bold text-xs text-[#201418] line-clamp-1">{item.product.name}</h4>
                  <p className="text-[11px] text-[#201418]/85 font-medium">
                    Qty: {item.quantity} × {formatINR(item.product.price)}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#201418] font-sans">
                  {formatINR(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#947B5F] space-y-2 text-xs">
            <div className="flex justify-between text-[#201418]/85 font-medium">
              <span>Subtotal</span>
              <span className="font-bold text-[#201418] font-sans">{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#201418]/85 font-medium">
              <span>Insured Courier Shipping</span>
              <span className="text-emerald-900 font-bold uppercase">Free Complimentary</span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#681C36] pt-2 border-t border-[#947B5F]">
              <span>Total Payable</span>
              <span className="font-sans">{formatINR(subtotal)}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#E2D2BB] border border-[#C0A889] text-xs text-[#201418] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#201418]">
              <Truck className="w-3.5 h-3.5 text-[#681C36]" />
              <span>Packaging & Transit Guarantee</span>
            </div>
            <p className="text-[11px] leading-relaxed font-medium">
              Every piece ships in a rigid velvet-lined box with tamper-evident seal and transit insurance.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
