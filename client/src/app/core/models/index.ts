export interface User {
  _id: string;
  email: string;
  role: string;
  token?: string;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  _id: string;
  name: string;
  sku: string;
  category: Category | string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  lowStockCount: number;
  lowStockProducts: Product[];
}
