"use client";
import React from "react";
import Logo from "../../assets/logo.png";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between">
          <div className="md:flex md:items-center md:gap-12">
            <Link href="/" className="block text-teal-600">
              <span className="sr-only">Home</span>
              <Image src={Logo} alt="Logo" width={150} height={35} />
            </Link>
          </div>

          <div className="hidden md:block">
            <nav aria-label="Global">
              <ul className="flex items-center gap-6 text-sm">
                <li>
                  <Link
                    href="/"
                    className="relative text-gray-800 text-base cursor-pointer font-medium font-figtree transition ease-in duration-300 hover:text-gray-800/75 
                     after:absolute after:left-0 after:bottom-0 after:w-0 after:h-px after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="relative text-gray-800 text-base cursor-pointer font-medium font-figtree transition ease-in duration-300 hover:text-gray-800/75 
                     after:absolute after:left-0 after:bottom-0 after:w-0 after:h-px after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/category"
                    className="relative text-gray-800 text-base cursor-pointer font-medium font-figtree transition ease-in duration-300 hover:text-gray-800/75 
                     after:absolute after:left-0 after:bottom-0 after:w-0 after:h-px after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    Categories
                  </Link>
                </li>
                <li>
                  <a
                    className="relative text-gray-800 text-base cursor-pointer font-medium font-figtree transition ease-in duration-300 hover:text-gray-800/75 
                     after:absolute after:left-0 after:bottom-0 after:w-0 after:h-px after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <Link
                    href="/account"
                    className="relative text-gray-800 text-base cursor-pointer font-medium font-figtree transition ease-in duration-300 hover:text-gray-800/75 
                     after:absolute after:left-0 after:bottom-0 after:w-0 after:h-px after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    Account
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="sm:flex sm:gap-4">
              {/* <a className="rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm">
                Login
              </a> */}
              <Link
                href="/login"
                className="rounded-full cursor-pointer bg-indigo-800 px-5 md:block hidden justify-center items-center py-2 font-figtree text-base font-medium text-white"
              >
                Sign In
              </Link>
            </div>
            <div className="block md:hidden">
              <button className="rounded-sm bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
