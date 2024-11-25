"use client";

import Register from '@/components/Register';

export default function Home() {  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center xl:p-8 sm:p-20 xl:font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col xl:gap-8 row-start-2 items-center sm:items-start">
        <Register />
      </main>
    </div>
  );
}
