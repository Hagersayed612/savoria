"use client";
import { useAppContext } from "@/context/AppContext";
import { Order } from "@/types";
import { STATUSES, statusColors } from "@/data/products";

export default function OrderCard({ order }: { order: Order }) {
  const { t, lang } = useAppContext();
  const statusIdx = STATUSES.indexOf(order.status);

  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <p style={{ margin: 0, fontSize: 13, color: "#9ca3af" }}>Order #{order.id}</p>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>{new Date(order.date).toLocaleDateString()}</p>
        </div>
        <div style={{ textAlign: "end" }}>
          <span style={{ background: statusColors[order.status] + "22", color: statusColors[order.status], borderRadius: 99, padding: "5px 12px", fontSize: 12, fontWeight: 700 }}>
            {t["status_" + order.status]}
          </span>
          <p style={{ margin: "6px 0 0", fontWeight: 800, color: "#e85d04", fontSize: 16 }}>{t.egp} {order.total}</p>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        {order.items.map(item => (
          <span key={item.id} style={{ background: "#f3f4f6", borderRadius: 8, padding: "5px 10px", fontSize: 12, color: "#6b7280" }}>
            {item.qty}× {lang === "ar" && item.nameAr ? item.nameAr : item.name}
          </span>
        ))}
      </div>
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          {STATUSES.map((s, i) => (
            <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: i <= statusIdx ? statusColors[order.status] : "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {i <= statusIdx && <span style={{ color: "#fff", fontSize: 12 }}>✓</span>}
              </div>
              <span style={{ fontSize: 10, color: i === statusIdx ? statusColors[order.status] : "#9ca3af", fontWeight: i === statusIdx ? 700 : 400, textAlign: "center", maxWidth: 60 }}>{t["status_" + s]}</span>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", top: 11, left: "10%", width: "80%", height: 2, background: "#e5e7eb", zIndex: 0 }}>
          <div style={{ height: "100%", background: statusColors[order.status], width: `${(statusIdx / (STATUSES.length - 1)) * 100}%`, transition: "width 0.8s ease" }} />
        </div>
      </div>
    </div>
  );
}