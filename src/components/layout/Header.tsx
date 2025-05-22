"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search } from "lucide-react";
import SearchBar from "../ui/SearchBar";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  
  const isActive = (path: string) => pathname === path;
  
  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              RustMarket
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`text-sm ${
                isActive("/") ? "text-orange-500 font-medium" : "text-gray-300 hover:text-white"
              }`}
            >
              Home
            </Link>
            <Link
              href="/items"
              className={`text-sm ${
                isActive("/items") ? "text-orange-500 font-medium" : "text-gray-300 hover:text-white"
              }`}
            >
              Items
            </Link>
            <Link
              href="/trending"
              className={`text-sm ${
                isActive("/trending") ? "text-orange-500 font-medium" : "text-gray-300 hover:text-white"
              }`}
            >
              Trending
            </Link>
          </nav>
          
          {/* Search Bar (Desktop) */}
          <div className="hidden md:block w-full max-w-md mx-4">
            <SearchBar />
          </div>
          
          {/* Mobile Nav Controls */}
          <div className="flex items-center md:hidden space-x-4">
            <button
              onClick={toggleSearch}
              className="text-gray-300 hover:text-white"
              aria-label="Toggle search"
            >
              <Search className="w-5 h-5" />
            </button>
            
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="py-3 md:hidden">
            <SearchBar autofocus={true} />
          </div>
        )}
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="px-2 pt-2 pb-4 md:hidden border-t border-gray-800 mt-2">
            <Link
              href="/"
              className={`block px-3 py-2 rounded-md text-base ${
                isActive("/") ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/items"
              className={`block px-3 py-2 rounded-md text-base ${
                isActive("/items") ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Items
            </Link>
            <Link
              href="/trending"
              className={`block px-3 py-2 rounded-md text-base ${
                isActive("/trending") ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Trending
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}