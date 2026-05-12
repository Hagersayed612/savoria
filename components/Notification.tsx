"use client";
import { useAppContext } from "@/context/AppContext";

export default function Notification() {
  const { notification } = useAppContext();
  if (!notification) return null;
  const colors: Record<string, string> = { success: "#10b981", error: "#ef4444", info: "#3b82f6" };
  return (
    <div style={{ position: "fixed", top: 72, right: 16, background: colors[notification.type] || colors.success, color: "#fff", padding: "12px 20px", borderRadius: 10, fontSize: 14, fontWeight: 500, zIndex: 999 }}>
      {notification.msg}
    </div>
  );
}