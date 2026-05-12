export interface Product {
  id: number;
  name: string;
  nameAr?: string;
  category: string;
  price: number;
  image: string;
  description: string;
  descriptionAr?: string;
  rating: number;
  reviews: number;
  inStock: boolean;
}

export interface CartItem extends Product {
  qty: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: string;
  paymentMethod: string;
  address: string;
  cardDetails: any;
  date: string;
  customer: string;
  customerId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  password: any
}

