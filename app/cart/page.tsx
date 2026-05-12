"use client";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import QtyControls from "@/components/QtyControls";

export default function CartPage() {
  const { t, cart } = useAppContext();
  const router = useRouter();
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  if (cart.length === 0) return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
      <h2 style={{ color: "#6b7280", fontWeight: 400 }}>{t.emptyCart}</h2>
      <button onClick={() => router.push("/")} style={{ background: "#e85d04", border: "none", borderRadius: 10, padding: "12px 28px", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", marginTop: 16 }}>{t.backToMenu}</button>
    </div>
  );

  return (
    <div style={{ paddingTop: 32, display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start", direction: t.dir }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>{t.cart}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {cart.map(item => (
            <div key={item.id} style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: "14px 16px", display: "flex", gap: 14, alignItems: "center" }}>
              <img src={item.image} alt={item.name} style={{ width: 72, height: 72, borderRadius: 10, objectFit: "cover" }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>{item.name}</p>
                <p style={{ margin: "4px 0 0", color: "#e85d04", fontWeight: 700 }}>{t.egp} {item.price}</p>
              </div>
              <QtyControls id={item.id} qty={item.qty} />
              <div style={{ fontWeight: 700, minWidth: 72, textAlign: "end" }}>{t.egp} {item.price * item.qty}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: 24, position: "sticky", top: 80 }}>
        <h3 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700 }}>Order Summary</h3>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#6b7280", marginBottom: 8 }}>
          <span>{t.subtotal}</span><span>{t.egp} {subtotal}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#6b7280", marginBottom: 16 }}>
          <span>{t.delivery}</span><span>{t.egp} 25</span>
        </div>
        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 12, display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 16, marginBottom: 20 }}>
          <span>{t.total}</span><span style={{ color: "#e85d04" }}>{t.egp} {subtotal + 25}</span>
        </div>
        <button onClick={() => router.push("/checkout")} style={{ width: "100%", background: "#e85d04", border: "none", borderRadius: 10, padding: 14, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>{t.placeOrder}</button>
        <button onClick={() => router.push("/")} style={{ width: "100%", background: "none", border: "none", padding: 10, color: "#6b7280", fontSize: 13, cursor: "pointer", marginTop: 8 }}>{t.continueShopping}</button>
      </div>
    </div>
  );
}