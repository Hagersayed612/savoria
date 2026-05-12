"use client";
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { t, lang, cart, placeOrder, user, isReady, showNotification } = useAppContext();
  const router = useRouter();
  const [payment, setPayment] = useState("cod");
  const [address, setAddress] = useState("");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });
  const [placing, setPlacing] = useState(false);
  const [errors, setErrors] = useState({ address: "", card: "" });
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  // حماية الصفحة - لو مش logged in يروح للـ login
  useEffect(() => {
    if (isReady && !user) {
      router.push("/login");
    }
  }, [user, isReady, router]);

  // لو الـ cart فاضي يروح للـ menu
  useEffect(() => {
    if (isReady && cart.length === 0 && !placing) {
      router.push("/");
    }
  }, [cart, isReady, placing, router]);

  if (!isReady || !user) return (
    <div style={{ textAlign: "center", padding: "80px 20px", color: "#6b7280" }}>
      {t.loading}
    </div>
  );

  const validate = () => {
    const newErrors = { address: "", card: "" };
    let valid = true;

    if (!address.trim()) {
      newErrors.address = t.dir === "rtl" ? "العنوان مطلوب" : "Address is required";
      valid = false;
    }
    if (payment === "online") {
      const cleanNumber = card.number.replace(/\s/g, "");
      if (cleanNumber.length < 16) {
        newErrors.card = t.dir === "rtl" ? "رقم البطاقة غير صحيح" : "Invalid card number";
        valid = false;
      } else if (!/^\d{2}\/\d{2}$/.test(card.expiry)) {
        newErrors.card = t.dir === "rtl" ? "تاريخ الانتهاء غير صحيح (MM/YY)" : "Invalid expiry date (MM/YY)";
        valid = false;
      } else if (card.cvv.length < 3) {
        newErrors.card = t.dir === "rtl" ? "رمز الأمان غير صحيح" : "Invalid CVV";
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handlePlace = () => {
    if (!validate()) return;
    setPlacing(true);
    setTimeout(() => {
      // بنبعت آخر 4 أرقام بس من الكارت مش الـ CVV
      const safeCard = payment === "online"
        ? { last4: card.number.slice(-4), expiry: card.expiry }
        : null;
      placeOrder(payment, address, safeCard);
      router.push("/orders");
    }, 1500);
  };

  const inputStyle = (hasError: boolean) => ({
    width: "100%",
    padding: "10px 14px",
    borderRadius: 10,
    border: `1px solid ${hasError ? "#ef4444" : "#e5e7eb"}`,
    fontSize: 14,
    boxSizing: "border-box" as const,
    outline: "none",
    color: "#111",
    background: "#fff",
  });

  return (
    <div style={{ paddingTop: 32, maxWidth: 600, margin: "0 auto", direction: t.dir }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>
        {lang === "ar" ? "إتمام الطلب" : "Checkout"}
      </h2>

      {/* العنوان */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: 24, marginBottom: 16 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600 }}>{t.address}</h3>
        <input
          value={address}
          onChange={e => { setAddress(e.target.value); setErrors(p => ({ ...p, address: "" })); }}
          placeholder={t.addressPlaceholder}
          style={inputStyle(!!errors.address)}
        />
        {errors.address && <p style={{ color: "#ef4444", fontSize: 11, margin: "6px 0 0" }}>{errors.address}</p>}
      </div>

      {/* طريقة الدفع */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: 24, marginBottom: 16 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600 }}>{t.paymentMethod}</h3>
        {[{ value: "cod", label: t.cashOnDelivery, icon: "💵" }, { value: "online", label: t.onlinePayment, icon: "💳" }].map(opt => (
          <label key={opt.value} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 10, border: `1.5px solid ${payment === opt.value ? "#e85d04" : "#e5e7eb"}`, background: payment === opt.value ? "#fff5f0" : "#f9fafb", cursor: "pointer", marginBottom: 10 }}>
            <input type="radio" name="payment" value={opt.value} checked={payment === opt.value} onChange={() => { setPayment(opt.value); setErrors(p => ({ ...p, card: "" })); }} />
            <span style={{ fontSize: 18 }}>{opt.icon}</span>
            <span style={{ fontWeight: 600, fontSize: 14, color: payment === opt.value ? "#e85d04" : "#111" }}>{opt.label}</span>
          </label>
        ))}

        {payment === "online" && (
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            <input
              value={card.number}
              onChange={e => { setCard(p => ({ ...p, number: e.target.value })); setErrors(p => ({ ...p, card: "" })); }}
              placeholder="**** **** **** ****"
              maxLength={19}
              style={inputStyle(!!errors.card)}
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <input
                value={card.expiry}
                onChange={e => { setCard(p => ({ ...p, expiry: e.target.value })); setErrors(p => ({ ...p, card: "" })); }}
                placeholder="MM/YY"
                maxLength={5}
                style={inputStyle(!!errors.card)}
              />
              <input
                value={card.cvv}
                onChange={e => { setCard(p => ({ ...p, cvv: e.target.value })); setErrors(p => ({ ...p, card: "" })); }}
                placeholder="CVV"
                maxLength={4}
                style={inputStyle(!!errors.card)}
              />
            </div>
            {errors.card && <p style={{ color: "#ef4444", fontSize: 11, margin: "2px 0 0" }}>{errors.card}</p>}
          </div>
        )}
      </div>

      {/* الملخص */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14, color: "#6b7280" }}>
          <span>{t.subtotal}</span><span>{t.egp} {subtotal}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 14, color: "#6b7280" }}>
          <span>{t.delivery}</span><span>{t.egp} 25</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 18, borderTop: "1px solid #e5e7eb", paddingTop: 12 }}>
          <span>{t.total}</span>
          <span style={{ color: "#e85d04" }}>{t.egp} {subtotal + 25}</span>
        </div>
      </div>

      <button
        onClick={handlePlace}
        disabled={placing}
        style={{ width: "100%", background: placing ? "#ccc" : "#e85d04", border: "none", borderRadius: 12, padding: 16, color: "#fff", fontSize: 16, fontWeight: 700, cursor: placing ? "not-allowed" : "pointer" }}
      >
        {placing ? (lang === "ar" ? "جاري تقديم الطلب..." : "Placing Order...") : t.placeOrder}
      </button>
    </div>
  );
}