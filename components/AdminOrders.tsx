"use client";
import { useAppContext } from "@/context/AppContext";
import { STATUSES, statusColors } from "@/data/products";

export default function AdminOrders() {
  const { t, lang, orders, updateOrderStatus } = useAppContext(); // ← بنستخدم updateOrderStatus

  if (orders.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>
        {t.noOrders}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {orders.map((order: any) => (
        <div key={order.id} style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: "16px 20px" }}>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 12, alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>#{order.id}</p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b7280" }}>
                {order.customer} · {new Date(order.date).toLocaleDateString()}
              </p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9ca3af" }}>
                {order.address}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
              <span style={{ fontWeight: 700, color: "#e85d04", fontSize: 16 }}>
                {t.egp} {order.total}
              </span>
              <span style={{ fontSize: 12, color: "#6b7280" }}>
                {order.paymentMethod === "cod" ? "💵 Cash on Delivery" : "💳 Online Payment"}
              </span>
            </div>
          </div>

          {/* الـ items */}
          <div style={{ margin: "12px 0", display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
            {order.items.map((item: any) => (
              <span key={item.id} style={{ background: "#f3f4f6", borderRadius: 6, padding: "4px 10px", fontSize: 12, color: "#374151" }}>
                {item.qty}× {lang === "ar" && item.nameAr ? item.nameAr : item.name}
              </span>
            ))}
          </div>

          {/* الـ status stepper */}
          <div style={{ margin: "16px 0 12px", position: "relative" }}>
            <div style={{ position: "absolute", top: 11, left: "5%", width: "90%", height: 2, background: "#e5e7eb", zIndex: 0 }} />
            <div style={{
              position: "absolute", top: 11, left: "5%", height: 2, zIndex: 1,
              background: statusColors[order.status],
              width: `${(STATUSES.indexOf(order.status) / (STATUSES.length - 1)) * 90}%`,
              transition: "width 0.5s ease"
            }} />
            <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
              {STATUSES.map((s, i) => {
                const statusIdx = STATUSES.indexOf(order.status);
                const isDone = i <= statusIdx;
                return (
                  <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: "50%",
                      background: isDone ? statusColors[order.status] : "#e5e7eb",
                      border: `2px solid ${isDone ? statusColors[order.status] : "#d1d5db"}`,
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      {isDone && <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>✓</span>}
                    </div>
                    <span style={{ fontSize: 10, color: i === statusIdx ? statusColors[order.status] : "#9ca3af", fontWeight: i === statusIdx ? 700 : 400, textAlign: "center", maxWidth: 64 }}>
                      {t["status_" + s]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* أزرار تغيير الـ status - الأدمن بس */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, marginTop: 8 }}>
            {STATUSES.map(s => (
              <button
                key={s}
                onClick={() => updateOrderStatus(order.id, s)}
                disabled={order.status === s}
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: `1.5px solid ${order.status === s ? statusColors[s] : "#e5e7eb"}`,
                  background: order.status === s ? statusColors[s] : "#fff",
                  color: order.status === s ? "#fff" : "#6b7280",
                  fontSize: 12,
                  fontWeight: order.status === s ? 700 : 400,
                  cursor: order.status === s ? "default" : "pointer",
                  transition: "all 0.2s"
                }}
              >
                {t["status_" + s]}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}