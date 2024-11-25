"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { user } = useAuthStore();

  // Adjusted function to highlight for both main and subpaths
  const getLinkClass = (href: string) =>
    `text-center block px-5 pb-3 py-3 hover:bg-gray-700 ${
      pathname.startsWith(href) ? 'bg-gray-700' : ''
    }`;

  return (
    <div className="flex">
      {/* Sidebar */}
      <nav className="w-64 h-[92vh] bg-gray-800 text-white flex flex-col">
        <ul>
          <li>
            <Link href="/dashboard/posts" className={getLinkClass('/dashboard/posts')}>
              Posts
            </Link>
          </li>
          {user?.adminRole && (
            <>
              <li>
                <Link href="/dashboard/users" className={getLinkClass('/dashboard/users')}>
                  Users
                </Link>
              </li>
              {/* <li>
                <Link href="/dashboard/comments" className={getLinkClass('/dashboard/comments')}>
                  Comments
                </Link>
              </li> */}
            </>
          )}
        </ul>
      </nav>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100 h-[92vh] overflow-y-scroll">{children}</div>
    </div>
  );
};

export default DashboardLayout;
