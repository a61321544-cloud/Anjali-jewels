import React, { useState } from 'react';
import { X, User, Mail, Phone, Lock, CheckCircle, Package } from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWishlist: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  onOpenWishlist
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'profile'>('login');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [user, setUser] = useState<{ name: string; email: string; phone: string } | null>(() => {
    try {
      const saved = localStorage.getItem('anjali_customer');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = { name: name || 'Valued Client', email, phone };
    setUser(customer);
    localStorage.setItem('anjali_customer', JSON.stringify(customer));
    setMode('profile');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('anjali_customer');
    setMode('login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="w-full max-w-md bg-[#B39A7A] rounded-2xl border border-[#947B5F] shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#947B5F] flex items-center justify-between bg-[#A88D70]">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#681C36]" />
            <h2 className="font-serif text-lg font-bold text-[#201418] uppercase tracking-wide">
              {user ? 'Client Sanctuary' : mode === 'login' ? 'Client Sign In' : 'Create Boutique Profile'}
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

        {/* Content */}
        <div className="p-6">
          {user ? (
            <div className="space-y-5 text-left">
              <div className="p-4 rounded-xl bg-[#E2D2BB] border border-[#C0A889] shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#681C36] text-[#FAF7F1] flex items-center justify-center font-serif text-xl font-bold shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#201418]">{user.name}</h3>
                    <p className="text-xs text-[#201418]/80 font-medium">{user.email || user.phone}</p>
                    <span className="inline-block mt-1 text-[10px] bg-[#681C36] text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                      Privileged Client
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenWishlist();
                  }}
                  className="w-full p-3 rounded-lg bg-[#E2D2BB] hover:bg-[#D4BEA3] border border-[#C0A889] text-xs font-bold uppercase tracking-wider text-[#201418] flex items-center justify-between transition-colors shadow-sm"
                >
                  <span>View Saved Wishlist</span>
                  <span className="text-[#681C36] font-bold">→</span>
                </button>
              </div>

              <div className="p-3.5 rounded-lg bg-[#E2D2BB] border border-[#C0A889] text-xs text-[#201418] shadow-sm">
                <p className="font-bold text-[#681C36] mb-1">VIP WhatsApp Concierge</p>
                <p className="font-medium leading-relaxed">Have an inquiry about sizing, matching lehengas, or express dispatch? Chat directly with our Janakpuri studio at <strong className="text-[#681C36]">+91 9319862576</strong>.</p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2.5 text-xs text-rose-800 font-bold hover:bg-[#A88D70]/40 rounded-lg transition-colors"
              >
                Sign Out of Account
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4 text-left">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-[#201418] uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g., Priya Verma"
                    className="w-full p-2.5 text-xs bg-[#E2D2BB] border border-[#C0A889] rounded-lg text-[#201418] placeholder-[#5A454B] focus:outline-none focus:ring-1 focus:ring-[#681C36]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#201418] uppercase tracking-wider mb-1">
                  Mobile / WhatsApp Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#681C36] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#E2D2BB] border border-[#C0A889] rounded-lg text-[#201418] placeholder-[#5A454B] focus:outline-none focus:ring-1 focus:ring-[#681C36]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#201418] uppercase tracking-wider mb-1">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#681C36] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#E2D2BB] border border-[#C0A889] rounded-lg text-[#201418] placeholder-[#5A454B] focus:outline-none focus:ring-1 focus:ring-[#681C36]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#681C36] hover:bg-[#7B2945] text-white rounded-lg text-xs font-semibold uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
              >
                {mode === 'login' ? 'Sign In / Continue' : 'Create Profile'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="text-xs text-[#681C36] hover:underline font-bold"
                >
                  {mode === 'login' ? 'New client? Register here' : 'Already have a profile? Sign In'}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
