import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  X, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  ShoppingBag, 
  Sliders, 
  RefreshCw,
  Search
} from 'lucide-react';
import { Product, StoreSettings, OrderEnquiry } from '../types';
import defaultStoreData from '../../data/store.json';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onProductsUpdated: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  onProductsUpdated
}) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('anjali_admin_token');
  });

  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'settings'>('products');

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderEnquiry[]>([]);
  const [settings, setSettings] = useState<Partial<StoreSettings>>({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // Editing state for products
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (isOpen && token) {
      loadData();
    }
  }, [isOpen, token]);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Try to fetch products from API, fall back to bundled default data
      try {
        const pRes = await fetch('/api/products');
        if (pRes.ok) {
          const pData = await pRes.json();
          if (pData.products && Array.isArray(pData.products)) {
            setProducts(pData.products);
          } else {
            setProducts(defaultStoreData.products as Product[]);
          }
        } else {
          setProducts(defaultStoreData.products as Product[]);
        }
      } catch {
        setProducts(defaultStoreData.products as Product[]);
      }

      // 2. Try to fetch settings from API, fall back to default settings
      try {
        const sRes = await fetch('/api/settings');
        if (sRes.ok) {
          const sData = await sRes.json();
          setSettings(sData.settings || defaultStoreData.settings);
        } else {
          setSettings(defaultStoreData.settings);
        }
      } catch {
        setSettings(defaultStoreData.settings);
      }

      // 3. Try to fetch orders from API, merge with locally stored inquiries
      if (token) {
        let serverOrders: OrderEnquiry[] = [];
        try {
          const oRes = await fetch('/api/orders', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (oRes.ok) {
            const oData = await oRes.json();
            serverOrders = oData.orders || [];
          }
        } catch {
          // Fallback to local storage on static Netlify
        }

        const localOrders: OrderEnquiry[] = JSON.parse(localStorage.getItem('anjali_local_orders') || '[]');
        // Deduplicate by ID
        const combinedMap = new Map<string, OrderEnquiry>();
        [...serverOrders, ...localOrders].forEach((ord) => combinedMap.set(ord.id, ord));
        setOrders(Array.from(combinedMap.values()));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // First attempt backend API login
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setToken(data.token);
          localStorage.setItem('anjali_admin_token', data.token);
          setPassword('');
          return;
        } else {
          setLoginError(data.message || 'Invalid passcode');
          return;
        }
      }
    } catch {
      // Backend not running (e.g. Netlify static mode)
    }

    // Static Netlify Fallback: verify default master passcode client-side
    if (password === 'anjali2026') {
      const staticToken = 'anjali-admin-token-static';
      setToken(staticToken);
      localStorage.setItem('anjali_admin_token', staticToken);
      setPassword('');
    } else {
      setLoginError('Invalid passcode. Default passcode is: anjali2026');
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('anjali_admin_token');
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name || !editingProduct.price) {
      alert('Product name and price are required');
      return;
    }

    try {
      const method = isCreating ? 'POST' : 'PUT';
      const url = isCreating ? '/api/products' : `/api/products/${editingProduct.id}`;

      let savedOnServer = false;
      try {
        const res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(editingProduct)
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            savedOnServer = true;
          }
        }
      } catch {
        // Netlify static mode
      }

      // Update state locally (works in all environments)
      setProducts((prev) => {
        if (isCreating) {
          return [{ ...(editingProduct as Product), id: editingProduct.id || `aj-${Date.now()}` }, ...prev];
        }
        return prev.map((p) => (p.id === editingProduct.id ? ({ ...p, ...(editingProduct as Product) } as Product) : p));
      });

      setStatusMsg(isCreating ? 'Piece added successfully!' : 'Piece updated successfully!');
      setEditingProduct(null);
      setIsCreating(false);
      if (savedOnServer) {
        await loadData();
      }
      onProductsUpdated();
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (err: any) {
      alert('Error saving product: ' + err.message);
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) return;

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg('Product removed from database.');
        await loadData();
        onProductsUpdated();
        setTimeout(() => setStatusMsg(''), 3000);
      }
    } catch (err) {
      alert('Error deleting product');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'videoUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            filename: file.name,
            base64Data,
            contentType: file.type
          })
        });
        const data = await res.json();
        if (data.success && editingProduct) {
          setEditingProduct({
            ...editingProduct,
            [field]: data.url
          });
          alert('Media uploaded successfully!');
        }
      } catch (err) {
        alert('Upload failed');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      try {
        const res = await fetch('/api/settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(settings)
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setStatusMsg('Store settings saved successfully!');
            setTimeout(() => setStatusMsg(''), 3000);
            return;
          }
        }
      } catch {
        // Fallback for Netlify static hosting
      }

      localStorage.setItem('anjali_local_settings', JSON.stringify(settings));
      setStatusMsg('Store settings saved successfully!');
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (err) {
      alert('Failed to save settings');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-5xl bg-[#B39A7A] rounded-2xl border border-[#947B5F] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#947B5F] flex items-center justify-between bg-[#30252A] text-white shrink-0">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-[#F7D37D]" />
            <div>
              <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-[#F7D37D]">
                Anjali Jewels Admin Portal
              </h2>
              <p className="text-[10px] text-[#E2D2BB]/90">
                Catalogue, Inventory, Orders & Policy Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {token && (
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-xs rounded text-white"
              >
                Sign Out
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Barrier or Management Dashboard */}
        {!token ? (
          /* Login Form */
          <div className="p-8 sm:p-12 max-w-md mx-auto text-center space-y-6 flex-1 flex flex-col justify-center">
            <div className="w-16 h-16 rounded-full bg-[#681C36]/20 text-[#681C36] flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-serif text-2xl font-bold text-[#201418]">Boutique Owner Sign In</h3>
              <p className="text-xs text-[#201418]/85 mt-1 font-medium">
                Enter your administrative key to manage the 36-product catalogue, edit prices, upload photos, and view order enquiries.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left bg-[#E2D2BB] p-6 rounded-2xl border border-[#C0A889] shadow-sm">
              <div>
                <label className="block text-xs font-bold text-[#201418] uppercase tracking-wider mb-1">
                  Master Passcode
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin passcode (e.g., anjali2026)"
                  className="w-full p-3 text-xs bg-[#FAF5EE] border border-[#C0A889] rounded-lg text-[#201418] placeholder-[#5A454B] focus:outline-none focus:ring-1 focus:ring-[#681C36]"
                />
              </div>

              {loginError && (
                <p className="text-xs text-rose-800 bg-rose-100/80 p-2 rounded border border-rose-300 font-medium">
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#681C36] hover:bg-[#7B2945] text-white rounded-lg text-xs font-semibold uppercase tracking-wider shadow transition-colors cursor-pointer"
              >
                Access Administration
              </button>

              <p className="text-[11px] text-[#201418]/80 text-center font-medium">
                Default authorization passcode is configured as: <code className="text-[#681C36] font-mono font-bold">anjali2026</code>
              </p>
            </form>
          </div>
        ) : (
          /* Admin Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Top Toolbar Tabs */}
            <div className="px-6 pt-3 pb-2 bg-[#A88D70] border-b border-[#947B5F] flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('products');
                    setEditingProduct(null);
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                    activeTab === 'products'
                      ? 'bg-[#681C36] text-white shadow-sm'
                      : 'text-[#201418]/80 hover:text-[#201418] hover:bg-[#B39A7A]'
                  }`}
                >
                  Catalogue ({products.length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-[#681C36] text-white shadow-sm'
                      : 'text-[#201418]/80 hover:text-[#201418] hover:bg-[#B39A7A]'
                  }`}
                >
                  Orders & Enquiries ({orders.length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-[#681C36] text-white shadow-sm'
                      : 'text-[#201418]/80 hover:text-[#201418] hover:bg-[#B39A7A]'
                  }`}
                >
                  Store Settings & Policies
                </button>
              </div>

              {activeTab === 'products' && !editingProduct && (
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(true);
                    setEditingProduct({
                      code: `AJ-${String(products.length + 1).padStart(2, '0')}`,
                      name: '',
                      category: 'Necklaces',
                      price: 4999,
                      originalPrice: 6249,
                      discountPercentage: 20,
                      description: '',
                      inStock: true,
                      isNewArrival: true,
                      isFeatured: false,
                      isBestSeller: false
                    });
                  }}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Piece</span>
                </button>
              )}
            </div>

            {statusMsg && (
              <div className="bg-emerald-50 text-emerald-800 text-xs py-2 px-6 border-b border-emerald-200 font-medium">
                {statusMsg}
              </div>
            )}

            {/* Main Tab Content */}
            <div className="p-6 overflow-y-auto flex-1 bg-[#B39A7A]">
              
              {/* TAB 1: PRODUCT CATALOGUE MANAGEMENT */}
              {activeTab === 'products' && (
                editingProduct ? (
                  /* Form to Add / Edit Product */
                  <form onSubmit={handleSaveProduct} className="space-y-5 text-left max-w-3xl mx-auto bg-[#E2D2BB] border border-[#C0A889] p-6 sm:p-8 rounded-2xl shadow-md">
                    <div className="flex items-center justify-between border-b border-[#C0A889] pb-3">
                      <h3 className="font-serif text-lg font-bold text-[#201418]">
                        {isCreating ? 'Add New Jewellery Piece' : `Edit Piece: ${editingProduct.code}`}
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct(null);
                          setIsCreating(false);
                        }}
                        className="text-xs text-[#201418]/80 hover:text-[#201418] font-bold underline cursor-pointer"
                      >
                        Cancel & Return
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#201418] mb-1">Product Code *</label>
                        <input
                          type="text"
                          required
                          value={editingProduct.code || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, code: e.target.value })}
                          className="w-full p-2.5 text-xs bg-[#FAF5EE] border border-[#C0A889] rounded-lg text-[#201418] focus:outline-none focus:ring-1 focus:ring-[#681C36]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#201418] mb-1">Product Name *</label>
                        <input
                          type="text"
                          required
                          value={editingProduct.name || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                          className="w-full p-2.5 text-xs bg-[#FAF5EE] border border-[#C0A889] rounded-lg text-[#201418] focus:outline-none focus:ring-1 focus:ring-[#681C36]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#201418] mb-1">Category</label>
                        <select
                          value={editingProduct.category || 'Necklaces'}
                          onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                          className="w-full p-2.5 text-xs bg-[#FAF5EE] border border-[#C0A889] rounded-lg text-[#201418] focus:outline-none focus:ring-1 focus:ring-[#681C36]"
                        >
                          <option value="Necklaces">Necklaces</option>
                          <option value="Chokers">Chokers</option>
                          <option value="Earrings & Jhumkas">Earrings & Jhumkas</option>
                          <option value="Bangles & Kadas">Bangles & Kadas</option>
                          <option value="Bridal Jewellery">Bridal Jewellery</option>
                          <option value="Temple Jewellery">Temple Jewellery</option>
                          <option value="Rani Haar">Rani Haar</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#201418] mb-1">Selling Price (₹) *</label>
                        <input
                          type="number"
                          required
                          value={editingProduct.price || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                          className="w-full p-2.5 text-xs bg-[#FAF5EE] border border-[#C0A889] rounded-lg text-[#201418] focus:outline-none focus:ring-1 focus:ring-[#681C36]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#201418] mb-1">Original Price (₹)</label>
                        <input
                          type="number"
                          value={editingProduct.originalPrice || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                          className="w-full p-2.5 text-xs bg-[#FAF5EE] border border-[#C0A889] rounded-lg text-[#201418] focus:outline-none focus:ring-1 focus:ring-[#681C36]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#201418] mb-1">Description *</label>
                      <textarea
                        rows={3}
                        required
                        value={editingProduct.description || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                        className="w-full p-2.5 text-xs bg-[#FAF5EE] border border-[#C0A889] rounded-lg text-[#201418] focus:outline-none focus:ring-1 focus:ring-[#681C36]"
                      />
                    </div>

                    {/* Image & Video URLs or Upload */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#201418] mb-1">Image URL / Path</label>
                        <input
                          type="text"
                          value={editingProduct.image || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                          className="w-full p-2.5 text-xs bg-[#FAF5EE] border border-[#C0A889] rounded-lg text-[#201418] mb-2 focus:outline-none focus:ring-1 focus:ring-[#681C36]"
                        />
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#A88D70] hover:bg-[#947B5F] text-[#201418] font-bold rounded-lg text-xs cursor-pointer shadow-sm">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Original Photo</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'image')} />
                        </label>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#201418] mb-1">4-Second Video URL</label>
                        <input
                          type="text"
                          value={editingProduct.videoUrl || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, videoUrl: e.target.value })}
                          className="w-full p-2.5 text-xs bg-[#FAF5EE] border border-[#C0A889] rounded-lg text-[#201418] mb-2 focus:outline-none focus:ring-1 focus:ring-[#681C36]"
                        />
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#A88D70] hover:bg-[#947B5F] text-[#201418] font-bold rounded-lg text-xs cursor-pointer shadow-sm">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Video Clip</span>
                          <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileUpload(e, 'videoUrl')} />
                        </label>
                      </div>
                    </div>

                    {/* Checkboxes: Stock, New, Featured */}
                    <div className="flex flex-wrap items-center gap-6 pt-2">
                      <label className="flex items-center gap-2 text-xs font-bold text-[#201418] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProduct.inStock !== false}
                          onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                          className="rounded text-[#681C36]"
                        />
                        <span>In Stock & Available</span>
                      </label>

                      <label className="flex items-center gap-2 text-xs font-bold text-[#201418] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!editingProduct.isNewArrival}
                          onChange={(e) => setEditingProduct({ ...editingProduct, isNewArrival: e.target.checked })}
                          className="rounded text-[#681C36]"
                        />
                        <span>Mark as New Arrival</span>
                      </label>

                      <label className="flex items-center gap-2 text-xs font-bold text-[#201418] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!editingProduct.isFeatured}
                          onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                          className="rounded text-[#681C36]"
                        />
                        <span>Feature on Homepage Hero</span>
                      </label>
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#C0A889]">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct(null);
                          setIsCreating(false);
                        }}
                        className="px-4 py-2 bg-[#A88D70] hover:bg-[#947B5F] text-[#201418] text-xs font-bold rounded-lg shadow-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-[#681C36] hover:bg-[#7B2945] text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm cursor-pointer"
                      >
                        Save Product Piece
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Products Table List */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="relative flex-1 max-w-sm">
                        <Search className="w-4 h-4 text-[#681C36] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Search piece by code or name..."
                          className="w-full pl-9 pr-3 py-2 text-xs bg-[#E2D2BB] border border-[#C0A889] rounded-lg text-[#201418] placeholder-[#5A454B] focus:outline-none focus:ring-1 focus:ring-[#681C36]"
                        />
                      </div>
                      <span className="text-xs text-[#201418] font-medium">
                        Total: <strong className="text-[#681C36]">{products.length}</strong> pieces in database
                      </span>
                    </div>

                    <div className="border border-[#C0A889] rounded-xl overflow-hidden bg-[#E2D2BB] shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs divide-y divide-[#C0A889]">
                          <thead className="bg-[#A88D70] text-[#201418] font-bold uppercase tracking-wider text-[11px]">
                            <tr>
                              <th className="py-2.5 px-3">Thumb</th>
                              <th className="py-2.5 px-3">Code</th>
                              <th className="py-2.5 px-3">Product Name</th>
                              <th className="py-2.5 px-3">Category</th>
                              <th className="py-2.5 px-3">Price</th>
                              <th className="py-2.5 px-3">Status</th>
                              <th className="py-2.5 px-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#C0A889]/60">
                            {products
                              .filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase()))
                              .map((p) => (
                                <tr key={p.id} className="hover:bg-[#D4BEA3]/50 transition-colors">
                                  <td className="py-2 px-3">
                                    <div className="w-10 h-10 rounded overflow-hidden bg-[#A88D70] border border-[#C0A889]">
                                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                    </div>
                                  </td>
                                  <td className="py-2 px-3 font-bold text-[#681C36]">{p.code}</td>
                                  <td className="py-2 px-3 font-serif font-bold text-[#201418] max-w-xs truncate">{p.name}</td>
                                  <td className="py-2 px-3 text-[#201418]/80 font-medium">{p.category}</td>
                                  <td className="py-2 px-3 font-bold text-[#201418]">₹{p.price}</td>
                                  <td className="py-2 px-3">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.inStock ? 'bg-emerald-800 text-white' : 'bg-rose-800 text-white'}`}>
                                      {p.inStock ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                  </td>
                                  <td className="py-2 px-3 text-right space-x-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setIsCreating(false);
                                        setEditingProduct(p);
                                      }}
                                      className="p-1 text-[#681C36] hover:bg-[#A88D70] rounded transition-colors"
                                      title="Edit Piece"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteProduct(p.id, p.name)}
                                      className="p-1 text-rose-800 hover:bg-rose-100 rounded transition-colors"
                                      title="Delete Piece"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )
              )}

              {/* TAB 2: ORDER ENQUIRIES */}
              {activeTab === 'orders' && (
                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-[#201418]">
                      Registered Client Order Enquiries ({orders.length})
                    </h3>
                    <button
                      type="button"
                      onClick={loadData}
                      className="inline-flex items-center gap-1 text-xs text-[#681C36] font-bold hover:underline cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Refresh</span>
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <div className="py-12 text-center text-xs text-[#201418] bg-[#E2D2BB] rounded-xl border border-[#C0A889] font-medium shadow-sm">
                      No order enquiries registered yet. When customers click WhatsApp or Email Checkout, their reference IDs appear here.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((ord) => (
                        <div key={ord.id} className="p-4 rounded-xl border border-[#C0A889] bg-[#E2D2BB] shadow-sm space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-xs text-[#681C36] bg-[#FAF5EE] border border-[#C0A889] px-2 py-0.5 rounded">
                              {ord.id}
                            </span>
                            <span className="text-[11px] text-[#201418]/80 font-medium">
                              Channel: <strong className="text-[#681C36]">{ord.channel}</strong> · {new Date(ord.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#201418]">
                            <p><strong>Client:</strong> {ord.customerName} ({ord.customerPhone})</p>
                            <p><strong>Total Value:</strong> ₹{ord.totalAmount}</p>
                          </div>

                          <div className="text-xs text-[#201418] bg-[#A88D70]/30 p-2.5 rounded-lg border border-[#C0A889]/50 font-medium">
                            <p><strong>Ordered Items:</strong> {ord.items.map((i) => `${i.name} (${i.code}) x${i.quantity}`).join(', ')}</p>
                            {ord.notes && <p className="mt-1"><strong>Notes / Address:</strong> {ord.notes}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: SETTINGS & POLICIES */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettings} className="space-y-5 text-left max-w-2xl mx-auto bg-[#E2D2BB] border border-[#C0A889] p-6 sm:p-8 rounded-2xl shadow-md">
                  <h3 className="font-serif text-lg font-bold text-[#201418] border-b border-[#C0A889] pb-2">
                    Boutique Details & Policies
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#201418] mb-1">WhatsApp Order Number</label>
                      <input
                        type="text"
                        value={settings.whatsapp || ''}
                        onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                        className="w-full p-2.5 text-xs bg-[#FAF5EE] border border-[#C0A889] rounded-lg text-[#201418] focus:outline-none focus:ring-1 focus:ring-[#681C36]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#201418] mb-1">Official Boutique Email</label>
                      <input
                        type="email"
                        value={settings.email || ''}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        className="w-full p-2.5 text-xs bg-[#FAF5EE] border border-[#C0A889] rounded-lg text-[#201418] focus:outline-none focus:ring-1 focus:ring-[#681C36]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#201418] mb-1">Boutique Physical Address</label>
                    <input
                      type="text"
                      value={settings.address || ''}
                      onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                      className="w-full p-2.5 text-xs bg-[#FAF5EE] border border-[#C0A889] rounded-lg text-[#201418] focus:outline-none focus:ring-1 focus:ring-[#681C36]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#201418] mb-1">Top Announcement Bar Text</label>
                    <input
                      type="text"
                      value={settings.announcementText || ''}
                      onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                      className="w-full p-2.5 text-xs bg-[#FAF5EE] border border-[#C0A889] rounded-lg text-[#201418] focus:outline-none focus:ring-1 focus:ring-[#681C36]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#681C36] hover:bg-[#7B2945] text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm cursor-pointer"
                  >
                    Save Boutique Settings
                  </button>
                </form>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
