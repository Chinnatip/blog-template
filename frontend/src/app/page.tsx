"use client";

import { useEffect } from 'react'
import { useStore } from '@/lib/store'
import Image from "next/image";
import BlogList from "@/components/BlogList";
import Login from '@/components/Login';
import Register from '@/components/Register';
import UserPanel from '@/components/UserPanel';

export default function Home() {
  const fetchPosts = useStore((state) => state.fetchPosts);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);
  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/dop-logo.png"
          alt="logo"
          width={180}
          height={38}
          priority
        />
        <BlogList />
        <Login />
        <Register />
        <UserPanel />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        lear share fun
      </footer>
    </div>
  );
}
