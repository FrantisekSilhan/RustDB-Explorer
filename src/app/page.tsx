import { Suspense } from "react";
import Link from "next/link";
import { ChevronRight, TrendingUp, BarChart, DollarSign } from "lucide-react";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/Button";
import SearchBar from "@/components/ui/SearchBar";
import ItemGrid from "@/components/ui/ItemGrid";

export const metadata = {
  title: "Rust Market Explorer - Track Item Prices and Market Data",
};

export default async function Home() {
  // Fetch recent items for homepage
  const recentItems = await api.items.getRecent(10);
  
  return (
    <div>
      {/* Hero section */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-950 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                Track <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">Rust</span> Item Prices
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Monitor the Steam marketplace, analyze price trends, and make informed decisions with real-time data.
              </p>
              
              <div className="max-w-lg">
                <SearchBar placeholder="Search for skins, weapons, clothing..." />
              </div>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <Button path="/items" variant="gradient" size="lg">
                  Explore Items
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
                
                <Button path="/trending" variant="outline" size="lg">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Trends
                </Button>
              </div>
            </div>
            
            <div className="md:w-1/2 relative hidden md:block">
              <div className="p-4">
                <div className="flex items-center justify-center w-full h-64 md:h-80">
                  <svg
                    viewBox="0 0 400 200"
                    className="w-full max-w-lg h-full"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="400" height="200" rx="24" fill="#18181b" />
                    <polyline
                      points="20,180 60,120 100,140 140,80 180,100 220,60 260,100 300,40 340,80 380,20"
                      fill="none"
                      stroke="url(#grad)"
                      strokeWidth="6"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      className="animate-[pulse_2s_infinite]"
                    />
                    <defs>
                      <linearGradient id="grad" x1="0" y1="0" x2="400" y2="0" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#ea580c" />
                        <stop offset="1" stopColor="#f43f5e" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Use Rust Market Explorer?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="bg-orange-600/20 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <BarChart className="text-orange-500 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-time Data</h3>
              <p className="text-gray-300">
                {"Access up-to-date market information directly from Steam's marketplace."}
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="bg-red-600/20 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <TrendingUp className="text-red-500 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Price Trends</h3>
              <p className="text-gray-300">
                Analyze price history and market trends to make smarter purchasing decisions.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="bg-orange-600/20 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <DollarSign className="text-orange-500 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Order Books</h3>
              <p className="text-gray-300">
                View detailed buy and sell orders to find the best market opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Recent items section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Recently Added Items</h2>
            <Link href="/items" className="text-orange-500 hover:text-orange-400 flex items-center">
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <Suspense fallback={<ItemGrid items={[]} isLoading={true} />}>
            <ItemGrid items={recentItems} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}