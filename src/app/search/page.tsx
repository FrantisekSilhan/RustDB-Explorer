import { Suspense } from "react";
import { Metadata } from "next";
import { api } from "@/utils/api";
import SearchBar from "@/components/ui/SearchBar";
import ItemGrid from "@/components/ui/ItemGrid";
import Pagination from "@/components/ui/Pagination";

export const metadata: Metadata = {
  title: "Search Rust Items",
  description: "Search for Rust items and view market data",
};

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}

export default async function SearchPage({ searchParams: params }: SearchPageProps) {
  const searchParams = await params;
  const query = searchParams.q || "";
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const limit = 30;
  
  // If no search query, show empty state
  if (!query) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Search Rust Items</h1>
        
        <div className="mb-12 max-w-xl">
          <SearchBar placeholder="Search by item name..." autofocus={true} />
        </div>
        
        <div className="text-center py-16">
          <p className="text-gray-400">Enter a search term to find items</p>
        </div>
      </div>
    );
  }
  
  // Fetch items based on search query
  const itemsData = await api.items.getAll(page, limit, query);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Results</h1>
      
      <div className="mb-8 max-w-xl">
        <SearchBar initialValue={query} />
      </div>
      
      <p className="text-gray-400 mb-6">
        Found {itemsData.pagination.total} results for &quot;{query}&quot;
      </p>
      
      <Suspense fallback={<ItemGrid items={[]} isLoading={true} />}>
        <ItemGrid items={itemsData.items} />
      </Suspense>
      
      {itemsData.pagination.pages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={itemsData.pagination.pages}
        />
      )}
    </div>
  );
}