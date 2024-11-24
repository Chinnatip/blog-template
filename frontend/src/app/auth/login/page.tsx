"use client";

import Login from '@/components/Login';
import Footer from '@/app/components/Footer';

export default function Home() {  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Login />
      </main>
      <Footer />
    </div>
  );
}
