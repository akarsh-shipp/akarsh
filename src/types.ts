export interface CropRateItem {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryNameKn: string;
  name: string;
  nameKn: string;
  price: number;
  unit: string;
  imageUrl?: string;
  sortOrder: number;
  updatedAt: string;
}

export interface ProductItem {
  id: string;
  name: string;
  nameKn?: string;
  category?: string;
  price: number;
  packSize: string;
  isAvailable: boolean;
  imageUrl?: string;
  updatedAt: string;
}

export interface ShopConfig {
  shopName: string;
  shopNameKn: string;
  ownerName: string;
  phone: string;
  whatsapp: string;
  address: string;
  addressKn?: string;
  announcement?: string;
  announcementKn?: string;
  updatedAt: string;
}

export interface FarmerInquiry {
  id: string;
  farmerName: string;
  phone: string;
  cropType: string;
  estimatedQuantity?: string;
  village?: string;
  notes?: string;
  status: 'pending' | 'contacted' | 'completed';
  createdAt: string;
}
