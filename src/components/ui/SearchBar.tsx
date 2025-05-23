"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSearchStore } from "@/utils/search-store";
import { Search, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface SearchBarProps {
  placeholder?: string;
  initialValue?: string;
  autofocus?: boolean;
  showResults?: boolean;
}

export default function SearchBar({
  placeholder = "Search for items...",
  initialValue = "",
  autofocus = false,
  showResults = true,
}: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  
  const { 
    initialize, 
    searchTerm, 
    setSearchTerm, 
    clearSearch, 
    searchResults, 
    isInitialized 
  } = useSearchStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [initialize, isInitialized]);

  useEffect(() => {
    if (initialValue) {
      setSearchTerm(initialValue);
    }
  }, [initialValue, setSearchTerm]);

  useEffect(() => {
    if (autofocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autofocus]);

  const handleClearSearch = () => {
    setSearchTerm("");
    clearSearch();
    router.push("/items");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="w-full h-10 pl-10 pr-10 py-2 text-sm rounded-md bg-gray-800 border border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none text-white placeholder:text-gray-400"
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
          />
          
          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {showResults && focused && searchTerm && searchResults.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-gray-900 border border-gray-700 rounded-md shadow-lg max-h-80 overflow-y-auto">
          <ul className="py-1">
            {searchResults.map((item, index) => (
              <li key={`${item.name}-${index}`}>
                <Link
                  href={`/items/name/${encodeURIComponent(item.name)}`}
                  className="flex items-center px-4 py-2 hover:bg-gray-800"
                  onClick={handleClearSearch}
                >
                  <div className="flex-shrink-0 w-8 h-8 mr-3 bg-gray-800 rounded overflow-hidden">
                    <Image
                      width={32}
                      height={32}
                      src={`https://community.fastly.steamstatic.com/economy/image/${item.icon}`}
                      alt=""
                      className="w-full h-full object-center object-contain"
                    />
                  </div>
                  <span className="text-sm text-white">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}