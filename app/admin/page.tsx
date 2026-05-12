"use client";
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import AdminMenuTab from "@/components/AdminMenu";
import AdminOrdersTab from "@/components/AdminOrders";

export default function AdminPage() {
  const { t, lang, user, orders, products, isReady } = useAppContext();
  const router = useRouter();
  const [tab, setTab] = useState("dashboard");

  useEffect(() => {
    if (isReady && !user?.isAdmin) {
      router.push("/login");
    }
  }, [user, router, isReady]);

  if (!isReady) return (
    <div style={{ textAlign: "center", padding: "80px 20px", color: "#6b7280" }}>
      {t.loading}
    </div>
  );

  if (!user?.isAdmin) return null;

  // revenue بس للـ delivered orders
  const deliveredRevenue = orders
    .filter(o => o.status === "delivered")
    .reduce((s, o) => s + o.total, 0);

  const activeOrders = orders.filter(o => o.status !== "delivered").length;

  const stats = [
    { label: t.totalOrders, value: orders.length, color: "#3b82f6" },
    { label: t.revenue, value: `${t.egp} ${deliveredRevenue}`, color: "#10b981" },
    { label: t.activeOrders, value: activeOrders, color: "#f59e0b" },
    { label: lang === "ar" ? "المنتجات" : "Products", value: products.length, color: "#8b5cf6" },
  ];

  return (
    <div style={{ paddingTop: 32, direction: t.dir }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>{t.adminDashboard}</h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 28, borderBottom: "1px solid #e5e7eb" }}>
        {[
          { id: "dashboard", label: lang === "ar" ? "نظرة عامة" : "Overview" },
          { id: "menu", label: t.manageMenu },
          { id: "orders", label: t.manageOrders },
        ].map(tb => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id)}
            style={{ background: "none", border: "none", borderBottom: `2px solid ${tab === tb.id ? "#e85d04" : "transparent"}`, padding: "10px 16px", cursor: "pointer", fontSize: 14, fontWeight: tab === tb.id ? 700 : 400, color: tab === tb.id ? "#e85d04" : "#6b7280", marginBottom: -1 }}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {tab === "dashboard" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 32 }}>
            {stats.map(s => (
              <div key={s.label} style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: "20px 16px" }}>
                <p style={{ margin: "0 0 4px", fontSize: 12, color: "#6b7280" }}>{s.label}</p>
                <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          {orders.length > 0 && (
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: 24 }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700 }}>
                {lang === "ar" ? "آخر الطلبات" : "Recent Orders"}
              </h3>
              {orders.slice(0, 5).map(o => (
                <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>#{o.id}</span>
                  <span style={{ fontSize: 13, color: "#6b7280" }}>{o.customer}</span>
                  <span style={{ background: "#f3f4f6", borderRadius: 99, padding: "3px 10px", fontSize: 11, fontWeight: 600, color: "#374151" }}>
                    {t["status_" + o.status]}
                  </span>
                  <span style={{ fontWeight: 700, color: "#e85d04" }}>{t.egp} {o.total}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "menu" && <AdminMenuTab />}
      {tab === "orders" && <AdminOrdersTab />}
    </div>
  );
}