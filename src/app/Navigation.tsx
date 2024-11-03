// components/Navigation.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="shadow rounded-lg mx-auto border border-black">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="text-2xl font-bold text-gray-900 hover:scale-105 transition-transform duration-200 ease-in-out">BitCode</div>
          </Link>
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-900"
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

          {/* Links */}
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
                <Link href="/dashboard" className="text-gray-900 hover:scale-105 transition-transform duration-200 ease-in-out px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <Link href="/contact" className="text-gray-900 hover:scale-105 transition-transform duration-200 ease-in-out px-3 py-2 rounded-md text-sm font-medium">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="flex flex-col space-y-1 px-2 py-2">
            <Link href="/" className="text-gray-900 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
              Home
            </Link>
            <Link href="/" className="text-gray-900 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
              About
            </Link>
            <Link href="/problem" className="text-gray-900 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
              Problems
            </Link>
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
