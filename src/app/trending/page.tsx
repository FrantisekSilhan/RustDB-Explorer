import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { TrendingUp, Clock, ExternalLink } from "lucide-react";
import { api } from "@/utils/api";
import ItemGrid from "@/components/ui/ItemGrid";
import { formatRelativeTime } from "@/utils/utils";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Trending Rust Items",
  description: "View trending and recently added Rust items on the Steam marketplace",
};

export default async function TrendingPage() {
  // Fetch recent items for trending page
  const recentItems = await api.items.getRecent(20);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <TrendingUp className="h-8 w-8 text-orange-500 mr-3" />
        <h1 className="text-3xl font-bold">Trending Items</h1>
      </div>

      <p className="text-gray-300 mb-8 max-w-3xl">
        View the most recently added items on the Steam marketplace. These items often represent 
        new releases or items gaining popularity in the Rust community.
      </p>

      {/* Recent Additions Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Recent Additions</h2>
        <Suspense fallback={<ItemGrid items={[]} isLoading={true} />}>
          <ItemGrid items={recentItems} />
        </Suspense>
      </div>

      {/* Recently Active Items */}
      <div className="bg-gray-800 rounded-lg p-6 mb-12">
        <h2 className="text-2xl font-bold mb-6">Recently Active Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentItems.slice(0, 6).map((item) => (
            <Link 
              key={item.item_id} 
              href={`/items/item-id/${item.item_id}`}
              className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 rounded overflow-hidden mr-4" style={{ backgroundColor: `#${item.background_color || "1a1a1a"}` }}>
                  <Image
                    width={280}
                    height={280}
                    src={item.full_icon_url} 
                    alt={item.name} 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium text-sm truncate">{item.name}</h3>
                  <div className="flex items-center mt-1 text-xs text-gray-400">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{formatRelativeTime(item.added_at)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Market Insights */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Market Insights</h2>
        <p className="text-gray-300 mb-4">
          The Rust item market is constantly evolving, with new items being added regularly. 
          Stay informed about market trends to make better trading decisions.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
            <h3 className="text-xl font-medium mb-3">Steam Market Tips</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Monitor price trends before making purchases</li>
              <li>• Check order books to understand market depth</li>
              <li>• New items often have volatile prices initially</li>
              <li>• Popular items tend to have more stable prices</li>
            </ul>
          </div>
          
          <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
            <h3 className="text-xl font-medium mb-3">External Resources</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://store.steampowered.com/itemstore/252490/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-orange-400 hover:text-orange-300"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Official Rust Item Store
                </a>
              </li>
              <li>
                <a 
                  href="https://steamcommunity.com/market/search?appid=252490" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-orange-400 hover:text-orange-300"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Rust Items on Steam Market
                </a>
              </li>
              <li>
                <a 
                  href="https://rust.facepunch.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-orange-400 hover:text-orange-300"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Rust Official Website
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}