// components/Navigation.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from './firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';
import SignInModal from './components/SignInModal';

interface DashboardProps {
  user: User; // Define the expected user prop
}

const Navigation = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        router.push('/dashboard'); // Redirect to Dashboard if user is authenticated
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleDashboardClick = () => {
    if (!user) {
      setModalOpen(true); // Open sign-in modal if user is not authenticated
    } else {
      router.push('/dashboard'); // Redirect to Dashboard if user is authenticated
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="shadow rounded-lg mx-auto border border-black">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <Link href="/">
            <div className="text-2xl font-bold text-gray-900 hover:scale-105 transition-transform duration-200 ease-in-out">IFML</div>
          </Link>
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-900 hover:bg-gray-100 focus:outline-none"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>

          <div className="flex-1 flex items-center justify-end sm:items-stretch sm:justify-end">
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                <Link href="/" className="text-gray-900 hover:scale-105 transition-transform duration-200 ease-in-out px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </Link>
                <Link href="#pagething" className="text-gray-900 hover:scale-105 transition-transform duration-200 ease-in-out px-3 py-2 rounded-md text-sm font-medium">
                  About
                </Link>
                <Link href="/problems" className="text-gray-900 hover:scale-105 transition-transform duration-200 ease-in-out px-3 py-2 rounded-md text-sm font-medium">
                  Problems
                </Link>
                <button 
                  onClick={handleDashboardClick} 
                  className="text-gray-900 hover:scale-105 transition-transform duration-200 ease-in-out px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </button>
                {user ? null : <SignInModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />}
                <Link href="/contact" className="text-gray-900 hover:scale-105 transition-transform duration-200 ease-in-out px-3 py-2 rounded-md text-sm font-medium">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="flex flex-col space-y-1 px-2 py-2">
            <Link href="/" className="text-gray-900 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
              Home
            </Link>
            <Link href="#pagething" className="text-gray-900 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
              About
            </Link>
            <Link href="/problems" className="text-gray-900 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
              Problems
            </Link>
            <button 
              onClick={handleDashboardClick} 
              className="text-gray-900 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
              Dashboard
            </button>
            {user ? null : <SignInModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />}
            <Link href="/contact" className="text-gray-900 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
