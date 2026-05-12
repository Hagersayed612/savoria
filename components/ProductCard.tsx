"use client";
import { useAppContext } from "@/context/AppContext";
import { Product } from "@/types";
import QtyControls from "./QtyControls";

export default function ProductCard({ product }: { product: Product }) {
  const { t, lang, addToCart, cart } = useAppContext();
  const inCart = cart.find(i => i.id === product.id);

  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", overflow: "hidden" }}>
      <div style={{ position: "relative" }}>
        <img src={product.image} alt={product.name} style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
        {!product.inStock && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 14, background: "rgba(0,0,0,0.7)", padding: "6px 14px", borderRadius: 8 }}>{t.outOfStock}</span>
          </div>
        )}
        <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.6)", color: "#fff", borderRadius: 8, padding: "4px 8px", fontSize: 12 }}>
          ⭐ {product.rating}
        </div>
      </div>
      <div style={{ padding: "14px 16px 16px" }}>
        <p style={{ fontSize: 12, color: "#e85d04", fontWeight: 600, margin: "0 0 4px", textTransform: "uppercase" }}>{product.category}</p>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 4px" }}>{lang === "ar" && product.nameAr ? product.nameAr : product.name}</h3>
        <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 12px" }}>{lang === "ar" && product.descriptionAr ? product.descriptionAr : product.description}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#e85d04" }}>{t.egp} {product.price}</span>
          {product.inStock ? (
            inCart ? <QtyControls id={product.id} qty={inCart.qty} /> :
            <button onClick={() => addToCart(product)} style={{ background: "#e85d04", border: "none", borderRadius: 8, padding: "8px 14px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              + {t.addToCart}
            </button>
          ) : (
            <span style={{ fontSize: 12, color: "#9ca3af" }}>{t.outOfStock}</span>
          )}
        </div>
      </div>
    </div>
  );
}