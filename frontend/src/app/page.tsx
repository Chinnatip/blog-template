"use client";

import BlogList from "@/components/BlogList";
import Footer from "@/components/Footer";

export default function Home() {  
  return (
    <div className="items-center justify-items-center p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <BlogList />
      </main>
      <Footer />
    </div>
  );
}
