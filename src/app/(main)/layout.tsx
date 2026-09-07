import React from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CompareBar } from "@/components/compare-bar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <CompareBar />
      <Footer />
    </div>
  );
}
