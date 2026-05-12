import type { Metadata } from "next";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Notification from "@/components/Notification";
import "./globals.css";

export const metadata: Metadata = {
  title: "Savoria - Food Ordering",
  description: "Authentic Flavors, Delivered",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#f9fafb", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <AppProvider>
          <Navbar />
          <Notification />
          <main style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px 40px" }}>
            {children}
          </main>
        </AppProvider>
      </body>
    </html>
  );
}