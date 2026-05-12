"use client";
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";

const categories = ["Sandwiches", "Burgers", "Pizza", "Salads", "Mains", "Desserts", "Drinks"];

export default function AdminMenu() {
  const { t, lang, products, setProducts, showNotification } = useAppContext();
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>({});

  const startEdit = (p?: any) => {
    setEditing(p?.id || "new");
    setForm(p || { name: "", nameAr: "", category: "Burgers", price: "", description: "", descriptionAr: "", image: "", inStock: true });
  };

  const save = () => {
    if (editing === "new") {
      setProducts((prev: any) => [...prev, { ...form, id: Date.now(), price: Number(form.price), rating: 4.5, reviews: 0 }]);
    } else {
      setProducts((prev: any) => prev.map((p: any) => p.id === editing ? { ...p, ...form, price: Number(form.price) } : p));
    }
    setEditing(null);
    showNotification(lang === "ar" ? "تم الحفظ" : "Saved!");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ margin: 0 }}>{t.manageMenu}</h3>
        <button onClick={() => startEdit()} style={{ background: "#e85d04", border: "none", borderRadius: 10, padding: "10px 18px", color: "#fff", fontWeight: 600, cursor: "pointer" }}>+ {t.addProduct}</button>
      </div>
      {editing && (
        <div style={{ background: "#fff", borderRadius: 16, border: "2px solid #e85d04", padding: 24, marginBottom: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[["name", t.productName], ["nameAr", t.productName + " (AR)"], ["price", t.price], ["description", t.description], ["descriptionAr", t.description + " (AR)"], ["image", t.imageUrl]].map(([key, label]) => (
              <div key={key} style={{ gridColumn: ["description", "descriptionAr", "image"].includes(key) ? "1 / -1" : "auto" }}>
                <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>{label}</label>
                {key === "category" ? (
                  <select value={form[key] || ""} onChange={e => setForm((p: any) => ({ ...p, [key]: e.target.value }))} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}>
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                ) : (
                  <input value={form[key] || ""} onChange={e => setForm((p: any) => ({ ...p, [key]: e.target.value }))} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, boxSizing: "border-box" as const }} />
                )}
              </div>
            ))}
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, fontSize: 14, cursor: "pointer" }}>
            <input type="checkbox" checked={form.inStock} onChange={e => setForm((p: any) => ({ ...p, inStock: e.target.checked }))} />
            {t.inStock}
          </label>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={save} style={{ background: "#e85d04", border: "none", borderRadius: 8, padding: "10px 20px", color: "#fff", fontWeight: 600, cursor: "pointer" }}>{t.save}</button>
            <button onClick={() => setEditing(null)} style={{ background: "#f3f4f6", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 600, cursor: "pointer" }}>{t.cancel}</button>
          </div>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
        {products.map((p: any) => (
          <div key={p.id} style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", overflow: "hidden" }}>
            <img src={p.image} alt={p.name} style={{ width: "100%", height: 120, objectFit: "cover" }} />
            <div style={{ padding: "12px 14px" }}>
              <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: 14 }}>{p.name}</p>
              <p style={{ margin: "0 0 10px", color: "#e85d04", fontWeight: 700 }}>{t.egp} {p.price}</p>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => startEdit(p)} style={{ flex: 1, background: "#f3f4f6", border: "none", borderRadius: 7, padding: 7, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{t.editProduct}</button>
                <button onClick={() => setProducts((prev: any) => prev.filter((x: any) => x.id !== p.id))} style={{ background: "#fee2e2", border: "none", borderRadius: 7, padding: "7px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#dc2626" }}>{t.deleteProduct}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}