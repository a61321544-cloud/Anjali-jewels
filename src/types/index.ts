export interface Product {
  id: string;
  code: string;
  name: string;
  slug: string;
  category: string;
  subCategory?: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  description: string;
  image: string;
  images?: string[];
  additionalImages?: string[];
  video?: string;
  videoUrl?: string;
  videoPoster?: string;
  inStock: boolean;
  isNewArrival: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  badge?: string;
  material?: string;
  plating?: string;
  stones?: string;
  closure?: string;
  packageContains?: string;
  includes?: string;
  careInstructions?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  count: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: string;
  customerName: string;
  location: string;
  verifiedBuyer: boolean;
  rating: number;
  date: string;
  productName: string;
  comment: string;
}

export interface Story {
  id: string;
  title: string;
  date: string;
  category: string;
  image: string;
  excerpt: string;
}

export interface StoreSettings {
  brandName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  whatsappFormatted: string;
  email: string;
  address: string;
  instagram: string;
  announcementText: string;
  policies: {
    noRefund: string;
    noExchange: string;
    noCod: string;
    shipping: string;
  };
}

export interface OrderEnquiry {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: Array<{
    code: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  channel: 'WhatsApp' | 'Email' | 'Web';
  notes?: string;
  status: string;
  createdAt: string;
}
