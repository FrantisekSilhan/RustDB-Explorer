"use client";

import { MinimalItem, MinimalItemsResponse, MinimalItemsDiffResponse } from "./types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SearchState {
  items: MinimalItem[];
  lastUpdated: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  searchTerm: string;
  searchResults: MinimalItem[];
  
  // Actions
  initialize: () => Promise<void>;
  checkForUpdates: () => Promise<void>;
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      items: [],
      lastUpdated: null,
      isLoading: false,
      isInitialized: false,
      searchTerm: "",
      searchResults: [],
      
      initialize: async () => {
        const state = get();
        
        // If already initialized, just return
        if (state.isInitialized) return;
        
        set({ isLoading: true });
        
        try {
          const response = await fetch("https://api.watercollector.icu/api/v1/items/minimal");
          const data: MinimalItemsResponse = await response.json();
          
          set({
            items: data.items,
            lastUpdated: data.last_item,
            isInitialized: true,
            isLoading: false,
          });
        } catch (error) {
          console.error("Failed to initialize search store:", error);
          set({ isLoading: false });
        }
      },
      
      checkForUpdates: async () => {
        const state = get();
        
        // If not initialized yet, initialize first
        if (!state.isInitialized) {
          await state.initialize();
          return;
        }
        
        // If no lastUpdated timestamp, can"t check for updates
        if (!state.lastUpdated) return;
        
        set({ isLoading: true });
        
        try {
          const response = await fetch(
            `https://api.watercollector.icu/api/v1/items/minimal/diff?from=${encodeURIComponent(state.lastUpdated)}`
          );
          const data: MinimalItemsDiffResponse = await response.json();
          
          // If there are new items, add them to the store
          if (data.items.length > 0) {
            set({
              items: [...state.items, ...data.items],
              lastUpdated: data.to,
              isLoading: false,
            });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error("Failed to check for updates:", error);
          set({ isLoading: false });
        }
      },
      
      setSearchTerm: (term) => {
        const state = get();
        const normalizedTerm = term.toLowerCase().trim();
        
        set({ searchTerm: term });
        
        if (!normalizedTerm) {
          set({ searchResults: [] });
          return;
        }
        
        // Search through items
        const results = state.items
          .filter(item => item.name.toLowerCase().includes(normalizedTerm))
          .slice(0, 100); // Limit to 100 results for performance
        
        set({ searchResults: results });
      },
      
      clearSearch: () => {
        set({ searchTerm: "", searchResults: [] });
      },
    }),
    {
      name: "rust-market-search-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        lastUpdated: state.lastUpdated,
        isInitialized: state.isInitialized,
      }),
    }
  )
);