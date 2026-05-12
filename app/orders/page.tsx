"use client";
import { useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import OrderCard from "@/components/OrderCard";

export default function OrdersPage() {
  const { t, lang, orders, user, isReady } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (isReady && !user) {
      router.push("/login");
    }
  }, [user, isReady, router]);

  if (!isReady) return (
    <div style={{ textAlign: "center", padding: "80px 20px", color: "#6b7280" }}>
      {t.loading}
    </div>
  );

  if (!user) return null;

  const myOrders = orders.filter(o => o.customerId === user.id);

  if (myOrders.length === 0) return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>📦</div>
      <h2 style={{ color: "#6b7280", fontWeight: 400 }}>{t.noOrders}</h2>
      <button
        onClick={() => router.push("/")}
        style={{ background: "#e85d04", border: "none", borderRadius: 10, padding: "12px 28px", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", marginTop: 16 }}
      >
        {t.backToMenu}
      </button>
    </div>
  );

  return (
    <div style={{ paddingTop: 32, direction: t.dir }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>{t.orderHistory}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {myOrders.map(order => <OrderCard key={order.id} order={order} />)}
      </div>
    </div>
  );
}