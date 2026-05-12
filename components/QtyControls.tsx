"use client";
import { useAppContext } from "@/context/AppContext";

export default function QtyControls({ id, qty }: { id: number; qty: number }) {
  const { updateQty } = useAppContext();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: "#f3f4f6",
        borderRadius: 8,
        padding: "4px 8px",
      }}
    >
      <button
        onClick={() => updateQty(id, -1)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#e85d04",
          fontWeight: 700,
          fontSize: 18,
          lineHeight: 1,
        }}
      >
        -
      </button>
      <span
        style={{
          fontSize: 14,
          fontWeight: 700,
          minWidth: 20,
          textAlign: "center",
        }}
      >
        {qty}
      </span>
      <button
        onClick={() => updateQty(id, 1)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#e85d04",
          fontWeight: 700,
          fontSize: 18,
          lineHeight: 1,
        }}
      >
        +
      </button>
    </div>
  );
}
