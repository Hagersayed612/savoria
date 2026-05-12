"use client";
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import ProductCard from "@/components/ProductCard";

export default function MenuPage() {
  const { t, lang, products } = useAppContext();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...new Set(products.map(p => p.category))];
  const filtered = products.filter(p => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = (p.name + " " + (p.nameAr || "")).toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ direction: t.dir }}>
      <div style={{ padding: "32px 0 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 8px", letterSpacing: "-1px" }}>
          {lang === "ar" ? "اكتشف قائمتنا" : "Discover Our Menu"}
        </h1>
        <p style={{ color: "#6b7280", fontSize: 15, margin: 0 }}>{t.tagline}</p>
      </div>

      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder={t.search}
        style={{ width: "100%", padding: "10px 16px", borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 14, marginBottom: 20, boxSizing: "border-box" as const, outline: "none", color: "#111" }}
      />

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{ padding: "7px 16px", borderRadius: 99, border: "1px solid", borderColor: activeCategory === cat ? "#e85d04" : "#e5e7eb", background: activeCategory === cat ? "#e85d04" : "#fff", color: activeCategory === cat ? "#fff" : "#6b7280", fontSize: 13, fontWeight: 500, cursor: "pointer" }}
          >
            {lang === "ar" && cat === "All" ? "الكل" : cat}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
        {filtered.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}

        {/* Empty state لو مفيش نتايج */}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <h3 style={{ color: "#6b7280", fontWeight: 400, margin: 0 }}>
              {lang === "ar" ? "لا توجد نتائج" : "No results found"}
            </h3>
            <p style={{ color: "#9ca3af", fontSize: 13, marginTop: 8 }}>
              {lang === "ar" ? "جرب كلمة بحث مختلفة" : "Try a different search term"}
            </p>
            <button
              onClick={() => { setSearch(""); setActiveCategory("All"); }}
              style={{ marginTop: 16, background: "#e85d04", border: "none", borderRadius: 10, padding: "10px 24px", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
            >
              {lang === "ar" ? "عرض الكل" : "Show All"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}