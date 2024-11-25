"use client";

import UserPanel from "@/components/UserPanel"
import { useAuthStore, useMenuStore, User } from '@/lib/store'
import { useRouter } from "next/navigation";

const UserBadge = ({ user } : {user: User}) => {
  const title = typeof user?.name == 'string' ? user?.name[0] : 'U'
  return <span 
    className='
      inline-block bg-blue-700 
      h-20 w-20 shadow-lg text-4xl font-bold  rounded-full
      flex items-center justify-center 
      text-white uppercase'>
    {title}
  </span>
}

const HiddenMenu = () => {
  const router = useRouter()
  const { user, logout } = useAuthStore();
  const { menubar, toggleMenu } = useMenuStore();
  return (
    <>
      <div className={`z-20 h-screen w-screen backdrop-blur-sm flex fixed top-0 left-0 transition-opacity duration-500 ${menubar ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`fixed p-10 flex items-center justify-center w-[80vw] h-full bg-[#FFFFFF70] border-r border-[#FFFFFF] rounded-r-md transition-transform duration-1000 ease-[cubic-bezier(0.4, 0, 0.2, 1)] ${menubar ? 'translate-x-0' : '-translate-x-full'}`}>
          { user ? 
            <div className="flex items-center flex-col">
              <UserBadge user={user} />
              <p className='mt-3 text-center underline font-semibold'>Hi ! {user.name}</p>
              <button name="logout" onClick={() => { toggleMenu(), logout(router)}} className="mt-20 inline-block bg-blue-500 text-white p-2 px-5 rounded-sm">
                Logout
              </button>          
            </div> :
            <div className="flex w-full items-center flex-col">
              <h2 className="mb-5 text-lg">What you want to do ?</h2>
              <button name="login" onClick={() => { toggleMenu(), router.push('/auth/login')}} className="bg-blue-600 text-xl text-white p-2 px-5 w-full rounded-sm">
                Login
              </button>
              <button name="register" onClick={() => { toggleMenu(), router.push('/auth/register')}} className="bg-gray-400 text-xl text-white p-2 w-full my-4 px-5 rounded-sm ">
                Register
              </button>
            </div>
          }
        </div>
        <div
          onClick={toggleMenu}
          className="fixed top-0 right-0 w-[30vw] h-screen"
        ></div>
      </div>
    </>
  );
};

const Navbar = () => {    
  const { toggleMenu } = useMenuStore()
  return <div className="h-[8vh] w-screen bg-gray-400 xl:bg-gradient-to-b from-gray-100 to-gray-200 relative flex xl:grid grid-cols-2 px-3 xl:px-12 justify-start">
    <HiddenMenu />
    <div className="flex items-center">
      <button onClick={toggleMenu} className="xl:hidden mr-2">
        <img src="hamburger.png" className="h-[32px]" alt="" />
      </button>
      <a href="/" className="bg-blue-800 p-1 px-4 inline-block rounded-full">
        <img src="/dop-logo.png" className="h-[40px]" alt="" />
      </a>
    </div>
    <div className="items-center justify-end hidden  xl:flex">
      <UserPanel />
    </div>
  </div>
}

export default Navbar