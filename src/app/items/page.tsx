import { Suspense } from "react";
import { Metadata } from "next";
import { api } from "@/utils/api";
import SearchBar from "@/components/ui/SearchBar";
import ItemGrid from "@/components/ui/ItemGrid";
import Pagination from "@/components/ui/Pagination";

export const metadata: Metadata = {
  title: "Browse Rust Items",
  description: "Browse and search for Rust items from the Steam marketplace",
};

interface ItemsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function ItemsPage({ searchParams: params }: ItemsPageProps) {
  const searchParams = await params;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const search = searchParams.search || "";
  const limit = 30;
  
  // Fetch items
  const itemsData = await api.items.getAll(page, limit, search);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Browse Rust Items</h1>
      
      <div className="mb-8 max-w-xl">
        <SearchBar initialValue={search} />
      </div>
      
      {search && (
        <p className="text-gray-400 mb-6">
          Found {itemsData.pagination.total} results for &quot;{search}&quot;
        </p>
      )}
      
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