"use client";
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";

function generateId() {
  return Math.random().toString(36).substr(2, 9).toUpperCase();
}

type RegisteredUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
};

export default function LoginPage() {
  const { t, setUser, showNotification, registeredUsers, setRegisteredUsers } =
    useAppContext();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });

  const validate = () => {
    const newErrors = { name: "", email: "", password: "" };
    let valid = true;

    if (!isLogin && !form.name.trim()) {
      newErrors.name = t.dir === "rtl" ? "الاسم مطلوب" : "Name is required";
      valid = false;
    }
    if (!form.email.trim()) {
      newErrors.email =
        t.dir === "rtl" ? "البريد الإلكتروني مطلوب" : "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email =
        t.dir === "rtl" ? "بريد إلكتروني غير صحيح" : "Invalid email address";
      valid = false;
    }
    if (!form.password.trim()) {
      newErrors.password =
        t.dir === "rtl" ? "كلمة المرور مطلوبة" : "Password is required";
      valid = false;
    } else if (form.password.length < 6) {
      newErrors.password =
        t.dir === "rtl"
          ? "كلمة المرور 6 أحرف على الأقل"
          : "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const users = registeredUsers as RegisteredUser[];

    if (isLogin) {
      const found = users.find(
        (u) => u.email === form.email && u.password === form.password,
      );
      if (!found) {
        const emailExists = users.find((u) => u.email === form.email);
        if (!emailExists) {
          setErrors((prev) => ({
            ...prev,
            email:
              t.dir === "rtl" ? "هذا البريد غير مسجل" : "Email not registered",
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            password:
              t.dir === "rtl" ? "كلمة المرور غلط" : "Incorrect password",
          }));
        }
        return;
      }
      // منبعتش الـ password للـ user state
      setUser({
        id: found.id,
        name: found.name,
        email: found.email,
        isAdmin: found.isAdmin,
        password: undefined,
      });
      showNotification(t.welcome + " " + found.name);
    } else {
      const exists = users.find((u) => u.email === form.email);
      if (exists) {
        setErrors((prev) => ({
          ...prev,
          email:
            t.dir === "rtl" ? "البريد مسجل بالفعل" : "Email already registered",
        }));
        return;
      }
      const newUser: RegisteredUser = {
        id: generateId(),
        name: form.name,
        email: form.email,
        password: form.password,
        isAdmin: form.email.toLowerCase().includes("admin"),
      };
      setRegisteredUsers([...registeredUsers, newUser]);
      // منبعتش الـ password للـ user state
      setUser({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        password: undefined,
      });
      showNotification(t.welcome + " " + newUser.name);
    }
    router.push("/");
  };

  const inputStyle = (hasError: boolean) => ({
    padding: "11px 14px",
    borderRadius: 10,
    border: `1px solid ${hasError ? "#ef4444" : "#e5e7eb"}`,
    fontSize: 14,
    outline: "none",
    color: "#111",
    width: "100%",
    boxSizing: "border-box" as const,
    background: "#fff",
  });

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          border: "1px solid #e5e7eb",
          padding: "40px 36px",
          width: "100%",
          maxWidth: 400,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ fontSize: 40 }}>🍽️</span>
          <h2
            style={{
              margin: "12px 0 4px",
              fontWeight: 800,
              fontSize: 24,
              color: "#e85d04",
            }}
          >
            {t.appName}
          </h2>
          <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>
            {isLogin ? t.signIn : t.signUp}
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {!isLogin && (
            <div>
              <input
                value={form.name}
                onChange={(e) => {
                  setForm((p) => ({ ...p, name: e.target.value }));
                  setErrors((p) => ({ ...p, name: "" }));
                }}
                placeholder={t.name}
                style={inputStyle(!!errors.name)}
              />
              {errors.name && (
                <p
                  style={{ color: "#ef4444", fontSize: 11, margin: "4px 0 0" }}
                >
                  {errors.name}
                </p>
              )}
            </div>
          )}
          <div>
            <input
              type="email"
              value={form.email}
              onChange={(e) => {
                setForm((p) => ({ ...p, email: e.target.value }));
                setErrors((p) => ({ ...p, email: "" }));
              }}
              placeholder="you@example.com"
              style={inputStyle(!!errors.email)}
            />
            {errors.email && (
              <p style={{ color: "#ef4444", fontSize: 11, margin: "4px 0 0" }}>
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <input
              type="password"
              value={form.password}
              onChange={(e) => {
                setForm((p) => ({ ...p, password: e.target.value }));
                setErrors((p) => ({ ...p, password: "" }));
              }}
              placeholder="••••••••"
              style={inputStyle(!!errors.password)}
            />
            {errors.password && (
              <p style={{ color: "#ef4444", fontSize: 11, margin: "4px 0 0" }}>
                {errors.password}
              </p>
            )}
          </div>
          <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>
            {t.dir === "rtl"
              ? "نصيحة: استخدم admin@ للوصول للإدارة"
              : "Tip: use admin@... email for admin access"}
          </p>
          <button
            onClick={handleSubmit}
            style={{
              background: "#e85d04",
              border: "none",
              borderRadius: 10,
              padding: 13,
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {isLogin ? t.signIn : t.signUp}
          </button>
          <button
            onClick={() => {
              setIsLogin((p) => !p);
              setForm({ name: "", email: "", password: "" });
              setErrors({ name: "", email: "", password: "" });
            }}
            style={{
              background: "none",
              border: "none",
              color: "#e85d04",
              fontSize: 13,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {isLogin
              ? t.noAccount + " " + t.signUp
              : t.hasAccount + " " + t.signIn}
          </button>
        </div>
      </div>
    </div>
  );
}
