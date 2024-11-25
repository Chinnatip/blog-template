"use client";

import UserPanel from "@/components/UserPanel"
import { useAuthStore } from '@/lib/store'

const Navbar = () => {    
const { user } = useAuthStore()
  return <div className="h-[8vh] w-screen bg-gray-500 relative flex items-center justify-center px-24">
    {/* Hamburger will show only user is existed */}
    {/* { user && <button onClick={toggleMenu} className="mr-16 xl:hidden">
      <img src="hamburger.png" className="h-24" alt="" />
    </button>} */}
    
    <a href="/">
      <img src="/dop-logo.png" className="h-[40px]" alt="" />
    </a>
    <div className="flex-grow"/>
    <UserPanel />
  </div>
}

export default Navbar