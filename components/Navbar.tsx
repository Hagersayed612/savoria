"use client";
import { useAppContext } from "@/context/AppContext";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const { t, lang, setLang, user, setUser, cartCount } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { path: "/", label: t.menu, icon: "🍽️" },
    { path: "/orders", label: t.orders, icon: "📦" },
    ...(user?.isAdmin ? [{ path: "/admin", label: t.admin, icon: "⚙️" }] : []),
  ];

  return (
    <nav style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", gap: 16, height: 60, direction: t.dir }}>
        <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 24 }}>🍽️</span>
          <span style={{ fontSize: 20, fontWeight: 700, color: "#e85d04" }}>{t.appName}</span>
        </button>
        <div style={{ flex: 1 }} />
        <button onClick={() => setLang(lang === "en" ? "ar" : "en")} style={{ background: "none", border: "1px solid #e5e7eb", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 13 }}>
          {lang === "en" ? "عربي" : "English"}
        </button>
        {navItems.map(nav => (
          <button key={nav.path} onClick={() => router.push(nav.path)} style={{ background: pathname === nav.path ? "#f3f4f6" : "none", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 13, fontWeight: pathname === nav.path ? 600 : 400 }}>
            {nav.label}
          </button>
        ))}
        <button onClick={() => router.push("/cart")} style={{ position: "relative", background: pathname === "/cart" ? "#e85d04" : "#f3f4f6", border: "none", borderRadius: 8, padding: "8px 14px", cursor: "pointer", color: pathname === "/cart" ? "#fff" : "#111", fontWeight: 600, fontSize: 13 }}>
          🛒 {cartCount > 0 && <span style={{ background: "#e85d04", color: "#fff", borderRadius: 99, fontSize: 11, padding: "1px 6px", marginLeft: 4 }}>{cartCount}</span>}
        </button>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#e85d04", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700 }}>{user.name[0].toUpperCase()}</div>
            <button onClick={() => { setUser(null); router.push("/"); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#6b7280" }}>{t.logout}</button>
          </div>
        ) : (
          <button onClick={() => router.push("/login")} style={{ background: "#e85d04", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", color: "#fff", fontSize: 13, fontWeight: 600 }}>{t.login}</button>
        )}
      </div>
    </nav>
  );
}