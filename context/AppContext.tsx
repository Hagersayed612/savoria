"use client";
import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { Product, CartItem, Order, User } from "@/types";
import { initialProducts } from "@/data/products";
import { translations } from "@/data/translations";

function generateId() {
  return Math.random().toString(36).substr(2, 9).toUpperCase();
}

interface AppContextType {
  lang: string; setLang: (l: string) => void;
  t: any;
  user: User | null; setUser: (u: User | null) => void;
  registeredUsers: User[]; setRegisteredUsers: (u: any) => void;
  cart: CartItem[]; addToCart: (p: Product) => void; updateQty: (id: number, delta: number) => void;
  orders: Order[]; setOrders: (o: any) => void;
  placeOrder: (method: string, address: string, card: any) => string;
  updateOrderStatus: (orderId: string, status: string) => void;
  products: Product[]; setProducts: (p: any) => void;
  cartCount: number;
  notification: { msg: string; type: string } | null;
  showNotification: (msg: string, type?: string) => void;
  isReady: boolean;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

// helper functions للـ localStorage
function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, value: any) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [lang, setLangState] = useState("en");
  const [user, setUserState] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsersState] = useState<User[]>([]);
  const [cart, setCartState] = useState<CartItem[]>([]);
  const [orders, setOrdersState] = useState<Order[]>([]);
  const [products, setProductsState] = useState<Product[]>(initialProducts);
  const [notification, setNotification] = useState<{ msg: string; type: string } | null>(null);

  // تحميل كل الـ state من الـ localStorage أول ما الـ app يشتغل
  useEffect(() => {
    setLangState(loadFromStorage("lang", "en"));
    setUserState(loadFromStorage("user", null));
    setRegisteredUsersState(loadFromStorage("registeredUsers", []));
    setCartState(loadFromStorage("cart", []));
    setOrdersState(loadFromStorage("orders", []));
    setProductsState(loadFromStorage("products", initialProducts));
    setIsReady(true);
  }, []);

  // wrapper functions بتحفظ في الـ localStorage تلقائياً
  const setLang = useCallback((l: string) => {
    setLangState(l);
    saveToStorage("lang", l);
  }, []);

  const setUser = useCallback((u: User | null) => {
    setUserState(u);
    saveToStorage("user", u);
  }, []);

  const setRegisteredUsers = useCallback((u: any) => {
    setRegisteredUsersState(u);
    saveToStorage("registeredUsers", typeof u === "function" ? u([]) : u);
  }, []);

  const setCart = useCallback((c: any) => {
    setCartState(prev => {
      const next = typeof c === "function" ? c(prev) : c;
      saveToStorage("cart", next);
      return next;
    });
  }, []);

  const setOrders = useCallback((o: any) => {
    setOrdersState(prev => {
      const next = typeof o === "function" ? o(prev) : o;
      saveToStorage("orders", next);
      return next;
    });
  }, []);

  const setProducts = useCallback((p: any) => {
    setProductsState(prev => {
      const next = typeof p === "function" ? p(prev) : p;
      saveToStorage("products", next);
      return next;
    });
  }, []);

  const t = translations[lang];

  const showNotification = useCallback((msg: string, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const addToCart = useCallback((product: Product) => {
    setCart((prev: CartItem[]) => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    showNotification(lang === "ar" ? "تمت الإضافة للسلة" : "Added to cart");
  }, [lang, showNotification, setCart]);

  const updateQty = useCallback((id: number, delta: number) => {
    setCart((prev: CartItem[]) =>
      prev.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0)
    );
  }, [setCart]);

  const placeOrder = useCallback((paymentMethod: string, address: string, cardDetails: any): string => {
    const newOrder: Order = {
      id: generateId(),
      items: [...cart],
      total: cart.reduce((s, i) => s + i.price * i.qty, 0) + 25,
      status: "pending",
      paymentMethod,
      address,
      cardDetails,
      date: new Date().toISOString(),
      customer: user?.name || "Guest",
      customerId: user?.id || "",
    };
    setOrders((prev: Order[]) => [newOrder, ...prev]);
    setCart([]);
    showNotification(t.orderConfirmed);
    return newOrder.id;
  }, [cart, user, t, showNotification, setOrders, setCart]);

  const updateOrderStatus = useCallback((orderId: string, status: string) => {
    setOrders((prev: Order[]) =>
      prev.map(o => o.id === orderId ? { ...o, status } : o)
    );
  }, [setOrders]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <AppContext.Provider value={{
      lang, setLang, t,
      user, setUser,
      registeredUsers, setRegisteredUsers,
      cart, addToCart, updateQty,
      orders, setOrders,
      placeOrder,
      updateOrderStatus,
      products, setProducts,
      cartCount, notification, showNotification,
      isReady,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}